/* App glue: view switcher, theme toggle, glossary, inline term tooltips. */
(function () {
  "use strict";

  var VIEWS = ["foundations", "examples", "simulator", "datacenter", "perspectives", "glossary", "coverage"];

  /* ---------- view switcher ---------- */
  function showView(name) {
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
  }

  function wireNav() {
    document.querySelectorAll("[data-view]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        showView(el.dataset.view);
      });
    });
    window.addEventListener("hashchange", function () {
      showView((window.location.hash || "#foundations").slice(1));
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

  /* ---------- inline term tooltips ---------- */
  function wireTooltips() {
    var map = {};
    glossary.forEach(function (t) { map[t.term] = t; });
    document.querySelectorAll(".gterm").forEach(function (el) {
      var key = el.dataset.term;
      var t = map[key];
      if (!t) return;
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.setAttribute("title", t.def + (t.source ? "  (Source: " + t.source + ")" : ""));
      el.setAttribute("aria-label", key + ": " + t.def);
      el.addEventListener("click", function () { showGlossaryTerm(key); });
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.click(); }
      });
    });
  }

  function loadGlossary() {
    fetch("data/glossary.json")
      .then(function (r) { if (!r.ok) throw new Error("glossary " + r.status); return r.json(); })
      .then(function (data) {
        glossary = (data && data.terms) || [];
        glossary.sort(function (a, b) { return a.term.localeCompare(b.term); });
        buildCatFilter();
        renderGlossary();
        wireGlossarySearch();
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
    document.querySelectorAll("[data-level]").forEach(function (el) {
      var lv = parseInt(el.getAttribute("data-level"), 10);
      var show = level === "all" || (lv && lv <= parseInt(level, 10));
      el.classList.toggle("lvl-hidden", !show);
    });
  }
  function wireLevel() {
    var wrap = document.getElementById("level-filter");
    if (!wrap) return;
    wrap.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () {
        wrap.querySelectorAll("button").forEach(function (x) {
          x.setAttribute("aria-pressed", x === b ? "true" : "false");
        });
        applyLevel(b.dataset.level);
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
