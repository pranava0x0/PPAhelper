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

Correction to run 3: the "failed at 14:44" status was wrong — the agent kept working
(zombie segment, 9 edits, all of index.html's Pass A changes) until a REAL death at
~14:57 on a fresh limit ("resets 5pm"). Both the panel and notifications misreported
liveness at some point; the transcript and `git status` were the only honest signals.

Input-token sums are per-API-call context re-sends without cache accounting — treat as
relative burn between runs, not billing figures.

### Takeaways so far

- Two dead runs burned ~19k output / ~318k rough input tokens with zero deliverable —
  the price of dying during exploration. Mitigations now in protocol: rules 3 and 4.
- Failure notifications embed a reset time, but the orchestrator may act on them hours
  later. Recompute against the clock every time (rule 3 exists because of run 2).
