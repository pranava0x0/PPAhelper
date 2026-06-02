# Backlog — PPA Helper

Ideas and deferred scope. Each: description + priority (low / medium / high).

## Deferred from initial scope (2026-06-01)

- **Legal clause-by-clause drafting & redlining module** — deep dive on drafting/reviewing legal terms, risk allocation, redline practice. Covered at foundational level in v1; expand into a dedicated lawyer-track module later. *Priority: medium*
- **Credit / approval / bankability analyst track** — investment-committee lens: bankability scoring, credit review, approval criteria, financing structures. Foundational coverage in v1; build a full "approve/analyze deals" track later. *Priority: medium*
- **Europe / UK regional module** — CfDs, GoOs, REGOs, EU market design, cross-border corporate PPAs. *Priority: low*
- **India / APAC regional module** — SECI, state DISCOMs, open access, Australia, SE Asia. *Priority: low*
- **Africa / emerging-markets module** — IPP/utility PPAs, World Bank/IFC standardized docs, sovereign guarantees, currency risk. *Priority: low*

## Build status

- **Phase 0 (MVP) — shipped & verified 2026-06-01.** Static site: Foundations (cited), VPPA settlement simulator (flagship — correct CfD math, SVG chart, editable 12-month table, scenarios, buyer/generator perspective), Glossary (search/filter + inline tooltips), Coverage & sources scorecard. Light/dark theme, mobile-first. No deps, no build step, GitHub Pages-ready.
- **Example PPAs + Data centers tabs — shipped 2026-06-02.** Annotated example PPAs (3 term sheets: corporate VPPA, utility physical, data-center nuclear — each clause links to glossary terms). Data-center/generation tab: 9 "clever" structures (accordions) + 9 recent hyperscaler/neocloud deals (filterable, cited). Experience-level filter (Newcomer / Practitioner / All) for progressive depth. Glossary now 45 terms. Cross-file integrity tests (every clause/structure glossaryRef must resolve). Scroll reductions: accordions, clause-selector, mobile scroll-into-view, tighter ledes.

## Next phases (tooling / feature ideas)

- **Phase 1** — Pricing-structure payoff explorer (fixed/escalating/floor/collar, who's in/out of the money) + basis-risk visualizer (node vs hub, ERCOT Aug-2019 preset, developer P&L). *Priority: high*
- **Phase 2** — Deal-lifecycle walkthrough (origination → term sheet → CPs → COD → operations). The annotated clause explorer shipped in the Example PPAs tab. *Priority: high*
- **Phase 3** — Flashcards + scenario quizzes ("market $X, strike $Y — who pays whom?") + negotiation role-play (you're the originator). *Priority: medium*
- **Phase 4** — Fill verified content for the gaps below; add a utility-PPA track. *Priority: medium*

## Gap research

- **Round 2 — done 2026-06-01 (cheap inline pass).** After the deep-research workflow failed on a harness error, gaps were filled via direct domain-filtered WebSearch/WebFetch against government & national-lab sources (FERC, IRS, EPA, NREL, Berkeley Lab, World Bank). Covered: FERC role & PURPA, IRA ITC/PTC + transferability → pricing, deal types (BTM/front-of-meter/sleeved/community), clauses (curtailment/force majeure/change-in-law/termination), bankability, and the originator role (secondary — job postings). Written up in `docs/research-us-ppa.md` (§9–14) and method comparison in `docs/research-methods.md`. *Priority: done.*
- **Still open** (low-cost tier-1 searches when needed): ISO/RTO per-market detail; internal approval/signing mechanics (investment committee, board, PUC prudence); clause-level CPs / assignment / lender step-in / dispute resolution; time-of-delivery & 24/7 CFE pricing. *Priority: medium.*
