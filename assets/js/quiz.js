/* quiz.js — self-check on PPA mechanics. Dependency-free.
   Questions probe the things hyperscaler/developer interviews actually test:
   settlement direction & amount, basis, risk allocation, structure choice,
   credit support, negative pricing. Each reveals worked reasoning on answer. */
(function () {
  "use strict";

  var QUESTIONS = [
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
        { t: "Without it, a negative LMP makes the generator pay the strike plus the full negative price", correct: true },
        { t: "To cap the buyer's upside when prices spike" },
        { t: "Because RECs can't be issued at negative prices" },
        { t: "To shorten the contract term" }
      ],
      explain: "When LMP goes below zero (routine in wind- and solar-heavy ERCOT, CAISO, SPP), settlement = (LMP − strike) × volume balloons: the generator owes the buyer the strike plus the magnitude of the negative price. Flooring the Floating Price at $0 caps that exposure."
    }
  ];

  var KEYS = ["A", "B", "C", "D"];

  function init() {
    var root = document.getElementById("quiz");
    if (!root) return;
    var scoreEl = document.getElementById("quiz-score");
    var resetBtn = document.getElementById("quiz-reset");
    var answered, correctCount;

    function updateScore() {
      if (scoreEl) scoreEl.textContent = correctCount + " / " + answered;
    }

    function build() {
      answered = 0;
      correctCount = 0;
      root.innerHTML = "";
      QUESTIONS.forEach(function (q, qi) {
        var card = document.createElement("div");
        card.className = "quiz-q";

        var prompt = document.createElement("p");
        prompt.className = "q-prompt";
        prompt.innerHTML = '<span class="q-num">' + (qi + 1) + ".</span>" + escapeHtml(q.prompt);
        card.appendChild(prompt);

        var opts = document.createElement("div");
        opts.className = "quiz-opts";
        opts.setAttribute("role", "group");
        opts.setAttribute("aria-label", "Question " + (qi + 1));

        var explain = document.createElement("p");
        explain.className = "quiz-explain";
        explain.hidden = true;
        explain.textContent = q.explain;

        q.opts.forEach(function (o, oi) {
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "quiz-opt";
          btn.innerHTML = '<span class="opt-key">' + KEYS[oi] + "</span><span>" + escapeHtml(o.t) + "</span>";
          btn.addEventListener("click", function () {
            if (card.dataset.done) return;
            card.dataset.done = "1";
            answered++;
            if (o.correct) correctCount++;
            var children = opts.querySelectorAll(".quiz-opt");
            children.forEach(function (c, ci) {
              c.disabled = true;
              if (q.opts[ci].correct) c.classList.add("correct");
            });
            if (!o.correct) btn.classList.add("wrong");
            explain.hidden = false;
            updateScore();
          });
          opts.appendChild(btn);
        });

        card.appendChild(opts);
        card.appendChild(explain);
        root.appendChild(card);
      });
      updateScore();
    }

    function escapeHtml(s) {
      return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    if (resetBtn) resetBtn.addEventListener("click", build);
    build();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}());
