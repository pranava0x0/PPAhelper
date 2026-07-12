# Issues — PPA Helper

Living audit trail. Each: date · area · description · root cause (**content bug** / **code bug** / **test bug**) · status.

## 2026-07-12 — masthead/scroll + Pass C review pass

Energy-expert + code review of the mode-consistency and masthead/scroll UX work.

**Energy outcome: no domain findings.** These branches touch UI chrome only (nav numbering,
level stubs, count lines, masthead layout, back-to-top) — no settlement/PPA content changed.
Ran the directional sweep (per the ppa-expert-review skill): every who-pays-whom claim still
reconciles with the settle-core convention; the five negative-price fixes from the PR #5 pass
hold and remain internally consistent. Nothing to fix on the domain side.

### Fixed (a11y nits from the code review)

- **2026-07-12 · A11y · Floating back-to-top FAB was below the 44px touch target.** *(code bug — Fixed)*
  `.to-top` measured 36px tall. It's a standalone floating action button (not a dense-toolbar
  control), so it should meet the 44px minimum. Added `min-height: 44px` + centering; now 44px.
  *Fix: assets/css/styles.css.*
- **2026-07-12 · A11y · "Resume →" chip read the bare arrow to screen readers.** *(code bug — Fixed)*
  The resume chip's only text was "Resume →", so a screen reader announced "Resume right-arrow".
  Added an explicit `aria-label` ("Resume the course — N of 7 stops done"). *Fix: assets/js/app.js.*

## 2026-07-12 — PR #5 energy-expert review pass

### Fixed

