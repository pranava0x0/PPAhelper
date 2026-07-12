# Backlog — PPA Helper

Ideas and deferred scope. Each: description + priority (low / medium / high).

## From hyperscaler/AI-lab job research (June 2026)

Sourced from 25 active job postings at Amazon, Google, Microsoft, Meta, Apple, Oracle, and Salesforce (2025–2026). Items ranked by hiring frequency across postings. PPA/utility-contract items were implemented; the rest are logged here.

### Implemented (shipped June 2026)
- ✅ **Risk allocation matrix** — Drafting tab. 8 key PPA risks, developer vs. buyer typical positions, physical vs. VPPA difference. Directly maps to Google/Amazon interview question "explain PPA risk allocation provisions."
- ✅ **Physical vs. VPPA decision framework** — Drafting tab. When to use each structure, the regulated-state constraint. Amazon and Google explicitly test this.
- ✅ **Utility contract types** — Drafting tab. ESA, green tariff, standard offer, sleeved PPA. Amazon (5 postings), Oracle (2), and Meta (2) require this knowledge.
- ✅ **5 new glossary terms** — ESA, Green Tariff, Letter of Credit (LC), Counterparty Credit Risk, LGIA.

### Implemented (Commissioner Swett review — 2026-06-22)
- ✅ **Pricing-structures explainer** — Drafting tab. Verified WBCSD "who bears price risk" table (fixed / escalating / inflation-indexed / discount-to-market+floor / collar) plus negative-price-floor and ToD notes. Closes the gap where the research had this but the UI didn't.
- ✅ **Self-check quiz** — Drafting tab, 6 questions with worked answers (settlement direction, basis/dev-realized, risk allocation, structure choice, credit support, negative pricing). Was the top unshipped pedagogical gap. `assets/js/quiz.js`.
- ✅ **Draft generator hardened** — added Limitation of Liability article (was internally inconsistent with the "uncapped liabilities = deal-killer" lesson), two-way termination close-out, basis/settlement-point clause, negative-price floor option, computed worked example, Business Day / Event of Default definitions, buyer parent-guarantee note.
- ✅ **Accuracy fixes** — corrected the "VPPAs require retail access" error (a VPPA needs the *project* in an ISO/RTO market, not the buyer in a retail-choice state) and the 3–5-vs-4–7-year lifecycle contradiction. See issues.md.
- ✅ **Negative Pricing / Price Floor glossary term** (EIA-sourced).
- ✅ **ISO/RTO market-by-market comparison** — Learn tab (Practitioner). ERCOT (energy-only, non-FERC), PJM (RPM capacity), CAISO (CRRs, NP15/SP15, no central capacity market), MISO (seasonal PRA), plus SPP/ISO-NE/NYISO notes. Verified against FERC + each ISO; coverage page moved from needs-research to verified. Was the top high-priority interview topic. New glossary terms: Capacity Market, Energy-Only Market, Congestion Revenue Right (CRR).
- ✅ **Draft generator — operational clauses** — Metering & Settlement Data (3.5), Taxes & Market Costs (3.6), Seller Insurance (7.3), Confidentiality (14.8).

### Still open from the 2026-06-22 review
- **examples.json "real-time LMP" default** — many VPPAs settle day-ahead; present both DA and RT as options. *Priority: low*
- **Generated draft — missing articles** — metering & data source (ISO settlement data as source of truth), taxes/charges/ancillary cost allocation, seller insurance, confidentiality. *Priority: medium*
- **REC shortfall / replacement** — what happens to the buyer's clean-energy claim if the project underproduces; minimum-REC-delivery or replacement-cost mechanics. *Priority: low*

### PPA / utility contract depth — not yet built (high priority)
- ✅ **ISO/RTO market-by-market comparison** — *shipped 2026-06-22 (Learn tab).* PJM vs. ERCOT vs. CAISO vs. MISO: capacity markets (PJM/MISO) vs. energy-only (ERCOT), nodal settlement, CAISO CRRs, FERC jurisdiction. Remaining depth (per-region SERC/SPP detail, CRR/FTR mechanics worked example) still open at lower priority.
- **Interconnection deep dive** — How LGIA/SGIA queue works, why it takes 3–7 years, what creates congestion constraints, how a buyer navigates queue position. Amazon, Google, and Meta all require interconnection knowledge. *Priority: high*
- **Counterparty credit provisions — worked example** — One-way vs. two-way CSA mechanics, sizing an LC (6–18 months of expected payments), when a parent guarantee is required vs. a cash deposit. *Priority: medium*
- **Curtailment clause variants** — Deemed generation vs. actual, who-caused-it carve-outs, the ERCOT example where curtailment risk wiped a deal's economics. *Priority: medium*
- **Deal lifecycle walkthrough** (already in backlog as Phase 2, confirmed high-priority by 8+ job postings) — origination → RFP → term sheet → due diligence → CPs → execution → COD → operations, with who does what and timelines. *Priority: high*

