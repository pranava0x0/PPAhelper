# Agent run log

Operational log of delegated subagent runs on this project: what was delegated, to
which model, what it cost, what it produced. Kept so orchestration improves run over
run; distilled lessons graduate to AGENTS.md → Running multi-agent workflows.

## Protocol (current)

1. **Spec before spawn.** The full task spec lives in a committed doc (e.g.
   docs/course-flow-spec.md) so a dead agent costs only its exploration, never the plan.
2. **Transient auth error (401)** → retry once with a fresh spawn.
3. **Session-limit error** → check the stated reset time against the current wall clock
   first; it may already have passed by the time the orchestrator acts on the failure.
   Only if the reset is genuinely in the future, arm a background wall-clock timer
   (`while [ $(date +%s) -lt TARGET ]; do sleep 300; done`, run in background — one
   re-invocation at fire time) and resume then. Never schedule a wait off the message
   text alone.
4. **Resume, don't respawn.** A dead agent that had accumulated exploration context is
   cheaper to resume (message it) than to replace with a cold spawn that re-reads
   everything. Respawn fresh only if resume fails.
5. **Log every run** — model, outcome, rough token burn, lesson — here, as it finishes.
6. **Canary before recommit.** After any limit failure, prove the pool is back with a
   trivial spawn ("reply OK", same model) before resuming/spawning real work — a passed
   reset time does not guarantee availability (the window may be rolling or re-exhausted).
7. **Two strikes, reroute.** If the same task dies twice on one model for capacity
   reasons, move the task to a model that is demonstrably working (or inline to the
   orchestrator) rather than paying a third cold context read.
8. **Don't trust silent channels.** Failure notifications can be dropped — poll task
   state (transcript mtime, panel) before claiming an agent is alive; print the wall
   clock in every probe rather than inferring times.

## Runs — 2026-07-12 (course-flow passes A/B)

