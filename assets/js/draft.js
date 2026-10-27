/* draft.js — VPPA practice-template generator. buildPPA(input) is pure text
   (tested by test/draft.test.js under Node); wireGenerator reads the form. */
(function () {
  "use strict";

  var SETTLE_POINTS = {
    ERCOT: "ERCOT North Hub",
    PJM:   "PJM Western Hub",
    CAISO: "CAISO NP15",
    MISO:  "MISO Illinois Hub",
    "ISO-NE": "ISO-NE Mass Hub",
    NYISO: "NYISO Zone J (NYC)",
    SPP:   "SPP South Hub"
  };

  var FORM_FIELDS = {
    buyer: "d-buyer", buyerState: "d-buyer-state", seller: "d-seller", sellerState: "d-seller-state",
    project: "d-project", location: "d-location", tech: "d-tech", capacity: "d-capacity",
    iso: "d-iso", settlePoint: "d-settle-point", strike: "d-strike", escalation: "d-escalation",
    term: "d-term", cod: "d-cod", govLaw: "d-gov-law"
  };

  function val(v, fallback) {
    v = v == null ? "" : String(v).trim();
    return v || ("[" + fallback + "]");
  }

  /* input: raw form values keyed as in FORM_FIELDS below (missing = placeholder) */
  function buildPPA(input) {
    input = input || {};
    var buyer      = val(input.buyer,       "BUYER NAME");
    var buyerSt    = val(input.buyerState,  "BUYER STATE");
    var seller     = val(input.seller,      "DEVELOPER NAME");
    var sellerSt   = val(input.sellerState, "SELLER STATE");
    var project    = val(input.project,     "PROJECT NAME");
    var loc        = val(input.location,    "PROJECT LOCATION");
    var tech       = input.tech             || "solar PV";
    var cap        = val(input.capacity,    "CAPACITY");
    var iso        = input.iso              || "ISO/RTO";
    var sp         = val(input.settlePoint, "SETTLEMENT POINT");
    var strike     = val(input.strike,      "STRIKE PRICE");
    var esc        = input.escalation       || "";
    var term       = val(input.term,        "TERM");
    var cod        = val(input.cod,         tech === "nuclear" ? "DELIVERY START DATE" : "TARGET COD DATE");
    var govLaw     = val(input.govLaw,      "GOVERNING LAW STATE");

    var capStr    = cap.startsWith("[")    ? cap    : cap + " MW AC";
    var strikeStr = strike.startsWith("[") ? strike : "$" + strike + "/MWh";
    var termStr   = term.startsWith("[")   ? term   : term + " years";

    // An existing nuclear plant is already operating: the term starts on a
    // Delivery Start Date, not at COD, and nothing in the draft is about building it.
    var isNuclear = tech === "nuclear";
    var start = isNuclear ? "the Delivery Start Date" : "COD";
    var isWindSolar = /solar|wind/.test(tech);

    var escStr = esc === "flat"  ? "fixed for the Contract Term"
               : esc === "1pct" ? "escalating at 1% per year from " + start
               : esc === "2pct" ? "escalating at 2% per year from " + start
               : esc === "cpi"  ? "CPI-indexed annually (CPI-U, base year = " + (isNuclear ? "the year of the Delivery Start Date" : "COD") + ")"
               : "as agreed by the Parties";

    var today = (function () {
      var d = new Date();
      return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    }());

    // Worked settlement example (signed, with direction) for Section 3.1.
    var strikeNum = parseFloat(strike);
    var exLmp = 55, exVol = 10000;
    var exStrikeLabel = isNaN(strikeNum) ? strikeStr.replace("/MWh", "") : "$" + strikeNum;
    var exResult;
    if (isNaN(strikeNum)) {
      exResult = "(enter a numeric strike to see the signed result and who pays).";
    } else {
      var exDiff = strikeNum - exLmp;                 // Fixed − Floating
      var exAmt = "$" + (Math.abs(exDiff) * exVol).toLocaleString("en-US");
      exResult = exDiff > 0
        ? "= +" + exAmt + " → Buyer pays Seller (market below strike)."
        : exDiff < 0
          ? "= −" + exAmt + " → Seller pays Buyer (market above strike)."
          : "= $0 → no payment this period (market equals strike).";
    }

    // Technology branch: an existing nuclear plant is an operating facility that
    // conveys environmental attributes / EACs, not a new-build renewable with RECs.
    var recitalBuild = isNuclear
      ? "WHEREAS, Seller owns and operates the " + project + ", a"
      : "WHEREAS, Seller intends to develop, construct, own, and";
    var recitalBuild2 = isNuclear
      ? capStr + " " + tech + " operating facility located in"
      : "operate the " + project + ", a " + capStr + " " + tech;
    var recitalBuild3 = isNuclear
      ? loc + " (the \"Project\"), which is interconnected to"
      : "facility located in " + loc + " (the \"Project\"),";
    var recitalBuild4 = isNuclear
      ? "the " + iso + " grid;"
      : "which will interconnect to the " + iso + " grid;";
    var attrDef = isNuclear
      ? ["\"Environmental Attributes\" means all environmental",
         "attributes and energy attribute certificates (EACs),",
         "including any carbon-free or emission-free certificates,",
         "associated with the Project's output during the Contract Term."]
      : ["\"Environmental Attributes\" means all renewable energy",
         "certificates (RECs), carbon credits, and other renewable",
         "attributes generated by the Project during the Contract Term."];
    var registryLine = isNuclear
      ? ["     Seller shall register the Project in [PJM-GATS / the",
         "     applicable attribute tracking registry] and transfer",
         "     the certificates within [30] days of issuance."]
      : ["     Seller shall register the Project in [WREGIS /",
         "     PJM-GATS] and transfer RECs within [30] days of",
         "     issuance."];
    var sellerReps = isNuclear
      ? ["     (a) the Project is an operating facility holding a",
         "         current NRC operating license;",
         "     (b) Seller holds all material permits and",
         "         interconnection rights for the Project;",
         "     (c) Seller holds an effective interconnection",
         "         agreement with " + iso + " or the transmission owner."]
      : ["     (a) the Project will be a qualified renewable facility;",
         "     (b) Seller holds or has applied for all material",
         "         permits and interconnection rights;",
         "     (c) Seller will execute a final LGIA with " + iso,
         "         prior to COD."];

    var startDef = isNuclear
      ? ["\"Delivery Start Date\" means " + cod + ", or if later, the",
         "first day of the month after the last condition in",
         "Exhibit B is satisfied."]
      : ["\"COD\" or \"Commercial Operation Date\" means the date on",
         "which the Project first delivers energy to the " + iso,
         "grid following completion of commissioning tests, as",
         "certified in writing by Seller."];
    var codCovenant = isNuclear
      ? ["     (a) maintain the Project's NRC operating license in",
         "         effect throughout the Contract Term;"]
      : ["     (a) use commercially reasonable efforts to achieve",
         "         COD on or before " + cod + ";"];
    var insurancePeriod = isNuclear
      ? ["     Project's type and size, including the nuclear",
         "     liability coverage the Price-Anderson Act requires,",
         "     throughout the Contract Term, naming Buyer as",
         "     additional insured where customary."]
      : ["     Project's type and size, throughout construction and",
         "     the Contract Term, naming Buyer as additional insured",
         "     where customary."];
    var defaultE = isNuclear
      ? ["     (e) (Seller only) the NRC suspends or revokes the",
         "         Project's operating license, or Availability is",
         "         below [75]% for [two] consecutive Contract Years."]
      : ["     (e) (Seller only) COD not achieved within [24]",
         "         months after " + cod + "."];
    var perfClause = isNuclear
      ? ["8.2  Availability Guarantee. Seller guarantees Availability",
         "     of at least [90]% in each Contract Year. \"Availability\"",
         "     means the hours the Project can generate at Contract",
         "     Capacity divided by the hours in the Contract Year,",
         "     excluding refueling outages scheduled with [90] days'",
         "     notice. For each percentage point of shortfall, Seller",
         "     pays Buyer $[SHORTFALL RATE] per MW of Contract",
         "     Capacity, capped at $[SHORTFALL CAP] per Contract Year,",
         "     as Buyer's sole remedy for low output short of an",
         "     Event of Default."]
      : ["8.2  Delay Damages. If COD is not achieved by " + cod + ",",
         "     Seller pays Buyer $[DELAY RATE]/day, capped at",
         "     $[DELAY CAP] total, as Buyer's sole pre-default remedy."];
    var perfRemedy = isNuclear ? "Availability Shortfall Payments" : "Delay Damages";
    var cpPermits = isNuclear
      ? ["1. License and permits: Seller holds the Project's NRC",
         "   operating license and all material operating and",
         "   environmental permits for the Project.",
         "2. Interconnection: Seller holds an effective",
         "   interconnection agreement with " + iso + " or the",
         "   transmission owner.",
         "3. Consents: Seller has obtained any lender, co-owner, and",
         "   regulatory consents needed to enter this Agreement."]
      : ["1. Permits: Seller has obtained all material construction,",
         "   environmental, and land-use permits for the Project.",
         "2. Interconnection: Seller has executed a final LGIA with",
         "   " + iso + " or the applicable transmission provider.",
         "3. Financing: Seller has closed project financing (debt",
         "   and tax equity, if any)."];
    var taxContext = ["[To be negotiated.]",
      "",
      " [Drafting note: re-verify the Project's federal tax-credit",
      " status, and the foreign-entity and tariff rules that apply",
      " to it, at signing. These rules changed in 2025.]"];
    if (isWindSolar) {
      taxContext = taxContext.concat([
        "",
        " [Wind and solar: the July 2025 law ends the 45Y/48E",
        " credits for projects that did not begin construction by",
        " Jul 4, 2026, unless placed in service by Dec 31, 2027.",
        " Foreign-entity rules apply to construction beginning",
        " after Dec 31, 2025; tariffs move module cost.]"]);
    }
    if (!isNuclear) {
      taxContext = taxContext.concat([
        "",
        " Seller represents the Project's beginning-of-construction",
        " date as [DATE], established by [physical work test /",
        " 5% safe harbor, if available]."]);
    }

    var SEP  = "─".repeat(64);
    var SEP2 = "═".repeat(64);

    return [
      "VIRTUAL POWER PURCHASE AGREEMENT",
      "",
      "PRACTICE TEMPLATE — EDUCATIONAL USE ONLY",
      "Generated by PPA Helper · " + today,
      "",
      SEP,
      "",
      "This Virtual Power Purchase Agreement (\"Agreement\") is",
      "entered into as of " + today + " by and between:",
      "",
      "  " + buyer + ", a " + buyerSt + " corporation or limited",
      "  liability company (\"Buyer\")",
      "and",
      "  " + seller + ", a " + sellerSt + " limited liability",
      "  company (\"Seller\")",
      "",
      "(each a \"Party,\" together the \"Parties\")",
      "",
      SEP,
      "RECITALS",
      SEP,
      "",
      recitalBuild,
      recitalBuild2,
      recitalBuild3,
      recitalBuild4,
      "",
      "WHEREAS, Buyer desires to purchase, and Seller desires to",
      "sell, the financial Settlement Payments associated with the",
      "Project's output, together with all Environmental Attributes",
      "generated by the Project;",
      "",
      "NOW, THEREFORE, in consideration of the mutual covenants",
      "herein, the Parties agree as follows:",
      "",
      SEP,
      "ARTICLE 1 — DEFINITIONS",
      SEP,
      "",
      "(Defined terms are capitalized. A clause that uses an",
      "undefined capitalized term is a drafting gap — every",
      "capitalized term below should resolve here or in context.)",
      "",
      "\"Business Day\" means any day other than a Saturday,",
      "Sunday, or US federal banking holiday.",
      "",
    ].concat(startDef, [
      "",
      "\"Contract Capacity\" means " + capStr + ".",
      "",
      "\"Contract Term\" means the period from " + start + ",",
      "through the last day of the " + termStr + "-anniversary",
      "month thereafter.",
      "",
      "\"Credit Support\" means a Letter of Credit, cash deposit,",
      "or parent guarantee per Article 6.",
      "",
    ], attrDef, [
      "",
      "\"Event of Default\" has the meaning given in Section 8.1.",
      "",
      "\"Fixed Price\" or \"Strike Price\" means " + strikeStr + ",",
      escStr + ".",
      "",
      "\"Floating Price\" means, for each Settlement Period, the",
      "applicable LMP at the Settlement Point as published by " + iso + ".",
      "",
      "\"LMP\" or \"Locational Marginal Price\" has the meaning",
      "given by " + iso + ".",
      "",
      "\"Settlement Payment\" means the amount payable under",
      "Section 3.1.",
      "",
      "\"Settlement Period\" means each calendar month during the",
      "Contract Term.",
      "",
      "\"Settlement Point\" means " + sp + ".",
      "",
      "\"Settlement Quantity\" means, for each Settlement Period,",
      "the actual metered output (MWh) delivered by the Project",
      "to the " + iso + " grid during that period.",
      "",
      SEP,
      "ARTICLE 2 — AGREEMENT TO SELL AND PURCHASE",
      SEP,
      "",
      "2.1  Financial Contract. This Agreement is a financial",
      "     contract only. No physical delivery of electricity",
      "     is contemplated. Seller sells the Project's output",
      "     into the " + iso + " wholesale market and receives",
      "     the price at its own node. Settlement Payments in",
      "     Article 3 make Seller's effective price equal the",
      "     Fixed Price before basis (Section 2.3), and hedge",
      "     Buyer at the Fixed Price against the hub.",
      "",
      "2.2  Conditions Precedent. The Parties' obligations are",
      "     conditioned on satisfaction of each condition in",
      "     Exhibit B. Either Party may terminate without",
      "     liability if any condition is unsatisfied within",
      "     [24] months of the Execution Date.",
      "",
      "2.3  Settlement Point and Basis. The Floating Price is the",
      "     LMP at the Settlement Point, a regional trading hub.",
      "     Seller physically sells the Project's output at its own",
      "     interconnection node, which may price below the hub.",
      "     Seller bears this node-to-hub difference (\"basis\");",
      "     Buyer's hedge references the hub only. The choice of",
      "     Settlement Point is the single most consequential",
      "     economic term in this Agreement.",
      "",
      SEP,
      "ARTICLE 3 — SETTLEMENT",
      SEP,
      "",
      "3.1  Monthly Calculation. For each Settlement Period:",
      "",
      "       Settlement Payment =",
      "         (Fixed Price − Floating Price) × Settlement Quantity",
      "",
      "     (a) If positive (Fixed > Floating): Buyer pays Seller.",
      "     (b) If negative (Floating > Fixed): Seller pays Buyer",
      "         the absolute value.",
      "",
      "     In words: when the hub price is above the Fixed Price,",
      "     Seller pays Buyer; when it is below, Buyer pays Seller.",
      "",
      "     Example: Fixed = " + strikeStr + "; Floating (LMP) =",
      "     $55/MWh; Volume = 10,000 MWh →",
      "       Settlement = (" + exStrikeLabel + " − $55) × 10,000 MWh",
      "       " + exResult,
      "",
      "3.2  Payment. Seller invoices within [10] Business Days",
      "     after each Settlement Period. The invoiced Party pays",
      "     within [20] Business Days. Late payments accrue",
      "     interest at [Prime Rate + 2%] per annum.",
      "",
      "3.3  Netting. Settlement Payments due in the same period",
      "     shall be netted to a single payment.",
      "",
      "3.4  Negative Prices (Floating Price Floor). [Optional —",
      "     negotiate.] For any interval in which the LMP at the",
      "     Settlement Point is below zero, the Floating Price",
      "     shall be deemed $0/MWh for settlement. Without this",
      "     floor, on every negative-price interval Buyer would",
      "     pay Seller the strike plus the full negative price — a",
      "     material exposure for Buyer in solar/wind-heavy markets",
      "     (ERCOT, CAISO, SPP) where negative LMPs are routine.",
      "",
      "3.5  Metering and Settlement Data. The Settlement Quantity",
      "     and Floating Price are taken from the official",
      "     settlement data published by " + iso + " — not either",
      "     Party's own meters. A Party disputing a statement",
      "     must do so within [12] months; absent timely dispute,",
      "     the statement is final and binding. If ISO data is",
      "     unavailable, the Parties use a good-faith estimate,",
      "     trued up when the data is issued.",
      "",
      "3.6  Taxes and Market Costs. Each Party bears its own",
      "     taxes on amounts it receives. Because Seller — not",
      "     Buyer — is the market participant, Seller bears all",
      "     transmission, congestion, ancillary-service, and",
      "     imbalance charges from selling the Project's output;",
      "     Buyer's settlement references the hub Floating Price",
      "     only. Any new tax imposed on the financial Settlement",
      "     Payments is allocated as the Parties agree [negotiate].",
      "",
      "3.7  Curtailment. The Settlement Quantity is metered output,",
      "     so Buyer settles only on MWh actually delivered.",
      "     (a) Grid-ordered curtailment (" + iso + " dispatch,",
      "         congestion, oversupply) is Seller's risk: curtailed",
      "         MWh are not settled, unless the Parties elect",
      "         [Deemed Generation], under which Buyer settles the",
      "         MWh the Project would have produced, estimated from",
      "         availability and resource data [negotiate method].",
      "     (b) Buyer-instructed curtailment: if Buyer directs",
      "         Seller to reduce output, Buyer settles the curtailed",
      "         MWh as if delivered at the Settlement Point.",
      "",
      SEP,
      "ARTICLE 4 — ENVIRONMENTAL ATTRIBUTES",
      SEP,
      "",
      "4.1  Transfer. Seller shall transfer to Buyer all",
      "     Environmental Attributes generated during the Contract",
      "     Term. The Fixed Price is full consideration for both",
      "     Settlement Payments and Environmental Attributes.",
    ], registryLine, [
      "",
      "4.2  No Prior Encumbrance. Seller represents that the",
      "     Environmental Attributes are free of any lien,",
      "     encumbrance, or prior sale.",
      "",
      "4.3  Registry Costs. All " + (isNuclear ? "certificate" : "REC") + " registration and transfer",
      "     costs shall be borne by [Seller / Buyer — negotiate].",
      "",
      SEP,
      "ARTICLE 5 — REPRESENTATIONS AND WARRANTIES",
      SEP,
      "",
      "5.1  Mutual. Each Party represents and warrants that:",
      "     (a) it is duly organized and has full authority to",
      "         execute and perform this Agreement;",
      "     (b) this Agreement is a legal, valid, binding",
      "         obligation enforceable against it;",
      "     (c) execution does not violate any applicable law",
      "         or material contract.",
      "",
      "5.2  Seller additionally represents that:",
    ], sellerReps, [
      "",
      SEP,
      "ARTICLE 6 — CREDIT SUPPORT",
      SEP,
      "",
      "6.1  Buyer LC. Within [30] days of execution, Buyer",
      "     delivers to Seller an irrevocable standby Letter of",
      "     Credit (rated institution, ≥ A−) in the amount of",
      "     $[BUYER LC AMOUNT] (~6–12 months of expected",
      "     Settlement Payments at the Fixed Price). An",
      "     investment-grade Buyer commonly substitutes a parent",
      "     or affiliate guarantee for the LC.",
      "",
      "6.2  Seller LC. Within [30] days of execution, Seller",
      "     delivers to Buyer an LC in the amount of $[SELLER",
      "     LC AMOUNT].",
      "",
      "6.3  Maintenance. Each Party maintains its Credit Support",
      "     throughout the Contract Term. Failure is an immediate",
      "     Event of Default.",
      "",
      "6.4  Draw. Upon an uncured Event of Default, the non-",
      "     defaulting Party may draw on the Defaulting Party's",
      "     Credit Support to the extent of the Termination Payment.",
      "",
      SEP,
      "ARTICLE 7 — COVENANTS",
      SEP,
      "",
      "7.1  Seller shall:",
    ], codCovenant, [
      "     (b) operate the Project in accordance with Prudent",
      "         Industry Practice;",
      "     (c) provide monthly production reports within [10]",
      "         Business Days after month-end;",
      "     (d) notify Buyer within [5] Business Days of any",
      "         material change in Project status.",
      "",
      "7.2  Buyer shall make all Settlement Payments when due",
      "     and maintain its Credit Support throughout the",
      "     Contract Term.",
      "",
      "7.3  Insurance. Seller shall maintain, with insurers rated",
      "     [A- or better], the property, casualty, and general-",
      "     liability coverage customary for a facility of the",
    ], insurancePeriod, [
      "",
      SEP,
      "ARTICLE 8 — EVENTS OF DEFAULT AND TERMINATION",
      SEP,
      "",
      "8.1  Events of Default:",
      "     (a) Failure to pay within [5] Business Days of",
      "         written notice;",
      "     (b) Material breach not cured within [30] days of",
      "         written notice (up to [90] days if diligently",
      "         pursued);",
      "     (c) Failure to maintain Credit Support;",
      "     (d) Insolvency or bankruptcy;",
    ], defaultE, [
      "",
    ], perfClause, [
      "",
      "8.3  Termination Payment (close-out). On an Event of",
      "     Default the non-defaulting Party may terminate and",
      "     calculate a Termination Payment equal to the",
      "     mark-to-market value of the remaining swap: the NPV",
      "     of expected future Settlement Payments, using the",
      "     forward price curve at the Settlement Point as of the",
      "     termination date, discounted at [X]%.",
      "       Because this is a fixed-for-floating swap, the",
      "     close-out amount may be owed by EITHER Party — it is",
      "     paid by whichever Party is out-of-the-money on the",
      "     remaining term, not automatically by the defaulting",
      "     Party. The non-defaulting Party computes it in a",
      "     commercially reasonable manner and may set it off",
      "     against Credit Support per Section 6.4. The owing",
      "     Party pays within [10] Business Days of the",
      "     calculation.",
      "",
      SEP,
      "ARTICLE 9 — FORCE MAJEURE",
      SEP,
      "",
      "9.1  Relief. A Party prevented by a Force Majeure Event",
      "     (acts of God, war, terrorism, fire, flood, or",
      "     government action beyond its control) is relieved",
      "     from performance obligations to the extent prevented,",
      "     provided it gives notice within [10] Business Days.",
      "     Curtailment is governed by Section 3.7, not this",
      "     Article.",
      "",
      "9.2  Extended FM. If Force Majeure continues for more",
      "     than [180] days, either Party may terminate without",
      "     Termination Payment liability.",
      "",
      SEP,
      "ARTICLE 10 — CHANGE IN LAW",
      SEP,
      "",
      "10.1 Notification. Each Party promptly notifies the other",
      "     of any Change in Law materially affecting the",
      "     economics of this Agreement.",
      "",
      "10.2 Negotiation. Parties negotiate in good faith for",
      "     [90] days to restore the affected Party's economic",
      "     position. If no agreement, either Party may terminate",
      "     with a reduced Termination Payment per Exhibit C.",
      "     Tax-credit and trade policy positions are in Exhibit C.",
      "",
      SEP,
      "ARTICLE 11 — ASSIGNMENT AND LENDER STEP-IN",
      SEP,
      "",
      "11.1 General. Neither Party assigns this Agreement without",
      "     the other's prior written consent (not unreasonably",
      "     withheld), except as provided below.",
      "",
      "11.2 Seller Collateral Assignment. Seller may collaterally",
      "     assign to Project lenders without Buyer's consent,",
      "     provided lenders execute a direct agreement",
      "     acceptable to Buyer.",
      "",
      "11.3 Lender Step-In. If Seller defaults, Seller's lenders",
      "     receive [30] days' written notice and may cure the",
      "     default or appoint a replacement operator.",
      "",
      "11.4 Buyer Permitted Assignment. Buyer may assign to any",
      "     affiliate with credit equal to or better than Buyer's",
      "     without Seller's consent.",
      "",
      SEP,
      "ARTICLE 12 — GOVERNING LAW AND DISPUTE RESOLUTION",
      SEP,
      "",
      "12.1 Governing Law. " + govLaw + " law governs, without",
      "     conflict-of-laws principles.",
      "",
      "12.2 Disputes. Unresolved disputes are first referred to",
      "     senior representatives for [30] days of negotiation.",
      "     If unresolved: [binding JAMS arbitration / courts of",
      "     " + govLaw + "].",
      "",
      SEP,
      "ARTICLE 13 — LIMITATION OF LIABILITY",
      SEP,
      "",
      "13.1 No Consequential Damages. Neither Party is liable to",
      "     the other for consequential, incidental, punitive, or",
      "     indirect damages (including lost profits), whether in",
      "     contract, tort, or otherwise. The Settlement Payments,",
      "     " + perfRemedy + ", and Termination Payment",
      "     are the agreed liquidated and exclusive remedies —",
      "     not penalties.",
      "",
      "13.2 Liability Cap. Except for fraud, willful misconduct,",
      "     and indemnity for third-party claims, each Party's",
      "     aggregate liability under this Agreement is capped at",
      "     $[LIABILITY CAP] (commonly 1–2 years of expected",
      "     Settlement Payments). An uncapped liability is a",
      "     common deal-killer and a barrier to financing — a",
      "     lender will not fund against unbounded downside.",
      "",
      SEP,
      "ARTICLE 14 — MISCELLANEOUS",
      SEP,
      "",
      "14.1 Entire Agreement. This Agreement (including all",
      "     Exhibits) supersedes all prior negotiations.",
      "14.2 Amendments. Written instrument signed by both Parties.",
      "14.3 Waiver. Failure to exercise a right is not a waiver.",
      "14.4 Severability. Invalid provisions severed; rest continues.",
      "14.5 Notices. As specified in Exhibit A.",
      "14.6 Counterparts. May be executed by electronic signature.",
      "14.7 No Third-Party Beneficiaries.",
      "14.8 Confidentiality. The terms of this Agreement are",
      "     confidential. Either Party may disclose them to its",
      "     lenders, investors, and advisors, and as required by",
      "     law, regulation, or " + (isNuclear ? "an attribute" : "a REC") + " registry, provided the",
      "     recipient is bound by like confidentiality.",
      "",
      SEP,
      "DISCLAIMER",
      SEP,
      "",
      "THIS DOCUMENT IS A PRACTICE TEMPLATE GENERATED BY PPA",
      "HELPER FOR EDUCATIONAL PURPOSES ONLY. IT IS NOT LEGAL",
      "ADVICE. DO NOT EXECUTE OR RELY ON IT FOR A REAL",
      "TRANSACTION WITHOUT REVIEW BY A QUALIFIED ENERGY ATTORNEY.",
      "",
      SEP,
      "SIGNATURE PAGE",
      SEP,
      "",
      "IN WITNESS WHEREOF, the Parties have executed this",
      "Agreement as of the date first written above.",
      "",
      buyer.toUpperCase(),
      "",
      "By:    ___________________________________",
      "Name:  ___________________________________",
      "Title: ___________________________________",
      "Date:  ___________________________________",
      "",
      "",
      seller.toUpperCase(),
      "",
      "By:    ___________________________________",
      "Name:  ___________________________________",
      "Title: ___________________________________",
      "Date:  ___________________________________",
      "",
      SEP2,
      "EXHIBIT A — NOTICES",
      SEP2,
      "",
      "Buyer:   " + buyer,
      "         Attn:    [BUYER NOTICE CONTACT]",
      "         Address: [BUYER ADDRESS]",
      "         Email:   [BUYER EMAIL]",
      "",
      "Seller:  " + seller,
      "         Attn:    [SELLER NOTICE CONTACT]",
      "         Address: [SELLER ADDRESS]",
      "         Email:   [SELLER EMAIL]",
      "",
      SEP2,
      "EXHIBIT B — CONDITIONS PRECEDENT",
      SEP2,
      "",
      "Each of the following must be satisfied prior to the",
      "first Settlement Period:",
      "",
    ], cpPermits, [
      "4. Seller Credit Support: Seller has delivered its LC",
      "   per Section 6.2.",
      "5. Buyer Approvals: Buyer has obtained all required",
      "   internal approvals (investment committee, board).",
      "6. Buyer Credit Support: Buyer has delivered its LC",
      "   per Section 6.1.",
      "",
      SEP2,
      "EXHIBIT C — TAX-CREDIT AND TRADE POLICY POSITIONS",
      SEP2,
      "",
    ], taxContext, [
      "",
      " Option A (Buyer shares): if the Project loses credits it",
      " was priced to receive, the Fixed Price re-opens to restore",
      " Seller's [original return], capped at [$X/MWh].",
      "",
      " Option B (Seller bears): no re-opener; Seller bears credit,",
      " foreign-entity and tariff risk, priced into the Fixed Price.",
      "",
      " Option C (Shared): Seller bears losses up to [X]% of the",
      " expected credit value; above that the Parties share",
      " [50/50 / per negotiation] or either may terminate before",
      " " + start + " without a Termination Payment.",
      "",
      SEP2,
      "END OF AGREEMENT",
      SEP2
    ]).join("\n");
  }

  function wireGenerator() {
    var isoSel    = document.getElementById("d-iso");
    var settlePt  = document.getElementById("d-settle-point");
    var genBtn    = document.getElementById("draft-generate");
    var copyBtn   = document.getElementById("draft-copy");
    var dlBtn     = document.getElementById("draft-download");
    var output    = document.getElementById("draft-output");
    if (!genBtn || !output) return;

    function readForm() {
      var input = {};
      Object.keys(FORM_FIELDS).forEach(function (k) {
        var el = document.getElementById(FORM_FIELDS[k]);
        input[k] = el ? el.value : "";
      });
      return input;
    }

    function setSettle() {
      if (!settlePt.dataset.edited) {
        settlePt.value = SETTLE_POINTS[isoSel.value] || "";
      }
    }
    if (isoSel && settlePt) {
      isoSel.addEventListener("change", setSettle);
      setSettle();
      settlePt.addEventListener("input", function () {
        settlePt.dataset.edited = "1";
      });
    }

    function generate() {
      var text = buildPPA(readForm());
      output.textContent = text;
      if (copyBtn) copyBtn.disabled = false;
      if (dlBtn)   dlBtn.disabled   = false;
    }

    genBtn.addEventListener("click", generate);

    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        navigator.clipboard.writeText(output.textContent).then(function () {
          copyBtn.textContent = "Copied!";
          setTimeout(function () { copyBtn.textContent = "Copy text"; }, 2000);
        }).catch(function () {
          var r = document.createRange();
          r.selectNode(output);
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(r);
          document.execCommand("copy");
        });
      });
    }

    if (dlBtn) {
      dlBtn.addEventListener("click", function () {
        var blob = new Blob([output.textContent], { type: "text/plain" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "vppa-draft.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
  }

  if (typeof module === "object" && module.exports) {
    module.exports = { buildPPA: buildPPA, SETTLE_POINTS: SETTLE_POINTS };
    return;
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireGenerator);
  } else {
    wireGenerator();
  }
}());
