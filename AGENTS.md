# AGENTS.md — How to work in these repos as an AI agent

> Base file for every project in this folder. Project-specific `AGENTS.md` files extend this with file maps, settings keys, and project-specific conflict cheatsheets. When project conflicts with base, project wins — it's the local source of truth.
>
> Companion files: [CLAUDE.md](CLAUDE.md) is the *what* (principles, architecture, editorial rules); [DESIGN.md](DESIGN.md) is the *look*.

---

## Read these first, in order

Before touching code, read:

1. **[CLAUDE.md](CLAUDE.md)** — universal principles + project-specific intent and editorial rules. The "Project intent" and any project-specific notes are load-bearing for every change.
2. **[DESIGN.md](DESIGN.md)** — visual + content system. Touch this before changing how data is presented.
3. **`backlog.md`** (or `BACKLOG.md`) — what's next. Pick from here; don't invent work.
4. **`issues.md`** — what's broken. Check before reporting a bug as new.
5. **`security.md`** — supply-chain advisory log. **Refresh if `Last updated` is > 7 days old before any `npm install` / `pip install` / dep upgrade.** Also fetch `https://pranava0x0.github.io/vibe-coding-security/llms-ctx.txt` and surface any matching advisory before suggesting an install.

---

## The Explore → Plan → Code → Verify loop

Documented in detail in [CLAUDE.md](CLAUDE.md). Concretely inside any repo:

- **Explore.** Use `grep`, `find`, or an Explore agent to find relevant code. Most projects here are small enough that a single read of the main module + the data schema covers ~80% of the surface.
- **Plan.** For anything beyond a one-line fix, present 2–3 approaches with pros/cons before writing code. Changes that touch the data schema, the editorial rules, or the visual identity ALWAYS need a plan surface — they reshape the product.
- **Code.** Edit existing files first; only create new files when the task genuinely requires it. No new helpers for one-shot operations. For any non-trivial rule or logic, write the spec in prose first — trigger, inputs, mechanism, success criteria — then implement against it.
- **Verify.** Run the test suite. Use the feature in a browser (or invoke the CLI) before declaring done.

**Per-item cadence in multi-item sessions.** Surface design questions up front, then do **tests + docs + commit per item**, not batched at the end. Catches issues early and produces a clean bisect history.

---

## Verifying changes

Default verification matrix (project-specific `AGENTS.md` should override with concrete commands):

| Change kind                    | Run                                                  |
| ------------------------------ | ---------------------------------------------------- |
| Schema edit                    | Schema-validation tests (Pydantic / zod / etc.)       |
| Seed / data edit               | Refresh script + data-integrity tests                 |
| Shared vocabulary change       | Match-frontend-to-backend test                        |
| Frontend (markup / styles / JS) | E2E / Playwright suite, or manual UAT in browser     |
| Connector / fetcher            | Connector unit tests + a small live integration run  |
| Dependency install / upgrade   | Advisory sweep + lockfile diff + full build/test      |
| Design tokens / styles         | Contrast + visible-focus check at mobile and desktop  |
| Anything substantial           | Full test suite (`pytest` / `npm test` / `vitest`)   |

**Narrowest meaningful test first, then broaden.** Run the test closest to the change for the fast loop; escalate to the full suite only when the change has cross-cutting risk. Don't pay full-suite latency on every iteration, and don't skip it before declaring a substantial change done.

**For UI changes**, also run the app locally and click through the affected views — type checks and unit tests verify code correctness, not feature correctness.

**For data changes**, diff the canonical output (`docs/data/*.json` or equivalent) and skim the diff before committing. A 30-second skim catches regressions tests miss (especially around character encoding, pretty-printer drift, and unintended fields).

---

## Running multi-agent workflows

The `Workflow` tool (deep-research and friends) fans out dozens of subagents and burns millions of tokens. Treat each run as an expensive, fragile batch job — see [CLAUDE.md → Multi-agent workflows](CLAUDE.md) for the principles.

