/* App glue: view switcher, theme toggle, glossary, inline term tooltips. */
(function () {
  "use strict";

  var VIEWS = ["foundations", "examples", "ppadraft", "simulator", "datacenter", "perspectives", "glossary", "coverage"];

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
    function sync() { btn.textContent = root.getAttribute("data-theme") === "dark" ? "light" : "dark"; }
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

  /* ---------- experience-level filter (newcomer → practitioner → all) ---------- */
  var currentLevel = "all";
  function applyLevel(level) {
    currentLevel = level;
    try { localStorage.setItem("ppa-level", level); } catch (e) {}
    document.querySelectorAll("[data-level]").forEach(function (el) {
      var lv = parseInt(el.getAttribute("data-level"), 10);
      var show = level === "all" || (lv && lv <= parseInt(level, 10));
      el.classList.toggle("lvl-hidden", !show);
    });
  }
  function wireLevel() {
    var wrap = document.getElementById("level-filter");
    if (!wrap) return;
    var saved = null;
    try { saved = localStorage.getItem("ppa-level"); } catch (e) {}
    if (saved) {
      applyLevel(saved);
      wrap.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", b.dataset.setlevel === saved ? "true" : "false");
      });
    }
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

  // exposed for the content renderers (assets/js/content.js)
  window.PPA = {
    showView: showView,
    showGlossaryTerm: showGlossaryTerm,
    reapplyLevel: function () { applyLevel(currentLevel); },
    getLevel: function () { return currentLevel; }
  };

  /* ---------- in-page scroll links (learning-path stepper) ---------- */
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
    wireNav();
    wireTheme();
    wireLevel();
    wireScrollLinks();
    loadGlossary();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
