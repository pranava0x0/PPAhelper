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
| Internal approval/signing (investment committee, board, PUC prudence) | ⚠️ Needs research |
| Conditions precedent, assignment/step-in, dispute resolution (clause-level) | ⚠️ Needs research |
| Time-of-delivery / hourly (ToD) pricing; 24/7 CFE matching | ⚠️ Needs research |