### Energy portfolio / analytics — not yet built (medium priority)
- **REC registry operations** — PJM-GATS, WREGIS, NAR, European GoO tracking. Microsoft's Renewable Energy Analyst role lists these registries as explicit requirements. *Priority: medium*
- **Mark-to-market / portfolio risk** — How energy portfolios are valued, VaR basics, how a portfolio manager monitors exposure. Amazon's Energy Portfolio Manager role requires this. *Priority: medium*
- **Load forecasting basics** — How buyers forecast their own data center energy load; why accurate load forecasts matter for contract sizing. *Priority: medium*

### Technical / specialized — backlog (low priority for this tool)
- **ASC 815 hedge accounting for VPPAs** — Whether a VPPA qualifies for hedge accounting vs. mark-to-market treatment, and why it matters for the buyer's P&L. Very specialized; relevant for finance/accounting track. *Priority: low*
- **24/7 CFE methodology** — Hourly vs. annual/volumetric REC matching, Google's 2030 goal, what additionality means at hourly granularity. *Priority: low*
- **Tax equity / ITC-PTC project finance** — Partnership flip, sale-leaseback, how ITC transferability changed the market post-IRA. Apple's Senior RE Specialist role requires this. *Priority: low*
- **Power flow studies / transmission planning** — PSS-E, PowerWorld, PSLF; steady-state and contingency analysis. Meta's Transmission Energy Manager role. Very technical; not core to PPA/utility contract knowledge. *Priority: low*
- **Behind-the-meter / onsite generation track** — Permitting BTM solar/storage, IPP co-location agreements, fuel cells. Meta's Onsite Generation Solutions role. *Priority: low*

## UAT findings — 2026-06-05

Full walkthrough as newcomer and practitioner. Generator works fine (static-analysis report was wrong). Real findings below, ranked by impact on actual learning.

### Confirmed bugs / broken experiences
- ✅ **Newcomer vs. Practitioner filter — fixed 2026-06-05.** Was hiding <5% of content (only the basis-risk and risk-allocation sections). Now also gates Who's-who and Deal lifecycle behind Practitioner, adds "Practitioner" pills to all four section headings. 18 elements hidden for Newcomer vs 0 for Practitioner; the filter is now meaningfully different.

### High-impact gaps — should build next
- ✅ **End-to-end worked narrative — shipped 2026-06-07.** Concrete 100 MW ERCOT VPPA (Sunridge Solar I, $43/MWh flat, 15-year): full commercial term negotiation narrative + 3-month settlement table (Jan calm, Jul spike, Aug congestion event) where basis risk wipes the developer's August economics to ~$0/MWh. Added to the Learn tab before "Where to go next."
- ✅ **Simulator: basis-risk mode — shipped 2026-06-07.** Node-to-hub spread slider (0–30 $/MWh) in a new "Basis risk" fieldset. Draws a dashed node LMP line on the chart; adds a "Developer's realized price" KPI (= strike − spread, shown in red when spread > 0); banner updates with a basis note. Both legend-node and banner update dynamically.
- ✅ **PPA Originator role accordion — shipped 2026-06-07.** Added to Learn tab: day-in-the-life (lead gen, pricing runs, term sheet, negotiations, IC approvals, closing coordination), who hires (4 employer categories with real firm names), how to break in (5 pathways), what to study next. Placed after the worked narrative before "Where to go next."
- **Self-check: quizzes and flashcards** — Newcomers learn by testing, not reading. A 5-question scenario quiz per tab ("market $55, strike $45 — who pays whom? How much?") would reinforce the simulator. Spaced-repetition flashcards from the glossary would help retention. This is the site's biggest pedagogical gap. *Priority: **high** (was medium — bumping).*

### Medium-impact gaps — build after above
- **ISO/RTO market comparison** — ERCOT energy-only nodal vs PJM/MISO capacity markets vs CAISO CRRs. Why it matters for basis risk and deal structure. Already in backlog, UAT confirms it's a real practitioner gap. *Priority: medium (confirmed).*
- **Pricing-structure payoff explorer (Phase 1)** — Flat-strike-only simulator. Real deals use escalators, collars, discount-to-market + floor. A side-by-side payoff comparison tool. *Priority: medium (confirming Phase 1).*
- **REC → Scope 2 / additionality primer** — The site says RECs transfer but doesn't explain how they map to GHG Protocol Scope 2, what additionality means, or why 24/7 hourly matching is stricter than annual. Corporate buyers need this. *Priority: medium (confirmed).*
- **Annotated clause depth** — 3 example term sheets with ~10 clauses each. Real due diligence needs: conditions precedent mechanics, assignment/lender step-in carve-outs, curtailment "deemed generation" triggers, CIL haircut formulas. *Priority: medium.*
- **Interconnection deep-dive** — Why 3–7 years, LGIA vs SGIA, how queue position affects buyers. Already in backlog; UAT confirms practitioners ask about this. *Priority: medium (confirmed).*