- **2026-07-12 · Settlement direction · Negative-price cash flow taught backwards in five places.** *(content bug — Fixed)*
  Every negative-price passage said the *generator* pays the buyer the strike plus the full negative price. Under the app's own convention — settlement = (LMP − strike), negative ⇒ **buyer pays generator** (settle-core.js, and the learn-bank below-strike question) — a deeply negative LMP makes the **buyer** pay the generator the strike plus the magnitude of the negative price. It's the **buyer's** exposure; the $0 floor caps the **buyer's** payment at the strike. The simulator convention line at index.html:1094 even contradicted itself in one sentence ("negative means the buyer pays the generator … the generator pays the buyer the strike plus the negative price"). The computation code and its tests were always correct; only the teaching copy was wrong. Root misconception dates to the 2026-06-22 negative-price feature (see that section's "No negative-price handling" entry, which is itself backwards). Fixed all five sites: quiz-banks.js simulator + drafting banks, draft.js §3.4, index.html:638 and :1094. Codex flagged one of the five (simulator bank); the expert pass found the other four. *Fix: assets/js/quiz-banks.js, assets/js/draft.js, index.html.*
- **2026-07-12 · Course flow · Draft PPA was a course stop with no checkpoint.** *(code bug — Fixed)*
  `ppadraft` sits in `COURSE` as stop 4/7 with prev/next footers and progress counts, but had no `data-quiz` container or bank, so it couldn't quiz-complete like every other non-Perspectives stop — progress silently fell back to manual marking, contradicting the PR's "every stop except Perspectives ends in a checkpoint" claim. Added a 3-question `ppadraft` bank (answerable from the stop's own page: the [IN BRACKETS] convention, the practice-template disclaimer, ISO→settlement-point auto-fill), wired `QUIZ_TO_VIEW`, and added the checkpoint container. flow.test.js's container↔bank sync guard now covers it. Codex flagged this. *Fix: assets/js/quiz-banks.js, assets/js/app.js, index.html.*
- **2026-07-12 · Asset caching · Review pass edited three JS files; bumped `?v=` per the same-day-stale-JS rule.** *(process — Done)*
  Bumped `?v=20260712b` → `?v=20260712c` so browsers don't serve the pre-review JS. Same lesson as the pass-A/B stale-JS bug below.

## 2026-07-12 — course-flow pass (A: spine/progress, B: checkpoints/palette)

### Fixed

- **2026-07-12 · Asset caching · Two same-day passes shipped different JS under one version string.** *(code bug — Fixed)*
  Pass A bumped every asset to `?v=20260712`; the browser cached those files during verification; Pass B then rewrote `app.js`/`quiz.js` under the same string, so the page silently ran stale JS (checkpoints rendered zero questions). Root cause: version string keyed to the working day, not to the shipped state. Bumped to `?v=20260712b` and logged the rule — bump once per shipped state. *Fix: index.html asset URLs (151d392); lesson in docs/agent-runs.md.*

### Open

- **2026-07-12 · Styling · `.src::before` prefixes non-source captions with "Source: ".** *(code bug — Open)*
  The rule is unconditional, but `class="src" style="border:none"` is reused for plain captions (Data centers deals intro, structures intro, glossary empty state), which all render a spurious "Source: " prefix. Fix: split into `.src` (real attributions) and a plain caption class. Tracked in backlog.md; spun off as a standalone task chip.
- **2026-07-12 · Level modes · Toggle changes the menu but content changes are invisible.** *(design gap — mostly Fixed 2026-07-12)*
  User-reported. Full audit + 8-item plan in backlog.md → "Newcomer ↔ Practitioner consistency plan". Pass C items 1–3 shipped (the three high-priority fixes): course numbers now unified across both levels; every hidden practitioner section leaves an in-place stub row at Newcomer that unlocks + scrolls to it; level-filtered lists (dc structures, Perspectives voices/resources, Drafting term sheets) show a live "Showing N of M" partial-state line. Remaining (items 4–7, medium/low): transient toggle-feedback status line, per-tab mode line, level labels on JSON-rendered voices/resources, chooser copy truthing.

## 2026-06-22 — "Commissioner Swett" expert review pass

Reviewed the whole tool as a demanding PPA approver/originator would. Findings and fixes below.

### Fixed

- **2026-06-22 · Foundations/Drafting · "VPPAs require retail access" is wrong.** *(content bug — Fixed)*
  The Physical/VPPA "when to use" cards and the "regulated-state constraint" card taught that a VPPA needs the *buyer* to be in a deregulated, retail-choice state. A VPPA is a purely financial hedge — the buyer keeps its existing retail supply and settles a swap against a wholesale hub — so it does **not** require retail access. What a VPPA needs is the **project** in an organized wholesale (ISO/RTO) market with a liquid LMP. Retail choice is what gates a **physical retail** deal. Also conflated ISO/RTO membership with retail deregulation (PJM/MISO span both). Rewrote both cards to the accurate framing. *Fix: index.html geography card + use-when lists.*

- **2026-06-22 · Drafting · Deal-lifecycle timeline self-contradiction.** *(content bug — Fixed)*
  Said a deal takes "3–5 years" total, then the bottleneck card said the interconnection queue alone can be "4–7 years." Reconciled to "3–7 years, longer when the queue binds," and noted stages overlap. *Fix: index.html lifecycle intro.*

- **2026-06-22 · Draft PPA generator · Generated contract contradicted the site's own teaching.** *(code bug — Fixed)*
  The Drafting tab lists "uncapped liabilities" as a deal-killer, but the generated VPPA had **no limitation-of-liability clause**. Added Article 13 (no consequential damages + liability cap), renumbered Miscellaneous to 14. *Fix: draft.js.*

- **2026-06-22 · Draft PPA generator · Termination payment direction was wrong.** *(code bug — Fixed)*
  Section 8.3 assumed the Termination Payment always flows *from* the defaulting party. A fixed-for-floating swap close-out is a mark-to-market that can be owed by **either** party depending on whether the remaining swap is in- or out-of-the-money. Reworded to two-way close-out. *Fix: draft.js 8.3.*

- **2026-06-22 · Draft PPA generator · No basis / settlement-point clause.** *(code bug — Fixed)*
  The tool teaches basis as the #1 risk, but the generated contract never stated that the seller bears node-to-hub basis. Added Section 2.3 (Settlement Point and Basis). *Fix: draft.js.*

- **2026-06-22 · Draft PPA generator · No negative-price handling.** *(code bug — Fixed)*
  Negative LMPs are routine in ERCOT/CAISO/SPP; without a floor the generator pays the strike plus the full negative price. Added optional Section 3.4 (Floating Price Floor at $0), a glossary term, a Drafting-tab note, and a simulator hint. *Fix: draft.js, glossary.json, index.html.* **[Correction 2026-07-12: the direction stated here is backwards — it is the *buyer* who pays the strike plus the negative price, and the floor caps the *buyer's* exposure. Fixed in the PR #5 review pass above.]**

- **2026-06-22 · Draft PPA generator · Worked settlement example showed no result.** *(code bug — Fixed)*
  Section 3.1 printed `(strike − $55) × 10,000` with no computed amount or direction. Now computes the signed result and states who pays whom when the strike is numeric. *Fix: draft.js.*

- **2026-06-22 · Draft PPA generator · Undefined defined-terms + buyer credit nuance.** *(code bug — Fixed)*
  Added "Business Day" and "Event of Default" definitions and a note that investment-grade buyers often post a parent guarantee instead of an LC. *Fix: draft.js.*

### Added (gaps, not bugs)

- **Pricing-structures explainer** in the Drafting tab — surfaces the verified WBCSD "who bears price risk" table (fixed / escalating / inflation-indexed / discount-to-market+floor / collar), which existed in the research but not the UI.
- **Self-check quiz** (6 questions, worked answers) in the Drafting tab — settlement direction, basis/developer-realized, risk allocation, structure choice, credit support, negative pricing.
- **ISO/RTO market comparison** in the Learn tab (Practitioner) — ERCOT / PJM / CAISO / MISO on capacity-vs-energy, nodal pricing & hubs, basis hedging, and FERC jurisdiction, plus SPP/ISO-NE/NYISO notes. Verified against FERC + each ISO (research-us-ppa.md Round 5); coverage page updated from needs-research to verified. New glossary terms: Capacity Market, Energy-Only Market, Congestion Revenue Right (CRR).
- **Draft operational clauses** — Metering & Settlement Data (§3.5), Taxes & Market Costs (§3.6), Seller Insurance (§7.3), Confidentiality (§14.8). Added as subsections in natural homes; no article renumber, so existing cross-references stay intact.

### Open (logged to backlog, not yet done)

- examples.json says "Floating = real-time LMP" as the default; many VPPAs settle day-ahead. Note both. *(low)*
- REC shortfall / replacement mechanics for the buyer's clean-energy claim. *(low)*
- ToD / hourly pricing and 24/7 CFE matching remain clause-level research gaps (already tracked).
- CRR/FTR mechanics worked example; SPP/SERC per-region depth. *(low)*
