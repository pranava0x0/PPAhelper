# Course-flow spec — make PPA Helper an excellent course for newcomers AND experts

> SHIPPED 2026-07-12 — pass A in 752566d, pass B in the following commit. Kept as the
> design record for the course flow. Two deviations from the text below: the nav
> reorder (A3) was already in main before the pass, and the simulator bank's basis
> question is grounded in the page's own spread numbers (no "Aug 2027 worked row"
> exists on the simulator page).

## Diagnosis (verified against the live site 2026-07-12)

The content is strong but the site reads as a *reference*, not a *course*:

1. **No spine across tabs.** Nine tabs, implicit order, 8 of 9 end as dead ends. The only
   "Where to go next" card sits below two collapsed accordions at the bottom of Learn.
2. **Nav order contradicts the taught order.** Learn tells the reader twice to "run the
   settlement simulator" next, but the nav places Drafting and Draft PPA between them.
   Reference material (Glossary, Coverage) is mixed in with course stops.
3. **No progress model.** Nothing records what's done; a returning learner has no resume point.
4. **Learn's stepper is stale.** Hardcoded 4 path cards + a lede saying "four steps" over a
   page with 7 sections, duplicating the auto-generated numbered TOC right above it. No
   you-are-here highlighting anywhere.
5. **The mode toggle is passive for experts.** Practitioner mode hides the on-ramp but offers
   no fast lane: no index of the deep sections scattered across 7 tabs, no search.
6. **Self-check exists on one tab only.** backlog.md itself ranks per-tab quizzes as the #1
   pedagogical gap. There's no way to close the "did I learn it?" loop per stop, and no way
   for an expert to test out of the basics.

## The course model (single source of truth)

One canonical course, same order for both levels — the level filter already controls depth
*within* each stop. Defined once in `app.js`:

```js
var COURSE = [
  { view: "foundations", label: "Learn",                teaser: "PPAs from scratch: the grid, the market, the settlement mechanic." },
  { view: "simulator",   label: "Settlement simulator", teaser: "Feel the cash flows: strike vs LMP, month by month." },
  { view: "examples",    label: "Drafting",             teaser: "How real contracts encode it: clauses, pricing structures, risk." },
  { view: "ppadraft",    label: "Draft PPA",            teaser: "Generate a full VPPA draft from terms you choose." },
  { view: "projfin",     label: "Project finance",      teaser: "Size the debt, see the equity return — the number the deal is really about." },
  { view: "datacenter",  label: "Data centers",         teaser: "The demand shock reshaping who signs PPAs and why." },
  { view: "perspectives", label: "Perspectives",        teaser: "What the people who do this all day disagree about." }
];
// Reference views (not course stops): glossary, coverage
```

---

## Pass A — spine, nav, stepper, expert lane

### A1. Course footer on every stop (replaces dead ends)

