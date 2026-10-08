# US Power Purchase Agreements — Research Knowledge Base

> Source: deep-research run, 2026-06-01. 24 sources fetched, 116 claims extracted, 25 verified by 3-vote adversarial check, 24 confirmed. This is the content backbone for the learning tool. Each section cites primary sources. Gaps are marked **[UNVERIFIED — needs research]** so the site never presents a hole as if it were covered.

Captured: 2026-06-01. Durable definitional content (REC definition, CfD mechanics, basis risk) is stable; price-index figures are point-in-time.

---

## 1. What a PPA is, and the two fundamental forms

A **Power Purchase Agreement** is the long-term contract governing the sale of electricity — and/or its environmental attributes — from a generator to an offtaker. In the US it comes in two fundamental flavors:

- **Physical PPA** — electrons and legal title actually flow to the buyer's meter/account.
- **Virtual / financial PPA (VPPA)** — no electrons are delivered; the deal settles **purely financially** as a contract-for-differences. The VPPA **has been the most common corporate PPA model in the US.**

The dividing line is literally "whether physical electrons are delivered from the project location to the buyer's meter."

*Sources: [LevelTen glossary](https://www.leveltenenergy.com/post/power-purchase-agreement-glossary), [WBCSD pricing-structures guide](https://www.wbcsd.org/wp-content/uploads/2023/10/Pricing-structures-for-corporate-renewable-PPAs.pdf)*

### How a VPPA settles (the core mechanic to master)

A VPPA is a **fixed-for-floating swap**. Each settlement period (typically **monthly**):

- Compare the buyer's **fixed strike price** against the **floating ISO/RTO market price (LMP)**.
- **If market price > strike:** the generator pays the buyer the difference.
- **If market price < strike:** the buyer pays the generator the difference.

Economically identical to an interest-rate swap. Contract language (LevelTen): "If the Settlement Amount is greater than zero, the Settlement Amount shall be payable by Buyer to Seller. If… less than zero,… payable by Seller to Buyer."

*Sources: [LevelTen terms](https://www.leveltenenergy.com/post/power-purchase-agreement-terms), [Stoel Rives "Law of Solar"](https://www.stoel.com/insights/reports/the-law-of-solar/power-purchase-agreements-utility-scale-projects), [Norton Rose Fulbright](https://www.projectfinance.law/publications/2020/june/corporate-vppas-risks-and-sensitivities), [WBCSD](https://www.wbcsd.org/wp-content/uploads/2023/10/Pricing-structures-for-corporate-renewable-PPAs.pdf)*

### Other type distinctions (asked for; only partially verified)
Physical vs. virtual is solidly verified. **[UNVERIFIED — needs research]** for a clean, cited treatment: utility/IOU vs. corporate/C&I, sleeved PPAs, retail vs. wholesale, behind-the-meter vs. front-of-meter, and community solar. (Catalyze and FlexiDAO blogs touched these but weren't put through verification.)

---

## 2. RECs / environmental attributes

A **Renewable Energy Certificate (REC)** is "a market-based instrument that represents the property rights to the environmental, social, and other non-power attributes of renewable electricity generation." **One REC is issued per megawatt-hour (MWh)** generated and delivered to the grid. Standard across all US tracking systems (PJM-GATS, WREGIS, NEPOOL-GIS, M-RETS).

In a VPPA, the **fixed price is the consideration for the RECs** — the seller conveys the Facility RECs / Environmental Attributes to the buyer. Deals **may** also share 50% of net revenues from "Additional Products" (deal-specific).

*Sources: [EPA — RECs](https://www.epa.gov/green-power-markets/renewable-energy-certificates-recs), [LevelTen terms](https://www.leveltenenergy.com/post/power-purchase-agreement-terms)*

---

## 3. US market structure & basis risk (the #1 structural risk)

In US organized wholesale markets, electricity is priced by **Locational Marginal Price (LMP)** at thousands of **nodes** (where generators connect). Nodes are aggregated by weighted average into a handful of less-volatile regional **hubs/zones**.

**Basis risk** is the dominant structural risk in a hub-settled VPPA:
- Most corporate buyers negotiate to settle at the **hub** (less volatile).
- The buyer's revenue tracks the **hub** price; the generator earns the local **nodal** price.
- The developer absorbs the **node-to-hub difference**. When hub price > node price, the project loses money.

Vivid example (Norton Rose Fulbright): August 2019 ERCOT event — North hub ~$9,000/MWh vs. node ~$1,000/MWh; a 300-MW project lost ~$2.4M **in one hour**.

The **Settlement Location** clause defines "the trading hub, pricing node, zone, or other location at which your project will settle financially" — one of the most consequential terms in the contract.

*Sources: [WBCSD](https://www.wbcsd.org/wp-content/uploads/2023/10/Pricing-structures-for-corporate-renewable-PPAs.pdf), [American Cities Climate Challenge — basis risk](https://cityrenewables.org/vppa/research-and-build-team/understand-basis-risk/), [Norton Rose Fulbright](https://www.projectfinance.law/publications/2020/june/corporate-vppas-risks-and-sensitivities), [LevelTen glossary](https://www.leveltenenergy.com/post/power-purchase-agreement-glossary)*

> **Note (refuted claim):** A LevelTen-sourced framing that hub settlement is "a deliberate basis-risk tradeoff *for the buyer*" was **refuted (1-2)**. The buyer typically **transfers** basis risk to the developer rather than retaining it. Use the corrected mechanics above.

### ISO/RTOs, FERC, and IRA tax credits
The ISO/RTO list (ERCOT, PJM, CAISO, MISO, SPP, ISO-NE, NYISO) is real and was the search frame, but a clean cited per-market treatment is **[UNVERIFIED — needs research]**.

**[UNVERIFIED — needs research]:**
- **FERC's specific jurisdictional role** over wholesale PPAs (market-based rate authority, QF/PURPA) vs. state PUC approval of utility PPAs.
- **Inflation Reduction Act / ITC & PTC** and post-2022 **tax-credit transferability** — how they flow through to PPA pricing and how value is split in negotiation. (IRS and Akin Gump pages were fetched but the specific pricing-effect claims weren't verified.)

---

## 4. The risk taxonomy (and mitigants)

RMI frames **five risks corporate buyers find unfamiliar**: **price, shape, basis, volume, operational.** (Broader taxonomies add credit, change-in-law, force majeure, regulatory.)

Established mitigants: **hub-settled contracts, floors and collars, proxy generation, volume firming agreements, fixed-volume swaps, long-term REC agreements, project tranches, and contract tranches.**

*Sources: [RMI — Corporate Purchaser's Guide to Risk Mitigation](https://rmi.org/insight/corporate-purchasers-guide-risk-mitigation/), [RMI press release](https://rmi.org/press-release/rmi-guide-highlights-risk-mitigation-for-corporate-renewable-energy-procurement/)*

### Who bears price risk, by pricing structure
| Structure | Who bears electricity-price risk |
|---|---|
| **Fixed** | Buyer (contract goes out-of-the-money if market prices fall) |
| **Escalating** | Buyer (predetermined upward price path) |
| **Inflation-indexed** | Buyer (committed to an indexed path) |
| **Discount-to-market with floor** | Producer bears it down to the floor; **buyer** at risk below the floor |
| **Collar (floor + cap)** | Producer bears risk **within** the collar; buyer at risk below floor but caps its upside exposure above the cap |

*Source: [WBCSD pricing-structures guide](https://www.wbcsd.org/wp-content/uploads/2023/10/Pricing-structures-for-corporate-renewable-PPAs.pdf)*

Also asked for: **time-of-delivery (ToD)** pricing and **CfD/swap** structure — CfD is verified (§1); ToD-specific mechanics are **[UNVERIFIED — needs research]**.

---

## 5. Key contract elements & penalty mechanisms

- **Term:** Traditional utility-scale solar PPAs run **~20 years** (to amortize project debt + sponsor return). Corporate offtakers increasingly request **shorter terms — 15, 12, even 10 years.** *([Stoel Rives](https://www.stoel.com/insights/reports/the-law-of-solar/power-purchase-agreements-utility-scale-projects))*
- **Delay Damages:** payments to the buyer if the seller misses its targeted **Commercial Operation Date (COD)** — penalize late delivery.
- **Capacity Buydowns:** payments to the buyer if the seller **underbuilds** the project (fails to complete to expected size).
  *([LevelTen glossary](https://www.leveltenenergy.com/post/power-purchase-agreement-glossary))*
- **Credit support (utility PPAs):** typically a **one-way** obligation — the **seller** posts security (cash escrow, an LC from an "A"-or-better bank, or a creditworthy guarantee); post-COD security usually **6–18 months** of expected payments. The investment-grade utility offtaker almost never posts security. Corporate/C&I PPAs can be **two-way** (surety bonds, credit insurance, buyer LCs). *([Stoel Rives](https://www.stoel.com/insights/reports/the-law-of-solar/power-purchase-agreements-utility-scale-projects))*

Other clauses asked for (contract quantity & shaping, conditions precedent, performance/availability guarantees, curtailment, force majeure, change in law, termination & default, assignment, dispute resolution) are real PPA components but were **[UNVERIFIED — needs research]** in this pass — fetch the SEIA C&I standard form and EEI master to source them clause-by-clause.

---

## 6. Deal lifecycle, bankability & approvals

**[LARGELY UNVERIFIED — needs research]** beyond term and credit support. The intended lifecycle (origination → term sheet → negotiation → execution → conditions precedent → COD → operations) was the search frame but no individual stage-mechanics claim cleared verification. Same for:
- **Bankability** (offtaker creditworthiness, what makes a PPA financeable, who bears merchant/basis/shape/volume risk in a financing context).
- **Internal approval & signing mechanics** — developer investment committee vs. corporate buyer board/treasury/sustainability sign-off; regulated-utility PUC prudence review.

Good next sources: the [DOE ETI Playbook — 10 important PPA features](https://www.eere.energy.gov/etiplaybook/pdfs/phase3-sample-10-important-features.pdf), [Pexapark](https://pexapark.com/solar-power-purchase-agreement-ppa/), [Energetic Capital — credit support](https://www.energeticcapital.com/post/credit-support-options-for-renewable-ppas).

---

## 7. The PPA originator role

**[UNVERIFIED — needs research]** — the question asked what an originator does day-to-day and what skills distinguish strong candidates, but no verified claim addressed it. Needs a dedicated research pass (job postings, IB/energy-finance career guides, practitioner interviews).

---

## 8. Standard forms & authoritative learning resources

- **EEI Master Power Purchase & Sale Agreement** — the standard model bilateral contract for forward purchases/sales of **wholesale** electricity in the US (published by Edison Electric Institute w/ NEMA). Standardizes product definitions and credit provisions so traders focus on **price, quantity, location, duration**. Current **v2.1 (April 2000)**. Note: corporate/financial VPPAs often replace it with **ISDA confirmations** or heavily modify it. *([EEI](https://www.eei.org/en/resources-and-media/master-contract))*
- **LevelTen North America PPA Price Index** — quarterly benchmark. Q1 2026: **291 offers from 207 projects** across AESO, CAISO, ERCOT, MISO, PJM, SPP; tenors 10–19 yrs; assumes financial settlement at regional hubs. (Vendor-published, point-in-time.) *([LevelTen PPA](https://www.leveltenenergy.com/ppa))*
- **EPA Guide to Purchasing Green Power** — newcomer-friendly; procurement process, supply options, benefits, capturing value (co-developed w/ DOE/WRI/CRS/NREL). *([EPA](https://www.epa.gov/greenpower/guide-purchasing-green-power))*
- **RMI** — [Corporate Purchaser's Guide to Risk Mitigation](https://rmi.org/insight/corporate-purchasers-guide-risk-mitigation/); [Exploring market-standard corporate PPAs](https://rmi.org/exploring-market-standard-corporate-ppas/).
- **WBCSD** — [Pricing structures for corporate renewable PPAs](https://www.wbcsd.org/wp-content/uploads/2023/10/Pricing-structures-for-corporate-renewable-PPAs.pdf).
- **Stoel Rives — "The Law of Solar"** — [Utility-scale PPAs chapter](https://www.stoel.com/insights/reports/the-law-of-solar/power-purchase-agreements-utility-scale-projects).
- **Norton Rose Fulbright** — [Corporate VPPAs: risks & sensitivities](https://www.projectfinance.law/publications/2020/june/corporate-vppas-risks-and-sensitivities).
- **American Cities Climate Challenge** — [Understand basis risk](https://cityrenewables.org/vppa/research-and-build-team/understand-basis-risk/).

---

## Round 2 — cheap inline pass (2026-06-01)

Sourced via direct WebSearch/WebFetch (no agent fan-out) against government, national-lab, and academic sources. See [research-methods.md](research-methods.md) for why this method was chosen. Government/national-lab sources marked **primary**; job postings marked **secondary**.

### 9. FERC's role & PURPA — primary (ferc.gov)
- FERC has jurisdiction **only over wholesale** sales of electricity (sales for resale); **retail** sales are state-jurisdictional. *([FERC — Power Sales & Markets](https://ferc.gov/power-sales-and-markets))*
- Wholesale sellers generally need **market-based rate (MBR) authority**, granted to sellers who show they and their affiliates **lack or have mitigated market power**. *([FERC — MBR FAQ](https://www.ferc.gov/power-sales-and-markets/electric-market-based-rates/frequently-asked-questions-faqs-market-based))*
- **PURPA qualifying facilities (QFs)** — small power production or cogeneration. A facility >1 MW can **self-certify** or seek FERC certification; QFs **≤20 MW** (and certain others) are **exempt** from FPA §205/§206 and need no MBR authority. PURPA created the utility **must-purchase obligation** from QFs. *([FERC — QF](https://www.ferc.gov/qf))*

### 10. IRA tax credits & PPA pricing — primary (IRS, LBNL)
- Two technology-neutral credits: the **Clean Electricity Investment Credit (ITC)**, base **6%** of qualified investment, and the **Clean Electricity Production Credit (PTC)**, base **0.3¢/kWh** (inflation-adjusted). Base rates rise with **prevailing-wage & apprenticeship** compliance, plus **domestic-content** and **energy-community** adders. *([IRS — Clean Electricity Investment Credit](https://www.irs.gov/credits-deductions/clean-electricity-investment-credit), [IRS — Production Credit](https://www.irs.gov/credits-deductions/clean-electricity-production-credit))*
- **Transferability (post-2022):** eligible taxpayers may **transfer all or part of eligible credits to unrelated taxpayers for cash**; the cash is **not taxable** to the seller and **not deductible** to the buyer. A **mandatory IRS pre-filing registration** (portal) is required before electing. **Elective (direct) pay** is available to tax-exempt entities. *([IRS — Elective pay & transferability](https://www.irs.gov/credits-deductions/elective-pay-and-transferability))*
- **Effect on PPA pricing (quantified):** tax credits cut the developer's net revenue requirement, lowering the achievable strike. Berkeley Lab's *Utility-Scale Solar 2024* (2023 data): utility-scale PV **LCOE ≈ $46/MWh before credits, ≈ $31/MWh after** federal incentives; PPAs signed in 2018–19 fell **below $30/MWh** levelized, some **below $20/MWh**. *([LBNL — Utility-Scale Solar](https://emp.lbl.gov/utility-scale-solar))*

### 11. Bankability — primary/secondary (World Bank PPP, DOE)
- A **bankable PPA** = a long-term offtake with a **creditworthy offtaker** and **sufficient tenor to repay project debt**. *([World Bank PPP — PPAs](https://ppp.worldbank.org/sector/energy/energy-power-agreements/power-purchase-agreements))*
- Lenders assess **how risk is allocated** between the parties; if too much risk sits on the private party, they **lend less** until operating cash flow covers **debt service plus margin**. Weak offtakers require **liquidity facilities / sovereign guarantees**. *([World Bank PPP — Government Guarantees](https://ppp.worldbank.org/sites/default/files/2020-02/Government-Guarantees%20for%20Mobilizing%20Private%20Investment%20in%20Infrastructure.pdf), [DOE ETI — 10 features of bankable PPAs](https://www.eere.energy.gov/etiplaybook/pdfs/phase3-sample-10-important-features.pdf))*

### 12. Other PPA types — primary (EPA, DOE/NREL)
- **Behind-the-meter (BTM):** generation on the **customer's side** of the meter; output **reduces the customer's bill**.
- **Front-of-meter / offsite:** power flows to the grid; the offtaker still buys grid power but uses the **RECs to cut market-based Scope 2 emissions**.
- **Sleeved PPA:** the **local utility acts as intermediary** between offtaker and developer, absorbs price-fluctuation risk, and delivers a **fixed price**; available in deregulated markets, or as a utility green-power product in regulated ones.
- **Community solar:** buy a **share of a local system** for **utility bill credits** (and possibly RECs) at lower upfront cost.
  *([EPA — Customer PPAs](https://www.epa.gov/statelocalenergy/customer-power-purchase-agreements), [DOE — Community Solar](https://www.energy.gov/media/290934), [NREL — Community Shared Solar guide](https://docs.nrel.gov/docs/fy12osti/54570.pdf))*

### 13. More clauses — primary (NREL, DOE)
- **Curtailment:** when output can't be physically taken, energy is paid on a **"deemed delivered / deemed generation"** basis; compensation **varies by cause** (transmission/grid causes are often uncompensated in many contracts). *([NREL — Wind & Solar Curtailment](https://docs.nrel.gov/docs/fy14osti/60983.pdf))*
- **Force majeure:** loss allocation depends on **insurance availability** (and political risk).
- **Change in law:** the contract must state **which party bears the risk** of a law/tax change that diminishes the deal's economics.
- **Termination:** should be **limited to significant events** — offtaker termination can strand the project with no route to market. *([DOE ETI — bankable PPA features](https://www.eere.energy.gov/etiplaybook/pdfs/phase3-sample-10-important-features.pdf))*

### 14. The originator role — secondary (job postings)
A **PPA originator** (a.k.a. origination manager) **leads origination and negotiation of PPAs** with developers, IPPs, generators, and corporate offtakers; **structures PPA types** (fixed, floating, baseload, sleeved, virtual); **manages deals end-to-end** — pricing, structure, risk allocation, commercial close; coordinates **legal, finance, and technical** teams; and maintains relationships with **utilities, traders, aggregators, industrial offtakers, and C-suite** decision-makers. Typical background: **5+ years in energy trading, origination, or PPA structuring**, with commercial awareness in **pricing, risk management, and route-to-market**. *(Secondary — composite of [energyRe VP PPA Origination JD](https://www.energyre.com/sites/g/files/ujywhv351/files/2022-09/VP,%20PPA%20Origination.pdf), Green Recruitment, enable.green postings.)*

---

## Round 3 — data centers & generation (2026-06-01)

The fastest-moving corner of the US PPA market. Sourced inline (government/national-lab + reputable trade press). Deals are point-in-time; full data in `data/datacenter.json`, annotated structures in `data/examples.json`.

**Demand context.** US data-center electricity demand more than doubled (2.3x) 2018→2024 and could reach 325–580 TWh by 2028 — up to ~12% of US electricity. *([LBNL — 2024 Data Center Energy Usage Report](https://eta.lbl.gov/publications/2024-lbnl-data-center-energy-usage-report))*

**Why structures are changing.** "Speed-to-power" — energizing megawatts faster than multi-year interconnection queues allow — is the binding constraint, pushing deals toward firm, on-site, and directly owned generation. *([Utility Dive](https://www.utilitydive.com/news/hyperscaler-data-center-power-companies-grid-utilities/820568/))*

**Landmark deals (as of mid-2026):**
- **Microsoft × Constellation** — restart Three Mile Island Unit 1 (Crane), ~835 MW, 20-yr PPA, online ~2027–28. *(Constellation; CNBC)*
- **Amazon × Talen** — Susquehanna nuclear, up to 1,920 MW, 17-yr (~$18B); restructured from behind-the-meter co-location to front-of-meter retail after FERC rejected the co-location interconnection agreement (Nov 2024). *(PowerMag; Utility Dive)*
- **Google × Kairos** — first corporate SMR fleet, up to 500 MW, first unit ~2030; **Google × Fervo** geothermal (115 MW) + **$4.75B Intersect Power** stake. *(Google; Utility Dive)*
- **Meta** — up to 6.6 GW nuclear via Vistra / Oklo / TerraPower; ~300 MW geothermal (Sage / XGS). *(PowerMag)*
- **Microsoft × Helion** — world's first fusion PPA (~50 MW, target 2028). *(Helion)*
- **Neoclouds** — Crusoe on-site gas (~1 GW, Stargate / Abilene); CoreWeave acquired Core Scientific (~1.3 GW). *(DCD; SEC)*
- **Added 2026-06-02** — Meta × Constellation (Clinton, 1,121 MW nuclear, 20-yr); Amazon × X-energy / Energy Northwest (SMRs, ~320→960 MW, WA); Microsoft × Brookfield (10.5 GW renewable framework — largest ever); Google × Brookfield (up to 3 GW hydro); Meta × Engie (600 MW solar, TX); xAI Colossus (on-site gas, Memphis); OpenAI/Oracle Stargate (700 MW off-grid gas microgrid, TX). Full data in `data/datacenter.json` (16 deals total). Also notable but not tabled: Google × Commonwealth Fusion Systems (200 MW fusion); Fermi America "Project Matador" (up to 11 GW behind-the-meter nuclear+gas+solar, Amarillo).

**Caveat.** Deal facts draw partly on company press releases and trade press (Data Center Dynamics, PowerMag, Utility Dive), not all primary or peer-reviewed; figures and statuses change quarterly. Demand and structural framing are LBNL/DOE-grounded. The annotated example term sheets are illustrative composites, not reproductions of signed contracts.

---

## Round 4 — expert perspectives & load flexibility (2026-06-02)

Named-expert framing (full data in `data/perspectives.json`) plus a load-flexibility structure in the data-center tab. Viewpoints are paraphrased summaries of public work, attributed with sources — not direct quotes.

- **Jigar Shah** — invented the no-money-down solar PPA at SunEdison (2003); led DOE's Loan Programs Office (2021–25, ~$400B) financing first-of-a-kind clean tech. Lesson: a PPA is a financing instrument first. *([Canary Media](https://www.canarymedia.com/articles/climatetech-finance/solar-finance-pioneer-jigar-shah-to-lead-40-billion-doe-loan-programs-office))*
- **Tyler Norris (Duke Nicholas Institute)** — "Rethinking Load Growth" (Feb 2025): the existing US grid can absorb ~76 GW of new load at 0.25% annual curtailment (~98 GW at 0.5%) — "curtailment-enabled headroom." Studied 22 balancing authorities (~95% of peak load); testified to House Energy & Commerce. *([PowerMag](https://www.powermag.com/duke-researchers-grid-flexibility-key-to-accommodate-load-growth/))*
- **Lucia Tian (Google)** — scaling clean firm power (advanced nuclear, enhanced geothermal, CCS, long-duration storage) via offtake and investment to reach 24/7 CFE; funding the "missing middle." *([Utility Dive](https://www.utilitydive.com/news/google-firm-peaking-clean-energy-geothermal-nuclear-ccs-hydrogen/693787/))*
- **Rich Powell (CEBA)** — 375+ corporate buyers; a record ~27 GW procured in 2025, broadening into clean firm power; buyers increasingly steer what gets built. *([Utility Dive](https://www.utilitydive.com/news/corporate-clean-energy-demand-remains-strong-ceba-ceo-rich-powell-2025-26-procurement-trends/819987/))*

---

## Round 5 — ISO/RTO market structure (2026-06-22)

Verified inline against primary sources (FERC + each ISO) for the four markets that dominate corporate PPAs. Drives the new "US wholesale markets" comparison in the Learn tab and the `Capacity Market` / `Energy-Only Market` / `Congestion Revenue Right (CRR)` glossary terms.

- **ERCOT — energy-only, non-FERC.** Pays generators only for energy (+ ancillary), no capacity market; relies on scarcity pricing. Grid is intrastate and not synchronously interconnected, so wholesale sales are **not** FERC-jurisdictional — oversight is the PUCT/Texas Legislature. Nodal LMP; hubs North/Houston/West/South. *([FERC — ERCOT](https://www.ferc.gov/industries-data/electric/electric-power-markets/ercot), [ERCOT market structure one-pager](https://www.ercot.com/files/docs/2019/09/17/Market_Structure_OnePager_FINAL_Revised.pdf))*
- **PJM — capacity + energy.** Reliability Pricing Model (RPM) procures capacity via the Base Residual Auction; locational deliverability areas. Nodal LMP; Western Hub (AEP-Dayton) benchmark. *([PJM Manual 18](https://www.pjm.com/-/media/DotCom/documents/manuals/m18.ashx))*
- **CAISO — no central capacity market.** Resource adequacy set at the state/CPUC level. CRRs hedge congestion; trading hubs based on NP15/SP15/ZP26 zones. *([CAISO — CRRs](https://www.caiso.com/market-operations/products-services/congestion-revenue-rights))*
- **MISO — capacity + energy.** Seasonal Planning Resource Auction clears capacity by Local Resource Zone; nodal LMP with hubs. *([MISO — Resource Adequacy / PRA](https://www.misoenergy.org/planning/resource-adequacy2/resource-adequacy/))*
- Smaller markets (SPP, ISO-NE FCM, NYISO ICAP) noted at a lighter level of detail, cited to [FERC — Electric power markets](https://www.ferc.gov/industries-data/electric/electric-power-markets).

## Round 6 — approval & signing mechanics (2026-07-01)

Sourced inline (WebSearch + primary regulatory/standard-form documents). Drives the "Getting to signature" section in the Drafting tab and the `Prudence Review` / `Independent Evaluator` / `Delegation of Authority` glossary terms.

### 15. Regulated-utility approval — primary (CA State Auditor, CPUC, EPA)
- To get a PPA approved, a California utility submits an **advice letter or application** to the CPUC describing the terms and compliance. Review involves the utility's **procurement review group** (PUC energy division, Office of Ratepayer Advocates, non-market participants) and an **independent evaluator** retained by the utility who monitors negotiations and assesses cost-effectiveness; approval or denial comes by **PUC resolution**. *([California State Auditor — CPUC oversight of energy utility contracts](https://information.auditor.ca.gov/reports/2016-104/appendix.html))*
- Real approvals to read: [CPUC Resolution E-4320](https://docs.cpuc.ca.gov/PUBLISHED/FINAL_RESOLUTION/116189.htm) (PG&E bilateral RPS PPA), [E-4448](https://docs.cpuc.ca.gov/PublishedDocs/PUBLISHED/FINAL_RESOLUTION/159180.htm) (SDG&E short-term RPS PPAs).
- Some states grant approval before commitment: a **CPCN** generally establishes prudence; Minnesota calls it **Advance Determination of Prudence**, Vermont a **Certificate of Public Good**. *([EPA — Guide to Action: Electricity Resource Planning and Procurement](https://www.epa.gov/system/files/documents/2022-08/Electricity%20Resource%20Planning%20and%20Procurement_508.pdf))*

### 16. Signature authority & documentation architecture — primary (EEI)
- The **EEI Master PPSA** has each party represent that it holds all necessary **regulatory authorizations** and that **execution and delivery are within its powers and duly authorized by all necessary action** — internal delegation-of-authority is what makes this representation true. *([EEI — Master Contract](https://www.eei.org/en/resources-and-media/master-contract))*
- Architecture: a negotiated **cover sheet** (elections: collateral thresholds, cross-default, confirmation procedure) + per-transaction **confirmations**; credit terms in the collateral annex. *([EEI — optional annex provisions](https://www.eei.org/en/resources-and-media/master-contract/annex-provisions-optional), [Charles Law — EEI masters overview](https://charleslawpllc.com/our_expertise/eei-master-agreements-for-the-purchase-and-sale-of-power/) (secondary))*

### 17. Corporate approval chain — secondary (advisor/law-firm guidance)
Corporate buyers route a PPA through sustainability (Scope 2 claim), treasury/finance (mark-to-market / hedge-accounting exposure), legal, then investment committee or board sign-off, usually with a procurement advisor running the RFP. *(Secondary — [DLA Piper — Corporate PPAs](https://intelligence.dlapiper.com/corporateppa/), [3Degrees — PPAs/VPPAs](https://3degreesinc.com/what-we-do/implement-your-strategy/power-purchase-agreements-ppas-vppas/), [Daeryun — PPA transaction steps](https://www.daeryunlaw.com/us/insights/ppa-transaction-in-nyc); no single primary source describes internal committee mechanics.)*

---

## Round 7 — real executed contracts & deal refresh (2026-07-01)

Two actual executed PPAs, publicly filed with the SEC as material-contract exhibits, now annotated clause-by-clause in the Drafting tab (values quoted from the documents themselves):

- **New Mexico SunTower, LLC × El Paso Electric** (Oct 17, 2008) — 92 MW solar, New Mexico. 20 commercial-operation-year term; price redacted under SEC confidential treatment (a teachable point); all RECs to EPE at no additional cost; Security Fund $20/kW → $40/kW; LC issuer rated A− or better by both S&P and Moody's (§11.1(C)(1)); Delivery Excuse / interconnection-disconnect carve-outs. *([SEC EDGAR — EPE Exhibit 10.07](https://www.sec.gov/Archives/edgar/data/31978/000119312509167228/dex1007.htm))*
- **SCPPA × Milford Wind Corridor Phase II, LLC** (Mar 1, 2010) — 102 MW wind, Milford, Utah. **Prepaid** municipal structure; Prepaid Energy Price $47.00/MWh; delivery at the Intermountain Power Project 345-kV switchyard; delay LDs $5,000/day (first 30 days) then $19,375/day capped at $4.8M (§3.5(a)); LD Security LC $4.8M + Performance Security LC $5M; curtailed energy deemed delivered toward the guarantee (§5.6(g)); buyer purchase options (§2.4–2.5). *([SEC EDGAR — First Wind Exhibit 10.57](https://www.sec.gov/Archives/edgar/data/1434804/000104746910008771/a2200542zex-10_57.htm))*

Method note: EDGAR full-text search for "power purchase agreement" in Exhibit 10 filings (with a declared User-Agent) is the best free library of real executed PPAs; utility commission dockets (CPUC resolutions) are the other main source.

Deal refresh (data/datacenter.json, 19 deals): added Google × Ormat (up to 150 MW geothermal, NV — [ESG Today](https://www.esgtoday.com/google-ormat-sign-deal-to-power-data-centers-from-new-geothermal-projects/)), SCE × Fervo (320 MW Cape Station, largest geothermal PPA — [Fervo](https://fervoenergy.com/fervo-energy-announces-320-mw-power-purchase-agreements-with-southern-california-edison/)), DTE × hyperscaler (1.4 GW regulated-utility ESA — [Utility Dive](https://www.utilitydive.com/news/dte-data-center-deal-transformational-growth-earnings/804231/)).

---

## Round 8 — data-center energy-lead roles & multi-technology contracting (2026-08-08)

Buyer-side job scan plus the contract mechanics those roles test. Sources fetched 2026-08-08.

**The role archetype.** Hyperscalers, neoclouds, data-center developers, and AI labs are hiring energy leads to source power for new large loads across technologies, not to sign one solar VPPA:

- CoreWeave, *Principal, Energy Strategy* (NYC): requires knowledge of "energy markets, utility tariffs, and power purchase agreements (PPAs)"; 5+ years energy procurement, "preferably within the data center or cloud industry"; $180k–264k base. *([Built In NYC](https://www.builtinnyc.com/job/principal-energy-strategy/6804601))* CoreWeave also listed an *Energy Procurement Manager* (Sunnyvale) — develop strategies, negotiate contracts, mitigate risk.
- Antora Energy, *Principal, Power Procurement*: 12+ years in power procurement / energy origination / utility negotiations; "closing 8+ PPAs, energy service agreements, or equivalent utility contracts, including negotiating at least 3 original or custom tariff structures." (Listing via Jobgether, since expired — quoted from the posting text.)
- The function, per the Umbrex data-center primer: load forecasting and capacity planning, grid-interconnection coordination, procurement across PPAs / utility tariffs / RECs / green tariffs, flexible-interconnection deals, on-site generation and storage, 24/7 CFE accounting. *([Umbrex — Energy Strategy & Power Procurement](https://umbrex.com/resources/data-center-primer/energy-strategy-power-procurement/))*

**Multi-technology portfolio facts (verified):**

- Heat rate (Btu/kWh) measures how efficiently a plant converts fuel to electricity; the spark spread is the difference between the power price and the gas cost to generate it — the standard profitability metric for gas generation, and the quantity a tolling counterparty captures. *([EIA — spark spread explainer](https://www.eia.gov/todayinenergy/includes/sparkspread_explain.php))*
- Tolling arrangement (EIA): a "contract arrangement under which a raw material … from one company is delivered to the production facility of another company in exchange for the equivalent volume of finished products and payment of a processing fee" — in power: buyer supplies the gas, pays a fixed toll (capacity payment), takes the electricity; fuel-price risk stays with the buyer. *([EIA glossary](https://www.eia.gov/tools/glossary/index.php?id=T))*
- Hybrid (solar + storage) PPA pricing — energy price plus a storage adder / capacity payment — documented with market data in LBNL's *Utility-Scale Solar*. *([Berkeley Lab](https://emp.lbl.gov/utility-scale-solar))*
- Hyperscaler nuclear commitments "could provide up to 13 gigawatts (GW) in total, split roughly equally between PPAs and direct partnerships" (~6.9 GW PPAs / ~6.1 GW direct); even if all materialize (~102 TWh/y) they "cover less than 20 percent of projected demand through 2035"; new plants have traditionally taken "ten to fifteen years from initial planning to commission." *([Carnegie Endowment, June 2026](https://carnegieendowment.org/research/2026/06/beyond-the-hype-assessing-hyperscaler-nuclear-commitments-against-us-energy-realities))*

**Load-side interconnection (verified):**

- Texas SB6 (June 2025) created ERCOT's formal large-load interconnection process: loads ≥ 75 MW studied in batches, $50,000/MW financial security, documented site control, backup-generation disclosure. As of June 2026 ERCOT tracked ~474.7 GW of large-load interconnection requests, ~420.8 GW of it data centers — more than five times ERCOT's all-time peak demand (91,308 MW, set July 22, 2026) and far beyond what will be built (the "phantom load" problem: the same load shopped into several utility queues at once). *([Utility Dive](https://www.utilitydive.com/news/texas-facing-438-gw-queue-approves-initial-large-load-interconnection-pro/823367/); [ERCOT — Large Load Integration](https://www.ercot.com/services/rq/large-load-integration); [ERCOT — peak-demand records](https://www.ercot.com/static-assets/data/news/content/a-peak-demand/all-time-records.htm))*
- FERC issued §206 show-cause orders to all six RTOs/ISOs on large-load interconnection rules on June 18, 2026 (Items E-7 to E-12, Dockets EL26-67-000 through EL26-72-000), following DOE's Oct 2025 §403 ANOPR (RM26-4-000). Tracked docket-by-docket on the companion microsite. *([Large Load Interconnection — FERC §206 arc](https://pranava0x0.github.io/FERC-Orders-June-2026/))*
- The regulated-utility counterpart of the PPA for these loads is the large-load ESA (electric service agreement) with ramp schedules, contract-demand minimums, and collateral — worked example: DTE × hyperscaler 1.4 GW (Round 7).

**Portfolio-model anchors (CEO-lens follow-up, verified):**

- Utility-scale batteries return roughly 80% of the electricity they store — the US fleet's average monthly round-trip efficiency was 82% (2019, latest EIA analysis of the metric); pumped storage ~79%. Used as the stack builder's default RTE. *([EIA — Today in Energy #46756](https://www.eia.gov/todayinenergy/detail.php?id=46756))*
- Capacity-factor anchors for representative-day profiles: utility-scale solar PV ~25%, onshore wind ~34% (EIA Electric Power Monthly, Table 6.07.B; varies by region and vintage). *([EIA — EPM Table 6.07.B](https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_6_07_b))*
- Arithmetic anchor: a 1,000 MW flat load consumes 8,760 GWh/yr (1 GW × 8,760 h); a same-nameplate solar project at ~25% CF generates ~2,190 GWh — a quarter of the energy, concentrated in ~8 daylight hours.

---

## Round 9 — load/gen/T&D case studies + VPP examples (2026-08-08)

Eight cases for `data/datacenter.json` (`caseStudies`, `vppCases`), each with participants, market, agreement stack, uniqueness-vs-standard-PPA, filed-document history, and 2–4 citations. Key primary documents verified this round:

- **FERC ER24-2172** (Nov 1, 2024, 189 FERC ¶ 61,078): PJM's amended ISA to raise Susquehanna co-located BTM load 300 → 480 MW rejected 2–1 ("high burden" for non-conforming terms not met); Chairman Phillips dissented that the first-of-its-kind configuration warranted one. *([Order PDF](https://www.ferc.gov/sites/default/files/2024-11/20241101-3061_ER24-2172-000.pdf); [Phillips dissent](https://www.ferc.gov/news-events/news/chairman-phillips-dissent-pjms-susquehanna-co-location-proposal-er24-2172))*
- **PUCO Case No. 24-508-EL-ATA** (approved Jul 9, 2025): AEP Ohio data-center tariff — new large data centers pay ≥85% of contracted capacity for up to 12 years; settlement with staff and the Consumers' Counsel; appeal at the Ohio Supreme Court (2025-1458). *([PUCO release](https://puco.ohio.gov/news/puco-orders-aep-ohio-to-create-data-center-specific-tariff))*
- **Meta × Entergy** (LPSC, Aug 2025, 4–1): three CCGTs totaling 2.26 GW (two Richland Parish online late 2028, one Waterford) for the ~$10B, ~2–2.5 GW Hyperion campus; settlement signed by LPSC staff, Walmart, Sierra Club, SREA. *([Entergy release](https://www.entergy.com/news/entergy-louisiana-receives-lpsc-approval-for-major-infrastructure-investments-to-support-metas-data-center-and-improve-reliability); [KPLC — the vote](https://www.kplctv.com/2025/08/21/entergy-la-gets-green-light-plant-power-metas-ai-data-center/))*
- **Crusoe Abilene**: 1.2 GW grid interconnection at the Lancium Clean Campus plus BTM solar/storage and ~1 GW of on-site turbines; four of eight buildings operational by Mar 2026; further 900 MW Microsoft AI-factory campus with its own on-site plant. *([Crusoe — 1.2 GW](https://www.crusoe.ai/resources/newsroom/crusoe-expands-ai-data-center-campus-in-abilene-to-1-2-gigawatts); [Crusoe — 900 MW](https://www.crusoe.ai/resources/newsroom/crusoe-announces-new-900-mw-ai-factory-campus-in-abilene-texas-to-support-microsoft-ai-infrastructure))*
- **xAI Memphis**: TVA board approvals (150 MW, then +150 MW) via MLGW (TVA's largest customer); Shelby County air permit (Jul 2025) covers 15 turbines / ~247 MW through Jan 2027; reporting and aerial imagery identified ~35 turbines with alleged unpermitted operation. *([WREG](https://wreg.com/news/local/tva-approves-xai-request-for-electricity-supply/); [DCD](https://www.datacenterdynamics.com/en/news/xai-doubles-number-of-onsite-gas-turbines-at-memphis-data-center-in-violation-of-permit-limits/))*
- **VPP anchors**: FERC Order 2222 (DER aggregations in wholesale markets); DOE VPP Liftoff (80–160 GW by 2030, ~$10B/yr savings); NRG × Renew Home × Google Cloud ~1 GW Texas VPP by 2035 (~200k homes equivalent, free thermostats, Renew Home co-funds $150 CAC); Sunrun CalReady 2025 fleet: ~56k customers / 75k batteries / ~250 MW two-hour dispatch, 4–9 p.m. May–Oct, up to ~$150/battery/season; Sunrun × PG&E SAVE dispatched 50+ times, 1,200+ dispatching hours Jul–Oct 2025. *([NRG](https://www.nrg.com/about/newsroom/2024/43921.html); [Sunrun](https://investors.sunrun.com/news-events/press-releases/detail/340/sunruns-distributed-power-plant-quadruples-in-size-to); [FERC 2222](https://www.ferc.gov/ferc-order-no-2222-explainer-facilitating-participation-electricity-markets-distributed-energy); [DOE](https://www.energy.gov/edf/articles/doe-releases-new-report-pathways-commercial-liftoff-virtual-power-plants))*

---

## Round 10 — case-study refresh to Oct 2026 + three new cases (2026-10-08)

All six load/gen/wires cases re-checked against primary filings and brought to Oct 2026; three cases added where the last year produced a new *contract form* rather than a new deal of an existing form. Each case now carries a four-cell `glance` (load, supply, contract, status) that feeds the at-a-glance table above the accordions. Verified this round:

- **FERC EL25-49** (PJM co-location): Dec 18, 2025 order finds the PJM tariff unjust and unreasonable for lacking co-location rules; Jun 18, 2026 rehearing order (EL25-49-002) keeps the finding, accepts interim NITS plus firm/non-firm contract-demand service for co-located load. Same day: §206 show-cause orders on large-load interconnection to all six RTOs (EL26-67 to EL26-72). Sep 21, 2026: PJM docket held in abeyance; PJM and its TOs must file §205 large-load rules by Nov 16, 2026. *([Troutman on the rehearing order](https://www.troutmanenergyreport.com/2026/06/ferc-addresses-arguments-on-rehearing-and-requires-additional-pjm-tariff-revisions-to-accommodate-co-located-load/); [abeyance order PDF](https://www.pjm.com/-/media/DotCom/documents/ferc/orders/2026/20260921-el26-67-001.pdf))*
- **FERC ER26-3380** (PJM Reliability Backstop Procurement, 97-page order read in full): filed Jul 31, 2026 after the 2028/29 BRA cleared 6,831 MW short at the $325/MW-day cap (Jul 14; $16.4B vs $29.7B uncollared) and the 2027/28 BRA 6,623 MW short. Attachment DD §18: one-time pay-as-bid procurement, up to 15-year commitments from new resources for 2028/29–2042/43, PJM Settlement as counterparty, $555/MW-day cap on the average accepted offer, bilateral contracts and self-supply netted from the target. Sep 29, 2026 (196 FERC ¶ 61,245): accepted, suspended five months to Feb 28, 2027 subject to refund, paper hearing on zonal load-growth cost allocation, TO exit rules and LSE collateral, plus a §206 proceeding (EL26-108); Chairman Swett concurrence faults the last-day filing. PJM cancelled the Sep 30 bid window. *([Order PDF](https://www.pjm.com/pjmfiles/directory/etariff/FercOrders/9154/20260929-er26-3380-000.pdf); [Board letter Jul 27](https://www.pjm.com/-/media/DotCom/about-pjm/who-we-are/public-disclosures/2026/20260727-board-decisional-letter-on-cifp-reliability-backstop-procurement-and-connect-and-manage.pdf); [Utility Dive — auction](https://www.utilitydive.com/news/pjm-capacity-auction-price-cap-reserve-shortfall-grows/825282/); [Utility Dive — delay](https://www.utilitydive.com/news/pjm-delays-backstop-procurement-ferc-data-center/831751))*
- **IURC Cause No. 46322** (NIPSCO × Amazon, 73-page order read in full, Jun 17, 2026): Data Center Customer #1 special contract dated Sep 18, 2025, 15 years from Jan 1, 2027, ramp to 2,400 MW by end-2032, fixed capacity charge + pass-through energy + Shared System Charges, parent guaranty, termination payments, one-time right to cut up to 1,200 MW by Mar 2029; supply chained through a PPA from the non-regulated affiliate NIPSCO Generation LLC (GenCo) to NIPSCO, so ~3,000 MW of new gas and storage never enters general rate base; settlement with OUCC, Industrial Group and LaPorte County; ~$1B of bill credits to other customers. *([Order PDF](https://www.in.gov/iurc/files/ord_46322_061726.pdf); [Utility Dive](https://www.utilitydive.com/news/nisource-nipsco-amazon-data-centers-indiana/806396/); [FactSet on contract terms](https://insight.factset.com/nipsco-proposes-special-contract-for-amazon-data-centers-in-indiana))*
- **Google × Fervo** (Cape Station, UT): 396 MW PPA signed Sep 1, 2026 with an option for ~600 MW more by June 2030 (nearly 1 GW); trade coverage reports a 15-year term in four 99 MW tranches from Q3 2028; first power Sep 24, 2026, first 33 MW GeoBlock in commercial operation Sep 30, 2026; Phase II ~400 MW in 2028. Earlier anchors: Project Red (2023), 115 MW NV Energy Clean Transition Tariff deal (Jun 2024). *([Fervo PPA release](https://fervoenergy.com/fervo-energy-and-google-sign-396-mw-ppa/); [Fervo COD](https://fervoenergy.com/fervo-energy-declares-commercial-operation-at-cape-station-ahead-of-schedule-leading-the-race-for-next-generation-geothermal-energy/); [TechCrunch](https://techcrunch.com/2026/09/02/enhanced-geothermal-notches-another-win-as-google-buys-400-mw-from-fervo/))*
- **Meta × Entergy, second build** (LPSC U-37882): Mar 25, 2026 application for seven more CCGT units (~5.2 GW), 2,500 MW solar, three battery projects, ~250 miles of transmission and nuclear uprates, ~$12.9B recovered from Meta through a CIAC agreement; Apr 15, 2026 expedited schedule approved 4–1 (Lewis dissent on bidding); hearing Oct 7–9, 2026; vote expected ~Dec 2026. Dec 2025 LPSC "Lightning" fast-track rules skip the market test when a customer funds most of a dedicated build. *([Advocate](https://www.shreveportbossieradvocate.com/news/meta-entergy-louisiana-data-center-power/article_6325d895-ea93-5451-84b5-815ccb8ac578.html); [Entergy response](https://www.entergy.com/entergy-louisianas-response-to-the-advocate))*
- **Microsoft × Crane**: DOE LPO $1B loan closed Nov 18, 2025; NRC draft FONSI Jun 2026; restart target 2027. *([Constellation](https://www.constellationenergy.com/newsroom/2025/11/us-government-backs-constellations-plan-to-launch-crane-clean-energy-center-adding-835-mws-of-new-baseload-power-to-the-grid.html))*
- **xAI**: 27 turbines run in Southaven, MS (Colossus 2) Aug–Dec 2025 before a state permit; MDEQ permit Mar 2026; NAACP Clean Air Act suit Apr 14, 2026, preliminary-injunction motion May 6. *([Action News 5](https://www.actionnews5.com/2026/04/14/naacp-sues-xai-alleging-unlawful-operation-gas-turbines-southaven/))*
- **Large-load tariffs spread**: PUCO denies rehearing Sep 2025, OMA appeals to the Ohio Supreme Court Nov 2025; AEP reports central-Ohio requests ~30 GW → ~5.7 GW (Feb 2026); Xcel MN tariff approved May 15, 2026 (15-year); NJ Data Center Fair Share Act signed Jul 7, 2026 (85% for 10 years). *([Ohio Capital Journal](https://ohiocapitaljournal.com/2025/09/11/ohio-regulators-turn-down-appeal-ok-utilitys-data-center-billing-plan/); [T&D World](https://www.tdworld.com/policy/news/55389587/new-jersey-governor-signs-data-center-fair-share-act-to-address-rising-energy-costs); [Fresh Energy](https://fresh-energy.org/regulatory-update-commission-approves-xcel-energys-large-load-tariff))*
- **Considered, not added**: Fermi America (Amarillo "HyperGrid"; anchor tenant terminated Dec 2025, no signed supply contract to teach from) and NRG's pending large-load deals (terms not public). Revisit when a filing lands.

---

## Coverage scorecard (be honest in the UI)

| Topic | Status |
|---|---|
| Physical vs. virtual PPA, CfD settlement | ✅ Verified |
| RECs (definition, 1 MWh = 1 REC, conveyance) | ✅ Verified |
| Basis risk / node-hub-LMP mechanics | ✅ Verified |
| Risk taxonomy + mitigants (RMI 5) | ✅ Verified |
| Price-risk allocation by pricing structure | ✅ Verified |
| Term lengths; delay damages; capacity buydowns; credit support | ✅ Verified |
| EEI master; LevelTen index; EPA guide | ✅ Verified |
| FERC role & PURPA QFs | ✅ Verified (R2, primary) |
| IRA ITC/PTC, transferability → pricing; LBNL price data | ✅ Verified (R2, primary) |
| Other PPA types (sleeved, BTM, community, front/behind-meter) | ✅ Verified (R2, primary) |
| Clauses: curtailment, force majeure, change-in-law, termination | ✅ Verified (R2, primary) |
| Bankability (creditworthy offtaker + tenor; lender risk view) | ✅ Verified (R2, primary) |
| Data-center demand, structures & landmark deals | ✅ Verified (R3, LBNL/DOE + trade press) |
| Annotated example term sheets (VPPA, utility, data-center nuclear) | ✅ Added (illustrative composites) |
| Expert perspectives (Shah, Norris, Tian, Powell); load flexibility | ✅ Added (R4, paraphrased + cited) |
| Originator role / day-to-day / skills | 🟡 Covered (R2, secondary — job postings) |
| ISO/RTO market structure (ERCOT/PJM/CAISO/MISO; capacity vs. energy, basis hedging) | ✅ Verified (R5, primary) |
| Internal approval/signing (PUC prudence review, signature authority, EEI architecture) | ✅ Verified (R6, primary; corporate chain secondary) |
| Assignment/step-in, dispute resolution (clause-level) | ⚠️ Needs research |
| Time-of-delivery / hourly (ToD) pricing; 24/7 CFE matching | ⚠️ Needs research |
| Heat rate, spark spread, tolling mechanics | ✅ Verified (R8, EIA) |
| ERCOT large-load interconnection (SB6 ≥75 MW process, queue size) | ✅ Verified (R8, ERCOT + trade press) |
| Hybrid solar+storage PPA pricing | ✅ Verified (R8, LBNL) |
| Hyperscaler nuclear commitments vs. delivery reality | ✅ Verified (R8, Carnegie) |
| Energy-lead role / buyer-side career frame | 🟡 Covered (R8, secondary — job postings + primer) |
| Storage tolling / hybrid clause depth (augmentation, degradation, RTE guarantees) | ⚠️ Needs research |
| Heat-rate call options / structured gas hedges | ⚠️ Needs research |