### Low-impact / deferred
- Progress tracking (localStorage checkmarks per step). *Priority: low.*
- Cross-tab "next step" breadcrumb. *Priority: low.*
- Per-view `<title>` + Open Graph meta. *Priority: low.*
- `issues.md` creation. *Priority: low.*

## Expert review — 2026-06-07

Full pedagogical audit: read every file, walked every tab as a PPA expert teaching a newcomer. Items ordered per user request: **flow → reorganization → content → improvement ideas**.

### 1. Pedagogical flow — fix first

- ✅ **Sticky learning-path stepper — shipped 2026-06-30.** `ol.path` made `position: sticky; top: 116px` on desktop; sits just below the masthead so the 4 steps are always visible while scrolling the Learn tab. *styles.css*
- ✅ **Cross-tab next-step prompts — shipped 2026-06-30.** Added three inline cross-tab nudges in Learn: (1) "run the settlement simulator" after Stage 3, (2) "Drafting → Pricing structures" after the VPPA mechanic, (3) "Drafting → Deal lifecycle" card after the worked narrative. No longer depends on the user scrolling to the bottom card.
- ✅ **Simulator real-world grounding — shipped 2026-06-30.** Added two hints below the scenario buttons: ERCOT North Hub ~$45/MWh 2024 context + discount-to-market approximation note.
- ✅ **Failure-mode content — shipped 2026-06-30.** Added "What goes wrong — four failure modes" accordion in Learn (before the originator accordion): COD slip, counterparty default, basis-risk wipe, change-in-law / IRA risk. Each is a concrete story, not a definition.
- **Perspectives tab lacks practitioner voices.** Current voices: CEO (Powell), pioneer/DOE (Shah), tech exec (Tian), academic (Norris). Missing: a corporate energy procurement manager ("what I need before recommending a PPA to our investment committee"), a lender ("what makes a PPA bankable"), and a developer/originator. These are the day-to-day practitioner perspectives. *Priority: **medium***
- **Perspectives tab lacks practitioner voices.** Current voices: CEO (Powell), pioneer/DOE (Shah), tech exec (Tian), academic (Norris). Missing: a corporate energy procurement manager ("what I need before recommending a PPA to our investment committee"), a lender ("what makes a PPA bankable"), and a developer/originator. These are the day-to-day practitioner perspectives. *Priority: **medium***

### 2. Reorganization

- ✅ **Deal lifecycle accessible from Learn — shipped 2026-06-30.** Added a "Drafting → Deal lifecycle" cross-link card in the Learn tab after the worked narrative settlement table. Newcomers who don't scroll to the bottom footer card now hit this midway.
- **Learn tab is too long without stage navigation mid-page.** Sticky stepper partially fixes this. Next level: collapsing each stage into a `<details>` that auto-opens the current one, with scroll-spy to highlight the active step. *Priority: **low** (sticky stepper shipped; this is incremental)*
- ✅ **Pricing structure callout in Simulator — shipped 2026-06-30.** Added two hints below the scenario buttons: discount-to-market approximation note + ERCOT 2024 real-world LMP context.

### 3. Content gaps