- JS appends a `.course-footer` at the end of each course view's section:
  - Left: `← Prev · {label}` (hidden on stop 1).
  - Center: `Mark stop {n} of 7 done` toggle (aria-pressed reflects state; becomes
    "Done ✓ · mark unread" when set). Below it, a small `reset course progress` text button
    (only rendered when ≥1 stop is done; confirm()-free — single click resets, it's low-stakes).
  - Right (dominant): `Next: {label}` + one-line teaser, card-styled, accent left border.
    On the last stop: "End of the course — browse the Glossary or check Coverage & sources."
- Reference views (glossary, coverage) get a slim footer: `Reference · Resume the course at
  stop {n}: {label} →` pointing at the first unfinished stop (or stop 1 when none started).
- All buttons are real `<button data-view=…>` so existing wiring patterns apply. Generated in
  JS, not HTML, so the sequence lives in exactly one place.

### A2. Progress model

- `localStorage["ppa-progress"]` JSON: `{ done: { viewName: true }, quiz: { bankId: { best, total } } }`.
  Parse defensively (try/catch → `{done:{},quiz:{}}`).
- Expose on `window.PPA`: `progress.isDone(view)`, `progress.markDone(view, on)`,
  `progress.reset()`, `progress.quizResult(bankId, score, total)` (stores best score; when a
  bank maps to a course view and score ≥ total − 1, auto-marks that view done),
  `progress.firstUnfinished()`. Pass B consumes `quizResult`.
- Nav ticks: a done stop's tab gets `.done` → a `✓` glyph (text char, not emoji) rendered via
  a `<span class="tick" aria-hidden="true">✓</span>` appended in JS + visually-hidden " (done)"
  text for SRs. Keep `.nav-btn` inner layout intact.
- Progress chip in `.masthead-controls`, before the level filter: mono `3/7`,
  `title="3 of 7 course stops done — click to resume"`, click = jump to first unfinished stop.
  Hidden entirely at zero progress (chip appears once the course starts — quieter masthead).
- Course numbers on tabs: in Newcomer mode only, course tabs show a small mono index
  (`1`–`7`) before the label (span, `aria-hidden`; SR text unchanged). Practitioner hides the
  numbers (adds `.lvl2` class on `<html>` or the nav via applyLevel), ticks show in both modes.

### A3. Nav = course order + reference group

- Reorder nav buttons in index.html to COURSE order:
  Learn · Settlement simulator · Drafting · Draft PPA · Project finance · Data centers ·
  Perspectives · | · Glossary · Coverage & sources.
- `<span class="nav-sep" aria-hidden="true"></span>` before Glossary: 1px vertical rule
  (`--border`), self-centered, margin 0 6px.
- Glossary + Coverage tabs get `.nav-ref` (slightly muted resting color; same active state).
- Update `VIEWS` array order in app.js to match (tests compare as sets, but keep them aligned).
- The `<section>` blocks in `<main>` may stay in current source order — only nav order matters.

### A4. Learn stepper unification + scroll-spy everywhere

- Delete the hardcoded `<ol class="path">…</ol>` block and its CSS (`.path`, `.path-step`,
  `.path-n`, `.path-t`, `.path-lvl`, the `ol.path` sticky rule, mobile overrides). The
  auto-generated numbered `.toc` becomes the single in-page nav for every long tab.
- Make `.toc` sticky on ≥900px: `position: sticky; top: <just below masthead>; z-index: 20;
  background: var(--bg);` with a bottom hairline while stuck. Static on mobile.
- Scroll-spy: one IntersectionObserver per view (or one global, re-scoped on view switch)
  highlighting the current section's `.toc-link` with `.active` (accent text + accent
  underline — same treatment as the active nav tab). Respect `prefers-reduced-motion` for
  scrolling (already handled in wireScrollLinks).
- Fix the Learn lede: replace "in four steps" with wording that doesn't hardcode a count,
  e.g. "…from 'I know nothing about power' to a deal's first settlement — step by step."
- Also remove the now-redundant `aria-label="Learning path"`-specific handling if any.

### A5. First-visit path chooser (makes the silent mode toggle an explicit decision)

- Static markup in index.html, top of Learn between the lede and the TOC:
  `<div id="path-chooser" class="chooser" hidden>` containing two choice buttons + dismiss:
  - "**New to power markets?** Follow the course in order — start at Electricity from scratch."
    → ensures level 1, dismisses, scrolls to `#stage-1`.
  - "**Work in energy already?** Switch to Practitioner: the on-ramp hides and a jump index
    to the deep sections appears." → applies level 2, dismisses, scrolls to `#prac-index`.
  - Dismiss `×` button (`aria-label="Dismiss"`), 44px hit area.
- Show only when `localStorage["ppa-chooser-done"]` is unset AND progress is empty. Any
  choice or dismiss sets the flag. No modal, no overlay — an inline card with accent border.

### A6. Practitioner index (the expert fast lane)

- `<div id="prac-index" data-level="2">` in Learn right after the chooser slot. JS fills it
  from a curated array in app.js (curated beats DOM-scanning: exact labels, testable):