**Before launching:**
- **Right-size it.** A 5-angle / 100-agent deep-research is for a genuinely broad question. For gap-filling or a narrow ask, a few direct `WebSearch` / `WebFetch` calls beat a workflow — cheaper, faster, no fan-out fragility.
- **Prefer a stable moment.** Mid-run MCP churn and transient model flakes are most likely to derail schema-constrained subagents (the ones forced to call a `StructuredOutput` tool).

**When one fails:**
- **Resume, don't restart.** `Workflow({scriptPath, resumeFromRunId})` returns cached results for every completed `agent()` call and re-runs only from the first failed/edited step. Re-running from scratch repays the entire 100-agent cost for nothing.
- **Read the transcript before retrying.** They live in `…/subagents/workflows/<runId>/agent-*.jsonl`. A final assistant turn with `"model":"<synthetic>"` + zero tokens means that agent was *killed* by an abort cascade, not that it failed — count those to gauge blast radius, then find the **one** agent that threw first (often `completed without calling StructuredOutput`: a schema agent returned prose instead of the forced tool call). That first throw is the real bug; the synthetic kills are collateral.

**Reading the resource counts:** a run that finished faster and cheaper than a prior one usually *failed earlier* — it is not "more efficient." Always confirm the result object exists and is non-empty before trusting it. (Real case: a 7-min / 1.4M-token run died mid-verify and returned nothing; the 16-min / 3.5M-token run completed. The cheap one was the failure.)

---

## Agent token discipline

**Scar tissue from a 150k-token session (June 2026):** Two background agents launched in parallel — one Explore sweep of this codebase (60.6k tokens, 22 tool uses) and one web-research agent for job postings (88.3k tokens, 89 tool uses). Both tasks could have been done inline for under 10k tokens combined. The codebase sweep was answerable with `cat backlog.md` + `ls data/`. The web research was answerable with 3–4 `WebSearch` calls in main context.

### The inline-first rule

Try direct tools before spawning any agent. The threshold for spawning is ~10 tool uses — if you'd need more than that inline, delegate; otherwise, stay in main context.

| Task | Do this instead | Spawn agent only if… |
|------|-----------------|----------------------|
| Check backlog + one data file | `cat backlog.md`, `Read` the file | Never — these are 2 reads |
| Find a function or symbol | `grep -rn "symbol" .` via Bash | Never — grep is instant |
| Read 1–5 files | `Read` each directly | Never — 5 reads is fast |
| Explore a codebase structure | `find . -type f | head -40`, `ls`, `cat` key files | > 15 files to map, or genuinely unknown structure |
| 1–3 web searches | `WebSearch` calls in main context | Never — stay inline |
| 4–8 web searches with synthesis | Still try inline first | If synthesis would flood context |
| 20+ searches, multi-source report | — | Yes — spawn with tight constraints |

### Constrain every agent prompt — non-negotiable

Every delegated prompt must include at least one scope limiter:

- `"Report in under 600 words"` — caps output, which caps processing and return tokens
- `"Use no more than 8 web searches"` — prevents runaway page fetching
- `"Read only the 3 most relevant files"` — stops Explore from sweeping everything
- `"Return the top 5 results only"` — for list/research tasks

Without a constraint, the Explore agent defaults to exhaustive behaviour (reads every file), and a web-research agent will fetch 20+ full pages.

### Explore agent breadth — default to "quick"

The breadth label in an Explore prompt directly controls how many files it reads:

- `"quick"` — one targeted lookup; right for "where is function X defined?"
- `"medium"` — moderate exploration; right for "how does this module work?"
- `"very thorough"` — full sweep; only when you genuinely need every file in the project

Default to `"quick"`. Use `"medium"` when you need to understand a subsystem. Use `"very thorough"` only when you can't know which files matter — and even then, add "focus on files changed in the last 5 commits."

### Avoid parallel heavy agents