- ✅ **Discount-to-market (index-minus) pricing — shipped 2026-06-30.** Added a paragraph in Learn after the VPPA mechanic section explaining the hub-minus-spread structure and pointing to Drafting → Pricing structures. Added a simulator hint for how to approximate it with a floor strike. Still absent from the glossary — add a standalone term next pass. *Priority: **low** (covered in Learn + Simulator; glossary term next)*
- **ISO/RTO market-by-market comparison.** Already tracked as high priority — this review confirms it's the single most asked-about topic in practitioner interviews. Add ERCOT (energy-only, nodal, FERC-exempt for interstate), PJM (RPM capacity market, nodal, 5–7 year queue), CAISO (CRRs for basis hedging, NP15/SP15), MISO (capacity + energy, mostly zonal). *Priority: **high** (already tracked)*
- **REC → Scope 2 accounting chain.** Already tracked — this review confirms it's the first question corporate sustainability teams ask before signing. Needs: GHG Protocol market-based Scope 2, what a bundled REC claims vs. an unbundled one, additionality, 24/7 hourly matching vs. annual volumetric. Cite: GHG Protocol Scope 2 Guidance (currently missing from citation base). *Priority: **medium** (already tracked, add GHG Protocol citation)*
- **Project finance fundamentals — "bankable" is said but never explained.** Non-recourse project finance, DSCR (what 1.25x means in plain terms), the capital stack (debt / tax equity / equity split), why the offtaker's credit rating is the variable lenders care most about. Would make every mention of "bankability" land with weight instead of floating. *Priority: **medium***
- ✅ **Price cannibal / value deflation — shipped 2026-06-30.** Added callout card in the ISO/RTO section (Practitioner level) in Learn: CAISO/ERCOT West midday saturation → prices toward zero → each new MW reduces every existing VPPA's settlement value. Structural responses: ToD pricing + battery co-location.
- ✅ **Interconnection queue mechanics — shipped 2026-06-30.** Added expandable `<details>` in Drafting deal-lifecycle Stage 1: 5-step queue process (application → feasibility → system impact → facilities → LGIA), FERC Order 2023 cluster reform note, and three questions buyers should ask any developer. Remaining depth (CRR/FTR mechanics, per-region queue times) still low priority.
- **Curtailment — economic vs. reliability, deemed generation.** Site explains curtailment exists but not: (a) economic curtailment when ISO dispatches to zero at negative prices (very common ERCOT West Texas), (b) who bears it and how; (c) deemed-generation mechanics — when a positive-price curtailment triggers a notional payment. *Priority: **medium** (already tracked)*
- **Counterparty assessment — absent.** How developers assess buyer creditworthiness (IG vs sub-IG, parent guarantee requirement, what a rating downgrade clause triggers), how buyers assess developer creditworthiness (track record, balance sheet, sponsor strength). Directly relevant to credit-support clauses already in the draft generator. *Priority: **medium***
- **Pricing structure escalators.** Escalating strikes (2%/yr is standard for physical PPAs) appear in the physical PPA example but are never explained. Why does the escalator exist? (Nominal debt service is roughly fixed; escalation lets the real burden decline with inflation.) *Priority: **low***
- **Proxy revenue swaps.** Increasingly used structure — not mentioned anywhere. Low priority for now but worth a glossary term and a sentence in pricing structures. *Priority: **low***

### 4. Other improvement ideas

- **Quiz / scenario challenges.** Already tracked as high priority, remains the biggest unshipped pedagogical gap. "Hub LMP $62, strike $45, volume 20,000 MWh — who pays whom and how much?" with stepped worked answers. *Priority: **high** (already tracked)*
- ✅ **Forward curve context callout in simulator — shipped 2026-06-30.** Added "Real-world grounding: ERCOT North Hub averaged ~$45/MWh in 2024. A $43/MWh strike was roughly at-the-money." Update this figure quarterly.
- **Buyer due diligence checklist.** A simple `<details>` accordion: what a buyer verifies before signing (queue position, resource assessment P50/P90, developer track record, EPC quality, permitting status, financing plan). Directly useful for anyone on the buyer side. *Priority: **low***
- **Add missing primary citations.** FERC Order 2023 (interconnection reform), GHG Protocol Scope 2 Guidance, CEBA Annual Procurement Survey. These are the authoritative sources for content that already exists on the site. *Priority: **low***

---

## Next up