```js
var PRAC_INDEX = [
  { view: "foundations", target: "…basis-risk h2 id…",      label: "Basis risk" },
  { view: "foundations", target: "…iso-rto section id…",    label: "ISO/RTO market-by-market" },
  { view: "foundations", target: "…scope2 id…",             label: "REC → Scope 2 chain" },
  { view: "foundations", target: "…whos-who id…",           label: "Who's who behind a deal" },
  { view: "foundations", target: "…bankable id…",           label: "What bankable means" },
  { view: "examples",    target: "…pricing structures id…", label: "Pricing structures" },
  { view: "examples",    target: "…risk allocation id…",    label: "Risk allocation matrix" },
  { view: "examples",    target: "…deal lifecycle id…",     label: "Deal lifecycle" },
  { view: "examples",    target: "…approvals id…",          label: "Getting to signature" },
  { view: "examples",    target: "…annotated examples id…", label: "Annotated real PPAs (SEC-filed)" },
  { view: "projfin",     target: "…workbench anchor…",      label: "Debt-sizing workbench" },
  { view: "projfin",     target: "…flip id…",               label: "Tax equity & the flip" },
  { view: "datacenter",  target: "…deals table anchor…",    label: "Hyperscaler deals table" }
];
```

  (Resolve each `target` to the real h2 `id` — the TOC builder already assigns
  `{view}-s{n}` ids to h2s without ids; prefer adding stable explicit ids to these h2s in
  index.html, e.g. `id="basis-risk"`, so the index and tests don't depend on section order.)
- Render: eyebrow "Practitioner index", then compact jump chips grouped by tab
  (`Learn · Drafting · Project finance · Data centers` group labels). Chip = pill button,
  44px min height on touch, mono number optional. Click = `showView(view)` then scroll to
  target (after the view unhides — next frame).
- Since the container carries `data-level="2"`, the existing level filter shows/hides it.

### A7. CSS notes (both passes)

- Use existing tokens only (`--surface`, `--border`, `--accent`, `--accent-soft`,
  `--shadow-card`, `--text-muted`). No new colors, no emoji, no web fonts.
- `.course-footer`: grid `auto 1fr auto` on desktop, stacks at ≤640px; top hairline rule;
  the Next card uses `--surface` + `--shadow-card` + 3px accent left border (same idiom as
  the old `.path-step`).
- Touch targets ≥ 44px; visible `:focus-visible` outlines (accent) on every new control.
- Verify nothing new triggers the `[hidden]` trap (a `display:` rule overriding `[hidden]`)
  — the guard rule exists but don't rely on it for layout classes.

### Pass A acceptance

- `node test/ui.test.js && node test/data.test.js && node test/settle.test.js` all pass
  (update ui.test.js ONLY if an assertion referenced the removed `.path` markup; do not
  weaken any test).
- Every nav `data-view` still resolves; VIEWS/tab sets still match; no console errors.
- Grep: no leftover `.path-step` / `ol.path` references in html/css/js.

---

## Pass B — checkpoints, palette, tests

### B1. Quiz engine + banks (the #1 backlog gap)

- Extract question banks to `assets/js/quiz-banks.js` following the settle-core.js
  browser+Node pattern: `window.PPA_QUIZ_BANKS` in browsers, `module.exports` under Node.
- `quiz.js` becomes a small engine: for every `[data-quiz]` container, render that bank with
  the existing card/option/explain UI (keep current classes so styles.css just works; keep
  the reset button behavior per instance; score line gets `aria-live="polite"`).
- On completion of a bank (all questions answered): call
  `PPA.progress.quizResult(bankId, score, total)` — Pass A auto-marks the stop done at
  score ≥ total − 1 — and render an inline result row: "Checkpoint passed — Next:
  {next stop label} →" (button, data-view) or "Review the sections above and retry."
- **Test-out nudge (experts):** on the `learn` bank at 100% while level 1 is active, show
  one extra chip: "All correct — Practitioner mode will skip the on-ramp and show the deep
  index." Button applies level 2 (reuse the level-filter buttons' click path so aria state
  stays in sync).