| # | task | model | outcome | out tk | in tk (rough) | tool calls | lesson |
|---|------|-------|---------|--------|---------------|-----------|--------|
| 1 | Pass A implement | opus 4.8 | died mid-exploration: API 401 (transient) | ~9.8k | ~176k | 36 | no edits lost — spec was on disk; immediate retry correct |
| 2 | Pass A implement (retry) | opus 4.8 | died mid-exploration ~09:30 ET: Opus session limit ("resets 12pm") | ~9.2k | ~142k | 23 | orchestrator acted at 14:42 ET — reset had already passed; verify clock before scheduling any wait |
| 3 | Pass A implement (resume of #2) | opus 4.8 | died ~90s after 14:43 ET resume — pool still exhausted despite "resets 12pm"; failure notification never reached orchestrator (user's UI screenshot surfaced it) | ~1.5k | ~137k | 4 | a passed reset time ≠ available pool; canary the model before any real run (rule 6) |
| 4 | Pass A implement (reroute) | fable (main loop, inline) | shipped 15:15 ET — 32/32 tests, browser-verified desktop+mobile, zero console errors | — | — | — | after N=2 capacity failures on one model, reroute; run 3's partial index.html edits were verified against the spec and kept, so nothing was redone |

| 5 | Pass B implement (checkpoints, palette, flow tests) | fable (main loop, inline) | shipped ~16:00 ET — 40/40 tests across 4 suites, browser-verified incl. keyboard paths | — | — | — | Opus pool still capped until 5pm; two-strikes rule says don't wait when the orchestrator can finish the job |

Correction to run 3: the "failed at 14:44" status was wrong — the agent kept working
(zombie segment, 9 edits, all of index.html's Pass A changes) until a REAL death at
~14:57 on a fresh limit ("resets 5pm"). Both the panel and notifications misreported
liveness at some point; the transcript and `git status` were the only honest signals.

Also caught in run 5: the zombie agent's cache-buster bump (`?v=20260712`) was burned
into the browser cache during Pass A verification, then Pass B rewrote the same files
under the same version string — stale JS served silently. Bumped to `20260712b`.
Lesson: bump the version string once per SHIPPED state, not once per working day.

## Session accounting — 2026-07-12 (course-flow session)

Measured by grep-summing the JSONL transcripts after the PR opened; input sums are
per-call and approximate. Wall clock 00:03–17:56 ET with two idle gaps (00:03→09:00,
09:30→14:42 user-away). Nine driver messages produced the whole session.

| Actor | API calls | Tool calls (approx) | Output tk | Uncached input tk | Cache-read tk | Delivered |
|---|---|---|---|---|---|---|
| Main loop (fable) | 665 | ~506 | ~1.85M | ~306k | ~143M | spec, 3/4 of Pass A, all of Pass B, all verification, docs, PR #5 |
| Opus run 1 | 49 | ~36 | ~9.8k | ~176k | — | nothing (401 mid-exploration) |
| Opus runs 2+3 (one agent, incl. zombie segment) | 81 | ~70 | ~130k | ~181k | — | index.html Pass A edits (41+/31−) |

### What the numbers say (levers for the next run)

1. **Cache locality was the whole economy.** 143M cache-read vs 306k uncached input:
   one continuous hot-context session re-served its conversation from cache 665 times.
   Every cold spawn forfeits that — the two dead cold runs paid ~357k input re-reading
   the codebase and shipped zero edits. Rule 4 (resume, don't respawn) is worth about
   one full cold exploration per avoided respawn.
2. **Delegation underperformed inline for this task shape.** Four Opus lifecycle
   events (~140k output) delivered one file's edits; the main loop shipped everything
   else. For single-file-heavy refactors where the orchestrator already holds the
   context, inline wins — delegation pays off for parallel/independent work, which
   this wasn't. (CLAUDE.md "inline first", now with numbers.)
3. **Verification calls earned their cost.** ~50 of ~506 tool calls were live browser
   checks; they caught the two bugs static review could not (same-version stale-JS
   serving; the `.src::before` caption prefix). The Node suites alone would have
   shipped both.
4. **Grep-first mapping kept per-call context flat.** index.html (1,400 lines) was
   never read end-to-end; structural greps + targeted sed ranges found every edit
   anchor. Same technique read the dead agents' transcripts safely (bounded `grep -o`
   sums — never cat a transcript).
5. **Driver attention was the scarcest input: nine messages,** two of which were spent
   un-sticking dead delegation. The recovery machinery added mid-session
   (clock-checked resume, canary, two-strikes reroute, transcript-based liveness)
   exists so future limit deaths cost zero driver messages.

Input-token sums are per-API-call context re-sends without cache accounting — treat as
relative burn between runs, not billing figures.

### Takeaways so far

- Two dead runs burned ~19k output / ~318k rough input tokens with zero deliverable —
  the price of dying during exploration. Mitigations now in protocol: rules 3 and 4.
- Failure notifications embed a reset time, but the orchestrator may act on them hours
  later. Recompute against the clock every time (rule 3 exists because of run 2).

---

## Run log — 2026-08-08 · energy-lead pass (branch jam/energy-leads-ppa-opportunities-08a96d)

Single inline session (no delegation), three user-driven phases, 13 commits, all shipped and verified. If resuming with lost context: `git log 680be26..HEAD --oneline` is the map; every phase has its research in `docs/research-us-ppa.md` Rounds 8–9 and its evaluation in `backlog.md` (2026-08-08 sections).

**Phase 1 — job-scan pass (Round 8).** Buyer-side "energy lead" postings (CoreWeave, Antora, Umbrex primer) diffed against the site. Shipped: technology → contract map + tolling/heat-rate/nuclear practitioner deep-dive (Data centers), large-load queue + ESA-terms section (ERCOT SB6, FERC §206), buyer's-chair role card (Learn), 5 glossary terms, datacenter quiz 3→6.

**Phase 2 — CEO lens (gigawatt execution).** Shipped: "Serve the load" stack builder (`stack-core.js` pure math + `stack.js` UI + `test/stack.test.js`, 10 cases; battery targets deepest deficit hours at EIA 82% RTE), gigawatt playbook (T−48 sequencing table, leverage, credit-at-scale, campus-killers), hiring-bar rubric, quiz 6→8.

**Phase 3 — case studies (Round 9).** `data/datacenter.json` gains `caseStudies` (6: AWS×Talen ER24-2172, Microsoft×Crane, Meta×Entergy LPSC, Crusoe Abilene, xAI Memphis, AEP Ohio 24-508-EL-ATA) and `vppCases` (2: NRG×Renew Home, Sunrun CalReady) with participants / agreement stack / unique-vs-PPA / filings history / primary citations; renderer in `content.js`; validation in `data.test.js`.

**Lessons that cost time (already codified):**
1. **The `?v=` scar bit twice more.** Stale `app.js` mid-session (bumped a→b), then stale `datacenter.json` — data fetches carried no version at all. Fix: `dataUrl()` threads each script's own `?v=` onto its JSON fetches; ui.test.js guard; issues.md entry; CLAUDE.md note now says "bump per editing pass."
2. **Browser-pane collapse mimics layout bugs.** `window.innerWidth === 0` (pane hidden) makes overflow numbers meaningless (a phantom "218px overflow" appeared twice). Check `innerWidth`/`document.hidden` before trusting any rect; re-establish with `resize_window` + reload.
3. **Quiz containers render `.quiz-q` divs, not fieldsets** — a smoke-test selector regression falsely reported dead checkpoints once.
4. **Test-the-test:** two "failures" this session were wrong assertions (battery-displaces-gas economics; slug-length check), not wrong code. Hand-verify the scenario before touching the model.

**State at pause:** worktree clean; 55 tests green across 5 suites; preview on :8129 (python http.server). Not yet done: /ship ritual (PR + review), and the ppa-expert-review directional sweep over the new copy would be a sensible pre-PR step.

---

## Run log — 2026-10-08 · case-study refresh (branch jam/case-studies-site-refresh-c1847a)

Orchestrated per the user's cost ladder: web searches and haiku for breadth, primary PDFs read inline for depth, one opus agent for the build, max two agents at a time.

| # | Agent | Job | Tokens | Outcome |
|---|---|---|---|---|
| 1 | haiku (general) | Scan the last 12 months: FERC large-load dockets, PJM auction/backstop, new data-center supply deals, tariff spread | ~100k | Useful map; several dates and one docket number wrong (46362 for 46322; show-cause deadline), all re-verified by direct search before use |
| 2 | haiku (general) | Fetch the six existing cases' follow-on events and candidate new cases | ~125k | Good leads (Fervo, NIPSCO, PJM RBP); Fermi/NRG flagged as thin |
| 3 | opus (general) | Build: glance table renderer, fact strip + lesson-first, CSS incl. <640px stacking, tests, copy, quiz, cache-bust | ~110k, 24 tool uses | Clean; four of five suites green before data landed, all five after |

Inline (no agent): the two order PDFs (ER26-3380, 97 pp; IURC 46322, 73 pp) were saved to the scratchpad and read with pypdf — WebFetch returns binary for them. The JSON mutation was a scratchpad Python script (indent 2, `ensure_ascii=False`, trailing newline) so re-running is idempotent.

**Lessons:**
1. **Haiku is a lead generator, not a source.** Every date or docket it returns goes through one direct check before it reaches `data/*.json`.
2. **The browser pane's mobile emulation misreports scroll geometry.** `scrollIntoView` appeared not to move the page at 375px (element top stayed at 1,129px in a reported 1,845px-tall viewport); the same click at desktop landed the case at 150px, exactly under the sticky nav. Verify scroll behaviour at desktop and trust screenshots, not rects, at emulated widths (see the 2026-08-08 note on `innerWidth`).
3. **Glance strings need a hard cap.** `data.test.js` enforces ≤ 90 chars per cell; two of mine were 92–93 before the test caught them. Write the cell first, the prose second.