Parallel agents double the token spend at launch. Two 60–90k agents running in parallel burn 150k tokens immediately — before either result arrives.

Only parallelize when **all three** are true:
1. The tasks are genuinely independent (neither's output feeds the other)
2. Each would require > 15 tool uses inline
3. Waiting for the first before starting the second would cost real user time

When in doubt, run sequentially: finish the cheaper/faster task first, use its output to constrain the second.

### Scout before delegating

Do a 30-second inline check before spawning any agent:
- `cat backlog.md | head -30` — often answers "what's already been done?"
- `grep -n "keyword" index.html` — often answers "where does X live?"
- One `WebSearch` call — often answers "do these jobs exist?" before spinning up a 90-tool-use scraper

If the scout answers your question, no agent needed. If it confirms the scope is large, you now have real data to write a tight agent prompt with.

### Model selection for subagents

- Simple gathering (list files, grep, backlog check, schema validation): specify `model: "haiku"` — 20× cheaper than Sonnet
- Multi-source synthesis (web research, code review, gap analysis): default Sonnet is appropriate
- Reserve Opus only for genuinely open-ended creative/analytical tasks where Sonnet visibly underperforms

---

## Common tasks

### Adding a record / claim / row (most common)

1. Open the seed file (typically `data/seed/<entity>.json` or equivalent).
2. Append one record with: stable `id`, real `source_url`, verbatim content, today's `captured_at`, and any required category from the canonical list in the schema module.
3. Run the refresh script (validates + writes the build output).
4. Run the relevant data-integrity test to confirm.
5. Commit. Seed JSON and build output `data/*.json` move together — never in separate commits, or a future bisect lands on a broken state.

### Adding a feature

1. Confirm it's on `backlog.md`. If not, propose adding it before building.
2. Sketch the smallest version that closes the user need end-to-end.
3. Build that. Add tests alongside. Use the feature in the browser / CLI.
4. Commit at the natural boundary (per module, per fix, per doc update).

### Adding a new vocabulary item (theme, category, tier)

This is a schema change. **Don't do this casually.** Steps:

1. File a `backlog.md` entry first explaining the gap.
2. Add to the canonical constant in the schema module.
3. Mirror in any frontend mirror constant (the test that asserts parity catches drift here).
4. Add any color / icon / label token to the design system (light + dark variants).
5. Migrate any existing records that should map to the new entry — or intentionally leave them.
6. Run the full test suite — drift-safety tests should catch a missed mirror.

### Adding a connector (per-source scraper)

1. Subclass the project's `Connector` base class.
2. Register in the connector index module.
3. Implement `fetch_records()` / `normalize()` / `cache_key()`.
4. Set `run_order` so enrichment connectors run *after* their producers.
5. Schema-validate emitted records; tests catch any new field that the schema's `extra="forbid"` would reject.

---

## What NOT to do

- **Don't paraphrase quoted content.** Quote verbatim into the `statement` / `quote` / `body` field. Tests catch obvious markers ("they claim that…").
- **Don't write product copy in the AI register.** Headings, button labels, microcopy, empty states, and any prose that ships avoid the model tells — *delve / leverage / seamless / robust*, "it's worth noting that", marketing vapor, rule-of-three padding, hollow summaries. Plain, specific, human: lead with a number or a name, short declaratives, no ceremony. Full list in [DESIGN.md § 11.1](DESIGN.md).
- **Don't add a record without a real `source_url`.** Schema rejects it; reviewers reject it harder.
- **Don't LLM-classify subjective editorial calls.** Stance, sentiment, framing — these are curator-only. A wrong tag undermines the whole product.
- **Don't aggregate to a "trust score" / "credibility index" / "greenwashing score."** Show the data; let users judge.
- **Don't introduce a new framework / library / build tool** mid-project. If the stack is vanilla JS + Pydantic + Playwright, stay there. Adding React / Vue / Svelte / Webpack contradicts the static-first principle and adds maintenance debt the project doesn't pay back.
- **Don't touch `docs/data/*.json` (or equivalent build output) directly.** Edit the seed and re-run the refresh script.
- **Don't expand scope inside a fix.** A bug fix doesn't need surrounding cleanup; a one-shot operation doesn't need a helper. Note future cleanup in `backlog.md` and move on.
- **Don't loosen invariants quietly.** If a rule has a test guarding it, that test was written because someone got burned. Read the rationale before relaxing it.
- **Don't `--no-verify` to bypass a hook.** Fix the underlying issue. Hooks exist because someone got burned.
- **Don't add yourself as a co-author or leave a machine fingerprint.** Never include `Co-Authored-By:` for any AI agent in commit messages — not Claude, Copilot, or any other tool — and no "🤖 Generated with…" footers or tool-attribution lines in commits or PR descriptions. Commits are owned by the human who reviews and ships the work. Write the message in their plain voice (what + why), not the generic-assistant register. The `claude.coauthor` git config is set to `false` in these repos; honor it.
- **Don't treat an empty result as a failure (or a failure as empty).** A legitimately empty collection renders as an explicit "none" state; an extraction/parse failure is a bug to log in `issues.md`. Conflating them hides coverage gaps. See [CLAUDE.md → Data handling](CLAUDE.md).
- **Don't invent history for a missing file.** If a referenced `backlog.md` / `issues.md` / `security.md` isn't there, don't fabricate prior entries — create the file only when the task calls for it.

---

## Repo norms

- **Read before edit.** Always. Even if you read the file earlier in this session.
- **Type hints on every Python function.** No `any` in TypeScript.
- **No `print()` for runtime output** — use the `logging` module.
- **Test alongside code, not after.**
- **Commit at natural checkpoints**: per-feature, per-bug-fix, per-doc-update. Small, focused commits over large monolithic ones.
- **Touch targets ≥ 44px** in any UI work.
- **Mobile first.** If you change UI, resize the preview to 375×812 (iPhone SE) and verify before declaring done.
- **No API keys in code, ever.** Read from environment variables; halt with a clear error if missing.
- **System fonts by default.** No Google Fonts link without explicit justification (see [DESIGN.md § 2](DESIGN.md)).

---

## Escalate to a human when…

- The editorial frame would change (e.g. adding a new theme / category, changing the rubric for a subjective field, adding a new entity to the in-scope set).
- A subjective call is contested and you're unsure (stance tags, content categorization, what counts as a primary source).
- A canonical source URL starts 404'ing or paywalls. Pause before switching to a less-canonical source.
- Schema fields would change in a way that cross-cuts seed + frontend + tests + connectors. Sketch the migration plan in a `docs/` file first.
- The user says "ship it" but a test is still failing for unrelated-looking reasons. Surface the failure, don't silently skip.
- A "scar tissue" pitfall in [DESIGN.md § 12](DESIGN.md) seems wrong for the current task. The pitfalls exist because someone hit them; verify the rationale doesn't apply before relaxing the rule.

---

## Cross-project hygiene

Working in this folder means the user may run many small projects in parallel.

- **Stay within the current project's scope.** Don't open files from a sibling project unless the user explicitly asks. The folder-level `backlog.md` is portfolio work, not a substitute for the project's own `backlog.md`.
- **Each project's `security.md` is independent.** Refreshing one doesn't refresh the others.
- **Each project's tests are independent.** Don't infer test status across projects.

---

## When something unexpected happens

Add a concise note to the project's CLAUDE.md or `issues.md`. The pattern is:

1. **What I expected:** one sentence.
2. **What happened:** one sentence.
3. **Why:** one sentence (root cause, not symptom).
4. **What to do next time:** one sentence (the actionable lesson).

The note grows the project's scar tissue. The next agent (or you, a month from now) avoids the same hour-long detour.

That growth — files getting *slightly* more specific with each session's surprises — is the asset. Don't rewrite from scratch; append.
