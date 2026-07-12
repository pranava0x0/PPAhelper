# CLAUDE.md — Universal Development Principles

> Base file for every project in this folder. Project files extend it and win on conflict (they're the local source of truth).
>
> Companion files: [AGENTS.md](AGENTS.md) is the *how* for agents; [DESIGN.md](DESIGN.md) is the *look*.

---

## North star: ship small things that work end-to-end

One rule drives the rest: **build the smallest version that works, then add only what the next real user need demands.** (Karpathy: "make it work, then make it good." levels.io: "ship it ugly, ship it now.") A working ugly thing teaches more in a day than a plan teaches in a month.

- **No half-finished work.** A feature ships end-to-end or stays a branch — never merged 80% done with a TODO.
- **No speculative abstraction.** Three similar lines beat a premature helper. Build the helper the second time you need it.
- **No future-proofing without a present user.** Every config knob, plugin point, and flag is dead weight until someone uses it.

---

## Agent Workflow: Explore → Plan → Code → Verify

Never blindly write code.

1. **Explore.** Find relevant files and understand existing patterns before touching anything.
2. **Plan.** Assess blast radius. For significant changes, present 2–3 approaches with pros/cons and get approval before coding.
3. **Code.** Implement following the rules below.
4. **Verify.** Run tests, use the feature, fix all failures before declaring done.

**Read before edit** — always, even if you read the file earlier this session. **Ask for options first** on non-trivial tasks; the first plausible plan is rarely the best. **Close the loop yourself** — build so the agent can compile, lint, test, and verify its own output. (Karpathy: "agentic coding works when the eval is the loop.")

---

## Communication style

- **Concise.** No filler, apologies, moralizing, or generic advice.
- **Show your work** only when it changes the answer.
- **Fail loud.** No catch-all handlers that swallow errors. Raise or log.
- **State results, not effort.** "Tests pass," not "I worked hard to get tests to pass."

---

## Architecture principles

- **No over-engineering.** Only changes directly requested or clearly necessary.
- **Boring tech wins.** Vanilla JS, SQLite, static HTML, system fonts, plain Python beat the framework-of-the-month. Every dependency is a future bug, migration, and advisory. (levels.io: "boring tech is the secret.")
- **Single source of truth.** Constants, configs, shared types derive from one place. If a value is duplicated, test that the copies match.
- **Modular layers.** Data fetching, processing, storage, presentation — distinct modules.
- **Idempotent operations.** Re-running is safe and repeatable (`INSERT OR IGNORE`, cache checks, dedup by key).
- **Static when possible.** Baked data over runtime backends. A `docs/` folder on GitHub Pages beats a server to babysit.
- **Cost-optimized.** Free tiers; cheapest resource that meets the requirement.
- **CLI-first.** Build CLI entry points before UI so agents can self-validate output.
- **Minimize page weight and request count.** Content sites stay lightweight — fewest requests, smallest payload.
- **Tree-shake and code-split.** Lazy-load what a page needs; don't bundle every controller everywhere.
- **Benchmark against best-in-class.** If the simplest site in the org is orders of magnitude lighter, review the build.
- **Document subsystems.** A `docs/` folder noting non-obvious subsystems, decisions, and correct CLI invocations. One line prevents repeated mistakes.

---

## Error resilience

- **Never let one item crash the pipeline.** Wrap per-record processing; log and continue.
- **Log aggressively** — every request, parse, API call, cache hit/miss, filter decision.
- **Cache everything fetchable** so re-runs are fast and cheap.
- **Validate everything.** Invalid external responses → log and skip, never crash.
- **Track errors visibly** in `issues.md` or an errors array — failures must surface.

---

## Security & credential handling

- **Never commit secrets.** Read credentials from env vars only; halt with a clear error if missing; never log them.
- Always `.gitignore`: `.env`, `.env.local`, `credentials.json`, `secrets/`, `node_modules/`, `__pycache__/`, `dist/`, `*.pyc`.
- Before committing: `git diff --cached | grep -iE "apikey|password|token|secret"`.
- **Respect privacy choices.** Don't proxy tracking SDKs through your own domain to dodge blockers.
- **Check advisories before any install / upgrade.** Supply-chain attacks hit popular packages within hours of a maintainer phish. Before suggesting/running `npm install` / `pip install`, fetch the advisory index at `https://pranava0x0.github.io/vibe-coding-security/llms-ctx.txt` (~12 KB) and surface any match before proceeding. Keep a `security.md` per project with the last sweep date; refresh if > 7 days old.

### Supply-chain hardening

- **Pin exact versions, never floating ranges.** `==` (Python) + lockfile installs (`npm ci`, not `npm install`) — a `>=`/`^` range auto-pulls whatever the registry serves next, the exact window a bad release lands in. Better still, hash-lock (`pip-compile --generate-hashes` + `--require-hashes`, `uv lock`, lockfile integrity hashes) to reject same-version re-publishes.
- **Subresource Integrity on every CDN asset.** `sha384` `integrity` on each `<link>`/`<script>`/import-map entry so a swapped file fails closed. Regenerate with `curl -sL <url> | openssl dgst -sha384 -binary | openssl base64 -A`; verify twice (a partial download yields a wrong hash that blanks the page). Self-host when feasible.
- **Pin CI actions to a full commit SHA + least privilege.** Every `uses:` pinned to a 40-char SHA (not a moving `@v3` tag) with a `# vX.Y.Z` comment, plus a minimal `permissions:` block per workflow. Re-pin with `gh api repos/<owner>/<repo>/commits/<tag> --jq .sha`.
- **Neutralize formula injection in exports.** Prefix CSV/TSV/spreadsheet cells starting with `= + - @`, tab, or CR with a `'`, or `=HYPERLINK(...)` runs when opened in Excel/Sheets.
- **No machine-local paths in committed data.** Store paths repo-relative; `/Users/<name>/...` leaks identity and layout into public history.
- **Every security fix ships with a regression test** — these regressions are invisible until exploited.

---

## Testing & validation

- **Write tests alongside code.** Every new module or bug fix includes them.
- **Regression-test every bug fix.** The bug is the test case; without one the fix rots.
- **Validate output against schemas before writing to disk** (Pydantic `extra="forbid"`, or zod).
- **Cover edges:** empty `[] / {} / ""`, null for every optional field, boundary values, combined filters.
- **Run the full suite before committing.**
- **Never ship test files to production.** CI excludes tests, fixtures, debug artifacts.
- **Tests are the eval suite** — the loop that tells you what works. Invest in it.

---

## Git discipline

- **Commit often** at natural checkpoints — small and focused: per module/feature, per bug fix (with its regression test), per doc update.
- **Messages explain *what* and *why*** — "fix off-by-one in pagination when filter is empty," not "fix bug."
- **Never commit large binaries, downloaded data, or keys.**
- **Don't amend pushed commits**, and don't `--no-verify` — fix the hook's underlying issue.
- **No agent co-authors and no machine fingerprints.** No `Co-Authored-By:` for any AI tool, no "🤖 Generated with…" footers, no generic-assistant PR prose. Commits are owned by the human who ships them; write messages in their plain voice. Enforce with `git config --local claude.coauthor false` (set globally once to cover all repos).
- **Set commit identity deliberately.** Author with the account's noreply address — `git config --global user.email "<id>+<username>@users.noreply.github.com"` — and set `user.name "<username>"` too, or git falls back to the OS full name and leaks it. The human runs this; agents don't touch git config.

---

## Data handling

- **Append-only.** Append rather than overwrite; dedup by unique key.
- **Source attribution.** Every record carries its origin (source URL, connector, capture date) so any value traces back.
- **Defensive optional fields.** Null-check before rendering or processing.
- **Null renders as an explicit placeholder** ("N/A", "—") — never a blank element.
- **Empty ≠ broken.** A legitimately empty result (clean audit, no matches) is valid — render an explicit "none" state. An *extraction failure* is a bug — log it and track coverage in `issues.md`. A silent `0` conflating the two reads as "covered everything" when it didn't.
- **Generated output commits with its source.** Seed + baked JSON, or rules + derived `llms.txt`, move together (a bisect must never land on an inconsistent state); assert the match with a test.
- **Capture dates over "current" framing.** Record `captured_at` and surface "as of YYYY-MM-DD"; record `archived_via` when a value came from a secondary/archived source.

---

## Issue tracking (`issues.md`)

A living audit trail in the project root.

- Each bug: date, area, description, root cause (**code bug** vs. **test bug**), status (Open / Fixed).
- On resolution: the fix + the commit. Check whether a regression test is needed.

## Backlog (`backlog.md`)

- Add ideas immediately — don't lose them. Each: description + priority (low / medium / high).
- Reprioritize periodically; demote stale "high" items rather than let them rot.

---

## Python standards *(when the project uses Python)*

- Type hints on all functions. `pathlib.Path` for paths. `logging`, not `print`, for runtime output.
- All constants in one config module. Pydantic for validation. Python 3.9+ unless specified.
- Pin dependencies with `==` (see Supply-chain hardening for hash-locking).

---

## Frontend standards *(when the project has a web frontend; full system in [DESIGN.md](DESIGN.md))*

- Functional components + hooks only. TypeScript strict, no `any`.
- Colors, enums, constants in a dedicated file — never inline.
- Data transforms in hooks/utils, not components.
- Loading, error, and empty states on every view. Visible focus indicators on every interactive element.
- **Mobile-first**; test at 375px before declaring done. **Touch targets ≥ 44px.**
- **Deduplicate image assets;** `<picture>` + `srcset` for AVIF/WebP/PNG. Never serve uncompressed PNGs for content. **Descriptive `alt`** on every content image.
- **Only load libraries used on the page.** No backend-only deps in read-only frontends.
- **Responsive CSS, not duplicate DOM trees.**
- **The `[hidden]` trap.** A `display: ...` rule overrides the `hidden` attribute. Always ship a `[hidden] { display: none }` rule alongside it.
- **Cache-bust per shipped state, not per day.** Two same-day passes rewriting the same assets under one `?v=` string serve stale JS silently (bitten 2026-07-12). If assets changed, the string changes.

---

## Network ethics & rate limiting *(when fetching from external sources)*

- ≥ 1.5–2s between requests to one host. Informative `User-Agent`. 429 → exponential backoff from 10s.
- Cache all fetched content to disk; re-runs never re-download.
- Persistent block after retries → log to `issues.md` and skip, never crash.
- **Start small** — validate against a handful of pages before a full run.

---

## AI / API cost optimization *(when the project uses LLM APIs)*

- Cheapest model that meets quality (Haiku before Opus). Keyword pre-filter before expensive calls. Truncate/excerpt input.
- Cache responses by content hash; never re-classify identical content.
- Log cost per layer; print a run summary. `--dry-run` and `--fetch-only` work without an API key.

---

## Working with AI agents (meta-principles)

- **Context is RAM, not memory.** (Karpathy: LLMs are "fuzzy CPUs.") Fill it with what the task needs — no more. Watch for context poisoning (compounding early errors), distraction (noise burying signal), and clash (contradictory instructions).
- **Start fresh on topic switches.** `/clear` between unrelated problems; break complex tasks into small committed steps.
- **AI has no taste.** Review output for: excess try/catch, needless abstractions, bloat instead of refactoring, generic naming (`data`, `result`, `utils2`), comments that restate code, gratuitous emoji or marketing tone. The fix is one thing: **match the surrounding code's idiom** so a diff doesn't announce a different author.
- **AI-sounding prose is a tell too.** Scrutinize shipped words — UI copy, empty states, READMEs, generated narrative — as hard as code. Cut the LLM register (*delve, leverage, robust, seamless,* "it's worth noting"), marketing vapor, rule-of-three padding, hollow summaries. Lead with the specific; short declaratives; read it aloud. Full list in [DESIGN.md § 11.1](DESIGN.md).
- **The four agent failure modes** (Karpathy), each already a rule here: (1) unverified assumptions → surface tradeoffs, ask first; (2) abstraction hypertrophy → minimum code; (3) collateral changes → touch only what the task needs, log adjacent cleanup in `backlog.md`; (4) no success criteria → define "done" and loop until verified.
- **AI is a tool, not a substitute for discipline.** Apply the fundamentals — perf audits, bundle analysis, review — to generated code. High LOC means nothing if it's bloated.
- **Vibe coding for throwaway; engineer the rest.** The moment a user depends on it, you owe it *agentic engineering* (vibe coding raises the floor; this raises the ceiling). Litmus test: **can you defend the output** under review? If not, you're still vibe coding.
- **Intent specification is the new coding.** The unit shifts from typing lines to delegating macro-actions; the scarce skill is judgment — what to delegate, how to specify, how to review fast. Write non-trivial logic as a prose spec first (trigger, inputs, mechanism, success criteria). **LLMs automate what you can verify** — build the feedback loop first.
- **Make instructions agent-legible.** Setup/deploy/run steps as copy-pasteable markdown blocks, not brittle scripts. Document the APIs, CLIs, and logs an agent can sense and drive — the more it can sense and drive, the more it closes the loop unattended.
- **Closed-loop validation** is the biggest force multiplier: when the agent can answer "did it work?" itself, every iteration is fast.
- **Keep this file current.** Append concise notes when something surprises you (a failed pattern, a correct invocation, a quirk). This is scar tissue — grow it, don't rewrite it.
- **Write big plans to files.** Spec large tasks to a `docs/` markdown file and review before executing.
- **Agents are expensive — inline first.** Spawning a subagent costs ≥5k tokens in overhead before any work, and a codebase-sweep Explore agent can hit 60k+ on 22 tool uses. Before spawning, ask: *can I answer this with 3 or fewer inline tool calls?* (`Read`, `Bash`, `WebSearch`, `preview_eval`). If yes — do it inline. Only spawn when the task genuinely needs > ~10 tool uses OR would flood main context with noise you don't need. Always include a scope constraint ("report in under X words", "use no more than N searches", "quick" or "medium" breadth — never "very thorough" by default). Avoid two heavy agents in parallel — 150k tokens can burn in one message.
- **Never use an agent to review a live UI.** Static-analysis agents read HTML and JS files but can't run the server or execute JavaScript. They will give confidently wrong answers about dynamic behavior — e.g., concluding a working feature is broken because the form output only appears after JS runs. Use `preview_eval`, `preview_snapshot`, and `preview_screenshot` directly instead. They're faster, cheaper (~3k tokens vs ~40k), and actually correct.
- **Sweep for orphaned wrapper shells after long-running commands.** A background polling wrapper (`until ps -p $(pgrep -f "...")...; do sleep N; done`) can outlive its process: once the PID exits, `pgrep` returns empty and the `until` loop never resolves, sleeping forever. Run `pgrep -fl "<project-path>"` before declaring done and `kill` stragglers. Fixes: prefer a Monitor tool over inline polling, or invert to `while pgrep -f "..."; do sleep N; done` so the loop exits when the process disappears.

### Multi-agent workflows (orchestration)

Scar tissue from a deep-research run that died at ~106 agents (operational drill in [AGENTS.md → Running multi-agent workflows](AGENTS.md)):

- **Judge a run by its output, never by its token/time counts.** A *failed* run is usually cheaper and faster than a successful one — it quit early. A run that was "2× faster and used 40% of the tokens" but returned nothing is strictly worse, not an optimization. Confirm the deliverable exists and is non-empty before declaring success.
- **Checkpoint intermediate results to disk.** The fan-out phases (search, fetch, verify) are the expensive part; the final synthesize is cheap. Persist each phase's output so a late-stage crash is salvageable instead of discarding hours of upstream work — then resume from the checkpoint, don't restart from zero.
- **Contain per-agent failures; one bad agent must not sink the batch.** In a wide fan-out (60+ concurrent), a single uncaught throw can abort every in-flight sibling. Schema / forced-tool agents fail by returning prose instead of the tool call — tolerate that as an abstention (coalesce to null), and wrap any *terminal* schema step (the synthesizer) in try/catch that salvages partial results.
- **Right-size the fan-out to the task.** 100+ agents and millions of tokens is the cost of a genuinely broad question, not a default. For gap-filling or a known-narrow ask, a handful of targeted searches is cheaper, faster, and far less fragile.
- **Provider limits are part of the plan** (2026-07-12, four delegated-agent deaths in one task): verify a stated reset time against the wall clock before waiting on it — it may already have passed, or re-cap again after passing; canary a capped model with a trivial spawn before real work; resume a dead agent rather than respawn (a cold respawn repays the whole exploration — ~180k input tokens here for zero shipped edits); after two capacity deaths on one model, reroute the task or take it inline; judge liveness from the transcript and `git status`, never the task panel — a "failed" agent kept editing for 13 more minutes. Keep a per-project `docs/agent-runs.md` logging each run's model, outcome, tokens, and lesson.

---

## Influences

- **Andrej Karpathy** — "make it work, then make it good"; LLM-as-fuzzy-CPU; eval-as-the-loop ("LLMs automate what you can verify"); context over prompt engineering; the closed-loop bar for trustworthy agents; the 2026 shift from vibe coding to *agentic engineering* (intent spec + task decomposition) and the four failure modes (unverified assumptions, abstraction hypertrophy, collateral changes, missing success criteria).
- **Pieter Levels (levels.io)** — ship fast and ugly; boring tech beats shiny; solo-friendly defaults (vanilla, SQLite, single-file, cheap hosting); profit before scale; don't add a dependency you can't maintain alone; talk to users daily.

When in doubt: **ship the smallest version that works, then iterate on what real users do, not what you imagine they'll do.**