- Banks (every question MUST be answerable from existing on-page content — reuse the page's
  own numbers; invent no facts; keep the existing 6 drafting questions verbatim as bank
  `drafting`):
  - `learn` (6): kW vs kWh; who's who (generator/ISO/utility/load); what LMP is and why it
    moves; why PPAs exist (bankability side); physical vs virtual; settlement direction at a
    given strike/LMP.
  - `simulator` (4): who pays whom + amount for given strike/LMP/volume; developer realized
    price with a node-hub spread (mirrors the Aug 2027 worked row); what a $0 floor changes
    at negative LMP; why capacity factor drives settled volume.
  - `projfin` (4): what DSCR 1.25× means; why a higher PPA price supports more debt; why
    debt tenor ≤ PPA term (merchant tail); what the ITC does to year-1 equity cash.
  - `datacenter` (3): sourced ONLY from data/datacenter.json + the Data centers view copy
    (structures, speed-to-power, additionality claims). Fewer questions is fine if the
    content doesn't support 3 without inventing facts.
  - `perspectives`: no bank (opinion content) — manual mark-done only.
- Checkpoint placement: a `## Checkpoint` h2 + `<div data-quiz="…">` near the end of each
  stop's section, before the course footer. Drafting keeps its existing "Test yourself"
  section (rename its container to `data-quiz="drafting"`; keep ids used by tests).
- Newcomer/Practitioner: checkpoints visible at both levels (no data-level gating).

### B2. Quick-nav palette (⌘K / Ctrl-K / `/`)

- Vanilla, built by JS on first open; no markup in index.html except a masthead button
  `Search /` (ghost style, before the progress chip; title "Search sections & glossary — press / or Ctrl-K").
- Overlay: `role="dialog" aria-modal="true"`, centered card ≤560px, input on top,
  `role="listbox"` results below, backdrop click / Esc closes, focus returns to the opener.
- Index (built per open so it respects the current level): course tabs (jump), every h2
  visible at the current level (label + tab context, jump = showView + scroll), every
  glossary term (label + "Glossary", jump = `PPA.showGlossaryTerm`).
- Ranking: case-insensitive; startsWith > word-boundary > substring; cap 12 rows; ↑↓ + Enter;
  hovering sets active. No fuzzy library.
- `/` opens only when the event target isn't an input/textarea/select/contenteditable.

### B3. Tests (dependency-free, matching the existing suites)

- New `test/flow.test.js`:
  - COURSE and PRAC_INDEX extracted from app.js (regex on the literal): every `view` exists
    as `#view-…` in index.html; nav button order === COURSE order + glossary + coverage;
    every PRAC_INDEX `target` id exists in index.html; `#path-chooser` and `#prac-index` exist;
    prac-index container carries `data-level="2"`.
  - Quiz banks via `require("../assets/js/quiz-banks.js")`: every bank has ≥3 questions
    (except datacenter ≥2), every question ≥3 options with exactly one `correct: true`,
    nonempty `explain`; every `data-quiz` attribute in index.html has a matching bank and
    vice versa (perspectives exempt).
  - localStorage progress round-trip: pure-function test if progress helpers are factored
    to be requireable; otherwise regex-assert the storage key names (`ppa-progress`,
    `ppa-chooser-done`) appear in app.js.
- Keep `node test/ui.test.js test/data.test.js test/settle.test.js` green; add flow.test.js
  to README's test list.

### Pass B acceptance

- All four test files pass under plain `node`.
- No new factual claims: every quiz explanation traceable to existing page content.
- No console errors on load; palette opens/closes cleanly with keyboard only.

---

## Out of scope (log to backlog if tempting)

- Spaced-repetition flashcards; per-view `<title>`/OG meta; collapsing Learn stages into
  auto-open `<details>`; auto-switching level when a palette result is level-hidden.
