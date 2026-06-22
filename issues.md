# Issues — PPA Helper

Living audit trail. Each: date · area · description · root cause (**content bug** / **code bug** / **test bug**) · status.

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
  Negative LMPs are routine in ERCOT/CAISO/SPP; without a floor the generator pays the strike plus the full negative price. Added optional Section 3.4 (Floating Price Floor at $0), a glossary term, a Drafting-tab note, and a simulator hint. *Fix: draft.js, glossary.json, index.html.*

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
