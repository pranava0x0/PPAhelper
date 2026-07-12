/* App glue: view switcher, theme toggle, glossary, inline term tooltips. */
(function () {
  "use strict";

  var VIEWS = ["foundations", "simulator", "examples", "ppadraft", "projfin", "datacenter", "perspectives", "glossary", "coverage"];

  /* The course spine: one canonical order, shared by the nav, the footers,
     the progress chip, and the practitioner index. Glossary + Coverage are
     reference views, not course stops. */
  var COURSE = [
    { view: "foundations",  label: "Learn",                teaser: "PPAs from scratch: the grid, the market, the settlement mechanic." },
    { view: "simulator",    label: "Settlement simulator", teaser: "Feel the cash flows: strike vs LMP, month by month." },
    { view: "examples",     label: "Drafting",             teaser: "How real contracts encode it: clauses, pricing structures, risk." },
    { view: "ppadraft",     label: "Draft PPA",            teaser: "Generate a full VPPA draft from terms you choose." },
    { view: "projfin",      label: "Project finance",      teaser: "Size the debt, see the equity return — the number the deal is really about." },
    { view: "datacenter",   label: "Data centers",         teaser: "The demand shock reshaping who signs PPAs and why." },
    { view: "perspectives", label: "Perspectives",         teaser: "What the people who do this all day disagree about." }
  ];

  /* Deep sections scattered across tabs — the expert fast lane (level 2 only).
     Targets are stable h2 ids in index.html; test/flow.test.js checks they exist. */
  var PRAC_INDEX = [
    { view: "foundations", target: "basis-risk",           label: "Basis risk" },
    { view: "foundations", target: "iso-rto-markets",      label: "ISO/RTO market-by-market" },
    { view: "foundations", target: "scope-2-chain",        label: "REC → Scope 2 chain" },
    { view: "foundations", target: "whos-who",             label: "Who's who behind a deal" },
    { view: "foundations", target: "bankable",             label: "What bankable means" },
    { view: "examples",    target: "pricing-structures",   label: "Pricing structures" },
    { view: "examples",    target: "risk-allocation",      label: "Risk allocation matrix" },
    { view: "examples",    target: "deal-lifecycle",       label: "Deal lifecycle" },
    { view: "examples",    target: "getting-to-signature", label: "Getting to signature" },
    { view: "examples",    target: "annotated-examples",   label: "Annotated real PPAs (SEC-filed)" },
    { view: "projfin",     target: "pf-workbench",         label: "Debt-sizing workbench" },
    { view: "projfin",     target: "tax-equity-flip",      label: "Tax equity & the flip" },
    { view: "datacenter",  target: "recent-deals",         label: "Hyperscaler deals table" }
  ];

  /* Build a stroke-icon SVG from a list of {tag, attrs} via safe DOM methods
     (no innerHTML). Shared by the theme toggle and the search button. */
  var SVG_NS = "http://www.w3.org/2000/svg";
  function makeIcon(paths, size) {
    var svg = document.createElementNS(SVG_NS, "svg");
    var base = { width: size || 16, height: size || 16, viewBox: "0 0 24 24", fill: "none",
      stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" };
    Object.keys(base).forEach(function (k) { svg.setAttribute(k, base[k]); });
    svg.setAttribute("aria-hidden", "true");
    paths.forEach(function (p) {
      var el = document.createElementNS(SVG_NS, p.tag);
      Object.keys(p.attrs).forEach(function (k) { el.setAttribute(k, p.attrs[k]); });
      svg.appendChild(el);
    });
    return svg;
  }
  var ICON_MOON = [{ tag: "path", attrs: { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" } }];
  var ICON_SUN = [{ tag: "circle", attrs: { cx: 12, cy: 12, r: 4 } },
    { tag: "path", attrs: { d: "M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" } }];
  var ICON_SEARCH = [{ tag: "circle", attrs: { cx: 11, cy: 11, r: 7 } }, { tag: "path", attrs: { d: "M21 21l-4.3-4.3" } }];

  /* ---------- view switcher ---------- */
  function showView(name, moveFocus) {
    if (VIEWS.indexOf(name) === -1) name = "foundations";
    VIEWS.forEach(function (v) {
      var panel = document.getElementById("view-" + v);
      var tab = document.getElementById("tab-" + v);
      if (panel) panel.hidden = (v !== name);
      if (tab) tab.setAttribute("aria-selected", v === name ? "true" : "false");
    });
    if (window.location.hash !== "#" + name) {
      history.replaceState(null, "", "#" + name);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
    if (moveFocus) {
      var panel = document.getElementById("view-" + name);
      var h1 = panel && panel.querySelector("h1");
      if (h1) { h1.setAttribute("tabindex", "-1"); h1.focus(); }
    }
    updateSpy(name);
  }

  function wireNav() {
    document.querySelectorAll("[data-view]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        showView(el.dataset.view, true);
      });
    });
    window.addEventListener("hashchange", function () {
      showView((window.location.hash || "#foundations").slice(1), true);
    });
    showView((window.location.hash || "#foundations").slice(1));
  }

  /* ---------- theme ---------- */
  function wireTheme() {
    var btn = document.getElementById("theme-toggle");
    var root = document.documentElement;
    var saved = null;
    try { saved = localStorage.getItem("ppa-theme"); } catch (e) {}
    if (saved) root.setAttribute("data-theme", saved);
    else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      root.setAttribute("data-theme", "dark");
    }
    function sync() {
      var dark = root.getAttribute("data-theme") === "dark";
      btn.replaceChildren(makeIcon(dark ? ICON_SUN : ICON_MOON)); // show the mode you'd switch TO
      btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      btn.title = dark ? "Light mode" : "Dark mode";
    }
    sync();
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("ppa-theme", next); } catch (e) {}
      sync();
      document.dispatchEvent(new CustomEvent("ppa:rerender"));
    });
  }

  /* ---------- glossary ---------- */
  var glossary = [];
  var activeCat = "All";
  var searchTerm = "";

  function renderGlossary() {
    var list = document.getElementById("glossary-list");
    var count = document.getElementById("glossary-count");
    if (!list) return;
    var q = searchTerm.toLowerCase();
    var rows = glossary.filter(function (t) {
      var catOk = activeCat === "All" || t.category === activeCat;
      var qOk = !q || (t.term + " " + t.def).toLowerCase().indexOf(q) !== -1;
      return catOk && qOk;
    });
    list.innerHTML = "";
    rows.forEach(function (t) {
      var dl = document.createElement("dl");
      dl.className = "term";
      var src = t.url
        ? '<dd class="src" style="border:none;margin-top:8px"><a href="' + t.url + '">' + t.source + '</a></dd>'
        : "";
      dl.innerHTML =
        '<dt>' + t.term + ' <span class="term-cat">' + t.category + '</span></dt>' +
        '<dd>' + t.def + '</dd>' + src;
      list.appendChild(dl);
    });
    if (count) count.textContent = rows.length + (rows.length === 1 ? " term" : " terms") +
      (activeCat !== "All" || q ? " shown" : " total");
    if (rows.length === 0) {
      list.innerHTML = '<p class="src" style="border:none">No terms match. Clear the filter or search.</p>';
    }
  }

  function buildCatFilter() {
    var wrap = document.getElementById("cat-filter");
    if (!wrap) return;
    var cats = ["All"].concat(glossary.map(function (t) { return t.category; })
      .filter(function (v, i, a) { return a.indexOf(v) === i; }));
    wrap.innerHTML = "";
    cats.forEach(function (c) {
      var b = document.createElement("button");
      b.className = "cat-btn";
      b.textContent = c;
      b.setAttribute("aria-pressed", c === activeCat ? "true" : "false");
      b.addEventListener("click", function () {
        activeCat = c;
        wrap.querySelectorAll(".cat-btn").forEach(function (x) {
          x.setAttribute("aria-pressed", x === b ? "true" : "false");
        });
        renderGlossary();
      });
      wrap.appendChild(b);
    });
  }

  function wireGlossarySearch() {
    var input = document.getElementById("glossary-search");
    if (!input) return;
    input.addEventListener("input", function () { searchTerm = input.value; renderGlossary(); });
  }

  /* ---------- inline term explainer card (hover / focus / tap) ---------- */
  var termMap = {};
  var card = null;
  var cardFor = null;      // element the card is currently shown for
  var hideTimer = null;
  var lastPointerType = "mouse";

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function buildCard() {
    card = document.createElement("div");
    card.className = "term-card";
    card.setAttribute("role", "tooltip");
    card.hidden = true;
    card.addEventListener("mouseenter", function () { clearTimeout(hideTimer); });
    card.addEventListener("mouseleave", scheduleHide);
    document.body.appendChild(card);
    window.addEventListener("scroll", hideCard, { passive: true });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") hideCard(); });
    document.addEventListener("pointerdown", function (e) {
      lastPointerType = e.pointerType || "mouse";
      if (card.hidden) return;
      if (!card.contains(e.target) && !(e.target.closest && e.target.closest(".gterm"))) hideCard();
    });
  }

  function showCardFor(el) {
    var t = termMap[el.dataset.term];
    if (!t) return;
    clearTimeout(hideTimer);
    cardFor = el;
    var src = t.url
      ? '<a href="' + esc(t.url) + '" target="_blank" rel="noopener">' + esc(t.source) + "</a>"
      : esc(t.source || "");
    card.innerHTML =
      '<p class="term-card-name">' + esc(t.term) + ' <span class="term-cat">' + esc(t.category) + "</span></p>" +
      '<p class="term-card-def">' + esc(t.def) + "</p>" +
      (src ? '<p class="term-card-src">Source: ' + src + "</p>" : "") +
      '<p class="term-card-hint">Click the term to open it in the glossary.</p>';
    // position: below the term, flipped above if it would overflow the viewport
    var r = el.getBoundingClientRect();
    card.style.visibility = "hidden";
    card.hidden = false;
    var x = Math.max(8, Math.min(r.left, window.innerWidth - card.offsetWidth - 8));
    var y = r.bottom + 8;
    if (y + card.offsetHeight > window.innerHeight - 8) y = r.top - card.offsetHeight - 8;
    if (y < 8) y = 8;
    card.style.left = x + "px";
    card.style.top = y + "px";
    card.style.visibility = "";
  }

  function hideCard() {
    if (card) card.hidden = true;
    cardFor = null;
  }

  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideCard, 200);
  }

  function wireTooltips() {
    buildCard();
    // delegated hover/focus so late-rendered .gterm elements (content.js) work too
    document.addEventListener("mouseover", function (e) {
      var g = e.target.closest && e.target.closest(".gterm");
      if (g && termMap[g.dataset.term]) showCardFor(g);
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest && e.target.closest(".gterm")) scheduleHide();
    });
    document.addEventListener("focusin", function (e) {
      var g = e.target.closest && e.target.closest(".gterm");
      if (g && termMap[g.dataset.term]) showCardFor(g);
      else if (card && !card.contains(e.target)) hideCard();
    });
    document.querySelectorAll(".gterm").forEach(function (el) {
      var key = el.dataset.term;
      var t = termMap[key];
      if (!t) return;
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.setAttribute("aria-label", key + ": " + t.def);
      el.addEventListener("click", function () {
        // touch has no hover: first tap shows the card, tapping again opens the glossary
        if (lastPointerType === "touch" && cardFor !== el) { showCardFor(el); return; }
        hideCard();
        showGlossaryTerm(key);
      });
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.click(); }
      });
    });
  }

  /* ---------- acronym auto-tagging ----------
     Glossary terms carry their acronym in parens ("Locational Marginal Price (LMP)").
     Tag the first bare occurrence of each acronym per paragraph/list item so every
     acronym in prose gets the hover explainer, without hand-tagging or wallpapering. */
  function autoTagAcronyms() {
    var acr = {};
    glossary.forEach(function (t) {
      var m = t.term.match(/\(([A-Z][A-Za-z&-]{1,9})\)/);
      if (m && !acr[m[1]]) acr[m[1]] = t.term;
    });
    if (termMap["ISO / RTO"] || glossary.some(function (t) { return t.term === "ISO / RTO"; })) {
      acr.ISO = acr.RTO = "ISO / RTO";
    }
    var names = Object.keys(acr).sort(function (a, b) { return b.length - a.length; });
    if (!names.length) return;
    var pattern = new RegExp("\\b(" + names.map(function (n) {
      return n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }).join("|") + ")s?\\b", "g");

    document.querySelectorAll("main p, main li, main td, main dd").forEach(function (el) {
      if (el.closest("#view-glossary, #view-ppadraft, a, button, .gterm, code, pre, .term-card")) return;
      var done = {};
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
        acceptNode: function (n) {
          return n.parentElement && n.parentElement.closest("a, button, .gterm, code, pre, summary")
            ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        }
      });
      var nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function (node) {
        var text = node.nodeValue;
        var m, last = 0, frag = null;
        pattern.lastIndex = 0;
        while ((m = pattern.exec(text))) {
          var name = m[1];
          if (done[name]) continue;
          done[name] = true;
          // "(PPA)" right after its expansion is the definition site — leave it alone
          if (text.charAt(m.index - 1) === "(") continue;
          if (!frag) frag = document.createDocumentFragment();
          frag.appendChild(document.createTextNode(text.slice(last, m.index)));
          var span = document.createElement("span");
          span.className = "gterm gterm-auto";
          span.dataset.term = acr[name];
          span.textContent = m[0];
          span.setAttribute("tabindex", "0");
          span.setAttribute("role", "button");
          span.setAttribute("aria-label", acr[name] + ": " + (termMap[acr[name]] ? termMap[acr[name]].def : ""));
          frag.appendChild(span);
          last = m.index + m[0].length;
        }
        if (frag) {
          frag.appendChild(document.createTextNode(text.slice(last)));
          node.parentNode.replaceChild(frag, node);
        }
      });
    });
  }

  function loadGlossary() {
    fetch("data/glossary.json")
      .then(function (r) { if (!r.ok) throw new Error("glossary " + r.status); return r.json(); })
      .then(function (data) {
        glossary = (data && data.terms) || [];
        glossary.sort(function (a, b) { return a.term.localeCompare(b.term); });
        glossary.forEach(function (t) { termMap[t.term] = t; });
        buildCatFilter();
        renderGlossary();
        wireGlossarySearch();
        autoTagAcronyms();
        wireTooltips();
      })
      .catch(function (err) {
        var list = document.getElementById("glossary-list");
        if (list) list.innerHTML = '<p class="src" style="border:none">Could not load the glossary (' +
          err.message + '). If you opened this file directly, serve it over http (see README).</p>';
        console.error(err);
      });
  }

  /* ---------- glossary deep-link (inline terms + clause chips) ---------- */
  function showGlossaryTerm(key) {
    showView("glossary");
    searchTerm = key; activeCat = "All";
    buildCatFilter(); renderGlossary();
    var input = document.getElementById("glossary-search");
    if (input) { input.value = key; input.focus(); }
  }

  /* ---------- experience-level filter (newcomer ↔ practitioner) ----------
     Two genuinely different modes: data-level="N" content is progressive
     (shown at level >= N), data-level-only="N" content is exclusive
     (the from-scratch on-ramp hides once you switch to Practitioner). */
  var currentLevel = "1";
  function applyLevel(level) {
    currentLevel = level;
    try { localStorage.setItem("ppa-level", level); } catch (e) {}
    document.querySelectorAll("[data-level]").forEach(function (el) {
      var lv = parseInt(el.getAttribute("data-level"), 10);
      el.classList.toggle("lvl-hidden", !(lv && lv <= parseInt(level, 10)));
    });
    document.querySelectorAll("[data-level-only]").forEach(function (el) {
      el.classList.toggle("lvl-hidden", el.getAttribute("data-level-only") !== level);
    });
    updateLevelCounts(level);
    syncTocs();
  }
  function wireLevel() {
    var wrap = document.getElementById("level-filter");
    if (!wrap) return;
    var saved = null;
    try { saved = localStorage.getItem("ppa-level"); } catch (e) {}
    if (saved === "all") saved = "2"; // migrate: the removed All mode was Practitioner-equivalent
    var level = saved === "1" || saved === "2" ? saved : "1";
    applyLevel(level);
    wrap.querySelectorAll("button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.setlevel === level ? "true" : "false");
    });
    wrap.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () {
        wrap.querySelectorAll("button").forEach(function (x) {
          x.setAttribute("aria-pressed", x === b ? "true" : "false");
        });
        applyLevel(b.dataset.setlevel);
        document.dispatchEvent(new CustomEvent("ppa:level"));
      });
    });
  }

  /* Newcomer stubs: every hidden practitioner section (data-level="2" wrapping an
     h2) leaves a slim in-place row so newcomers can see depth exists and unlock it.
     Stubs carry data-level-only="1", so applyLevel swaps stub ↔ section for free. */
  function buildLevelStubs() {
    document.querySelectorAll('[data-level="2"]').forEach(function (sec) {
      var h2 = sec.querySelector("h2");
      if (!h2 || sec.previousElementSibling && sec.previousElementSibling.classList.contains("level-stub")) return;
      var clone = h2.cloneNode(true);
      clone.querySelectorAll(".pill").forEach(function (p) { p.remove(); });
      var title = clone.textContent.replace(/\s+/g, " ").trim();
      if (!title) return;

      var stub = document.createElement("button");
      stub.type = "button";
      stub.className = "level-stub";
      stub.setAttribute("data-level-only", "1");
      var eyebrow = document.createElement("span");
      eyebrow.className = "level-stub-eyebrow";
      eyebrow.textContent = "Practitioner section";
      var label = document.createElement("span");
      label.className = "level-stub-title";
      label.textContent = title;
      var cta = document.createElement("span");
      cta.className = "level-stub-cta";
      cta.textContent = "Switch to Practitioner to read →";
      stub.appendChild(eyebrow);
      stub.appendChild(label);
      stub.appendChild(cta);
      stub.addEventListener("click", function () {
        setLevelViaFilter("2");
        var target = h2.id ? h2 : sec;
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            var smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
          });
        });
      });
      sec.parentNode.insertBefore(stub, sec);
    });
  }

  /* Partial-state count lines: where a list is level-filtered, show "N of M" at
     Newcomer so the hidden depth is honest (CLAUDE.md empty≠broken). Each host is
     a [data-level-count] element naming the container whose [data-level] children
     it summarizes; the line clears at Practitioner (everything shown). */
  function updateLevelCounts(level) {
    document.querySelectorAll("[data-level-count]").forEach(function (host) {
      var sel = host.getAttribute("data-level-count");
      var scope = sel ? document.querySelector(sel) : null;
      if (!scope) { host.textContent = ""; return; }
      var noun = host.getAttribute("data-count-noun") || "items";
      var items = scope.querySelectorAll("[data-level]");
      var total = items.length;
      var shown = 0;
      items.forEach(function (it) {
        var lv = parseInt(it.getAttribute("data-level"), 10) || 1;
        if (lv <= parseInt(level, 10)) shown++;
      });
      if (total > 0 && shown < total) {
        host.textContent = "Showing " + shown + " of " + total + " " + noun + " — the rest are Practitioner.";
        host.hidden = false;
      } else {
        host.textContent = "";
        host.hidden = true;
      }
    });
  }

  /* ---------- course progress (localStorage) ----------
     { done: { viewName: true }, quiz: { bankId: { best, total } } }
     quiz.js reports checkpoint results via PPA.progress.quizResult; a
     near-perfect score (>= total - 1) auto-marks that course stop done. */
  var PROGRESS_KEY = "ppa-progress";
  var QUIZ_TO_VIEW = { learn: "foundations", simulator: "simulator", drafting: "examples", ppadraft: "ppadraft", projfin: "projfin", datacenter: "datacenter" };

  function loadProgress() {
    try {
      var p = JSON.parse(localStorage.getItem(PROGRESS_KEY));
      if (p && typeof p === "object") return { done: p.done || {}, quiz: p.quiz || {} };
    } catch (e) {}
    return { done: {}, quiz: {} };
  }
  var progressState = loadProgress();
  function saveProgress() {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressState)); } catch (e) {}
  }

  var progress = {
    isDone: function (view) { return !!progressState.done[view]; },
    markDone: function (view, on) {
      if (on) progressState.done[view] = true;
      else delete progressState.done[view];
      saveProgress();
      refreshProgressUI();
    },
    reset: function () {
      progressState = { done: {}, quiz: {} };
      saveProgress();
      refreshProgressUI();
    },
    quizResult: function (bankId, score, total) {
      var prev = progressState.quiz[bankId];
      if (!prev || score > prev.best) progressState.quiz[bankId] = { best: score, total: total };
      var view = QUIZ_TO_VIEW[bankId];
      if (view && total > 0 && score >= total - 1) progressState.done[view] = true;
      saveProgress();
      refreshProgressUI();
    },
    firstUnfinished: function () {
      for (var i = 0; i < COURSE.length; i++) {
        if (!progressState.done[COURSE[i].view]) return COURSE[i];
      }
      return COURSE[0];
    },
    doneCount: function () {
      return COURSE.filter(function (s) { return progressState.done[s.view]; }).length;
    }
  };

  /* ---------- course chrome: nav ticks + numbers, progress chip ---------- */
  function decorateNav() {
    COURSE.forEach(function (stop, i) {
      var tab = document.getElementById("tab-" + stop.view);
      if (!tab) return;
      var num = document.createElement("span");
      num.className = "course-num";
      num.setAttribute("aria-hidden", "true");
      num.textContent = String(i + 1);
      tab.insertBefore(num, tab.firstChild);
      var tick = document.createElement("span");
      tick.className = "tick";
      tick.setAttribute("aria-hidden", "true");
      tick.textContent = "✓";
      tab.appendChild(tick);
      var sr = document.createElement("span");
      sr.className = "visually-hidden tick-sr";
      tab.appendChild(sr);
    });
  }

  function buildProgressChip() {
    var controls = document.querySelector(".masthead-controls");
    if (!controls) return;
    var b = document.createElement("button");
    b.type = "button";
    b.id = "progress-chip";
    b.className = "progress-chip";
    b.hidden = true;
    b.addEventListener("click", function () { showView(progress.firstUnfinished().view, true); });
    controls.appendChild(b);
  }

  /* Floating back-to-top: appears after scrolling past ~1.2 screens, so a long
     stop can be exited without scrubbing all the way up by hand. */
  function buildBackToTop() {
    var b = document.createElement("button");
    b.type = "button";
    b.id = "to-top";
    b.className = "to-top";
    b.setAttribute("aria-label", "Back to top");
    b.appendChild(document.createTextNode("↑ Top"));
    b.addEventListener("click", function () {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      var h1 = document.querySelector(".view:not([hidden]) h1");
      if (h1) { h1.setAttribute("tabindex", "-1"); h1.focus({ preventScroll: true }); }
    });
    document.body.appendChild(b);
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        b.classList.toggle("show", window.scrollY > 900);
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- course footers: prev / mark done / next on every stop ---------- */
  function buildCourseFooters() {
    COURSE.forEach(function (stop, i) {
      var view = document.getElementById("view-" + stop.view);
      if (!view) return;
      var foot = document.createElement("div");
      foot.className = "course-footer";

      var prev = document.createElement("div");
      prev.className = "cf-prev";
      if (i > 0) {
        var pb = document.createElement("button");
        pb.type = "button";
        pb.className = "cf-prev-btn";
        pb.setAttribute("data-view", COURSE[i - 1].view);
        var pArrow = document.createElement("span");
        pArrow.setAttribute("aria-hidden", "true");
        pArrow.textContent = "←";
        pb.appendChild(pArrow);
        pb.appendChild(document.createTextNode(" Prev · " + COURSE[i - 1].label));
        prev.appendChild(pb);
      }

      var mid = document.createElement("div");
      mid.className = "cf-mid";
      var mark = document.createElement("button");
      mark.type = "button";
      mark.className = "cf-mark";
      mark.setAttribute("data-markview", stop.view);
      mark.addEventListener("click", function () { progress.markDone(stop.view, !progress.isDone(stop.view)); });
      mid.appendChild(mark);
      var reset = document.createElement("button");
      reset.type = "button";
      reset.className = "cf-reset";
      reset.textContent = "reset course progress";
      reset.hidden = true;
      reset.addEventListener("click", function () { progress.reset(); });
      mid.appendChild(reset);

      var next = document.createElement("div");
      next.className = "cf-next";
      var nb = document.createElement("button");
      nb.type = "button";
      nb.className = "cf-next-btn";
      var nLabel = document.createElement("span");
      nLabel.className = "cf-next-label";
      var nTeaser = document.createElement("span");
      nTeaser.className = "cf-next-teaser";
      if (i < COURSE.length - 1) {
        nb.setAttribute("data-view", COURSE[i + 1].view);
        nLabel.textContent = "Next: " + COURSE[i + 1].label + " ";
        nTeaser.textContent = COURSE[i + 1].teaser;
      } else {
        nb.setAttribute("data-view", "glossary");
        nLabel.textContent = "End of the course ";
        nTeaser.textContent = "Browse the Glossary or check Coverage & sources.";
      }
      var nArrow = document.createElement("span");
      nArrow.setAttribute("aria-hidden", "true");
      nArrow.textContent = "→";
      nLabel.appendChild(nArrow);
      nb.appendChild(nLabel);
      nb.appendChild(nTeaser);
      next.appendChild(nb);

      foot.appendChild(prev);
      foot.appendChild(mid);
      foot.appendChild(next);
      view.appendChild(foot);
    });

    // reference views get a slim resume-the-course footer instead
    ["glossary", "coverage"].forEach(function (name) {
      var view = document.getElementById("view-" + name);
      if (!view) return;
      var foot = document.createElement("div");
      foot.className = "ref-footer";
      var label = document.createElement("span");
      label.className = "eyebrow";
      label.textContent = "Reference";
      var rb = document.createElement("button");
      rb.type = "button";
      rb.className = "ref-resume";
      rb.setAttribute("data-view", COURSE[0].view);
      foot.appendChild(label);
      foot.appendChild(rb);
      view.appendChild(foot);
    });
  }

  function refreshProgressUI() {
    var count = progress.doneCount();
    COURSE.forEach(function (stop, i) {
      var done = progress.isDone(stop.view);
      var tab = document.getElementById("tab-" + stop.view);
      if (tab) {
        tab.classList.toggle("done", done);
        var sr = tab.querySelector(".tick-sr");
        if (sr) sr.textContent = done ? " (done)" : "";
      }
      var mark = document.querySelector('.cf-mark[data-markview="' + stop.view + '"]');
      if (mark) {
        mark.setAttribute("aria-pressed", done ? "true" : "false");
        mark.textContent = done ? "Done ✓ · mark unread" : "Mark stop " + (i + 1) + " of " + COURSE.length + " done";
      }
    });
    document.querySelectorAll(".cf-reset").forEach(function (b) { b.hidden = count === 0; });
    var chip = document.getElementById("progress-chip");
    if (chip) {
      chip.hidden = count === 0;
      chip.textContent = "Resume →";
      chip.setAttribute("aria-label", "Resume the course — " + count + " of " + COURSE.length + " stops done");
      chip.title = count + " of " + COURSE.length + " course stops done — click to resume the next one";
    }
    var next = progress.firstUnfinished();
    var stopNo = COURSE.indexOf(next) + 1;
    document.querySelectorAll(".ref-resume").forEach(function (b) {
      b.setAttribute("data-view", next.view);
      b.textContent = "Resume the course at stop " + stopNo + ": " + next.label + " →";
    });
  }

  /* ---------- first-visit path chooser ---------- */
  function scrollToId(id) {
    requestAnimationFrame(function () {
      var t = document.getElementById(id);
      if (!t) return;
      var smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      t.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    });
  }

  function setLevelViaFilter(level) {
    var b = document.querySelector('#level-filter button[data-setlevel="' + level + '"]');
    if (b) b.click(); // reuse the filter's own click path so aria state stays in sync
  }

  function wireChooser() {
    var box = document.getElementById("path-chooser");
    if (!box) return;
    var seen = null;
    try { seen = localStorage.getItem("ppa-chooser-done"); } catch (e) {}
    if (seen || progress.doneCount() > 0) return;
    box.hidden = false;
    function dismiss() {
      box.hidden = true;
      try { localStorage.setItem("ppa-chooser-done", "1"); } catch (e) {}
    }
    document.getElementById("chooser-new").addEventListener("click", function () {
      setLevelViaFilter("1"); dismiss(); scrollToId("stage-1");
    });
    document.getElementById("chooser-pro").addEventListener("click", function () {
      setLevelViaFilter("2"); dismiss(); scrollToId("prac-index");
    });
    box.querySelector(".chooser-dismiss").addEventListener("click", dismiss);
  }

  /* ---------- practitioner index (expert fast lane, level 2 only) ---------- */
  function buildPracIndex() {
    var box = document.getElementById("prac-index");
    if (!box) return;
    var eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = "Practitioner index · jump straight to the deep sections";
    box.appendChild(eyebrow);
    var groups = {};
    var wrap = document.createElement("div");
    wrap.className = "prac-groups";
    PRAC_INDEX.forEach(function (item) {
      if (!groups[item.view]) {
        var g = document.createElement("div");
        g.className = "prac-group";
        var lab = document.createElement("span");
        lab.className = "prac-group-label";
        var stop = COURSE.filter(function (s) { return s.view === item.view; })[0];
        lab.textContent = stop ? stop.label : item.view;
        g.appendChild(lab);
        var chips = document.createElement("div");
        chips.className = "chips prac-chips";
        g.appendChild(chips);
        groups[item.view] = chips;
        wrap.appendChild(g);
      }
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip prac-chip";
      chip.textContent = item.label;
      chip.addEventListener("click", function () {
        showView(item.view);
        scrollToId(item.target); // next frame, after the view unhides
      });
      groups[item.view].appendChild(chip);
    });
    box.appendChild(wrap);
  }

  /* ---------- TOC scroll-spy (one observer, re-scoped per view) ---------- */
  var spy = null;
  function updateSpy(name) {
    if (!("IntersectionObserver" in window)) return;
    if (spy) { spy.disconnect(); spy = null; }
    var view = document.getElementById("view-" + name);
    if (!view || !view.querySelector(".toc")) return;
    var links = {};
    view.querySelectorAll(".toc [data-scroll-to]").forEach(function (b) {
      links[b.getAttribute("data-scroll-to")] = b;
    });
    spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        view.querySelectorAll(".toc-link.active").forEach(function (b) { b.classList.remove("active"); });
        if (links[en.target.id]) links[en.target.id].classList.add("active");
      });
    }, { rootMargin: "-130px 0px -60% 0px", threshold: 0 });
    view.querySelectorAll("h2[id]").forEach(function (h) { spy.observe(h); });
  }

  /* ---------- quick-nav palette (/ or Ctrl-K) ----------
     Built on first open; the index is rebuilt per open so it respects the
     current level filter. Course tabs, every visible h2, every glossary term. */
  var pal = null;

  function paletteCtx(name) {
    var stop = COURSE.filter(function (s) { return s.view === name; })[0];
    if (stop) return stop.label;
    return name === "glossary" ? "Glossary" : name === "coverage" ? "Coverage & sources" : name;
  }

  function buildPaletteIndex() {
    var items = [];
    COURSE.forEach(function (s, i) {
      items.push({ label: s.label, ctx: "Stop " + (i + 1) + " of " + COURSE.length, view: s.view, id: null });
    });
    items.push({ label: "Glossary", ctx: "Reference", view: "glossary", id: null });
    items.push({ label: "Coverage & sources", ctx: "Reference", view: "coverage", id: null });
    VIEWS.forEach(function (name) {
      var view = document.getElementById("view-" + name);
      if (!view) return;
      view.querySelectorAll("h2").forEach(function (h, hi) {
        if (h.closest(".lvl-hidden")) return;
        if (!h.id) h.id = name + "-x" + (hi + 1);
        var clean = h.cloneNode(true);
        clean.querySelectorAll(".pill, .stage-n").forEach(function (x) { x.remove(); });
        items.push({ label: clean.textContent.replace(/\s+/g, " ").trim(), ctx: paletteCtx(name), view: name, id: h.id });
      });
    });
    glossary.forEach(function (t) {
      items.push({ label: t.term, ctx: "Glossary", term: t.term });
    });
    return items;
  }

  function rankPalette(items, q) {
    q = (q || "").trim().toLowerCase();
    if (!q) return items.slice(0, 12);
    var scored = [];
    items.forEach(function (it) {
      var l = it.label.toLowerCase();
      var s;
      if (l.indexOf(q) === 0) s = 0;
      else if (l.indexOf(" " + q) !== -1 || l.indexOf("(" + q) !== -1) s = 1;
      else if (l.indexOf(q) !== -1) s = 2;
      else return;
      scored.push({ s: s, it: it });
    });
    scored.sort(function (a, b) { return a.s - b.s || a.it.label.length - b.it.label.length; });
    return scored.slice(0, 12).map(function (x) { return x.it; });
  }

  function paletteGo(item) {
    closePalette();
    if (item.term) { showGlossaryTerm(item.term); return; }
    showView(item.view, !item.id);
    if (item.id) scrollToId(item.id);
  }

  function buildPaletteDom() {
    var backdrop = document.createElement("div");
    backdrop.className = "palette-backdrop";
    backdrop.hidden = true;
    var box = document.createElement("div");
    box.className = "palette";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Search sections and glossary");
    var input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Jump to a section or glossary term…";
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-expanded", "true");
    input.setAttribute("aria-controls", "palette-list");
    var list = document.createElement("ol");
    list.className = "palette-list";
    list.id = "palette-list";
    list.setAttribute("role", "listbox");
    box.appendChild(input);
    box.appendChild(list);
    backdrop.appendChild(box);
    document.body.appendChild(backdrop);

    backdrop.addEventListener("pointerdown", function (e) {
      if (e.target === backdrop) closePalette();
    });
    backdrop.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); closePalette(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); movePalette(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); movePalette(-1); }
      else if (e.key === "Enter") {
        e.preventDefault();
        var row = pal.rows[pal.active];
        if (row) paletteGo(row.item);
      }
    });
    input.addEventListener("input", function () { renderPalette(input.value); });

    pal = { backdrop: backdrop, input: input, list: list, rows: [], active: 0, opener: null, items: [] };
  }

  function renderPalette(q) {
    var ranked = rankPalette(pal.items, q);
    pal.rows = [];
    while (pal.list.firstChild) pal.list.removeChild(pal.list.firstChild);
    if (!ranked.length) {
      var empty = document.createElement("li");
      empty.className = "palette-empty";
      empty.textContent = "No matches.";
      pal.list.appendChild(empty);
      return;
    }
    ranked.forEach(function (item, i) {
      var li = document.createElement("li");
      li.setAttribute("role", "option");
      li.id = "pal-opt-" + i;
      var lab = document.createElement("span");
      lab.className = "pal-label";
      lab.textContent = item.label;
      var ctx = document.createElement("span");
      ctx.className = "pal-ctx";
      ctx.textContent = item.ctx || "";
      li.appendChild(lab);
      li.appendChild(ctx);
      li.addEventListener("pointerdown", function (e) { e.preventDefault(); paletteGo(item); });
      li.addEventListener("mouseenter", function () { setPaletteActive(i); });
      pal.list.appendChild(li);
      pal.rows.push({ el: li, item: item });
    });
    setPaletteActive(0);
  }

  function setPaletteActive(i) {
    pal.active = i;
    pal.rows.forEach(function (r, ri) {
      r.el.setAttribute("aria-selected", ri === i ? "true" : "false");
    });
    pal.input.setAttribute("aria-activedescendant", "pal-opt-" + i);
    var el = pal.rows[i] && pal.rows[i].el;
    if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
  }

  function movePalette(d) {
    if (!pal.rows.length) return;
    setPaletteActive((pal.active + d + pal.rows.length) % pal.rows.length);
  }

  function openPalette() {
    if (!pal) buildPaletteDom();
    pal.opener = document.activeElement;
    pal.items = buildPaletteIndex();
    pal.backdrop.hidden = false;
    pal.input.value = "";
    renderPalette("");
    pal.input.focus();
  }

  function closePalette() {
    if (!pal || pal.backdrop.hidden) return;
    pal.backdrop.hidden = true;
    if (pal.opener && pal.opener.focus) pal.opener.focus();
  }

  function isEditable(el) {
    if (!el) return false;
    var tag = el.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
  }

  function buildSearchButton() {
    var controls = document.querySelector(".masthead-controls");
    if (!controls) return;
    var b = document.createElement("button");
    b.type = "button";
    b.id = "search-btn";
    b.className = "search-btn";
    b.setAttribute("aria-label", "Search sections and glossary");
    b.title = "Search sections & glossary — press / or Ctrl-K";
    b.appendChild(makeIcon(ICON_SEARCH, 15));
    var lbl = document.createElement("span");
    lbl.className = "sb-label";
    lbl.textContent = "Search";
    var key = document.createElement("kbd");
    key.className = "sb-key";
    key.textContent = "/";
    b.appendChild(lbl);
    b.appendChild(key);
    b.addEventListener("click", openPalette);
    controls.appendChild(b);

    document.addEventListener("keydown", function (e) {
      if (pal && !pal.backdrop.hidden) return; // the open palette handles its own keys
      if ((e.ctrlKey || e.metaKey) && String(e.key).toLowerCase() === "k") {
        e.preventDefault();
        openPalette();
      } else if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey && !isEditable(e.target)) {
        e.preventDefault();
        openPalette();
      }
    });
  }

  // exposed for the content renderers (assets/js/content.js) and quiz.js
  window.PPA = {
    showView: showView,
    showGlossaryTerm: showGlossaryTerm,
    reapplyLevel: function () { applyLevel(currentLevel); },
    getLevel: function () { return currentLevel; },
    setLevel: setLevelViaFilter,
    quizViewFor: function (bankId) { return QUIZ_TO_VIEW[bankId] || null; },
    nextStopAfter: function (view) {
      for (var i = 0; i < COURSE.length - 1; i++) {
        if (COURSE[i].view === view) return COURSE[i + 1];
      }
      return null;
    },
    progress: progress
  };

  /* ---------- per-view "On this page" contents ----------
     Long tabs (4+ h2 sections) get a numbered jump bar under the lede so
     readers can navigate without scrolling. Entries hide with their section
     when the level filter hides it (syncTocs, called from applyLevel). */
  function buildTocs() {
    VIEWS.forEach(function (name) {
      var view = document.getElementById("view-" + name);
      if (!view) return;
      var h2s = Array.prototype.slice.call(view.querySelectorAll("h2"));
      if (h2s.length < 4) return;
      var nav = document.createElement("nav");
      nav.className = "toc";
      nav.setAttribute("aria-label", "On this page");
      var ol = document.createElement("ol");
      h2s.forEach(function (h, i) {
        if (!h.id) h.id = name + "-s" + (i + 1);
        var clean = h.cloneNode(true);
        clean.querySelectorAll(".pill, .stage-n").forEach(function (x) { x.remove(); });
        var li = document.createElement("li");
        var b = document.createElement("button");
        b.type = "button";
        b.className = "toc-link";
        b.setAttribute("data-scroll-to", h.id);
        b.textContent = clean.textContent.replace(/\s+/g, " ").trim();
        li.appendChild(b);
        ol.appendChild(li);
      });
      nav.appendChild(ol);
      // on Learn the TOC sits below the chooser + practitioner index, per the course flow
      var anchor = view.querySelector("#prac-index") || view.querySelector(".lede") || view.querySelector("h1");
      anchor.parentNode.insertBefore(nav, anchor.nextSibling);
    });
  }

  function syncTocs() {
    document.querySelectorAll(".toc [data-scroll-to]").forEach(function (b) {
      var t = document.getElementById(b.getAttribute("data-scroll-to"));
      var off = !t || t.closest(".lvl-hidden");
      b.parentElement.style.display = off ? "none" : "";
    });
  }

  /* ---------- in-page scroll links (TOC + stage jump links) ---------- */
  function wireScrollLinks() {
    document.querySelectorAll("[data-scroll-to]").forEach(function (b) {
      b.addEventListener("click", function () {
        var t = document.getElementById(b.dataset.scrollTo);
        if (!t) return;
        var smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        t.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
      });
    });
  }

  function init() {
    wireTheme();
    buildTocs();
    decorateNav();
    buildSearchButton();
    buildProgressChip();
    buildBackToTop();
    buildCourseFooters();
    buildPracIndex();
    buildLevelStubs();
    wireLevel();
    wireChooser();
    refreshProgressUI();
    wireScrollLinks();
    wireNav(); // last: binds every [data-view], including the generated footers, then shows the initial view
    loadGlossary();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
