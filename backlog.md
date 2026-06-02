# Backlog — PPA Helper

Ideas and deferred scope. Each: description + priority (low / medium / high).

## Next up

- ✅ **Newcomer on-ramp trio — shipped 2026-06-02.** Foundations gained "Why sign a PPA?", an electricity primer, and the MW-vs-MWh rule.
- ✅ **"From scratch" rung + Learn reorg — shipped 2026-06-02.** Closed the gap between "I know nothing" and "I know a little about electricity": added Step 1 "Electricity from scratch" (kW vs kWh / your bill, can't-store → instant balance, the plant→grid→you journey, who's who) below the market content. Restructured the tab (now "Learn") into an explicit **4-step path with a clickable stepper**: 1 Electricity from scratch → 2 How power is bought & sold → 3 Why PPAs exist → 4 How a PPA works. Added 3 grid-basics terms (kWh, Utility, T&D; 57 total).
- ✅ **Fixed 2026-06-02: Newcomer level-filter bug.** The level-filter control buttons carried `data-level`, the same attribute the content filter targets — so clicking "Newcomer"/"Practitioner" hid the other filter buttons (you couldn't switch back). Moved the control to `data-setlevel`; added a static UI-integrity test suite (`test/ui.test.js`) that fails if the control ever filters itself, if an inline tooltip term doesn't resolve, or if nav tabs and views drift. Also compacted the mobile stepper (2×2, hide level cue) to cut scrolling.
- **Now on deck:** the two verified quick fixes — focus management on view switch, and persist the level filter — then the **deal-lifecycle walkthrough** and **who's-who ecosystem map**.

### Information architecture — verdict (2026-06-02)
**Does the whole site need reorganizing? No full teardown.** The tab order already follows a sensible arc — Learn → Examples → Simulator → Data centers → Perspectives → Glossary → Coverage (learn → apply → explore → reference). The real flow problem was *inside* the learn page: a missing absolute-beginner rung and no visible sequence. Both are now fixed (the "from scratch" step + the 4-step stepper + renaming the tab "Learn" to signal the entry point). Deferred IA ideas, lower priority:
- **Cross-tab "next step" links** so the path continues past Learn (Learn → Examples → Simulator → …) — a guided sequence across the whole site, not just within one tab. *Priority: medium*
- **Progress tracking** (localStorage checkmarks per step/tab) so a returning learner sees where they left off. *Priority: low*
- **Sticky / persistent learning-path stepper.** The Learn page is ~6 screens; the stepper only appears at the top, so jumping between stages mid-page means scrolling back up. A slim sticky stepper (or a desktop side rail) would let learners jump from anywhere and further cut scrolling. *Priority: medium*

## Deferred from initial scope (2026-06-01)

- **Legal clause-by-clause drafting & redlining module** — deep dive on drafting/reviewing legal terms, risk allocation, redline practice. Covered at foundational level in v1; expand into a dedicated lawyer-track module later. *Priority: medium*
- **Credit / approval / bankability analyst track** — investment-committee lens: bankability scoring, credit review, approval criteria, financing structures. Foundational coverage in v1; build a full "approve/analyze deals" track later. *Priority: medium*
- **Europe / UK regional module** — CfDs, GoOs, REGOs, EU market design, cross-border corporate PPAs. *Priority: low*
- **India / APAC regional module** — SECI, state DISCOMs, open access, Australia, SE Asia. *Priority: low*
- **Africa / emerging-markets module** — IPP/utility PPAs, World Bank/IFC standardized docs, sovereign guarantees, currency risk. *Priority: low*

## Build status

- **Phase 0 (MVP) — shipped & verified 2026-06-01.** Static site: Foundations (cited), VPPA settlement simulator (flagship — correct CfD math, SVG chart, editable 12-month table, scenarios, buyer/generator perspective), Glossary (search/filter + inline tooltips), Coverage & sources scorecard. Light/dark theme, mobile-first. No deps, no build step, GitHub Pages-ready.
- **Example PPAs + Data centers tabs — shipped 2026-06-02.** Annotated example PPAs (3 term sheets: corporate VPPA, utility physical, data-center nuclear — each clause links to glossary terms). Data-center/generation tab: 9 "clever" structures (accordions) + 9 recent hyperscaler/neocloud deals (filterable, cited). Experience-level filter (Newcomer / Practitioner / All) for progressive depth. Cross-file integrity tests (every clause/structure glossaryRef must resolve). Scroll reductions: accordions, clause-selector, mobile scroll-into-view, tighter ledes.
- **Perspectives tab + mobile UX fix — shipped 2026-06-02.** Expert perspectives (Shah, Norris, Tian, Powell) + a "keep learning" resource path; a flexible/curtailable-load structure (Duke 2025). Fixed the mobile masthead so the level filter and theme toggle no longer shift (grouped controls, deterministic wrap, fixed toggle width — verified 0px shift across theme toggles and tab switches). Glossary now 48 terms. Site is ~30 KB / 9 requests / ~50 ms load.

## Next phases (tooling / feature ideas)

- **Phase 1** — Pricing-structure payoff explorer (fixed/escalating/floor/collar, who's in/out of the money) + basis-risk visualizer (node vs hub, ERCOT Aug-2019 preset, developer P&L). *Priority: high*
- **Phase 2** — Deal-lifecycle walkthrough (origination → term sheet → CPs → COD → operations). The annotated clause explorer shipped in the Example PPAs tab. *Priority: high*
- **Phase 3** — Flashcards + scenario quizzes ("market $X, strike $Y — who pays whom?") + negotiation role-play (you're the originator). *Priority: medium*
- **Phase 4** — Fill verified content for the gaps below; add a utility-PPA track. *Priority: medium*

## Improvement opportunities (evaluation 2026-06-02)

A walkthrough as a newcomer and as an expert. Items grounded in inspection of the live site; a few are verified bugs (noted). Measurement caveat: this session's preview reported `innerWidth: 0`, so pixel/contrast/overflow checks weren't reliable — re-run a visual + contrast/keyboard audit in a real browser (Lighthouse/axe) before trusting layout metrics.

### Newcomer lens (focus: getting a job, learning from zero)
- **Guided "Start here" learning path.** Tabs are non-linear; add an ordered track (what a PPA is → types → settlement → risks → examples → the role) with next/prev and optional progress checkmarks (localStorage). *Priority: high*
- **Self-test: quizzes + flashcards** (was Phase 3). Scenario quizzes ("market $X, strike $Y — who pays whom?") and spaced-repetition flashcards generated from the glossary. Newcomers learn by testing. *Priority: high*
- **"Become a PPA originator" page.** The role is only a glossary entry today. Expand to a short page: day-to-day, skills, who hires (developers/IPPs, utilities, advisors), how to break in, what to study. Directly serves the project's stated goal. *Priority: high*
- **Accessible, broader term lookup.** Inline tooltips exist only on hand-tagged `.gterm` spots and use the `title` attribute (doesn't work on touch / poor for screen readers). Auto-link known glossary terms in prose and replace `title` tooltips with a real popover. *Priority: medium*
- **Simulator guided mode.** A 2–3 step "try this, watch that" intro so a newcomer who doesn't yet know strike/LMP can learn the mechanic. *Priority: medium*

### Curriculum completeness — newcomer journey (2026-06-02)
Walking the tabs as a true beginner: the **mechanics are taught well, but the on-ramp and the process are thin.** To actually cover "everything needed to know":
- **Electricity & markets 101, before PPA mechanics.** Foundations opens on physical-vs-virtual and immediately uses LMP / node / hub / MWh. Add a primer first: generation → transmission → distribution, supply/demand and why prices move, wholesale vs retail, what an ISO/RTO does, baseload vs peaker, energy vs capacity. *Priority: high*
- **Units primer: MW vs MWh and capacity factor.** The distinction newcomers always trip on; connect project size to annual output and revenue. *Priority: high*
- **"Why PPAs exist" before "how they work."** Lead with the value proposition — price certainty/hedge (buyer), bankable revenue (developer), clean-energy claim (corporate) — then the mechanics. *Priority: high*
- **Deal lifecycle, end to end** (also Phase 2) — newcomer-critical: lead → term sheet/LOI → diligence → negotiation → signing → conditions precedent → notice to proceed → construction → COD → operations → end of term, with who does what and rough timelines. *Priority: high*
- **"Who's who" ecosystem map.** The cast and how power + money flow: developer, EPC, O&M, lender, tax-equity investor, offtaker, utility, ISO/RTO, advisor/broker. *Priority: medium*
- **Consolidated risk-allocation matrix.** One who-bears-what table across price / basis / shape / volume / curtailment / credit / change-in-law by structure (the prose lists these but never side-by-side). *Priority: medium*
- **REC → Scope 2 / additionality accounting primer.** How RECs map to corporate carbon accounting (GHG Protocol market-based Scope 2), what additionality means, why 24/7 hourly matching is stricter. *Priority: medium*
- **Light financial literacy.** LCOE vs PPA price vs merchant; a paragraph each on IRR, DSCR, and tax equity so "bankable" carries meaning. *Priority: medium*
- **Negotiation basics & common deal-killers.** What actually gets negotiated (settlement point, term, credit, curtailment) and what sinks deals. *Priority: medium*
- **One end-to-end worked case.** A short narrative (e.g., 100 MW ERCOT solar VPPA) threading market → strike → settlement → RECs → risk → bankability so the pieces connect. *Priority: medium*
- **Recaps + "you can now…" checkpoints + next-step links** at the end of each section. *Priority: medium*

> Verdict: mechanics are strong; the biggest newcomer gaps are the **on-ramp** (grid/markets/units), the **process** (lifecycle, parties, negotiation), and **accounting/finance** (RECs→Scope 2, LCOE/IRR/DSCR).

### Expert lens (focus: depth, realism, rigor)
- **Pricing-structure payoff explorer** (Phase 1). The simulator only models a flat strike; add escalators, discount-to-market + floor, collars, and time-of-delivery, showing who's in/out of the money. *Priority: high*
- **Basis-risk visualizer** (Phase 1). Node vs hub spread over time, ERCOT Aug-2019 preset, developer P&L. The simulator explicitly assumes no basis — experts will want to see it. *Priority: high*
- **Realistic settlement.** Add a generation shape (solar/wind profile), hourly settlement, and P50/P90 output instead of flat monthly volume. *Priority: medium*
- **IRA tax-credit → price calculator.** Make the ITC/PTC + adders + transferability effect interactive (LCOE pre/post credit, ~$46→$31/MWh). *Priority: medium*
- **Bankability / debt-sizing illustration.** Offtaker rating + tenor + DSCR → how much debt a PPA supports; ties "bankability" to numbers. *Priority: medium*
- **ISO/RTO per-market explainer** (still open). ERCOT (energy-only, nodal) vs PJM/MISO (capacity markets) vs CAISO, and how each shapes structure and basis. *Priority: medium*
- **Clause-level depth** (still open). Conditions precedent, assignment / lender step-in, change-of-control, dispute resolution — add to examples + glossary. *Priority: medium*
- **Upgrade citations to primary.** Some data-center deal facts cite trade press; link SEC 8-Ks / FERC orders / company PRs where available, and show a per-deal "announced" + "as-of" date for freshness. *Priority: medium*

### Cross-cutting (UX · accessibility · technical)
- **Focus management on view switch** (verified gap). Switching tabs leaves focus on `<body>`; move focus to the view's `<h1>` (`tabindex="-1"`) so keyboard/screen-reader users land in the new content. *Priority: medium*
- **Persist the level filter** (verified gap). Theme persists via localStorage; the Newcomer/Practitioner/All choice does not. *Priority: low*
- **Deep-linkable sub-state.** Support `#glossary/basis-risk`-style links (shareable) and reflect the active example/deal filter in the URL. *Priority: medium*
- **Mobile nav scroll affordance.** Seven tabs scroll horizontally with no cue; add an edge fade / "more" indicator so off-screen tabs are discoverable. *Priority: medium*
- **Automated link-checker** (105 external links). Add a CI script (e.g., lychee) or make target to catch dead links; log rot to `issues.md`. *Priority: medium*
- **Render smoke test in CI.** `test/ui.test.js` now statically checks nav/view consistency, inline-term resolution, and the self-filtering guard; a true headless render check (each view paints, key nodes exist) is still worth adding. *Priority: medium*
- **Asset cache-busting.** `index.html` references `app.js`/`styles.css` with no version, so a returning visitor can pair new HTML with stale cached JS/CSS — observed in testing, where a cached old `app.js` broke the level filter. Add `?v=` query strings or hashed filenames on deploy. *Priority: medium*
- **Create `issues.md`.** No bug log exists yet (CLAUDE.md expects one). *Priority: low*
- **Per-view `<title>` + Open Graph meta** for sharing/SEO. *Priority: low*

## Gap research

- **Round 2 — done 2026-06-01 (cheap inline pass).** After the deep-research workflow failed on a harness error, gaps were filled via direct domain-filtered WebSearch/WebFetch against government & national-lab sources (FERC, IRS, EPA, NREL, Berkeley Lab, World Bank). Covered: FERC role & PURPA, IRA ITC/PTC + transferability → pricing, deal types (BTM/front-of-meter/sleeved/community), clauses (curtailment/force majeure/change-in-law/termination), bankability, and the originator role (secondary — job postings). Written up in `docs/research-us-ppa.md` (§9–14) and method comparison in `docs/research-methods.md`. *Priority: done.*
- **Still open** (low-cost tier-1 searches when needed): ISO/RTO per-market detail; internal approval/signing mechanics (investment committee, board, PUC prudence); clause-level CPs / assignment / lender step-in / dispute resolution; time-of-delivery & 24/7 CFE pricing. *Priority: medium.*