- ✅ **University-curriculum benchmark → quantitative layer + visual re-skin — shipped 2026-07-05.** Benchmarked the tool against reputable PPA / renewable-finance courses (Yale CBEY, Columbia SIPA, NYU SPS, Stanford/MIT engineering-economics, Duke, Infocus). Verdict: strong conceptual match, but those are *modeling* courses and the tool taught the concepts without letting you compute them. Closed that gap:
  - **New "Project finance" tab** (`view-projfin`, `assets/js/projfin.js`) — an interactive debt-sizing & returns workbench. Inputs: MW, capex $/kW, capacity factor, opex, PPA price, tenor, interest rate, target DSCR, ITC share, merchant-tail years/price, with Solar/Wind/Storage presets. Outputs: annual revenue, CFADS, debt sized to DSCR (annuity PV, capped 75% gearing), gearing, sponsor equity, 2-layer capital-stack bar, and levered equity IRR (bisection solver) — contracted-only vs. incl. merchant tail. ITC modeled as year-1 cash to equity (post-IRA transferability); note points to the flip alternative. Presets calibrated to believable IRRs (solar ~11%, wind ~10%, storage ~9%).
  - **Tax equity & the partnership flip** (Project finance tab, Practitioner) — before/after flip, yield-based vs. fixed, ITC vs. PTC, why a thin PPA raises the sponsor's check twice over.
  - **Contracted vs. merchant revenue / the merchant tail** (Project finance tab, Practitioner) — why debt tenor ≤ PPA term, why equity underwrites the tail, cannibalization risk.
  - **How a nodal LMP is built** (Learn → ISO/RTO, Practitioner) — energy + congestion + loss decomposition; congestion *is* basis; FTR/CRR as the market hedge and why it rarely covers a VPPA in full.
  - 6 new glossary terms: CFADS, Gearing (Debt-to-Capital), Partnership Flip, Merchant Tail, Price Cannibalization, Financial Transmission Right (FTR). Coverage page: 5 new verified rows.
  - **Visual re-skin away from the Claude/Anthropic aesthetic** — warm-paper `#f3efe6` + copper `#b06a2c` + Charter serif display → cool near-white `#f4f6f9` + electric-blue `#2563eb` + Inter/grotesque-sans display; double-rule broadsheet framing → single borders + soft card elevation + blurred sticky masthead. Dark mode retuned to a cool slate. `docs/design.md` identity updated (source of truth) with a history note. Structure, mono data spine, and money-flow semantics unchanged. Verified: all tests green (9 tabs, 131 inline terms), no console errors, no 375px overflow, dark mode correct. Cache-bust `?v=20260705b`.

- ✅ **Accounting + finance depth drive — shipped 2026-07-05.** Closed three long-tracked medium items in one pass, all Learn/Drafting Practitioner-level:
  - **REC → Scope 2 chain** (Learn): 3-step primer — GHG Protocol location- vs. market-based method → retire the REC → additionality quality test — plus an annual-vs-24/7 callout carrying the "guidance under revision, hourly matching proposed" caveat. New glossary terms: Scope 2 (Market-Based), Additionality, Unbundled REC. GHG Protocol Scope 2 Guidance added as a primary citation (was flagged missing).
  - **"What bankable actually means"** (Learn): non-recourse project finance, the capital stack (senior debt → tax equity → sponsor equity), the DSCR coverage test (1.25x worked), and offtaker credit as the one variable lenders obsess over — reframes the drafting-page deal-killers through the lender's DSCR lens. New glossary terms: Debt Service Coverage Ratio (DSCR), Capital Stack, Non-Recourse Project Finance.
  - **Buyer's due-diligence checklist** (Drafting `<details>`): two-column — "can it get built & connected" (interconnection/LGIA, permitting, EPC) vs. "will it produce & will the counterparty last" (P50/P90, developer track record, financing, basis).
  - Coverage page: three new verified rows; ToD row reworded (concept + 24/7 now covered, clause-level mechanics still open). Cache-bust bumped to `?v=20260705`. Regression coverage via existing ui.test.js (every new `data-term` resolves; acronym map still unique). Closes the "still open from signing research" GHG-Scope-2 + due-diligence items above.

- ✅ **Real executed PPAs, annotated — shipped 2026-07-01.** Two actual SEC-filed contracts added to the Drafting tab's annotated examples (5 total): EPE × NM SunTower 92 MW solar (2008, price redacted — confidential-treatment teachable) and SCPPA × Milford Wind II 102 MW prepaid wind (2010, $47/MWh, real LD/LC numbers). Every clause value quoted from the document; realDocs links to the full text on EDGAR. Deals table refreshed 16 → 19 (Google×Ormat geothermal, SCE×Fervo 320 MW, DTE 1.4 GW ESA). Research Round 7 in docs/research-us-ppa.md.

- ✅ **Numbered "On this page" contents bar — shipped 2026-07-01.** Auto-generated for any view with 4+ h2 sections (Learn, Drafting, Coverage): numbered jump links under the lede, wired through the existing `data-scroll-to` mechanism (hash hrefs would collide with the view router), entries hide/renumber with the level filter, `scroll-margin-top` clears the sticky masthead. Directly addresses the "lots of scrolling" feedback; supersedes the deferred scroll-spy/`<details>` stage-collapse idea at lower cost.
- ✅ **Level filter: removed "All", made the two modes actually different — shipped 2026-07-01.** "All" was redundant (Practitioner showed everything). Now two buttons: Newcomer (hides practitioner content, default for new visitors) and Practitioner (also hides the Stage 1 "Electricity from scratch" on-ramp via a new `data-level-only` exclusive attribute; progressive `data-level` unchanged so level-1 examples/deals stay visible). Saved `ppa-level="all"` migrates to Practitioner; the lone level-3 structure (fusion offtake) reclassified to 2 so nothing becomes unreachable. Regression tests in ui.test.js.
- ✅ **"Getting to signature" module — shipped 2026-07-01.** Drafting tab, Practitioner level, after the deal lifecycle: two-track approval chain (corporate: sustainability → treasury → legal → IC/board with delegation of authority; regulated utility: advice letter → procurement review group + independent evaluator → PUC resolution / prudence review), EEI signature-authority representations and cover-sheet-plus-confirmation architecture, "signed ≠ unconditional" CP callout. 3 new glossary terms (Prudence Review, Independent Evaluator, Delegation of Authority). Research Round 6 in docs/research-us-ppa.md (§15–17); coverage page row moved from needs-research to verified. Closes the oldest scorecard gap.
- **Still open from the signing research:** ~~GHG Protocol Scope 2 explainer~~ ✅ (shipped 2026-07-05), EEI cover-sheet anatomy as an annotated example, ~~buyer due-diligence checklist~~ ✅ (shipped 2026-07-05). Remaining: EEI cover-sheet anatomy. *Priority: medium*

