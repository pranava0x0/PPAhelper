/* quiz.js — checkpoint engine. Renders every [data-quiz] container from the
   banks in assets/js/quiz-banks.js with the shared card/option/explain UI,
   reports finished runs to PPA.progress (a near-perfect score marks the
   course stop done), and offers the next stop on a pass. */
(function () {
  "use strict";

  var KEYS = ["A", "B", "C", "D"];

  function renderBank(root, bankId, questions) {
    var answered, correctCount, scoreEl, resultEl;

    function questionCard(q, qi) {
      var card = document.createElement("div");
      card.className = "quiz-q";

      var prompt = document.createElement("p");
      prompt.className = "q-prompt";
      var num = document.createElement("span");
      num.className = "q-num";
      num.textContent = (qi + 1) + ".";
      prompt.appendChild(num);
      prompt.appendChild(document.createTextNode(" " + q.prompt));
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
        var key = document.createElement("span");
        key.className = "opt-key";
        key.textContent = KEYS[oi];
        var txt = document.createElement("span");
        txt.textContent = o.t;
        btn.appendChild(key);
        btn.appendChild(txt);
        btn.addEventListener("click", function () {
          if (card.dataset.done) return;
          card.dataset.done = "1";
          answered++;
          if (o.correct) correctCount++;
          opts.querySelectorAll(".quiz-opt").forEach(function (c, ci) {
            c.disabled = true;
            if (q.opts[ci].correct) c.classList.add("correct");
          });
          if (!o.correct) btn.classList.add("wrong");
          explain.hidden = false;
          updateScore();
          if (answered === questions.length) finish();
        });
        opts.appendChild(btn);
      });

      card.appendChild(opts);
      card.appendChild(explain);
      return card;
    }

    function updateScore() {
      scoreEl.textContent = correctCount + " / " + answered;
    }

    function finish() {
      var total = questions.length;
      var ppa = window.PPA;
      if (ppa && ppa.progress) ppa.progress.quizResult(bankId, correctCount, total);
      while (resultEl.firstChild) resultEl.removeChild(resultEl.firstChild);
      resultEl.hidden = false;

      var msg = document.createElement("span");
      var passed = correctCount >= total - 1;
      if (passed) {
        msg.textContent = "Checkpoint passed — " + correctCount + " / " + total + ".";
        resultEl.appendChild(msg);
        var view = ppa && ppa.quizViewFor ? ppa.quizViewFor(bankId) : null;
        var next = view && ppa.nextStopAfter ? ppa.nextStopAfter(view) : null;
        if (next) {
          var nb = document.createElement("button");
          nb.type = "button";
          nb.className = "btn-secondary";
          nb.textContent = "Next: " + next.label + " →";
          nb.addEventListener("click", function () { ppa.showView(next.view, true); });
          resultEl.appendChild(nb);
        }
        // test-out nudge: a perfect on-ramp run means Newcomer mode has nothing left to teach
        if (bankId === "learn" && correctCount === total && ppa && ppa.getLevel && ppa.getLevel() === "1") {
          var up = document.createElement("button");
          up.type = "button";
          up.className = "btn-secondary";
          up.textContent = "All correct — switch to Practitioner (skips the on-ramp, shows the deep index)";
          up.addEventListener("click", function () {
            ppa.setLevel("2");
            up.disabled = true;
            up.textContent = "Practitioner mode on";
          });
          resultEl.appendChild(up);
        }
      } else {
        msg.textContent = correctCount + " / " + total + " — review the sections above and retry.";
        resultEl.appendChild(msg);
      }
    }

    function build() {
      answered = 0;
      correctCount = 0;
      while (root.firstChild) root.removeChild(root.firstChild);
      questions.forEach(function (q, qi) { root.appendChild(questionCard(q, qi)); });

      var foot = document.createElement("p");
      foot.className = "quiz-foot";
      var scoreLabel = document.createElement("span");
      scoreLabel.setAttribute("aria-live", "polite");
      scoreLabel.appendChild(document.createTextNode("Score: "));
      scoreEl = document.createElement("span");
      scoreEl.className = "quiz-score";
      scoreLabel.appendChild(scoreEl);
      foot.appendChild(scoreLabel);
      var reset = document.createElement("button");
      reset.type = "button";
      reset.className = "btn-secondary quiz-reset";
      reset.textContent = "Reset";
      reset.addEventListener("click", build);
      foot.appendChild(reset);

      resultEl = document.createElement("div");
      resultEl.className = "quiz-result";
      resultEl.setAttribute("role", "status");
      resultEl.hidden = true;

      root.appendChild(resultEl);
      root.appendChild(foot);
      updateScore();
    }

    build();
  }

  function init() {
    var banks = window.PPA_QUIZ_BANKS || {};
    document.querySelectorAll("[data-quiz]").forEach(function (root) {
      var bankId = root.getAttribute("data-quiz");
      var questions = banks[bankId];
      if (questions && questions.length) renderBank(root, bankId, questions);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}());
