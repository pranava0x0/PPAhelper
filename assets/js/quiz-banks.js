/* quiz-banks.js — checkpoint question banks, one per course stop.
   Shared browser + Node (flow.test.js) like settle-core.js.
   Every question is answerable from that stop's own page content —
   same numbers, same wording, no outside facts. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.PPA_QUIZ_BANKS = factory();
}(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  return {

    /* Learn — the on-ramp + the settlement mechanic */
    learn: [
      {
        prompt: "A PPA is priced in $/MWh. What does a megawatt-hour measure?",
        opts: [
          { t: "Energy delivered over time", correct: true },
          { t: "Power being produced right now" },
          { t: "The plant's maximum possible output" },
          { t: "The grid's operating frequency" }
        ],
        explain: "Watts measure power right now; a watt-hour measures energy used over time. A 100 MW solar farm hits 100 MW only at full sun — at a ~25% capacity factor it makes about 219,000 MWh a year, not 876,000. PPAs buy that energy, priced in $/MWh."
      },
      {
        prompt: "In the market's cast of characters, who is \"the load\"?",
        opts: [
          { t: "Whoever consumes the power — you, or a data center", correct: true },
          { t: "The generator selling the power" },
          { t: "The ISO/RTO running the market" },
          { t: "The transmission lines carrying the power" }
        ],
        explain: "Generators make the power, a grid operator moves and balances it, a utility delivers it and bills you, and the consumer is the load. A PPA is a contract between a generator (the seller) and a buyer."
      },
      {
        prompt: "What is the locational marginal price (LMP)?",
        opts: [
          { t: "The price at a specific grid location, set by the last plant needed to meet demand", correct: true },
          { t: "The retail rate on your utility bill" },
          { t: "The fixed price written into a PPA" },
          { t: "A federal tax on wholesale power" }
        ],
        explain: "Operators stack plants cheapest-first; the last one needed sets the price at each point on the grid. When demand spikes or the grid is congested, that price can jump enormously — and it's exactly what a PPA settles against."
      },
      {
        prompt: "Why does a developer need a signed PPA before construction starts?",
        opts: [
          { t: "The long-term contracted revenue is what lets the project raise debt", correct: true },
          { t: "FERC requires a PPA before any plant is built" },
          { t: "It locks in the price of solar panels" },
          { t: "The ISO refuses to interconnect uncontracted projects" }
        ],
        explain: "Bankability: a creditworthy buyer's long-term contract is the predictable revenue lenders need. No offtake, no project — which is why PPAs are now the main way new US generation gets financed (~27 GW contracted by corporate buyers in 2025)."
      },
      {
        prompt: "In a virtual PPA (VPPA), what does the buyer actually receive?",
        opts: [
          { t: "Financial settlement against the strike, plus the RECs — no electrons", correct: true },
          { t: "Physical delivery of power to its meter" },
          { t: "An ownership stake in the project" },
          { t: "Capacity payments from the ISO" }
        ],
        explain: "No electrons reach the buyer. The deal settles purely financially as a contract-for-differences and the renewable energy certificates transfer — this has been the most common corporate PPA model in the US. In a physical PPA, electrons and title actually flow."
      },
      {
        prompt: "Strike $50/MWh; the market price averages $38 this month. Which way does the settlement flow?",
        opts: [
          { t: "The buyer pays the generator the $12 difference", correct: true },
          { t: "The generator pays the buyer the $12 difference" },
          { t: "No payment — settlement only happens above the strike" },
          { t: "The ISO covers the gap" }
        ],
        explain: "Market price below the strike: the buyer pays the generator the difference, so the generator gets its fixed revenue regardless of the market. Above the strike it reverses — the generator pays the buyer. That two-way swap is the whole mechanic."
      }
    ],

    /* Settlement simulator — the cash flows you just ran */
    simulator: [
      {
        prompt: "Hub-settled VPPA, strike $43/MWh. This month the hub LMP averages $51 and 25,000 MWh settle. Who pays whom?",
        opts: [
          { t: "Generator pays the buyer $200,000", correct: true },
          { t: "Buyer pays the generator $200,000" },
          { t: "Generator pays the buyer $1,075,000" },
          { t: "Nothing — the strike is fixed" }
        ],
        explain: "Settlement = (LMP − strike) × volume = ($51 − $43) × 25,000 = +$200,000. Positive means the generator pays the buyer, making the buyer whole at its strike."
      },
      {
        prompt: "Strike $45/MWh and a $6 node-to-hub spread. What does the developer actually realize per MWh?",
        opts: [
          { t: "$39 — the strike minus the spread", correct: true },
          { t: "$45 — the strike protects it" },
          { t: "$51 — the strike plus the spread" },
          { t: "$6 — only the spread" }
        ],
        explain: "The swap settles at the hub, but the developer earns only its node price for actual energy sales (node = hub − spread). Its realized price is strike − spread = $39. A $5–8 spread is typical in ERCOT; a congestion event can hit $40+."
      },
      {
        prompt: "A month prints LMP = −$20 with a $45 strike and no price floor. Who pays whom, and how much per MWh?",
        opts: [
          { t: "The buyer pays the generator $65 — the strike plus the full negative price", correct: true },
          { t: "The generator pays the buyer $65" },
          { t: "The buyer pays $45 — never more than the strike" },
          { t: "Nothing — negative prices void the swap" }
        ],
        explain: "Settlement = (LMP − strike) = (−$20 − $45) = −$65, and negative means the buyer pays the generator — here the strike plus the magnitude of the negative price, $65/MWh. That blowout on the buyer is exactly why VPPAs often floor the floating price at $0, capping the buyer's payment at the strike."
      },
      {
        prompt: "Why does a 100 MW solar project settle far less volume than 100 MW × 8,760 hours?",
        opts: [
          { t: "Capacity factor — it only generates when the sun is there (~25%)", correct: true },
          { t: "The ISO curtails all solar at night by rule" },
          { t: "The strike price caps monthly volume" },
          { t: "Transmission losses absorb the rest" }
        ],
        explain: "Annual generation = MW × 8,760 h × capacity factor. At ~25% for solar that's about 219,000 MWh, not 876,000 — and settled volume follows what's actually generated."
      }
    ],

    /* Drafting — kept verbatim from the original self-check */
    drafting: [
      {
        prompt: "A hub-settled VPPA has a strike of $45/MWh. This month the hub LMP averages $62/MWh and the project generates 20,000 MWh. Who pays whom?",
        opts: [
          { t: "Generator pays the buyer $340,000", correct: true },
          { t: "Buyer pays the generator $340,000" },
          { t: "Generator pays the buyer $1,240,000" },
          { t: "No payment — the strike is fixed" }
        ],
        explain: "Settlement = (LMP − strike) × volume = ($62 − $45) × 20,000 = +$340,000. Positive means the market is above the strike, so the generator pays the buyer — making the buyer whole at its $45 strike."
      },
      {
        prompt: "Same deal (strike $45, hub LMP $62), but the project's own node settled at $40 that month — a $22 node-to-hub spread. What did the developer actually realize per MWh?",
        opts: [
          { t: "$23/MWh", correct: true },
          { t: "$45/MWh — the strike protects it" },
          { t: "$40/MWh — the node price" },
          { t: "$62/MWh — the hub price" }
        ],
        explain: "Developer realized = strike − (hub − node) = $45 − ($62 − $40) = $45 − $22 = $23/MWh. It earns $40 selling energy at its node, then pays the buyer $62 − $45 = $17 on the hub-settled swap: $40 − $17 = $23. That gap is basis risk biting."
      },
      {
        prompt: "In a standard hub-settled VPPA, who bears basis risk — the node-to-hub price gap?",
        opts: [
          { t: "The developer / seller", correct: true },
          { t: "The buyer" },
          { t: "The ISO/RTO" },
          { t: "Split 50/50 by default" }
        ],
        explain: "The buyer's hedge references the hub; the developer earns its local node price but settles at the hub, so it absorbs the node-to-hub difference. Choosing the settlement point is the single most consequential economic term in the contract."
      },
      {
        prompt: "A company's load sits in Georgia (regulated, no in-state organized market). It wants to hedge a solar project located in ERCOT. What's the natural fit?",
        opts: [
          { t: "A virtual PPA settled at an ERCOT hub", correct: true },
          { t: "A physical retail PPA in Georgia" },
          { t: "Nothing — a VPPA needs the buyer to have retail choice" },
          { t: "A behind-the-meter PPA at the Georgia site" }
        ],
        explain: "A VPPA is a purely financial hedge: the buyer keeps its Georgia retail supply and separately settles a swap against the ERCOT hub where the project lives. What a VPPA needs is the project in an organized wholesale market with a liquid LMP — not retail choice in the buyer's territory."
      },
      {
        prompt: "A 20-year PPA between an independent power producer and an investment-grade regulated utility. What's the typical credit-support structure?",
        opts: [
          { t: "One-way: the seller posts security; the IG utility usually posts none", correct: true },
          { t: "Two-way: both parties post letters of credit" },
          { t: "Neither party posts anything" },
          { t: "The ISO guarantees both sides' payments" }
        ],
        explain: "Utility PPAs are classically one-way — the seller posts 6–18 months of expected payments via an LC or guarantee, and the investment-grade utility's balance sheet is the security. Corporate VPPAs, by contrast, are often two-way."
      },
      {
        prompt: "Why do VPPAs increasingly add a $0 floor on the Floating Price?",
        opts: [
          { t: "Without it, a negative LMP makes the buyer pay the strike plus the full negative price", correct: true },
          { t: "To cap the buyer's upside when prices spike" },
          { t: "Because RECs can't be issued at negative prices" },
          { t: "To shorten the contract term" }
        ],
        explain: "When LMP goes below zero (routine in wind- and solar-heavy ERCOT, CAISO, SPP), settlement = (LMP − strike) × volume balloons in the buyer's-payment direction: the buyer owes the generator the strike plus the magnitude of the negative price. Flooring the Floating Price at $0 caps the buyer's exposure."
      }
    ],

    /* Draft PPA — the practice-template generator you just drove */
    ppadraft: [
      {
        prompt: "In the generated draft, what do the [IN BRACKETS] markers flag?",
        opts: [
          { t: "Every negotiable position — what's still yours to fill in or bargain", correct: true },
          { t: "Clauses the law requires verbatim" },
          { t: "Sections the generator failed to complete" },
          { t: "Defined terms that have a glossary entry" }
        ],
        explain: "The tool marks every negotiable position [IN BRACKETS] so you can see exactly what's still open — party names and states, dates, the optional price floor, credit support, governing law. Nothing in brackets is settled."
      },
      {
        prompt: "The output is labeled a \"practice template only.\" What does that mean for using it?",
        opts: [
          { t: "It's a learning draft and starting point — don't sign or rely on it without a qualified energy attorney", correct: true },
          { t: "It's execution-ready the moment the brackets are filled" },
          { t: "It's binding once both parties download the same copy" },
          { t: "It can be filed with FERC as-is" }
        ],
        explain: "A real VPPA is a bespoke, heavily negotiated contract. The page warns you not to sign or rely on the generated draft for a real transaction without review by a qualified energy attorney — it's for learning and as a first draft."
      },
      {
        prompt: "You pick an ISO/RTO and a strike price. Which draft term does the generator derive from your ISO choice?",
        opts: [
          { t: "The settlement point — the hub whose LMP the swap floats against", correct: true },
          { t: "The strike price" },
          { t: "The contract term in years" },
          { t: "The buyer's state of formation" }
        ],
        explain: "Choosing the ISO auto-fills the settlement point — the hub where the Floating Price (LMP) is measured (ERCOT North, PJM Western, CAISO NP15, and so on). Strike, term, and party details are yours to set; the settlement point follows from the market the project lives in."
      }
    ],

    /* Project finance — the workbench you just used */
    projfin: [
      {
        prompt: "Lenders set a minimum DSCR of 1.25×. What must be true in every year of the debt?",
        opts: [
          { t: "Cash available for debt service must cover the debt payment 1.25 times over", correct: true },
          { t: "Debt can be at most 1.25× the sponsor's equity" },
          { t: "Revenue must grow 25% per year" },
          { t: "The equity IRR must exceed 25%" }
        ],
        explain: "DSCR is CFADS ÷ debt service. Lenders size the loan so the level annual payment equals CFADS ÷ target DSCR — the cushion that keeps the debt safe when output or prices wobble."
      },
      {
        prompt: "Why does a higher PPA price let the project carry more debt?",
        opts: [
          { t: "More revenue means more CFADS, so a bigger payment passes the same DSCR test", correct: true },
          { t: "Lenders charge a lower interest rate on expensive power" },
          { t: "The ITC grows with the PPA price" },
          { t: "It doesn't — debt only depends on capex" }
        ],
        explain: "Revenue = generation × PPA price, CFADS = revenue − opex, and the supportable debt is the amount whose level payment equals CFADS ÷ DSCR, present-valued over the tenor. Push the price up in the workbench and watch the debt bar grow (until the 75% gearing cap binds)."
      },
      {
        prompt: "Why won't lenders size debt beyond the PPA term?",
        opts: [
          { t: "After the PPA the project sells at uncertain merchant prices — risk equity bears, not debt", correct: true },
          { t: "FERC prohibits longer amortization" },
          { t: "Solar panels stop working when the PPA ends" },
          { t: "RECs expire with the contract" }
        ],
        explain: "Contracted years fund the debt; the merchant tail is uncontracted upside — and downside — that equity underwrites. If merchant prices hold, the sponsor's IRR climbs; if renewables cannibalize midday prices, the tail is worth far less. That's why a longer PPA is worth real money to a developer."
      },
      {
        prompt: "In the workbench's capital stack, what does the investment tax credit (ITC) do?",
        opts: [
          { t: "Returns ~30% of capex to equity as cash in year 1", correct: true },
          { t: "Reduces the PPA strike price" },
          { t: "Repays the senior lenders first" },
          { t: "Covers the project's operating costs" }
        ],
        explain: "At construction the project is funded by senior debt and sponsor equity; the ITC then comes back to equity as year-1 cash (the model assumes post-IRA transferability). Route it through a tax-equity partnership flip instead and the tax-equity investor takes most of the credit and early cash, lowering the sponsor's own return."
      }
    ],

    /* Data centers — structures and the demand shock */
    datacenter: [
      {
        prompt: "What is the binding constraint pushing data-center buyers toward nuclear restarts, on-site gas, and geothermal?",
        opts: [
          { t: "Speed-to-power — getting large, firm, 24/7 megawatts faster than the grid can build", correct: true },
          { t: "REC prices rising too fast" },
          { t: "State renewable mandates" },
          { t: "Cheap midday solar flooding the market" }
        ],
        explain: "US data-center demand more than doubled from 2018 to 2024 and could reach up to roughly 12% of US electricity by 2028. Speed-to-power is now the constraint — pushing deals toward firm sources, on-site generation, and direct ownership."
      },
      {
        prompt: "Why did Amazon and Talen restructure their Susquehanna co-location deal as front-of-meter retail in June 2025?",
        opts: [
          { t: "It sidesteps the FERC co-location dispute — the load becomes a normal grid-connected retail customer", correct: true },
          { t: "The nuclear plant was being retired" },
          { t: "Co-location turned out to be slower to energize" },
          { t: "The RECs couldn't transfer behind the meter" }
        ],
        explain: "FERC rejected Talen's amended interconnection agreement for the behind-the-meter AWS co-location in Nov 2024 amid cost-allocation questions. The June 2025 restructure keeps the firm nuclear supply while the load pays the grid charges it had avoided — a normal front-of-meter retail arrangement."
      },
      {
        prompt: "How does 24/7 hourly carbon-free matching differ from annual REC matching?",
        opts: [
          { t: "Carbon-free supply must match consumption every hour in the region, not net out across a year", correct: true },
          { t: "It's the same thing, purchased monthly" },
          { t: "It only counts nuclear power" },
          { t: "It's cheaper because midday solar is abundant" }
        ],
        explain: "Hourly matching is a far more rigorous claim than annual RECs — it forces procurement of firm and storage resources, not just cheap midday solar. It's also harder and more expensive; some analyses find it isn't always the most cost-effective way to cut system-wide emissions."
      }
    ]
  };
}));