- ✅ **Backlog drive — shipped 2026-06-30.** Closed 8 open items in one pass: sticky stepper (desktop CSS), cross-tab next-step prompts at 3 points in Learn, failure-modes accordion (COD slip / counterparty default / basis wipe / change-in-law), discount-to-market note in Learn + simulator, price-cannibal / value-deflation callout in ISO/RTO section, interconnection queue steps expandable in Drafting deal-lifecycle Stage 1, ERCOT 2024 LMP grounding in simulator. Cache-bust version strings updated in next deploy.

- ✅ **Newcomer on-ramp trio — shipped 2026-06-02.** Foundations gained "Why sign a PPA?", an electricity primer, and the MW-vs-MWh rule.
- ✅ **"From scratch" rung + Learn reorg — shipped 2026-06-02.** Closed the gap between "I know nothing" and "I know a little about electricity": added Step 1 "Electricity from scratch" (kW vs kWh / your bill, can't-store → instant balance, the plant→grid→you journey, who's who) below the market content. Restructured the tab (now "Learn") into an explicit **4-step path with a clickable stepper**: 1 Electricity from scratch → 2 How power is bought & sold → 3 Why PPAs exist → 4 How a PPA works. Added 3 grid-basics terms (kWh, Utility, T&D; 57 total).
- ✅ **Fixed 2026-06-02: Newcomer level-filter bug.** The level-filter control buttons carried `data-level`, the same attribute the content filter targets — so clicking "Newcomer"/"Practitioner" hid the other filter buttons (you couldn't switch back). Moved the control to `data-setlevel`; added a static UI-integrity test suite (`test/ui.test.js`) that fails if the control ever filters itself, if an inline tooltip term doesn't resolve, or if nav tabs and views drift. Also compacted the mobile stepper (2×2, hide level cue) to cut scrolling.
- ✅ **"How to draft a PPA" section — shipped 2026-06-02.** Added to the **Drafting** tab (renamed from "Example PPAs"): a 6-step drafting process (start from a standard form → term sheet → define terms → allocate risk → bankability → CPs/COD), a "what every PPA must define" checklist, and drafting principles / deal-killers — all linked to the glossary. The annotated examples now sit below as worked illustrations. Added Term Sheet + Conditions Precedent terms (59 total). Partially covers the deferred legal-drafting module and the deal-lifecycle walkthrough.
- ✅ **Focus management on view switch — shipped 2026-06-05.** `showView()` now accepts a `moveFocus` flag; tab clicks and hashchange pass `true`, so keyboard/screen-reader users land on the new view's `<h1>` (tabindex="-1"). Initial page load does not move focus.
- ✅ **Persist the level filter — shipped 2026-06-05.** `applyLevel()` writes to `localStorage("ppa-level")`; `wireLevel()` restores on init and syncs the `aria-pressed` state of the buttons. Joins theme persistence.
- ✅ **Deal-lifecycle walkthrough — shipped 2026-06-05.** Six-stage numbered timeline (Origination → Term Sheet → Diligence → Execution/CPs → Construction → Operations) in the Drafting tab, with timelines, parties, and glossary links. Directly maps to the "Now on deck" Phase 2 item.
- ✅ **Who's-who ecosystem map — shipped 2026-06-05.** Nine-card grid in the Learn tab covering Developer/IPP, EPC, O&M, Lender, Tax-Equity, Offtaker, Utility, ISO/RTO, and Broker/Advisor — each with eyebrow role label and glossary links.
- ✅ **Asset cache-busting — shipped 2026-06-05.** Added `?v=20260605` query strings to all four asset references (styles.css, settle-core.js, simulator.js, app.js, content.js) so returning visitors always get fresh assets.
- ✅ **Mobile nav scroll affordance — shipped 2026-06-05.** CSS `mask-image` gradient fades the right 48px of the nav on screens ≤860px, hinting at off-screen tabs.

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
- ✅ **Accessible, broader term lookup — shipped 2026-07-01.** `title` tooltips replaced with a real hover/focus/tap explainer card (term, category, definition, source link, glossary hint; Escape/scroll/outside-tap dismisses; two-tap flow on touch). Acronyms auto-tagged from glossary parentheticals — first bare occurrence per paragraph/list item/table cell gets a subtle explainer underline (17 acronyms, ~150 spots), skipping definition sites, links, buttons, code, the glossary view, and the generated draft. Regression test in ui.test.js.
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
- **Asset cache-busting.** ~~`index.html` references `app.js`/`styles.css` with no version~~ Done 2026-07-12: all assets carry `?v=` strings. Remaining lesson (bitten same day, see issues.md): bump the string once per **shipped state**, never reuse one across two change sets — same-string rewrites serve stale JS silently. A tiny pre-commit check (assets changed ⇒ version changed) would make this mechanical. *Priority: low (was medium)*
- **Create `issues.md`.** No bug log exists yet (CLAUDE.md expects one). *Priority: low*
- **Per-view `<title>` + Open Graph meta** for sharing/SEO. *Priority: low*
- **`.src::before` prefixes non-source captions.** Every `<p class="src" style="border:none">` caption (deals table intro, structures intro, glossary empty state) renders with a spurious "Source: " prefix because `.src::before { content: "Source: " }` is unconditional. Split into `.src` (real source lines) and a plain caption class. Found 2026-07-12 during the course-flow pass. *Priority: low*

## Newcomer ↔ Practitioner consistency plan (added 2026-07-12)

User-reported after the course-flow pass: switching modes visibly changes the MENU
(course numbers appear/disappear) while the CONTENT looks the same. Audited what the
toggle actually does — level-gated blocks per tab, hidden at Newcomer → shown at
Practitioner:

| Tab | Gated blocks | Hidden at Newcomer | What actually changes on toggle |
|---|---|---|---|
| Learn | 7 | 6 | on-ramp swaps out; 5 deep sections + practitioner index appear |
| Settlement simulator | 0 | 0 | nothing |
| Drafting | 9 | 8 | 4 deep sections + extra term-sheet pills appear |
| Draft PPA | 0 | 0 | nothing |
| Project finance | 2 | 2 | tax-equity + merchant-tail sections appear |
| Data centers | 10 | 6 | 4 structures shown → 10 |
| Perspectives | 12 | 7 | extra voices + resources appear |
| Glossary / Coverage | 0 | 0 | nothing |

### Diagnosis — four distinct inconsistencies

1. **Numbering disagrees with itself.** Practitioner hides the nav course numbers
   (`nav.views.lvl2 .course-num`), but course footers still say "Mark stop N of 7",
   the masthead chip still says "N/7", and the palette says "Stop N of 7". The course
   order is canonical for both levels (the spec's own premise), so hiding numbers for
   experts contradicts every other numbered surface. This is the "menu looks
   different" half of the report.
2. **Revealed content is indistinguishable from always-on content.** Practitioner
   sections use the same cards and h2s as everything else; the only marker is a small
   "Practitioner" pill — visible only AFTER switching, exactly when it carries no
   information. Toggling produces no visible change unless a gated block happens to
   be in the viewport. This is the "content looks the same" half.
3. **Newcomers can't tell depth exists.** Hidden practitioner blocks vanish without a
   trace: no stub, no count, no "6 more structures in Practitioner". Same for the
   gated term sheets and Perspectives voices/resources. Discovering the deeper half
   of the site depends entirely on trying the masthead toggle.
4. **Three tabs don't participate at all.** Simulator, Draft PPA, and the reference
   tabs have zero gated content — there the toggle changes only the menu, the purest
   form of the reported inconsistency. The chooser's promise ("the on-ramp hides and
   a jump index appears") is only true on Learn.

### Plan (Pass C candidate, in order)

> **Items 1–3 shipped 2026-07-12** (branch `claude/pass-c-mode-consistency`). The three
> high-priority fixes that close the reported "menu changes but content looks the same"
> gap. Items 4–7 (toggle feedback line, per-tab mode line, JSON-content level labels,
> chooser copy truthing) remain — all medium/low. 3 flow.test.js assertions ride along.

1. ✅ **Unify numbering — keep course numbers in both modes — shipped 2026-07-12.** Deleted the
   `nav.views.lvl2 .course-num { display:none }` rule and the `applyLevel` `lvl2` class
   toggle; numbers + done ticks now agree with footers, chip, and palette in both modes.
   Verified: toggling level leaves the nav unchanged (7 numbers, no `.lvl2` class); flow.test
   asserts both the CSS rule and the JS toggle are gone. *Effort: XS. Priority: high.*
2. ✅ **Stub rows for hidden practitioner sections — shipped 2026-07-12.** At Newcomer, each hidden
   `data-level="2"` block with an h2 renders a slim in-place row: "Practitioner section ·
   {title} · Switch to Practitioner to read →" (button = `setLevelViaFilter("2")` + scroll to
   the anchor). Generated in app.js (`buildLevelStubs`) from the gated h2s; stubs carry
   `data-level-only="1"` so the existing `applyLevel` swaps stub ↔ section for free. Reuses the
   chip/eyebrow idiom, no new colors. Verified: all 10 gated-h2 sections get a stub at Newcomer;
   clicking one switches to Practitioner and lands on the revealed section; 0 stubs visible at
   Practitioner. *Effort: M. Priority: high.*
3. ✅ **Count lines where lists are level-filtered — shipped 2026-07-12.** `[data-level-count]` host
   `<p>`s under the Data centers structures ("Showing 4 of 10 structures — the rest are
   Practitioner"), Perspectives voices (2 of 4) and resources (3 of 8), and Drafting term-sheet
   pills (1 of 5). `updateLevelCounts` (called from `applyLevel`, recomputed after content.js
   renders via `reapplyLevel`) counts each host's `[data-level]` children; the line clears at
   Practitioner. Verified live at both levels. *Effort: S. Priority: high.*
4. **Toggle feedback at the point of action.** On level change, a transient
   aria-live status line by the masthead controls: "Practitioner — 23 deeper blocks
   shown across 5 tabs" / "Newcomer — on-ramp restored, deep sections stubbed",
   computed from the same audit that produced the table above. Acceptance: visible
   and screen-reader-announced on every toggle; no layout shift. *Effort: S.
   Priority: medium.*
5. **Per-tab mode line.** One line under each h1 stating the tab's relationship to
   the toggle: "5 practitioner sections on this tab" (shown or stubbed) vs "This tab
   is the same at both levels" (Simulator, Draft PPA, reference tabs). Kills the
   silent-tab problem honestly — by labeling, not padding. Driven from one audit
   function, not hand-written per tab. *Effort: S–M. Priority: medium.*
6. **Level labels on rendered (JSON) content.** Static gated h2s all carry the
   "Practitioner" pill already, and dc structure cards label Newcomer/Practitioner
   per card — but the gated Perspectives voices/resources and Drafting term-sheet
   pills carry no label at all. Bring them up to the dc-structures standard.
   *Effort: S. Priority: low.*
7. **Chooser copy truthing.** Once 2–5 land, reword the Practitioner option to match
   reality beyond Learn ("deep sections unlock across five tabs — index on Learn"),
   or generate the sentence from the audit counts. *Effort: XS. Priority: low.*
8. **Tests ride along.** flow.test.js: ✅ number-hiding rule + `.lvl2` toggle gone (1);
   ✅ `buildLevelStubs` wired + gated sections exist to stub (2); ✅ count-line hosts present
   and wired into `applyLevel` (3) — all shipped 2026-07-12. Still open: every gated h2 carries
   a pill (6). Note: the static Node harness can't exercise the DOM, so the behavioral proof
   (stub swap, live counts) is browser-verified; the assertions guard the wiring. *Effort: S, per item.*

Deliberately NOT in this plan: inventing practitioner content for Simulator/Draft PPA
just so the toggle "does something" there — the honest fix is labeling (item 5). If
real depth is wanted later, the natural candidates already exist above: the pricing
payoff explorer (discount-to-market, collars) and a basis-risk visualizer.

## Gap research

- **Round 2 — done 2026-06-01 (cheap inline pass).** After the deep-research workflow failed on a harness error, gaps were filled via direct domain-filtered WebSearch/WebFetch against government & national-lab sources (FERC, IRS, EPA, NREL, Berkeley Lab, World Bank). Covered: FERC role & PURPA, IRA ITC/PTC + transferability → pricing, deal types (BTM/front-of-meter/sleeved/community), clauses (curtailment/force majeure/change-in-law/termination), bankability, and the originator role (secondary — job postings). Written up in `docs/research-us-ppa.md` (§9–14) and method comparison in `docs/research-methods.md`. *Priority: done.*
- **Still open** (low-cost tier-1 searches when needed): ISO/RTO per-market detail; internal approval/signing mechanics (investment committee, board, PUC prudence); clause-level CPs / assignment / lender step-in / dispute resolution; time-of-delivery & 24/7 CFE pricing. *Priority: medium.*
