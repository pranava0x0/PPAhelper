/* content.js — renders the Example PPAs and Data centers views from JSON.
   Depends on window.PPA (app.js) for glossary deep-links and level re-filtering. */
(function () {
  "use strict";

  /* Data fetches carry the same ?v= as this script tag, so a deploy that
     changes JSON busts the browser cache with it (scar: stale datacenter.json
     hid new content while fresh JS rendered nothing, 2026-08-08). */
  var DATA_V = (function () {
    var m = ((document.currentScript && document.currentScript.src) || "").match(/[?&]v=([\w-]+)/);
    return m ? m[1] : "";
  })();
  function dataUrl(path) { return DATA_V ? path + "?v=" + DATA_V : path; }

  function elem(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function glossaryChips(refs) {
    if (!refs || !refs.length) return "";
    return '<div class="chips">' + refs.map(function (r) {
      return '<button type="button" class="chip gloss-chip" data-term="' + esc(r) + '">' + esc(r) + "</button>";
    }).join("") + "</div>";
  }
  function wireChips(root) {
    root.querySelectorAll(".gloss-chip").forEach(function (b) {
      b.addEventListener("click", function () {
        if (window.PPA) window.PPA.showGlossaryTerm(b.dataset.term);
      });
    });
  }
  function reapplyLevel() { if (window.PPA) window.PPA.reapplyLevel(); }

  /* ============ EXAMPLE PPAs ============ */
  var examples = [], activeExample = null;

  function renderExamplePills() {
    var wrap = document.getElementById("example-pills");
    wrap.innerHTML = "";
    examples.forEach(function (ex) {
      var b = elem("button", "example-pill");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("data-id", ex.id);
      b.setAttribute("data-level", ex.level);
      b.setAttribute("aria-selected", ex.id === activeExample ? "true" : "false");
      b.innerHTML = esc(ex.title) + ' <span class="pill outline">' + esc(ex.type) + "</span>";
      b.addEventListener("click", function () { selectExample(ex.id); });
      wrap.appendChild(b);
    });
  }

  function selectExample(id) {
    activeExample = id;
    var ex = examples.find(function (e) { return e.id === id; });
    if (!ex) return;
    document.querySelectorAll("#example-pills .example-pill").forEach(function (b) {
      b.setAttribute("aria-selected", b.dataset.id === id ? "true" : "false");
    });
    document.getElementById("example-summary").textContent = ex.summary;

    var list = document.getElementById("clause-list");
    list.innerHTML = "";
    ex.clauses.forEach(function (c, i) {
      var li = elem("li");
      var b = elem("button", "clause-row");
      b.type = "button";
      b.setAttribute("data-idx", i);
      b.setAttribute("aria-selected", i === 0 ? "true" : "false");
      b.innerHTML = '<span class="clause-label">' + esc(c.label) + "</span>" +
                    '<span class="clause-val mono">' + esc(c.value) + "</span>";
      b.addEventListener("click", function () { selectClause(ex, i, true); });
      li.appendChild(b);
      list.appendChild(li);
    });

    var rd = document.getElementById("example-realdocs");
    rd.innerHTML = ex.realDocs && ex.realDocs.length
      ? "Real public templates: " + ex.realDocs.map(function (d) {
          return '<a href="' + esc(d.url) + '">' + esc(d.label) + "</a>"; }).join(" · ")
      : "";

    selectClause(ex, 0);
  }

  var PARTY = { buyer: "Buyer-side", seller: "Seller-side", both: "Both parties" };
  function selectClause(ex, idx, userScroll) {
    var c = ex.clauses[idx];
    document.querySelectorAll("#clause-list .clause-row").forEach(function (b) {
      b.setAttribute("aria-selected", parseInt(b.dataset.idx, 10) === idx ? "true" : "false");
    });
    var d = document.getElementById("clause-detail");
    d.innerHTML =
      '<span class="pill outline">' + esc(PARTY[c.party] || "—") + "</span>" +
      "<h3>" + esc(c.label) + "</h3>" +
      '<p class="clause-detail-val mono">' + esc(c.value) + "</p>" +
      "<p>" + esc(c.annotation) + "</p>" +
      glossaryChips(c.glossaryRefs);
    wireChips(d);
    // On a stacked (mobile) layout the detail sits below a long clause list —
    // bring it into view so a tap doesn't strand the reader at the top.
    if (userScroll && window.innerWidth < 860) {
      var smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      d.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    }
  }

  function loadExamples() {
    return fetch(dataUrl("data/examples.json")).then(function (r) { return r.json(); }).then(function (data) {
      examples = (data && data.examples) || [];
      if (!examples.length) return;
      activeExample = examples[0].id;
      renderExamplePills();
      selectExample(activeExample);
    }).catch(function (e) {
      var s = document.getElementById("example-summary");
      if (s) s.textContent = "Could not load examples (" + e.message + "). Serve over http (see README).";
    });
  }

  /* ============ DATA CENTERS ============ */
  function renderDatacenter(data) {
    document.getElementById("dc-why").textContent = data.why || "";

    var d = data.demand || {};
    document.getElementById("dc-demand").innerHTML =
      '<div class="k-label">The demand shock</div>' +
      '<div class="k-val" style="font-size:1.15rem;line-height:1.35">' + esc(d.stat || "") + "</div>" +
      (d.url ? '<div class="k-sub"><a href="' + esc(d.url) + '">' + esc(d.source) + "</a></div>" : "");

    var sWrap = document.getElementById("dc-structures");
    sWrap.innerHTML = "";
    (data.structures || []).forEach(function (s) {
      var det = elem("details", "dc-structure");
      det.setAttribute("data-level", s.level);
      var lvlLabel = s.level === 1 ? "Newcomer" : s.level === 2 ? "Practitioner" : "Advanced";
      det.innerHTML =
        "<summary><span class=\"dc-s-name\">" + esc(s.name) + "</span>" +
        '<span class="pill outline">' + lvlLabel + "</span></summary>" +
        '<div class="dc-s-body">' +
          "<p><strong>What it is.</strong> " + esc(s.what) + "</p>" +
          "<p><strong>Why it's clever.</strong> " + esc(s.whyClever) + "</p>" +
          "<p><strong>Trade-offs.</strong> " + esc(s.tradeoffs) + "</p>" +
          '<p class="src" style="border:none"><strong>Seen in:</strong> ' + esc(s.example) +
            (s.url ? ' · <a href="' + esc(s.url) + '">' + esc(s.source) + "</a>" : "") + "</p>" +
          glossaryChips(s.glossaryRefs) +
        "</div>";
      sWrap.appendChild(det);
      wireChips(det);
    });

    renderCases(data.caseStudies, "dc-cases");
    renderCases(data.vppCases, "vpp-cases");

    // deals filter + table
    var types = ["All"].concat((data.deals || []).map(function (x) { return x.buyerType; })
      .filter(function (v, i, a) { return a.indexOf(v) === i; }));
    var fWrap = document.getElementById("dc-filter");
    fWrap.innerHTML = "";
    var activeType = "All";
    function drawDeals() {
      var t = document.getElementById("dc-deals");
      var rows = (data.deals || []).filter(function (x) { return activeType === "All" || x.buyerType === activeType; });
      t.innerHTML =
        "<thead><tr><th>Buyer</th><th>Seller</th><th>Tech</th><th>Size</th><th>Structure</th><th>Source</th></tr></thead><tbody>" +
        rows.map(function (x) {
          return "<tr><td><strong>" + esc(x.buyer) + "</strong><br><span class=\"src\" style=\"border:none\">" + esc(x.buyerType) + " · " + esc(x.announced) + "</span></td>" +
            "<td>" + esc(x.seller) + "</td>" +
            "<td>" + esc(x.tech) + "</td>" +
            "<td class=\"mono\">" + esc(x.capacity) + "</td>" +
            "<td>" + esc(x.structure) + (x.note ? '<br><span class="src" style="border:none">' + esc(x.note) + "</span>" : "") + "</td>" +
            "<td><a href=\"" + esc(x.url) + "\">" + esc(x.source) + "</a></td></tr>";
        }).join("") + "</tbody>";
    }
    types.forEach(function (ty) {
      var b = elem("button", "dc-filter-btn");
      b.type = "button";
      b.textContent = ty;
      b.setAttribute("aria-pressed", ty === activeType ? "true" : "false");
      b.addEventListener("click", function () {
        activeType = ty;
        fWrap.querySelectorAll(".dc-filter-btn").forEach(function (x) {
          x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        drawDeals();
      });
      fWrap.appendChild(b);
    });
    drawDeals();
  }

  /* Case studies (data-center + VPP): richer accordions than structures —
     load/gen/wires narrative, agreement stack, filed-documents history,
     participants, and multi-source citation lines. */
  function renderCases(cases, containerId) {
    var wrap = document.getElementById(containerId);
    if (!wrap) return;
    wrap.replaceChildren();
    (cases || []).forEach(function (c) {
      var det = elem("details", "dc-structure case-study");
      det.setAttribute("data-level", c.level);
      var lvlLabel = c.level === 1 ? "Newcomer" : "Practitioner";

      var history = (c.history || []).map(function (h) {
        return '<li><span class="mono case-date">' + esc(h.date) + "</span> " + esc(h.event) + "</li>";
      }).join("");
      var sources = (c.sources || []).map(function (s) {
        return '<a href="' + esc(s.url) + '">' + esc(s.label) + "</a>";
      }).join(" · ");

      det.append(
        elem("summary", null,
          '<span class="dc-s-name">' + esc(c.title) + "</span>" +
          '<span class="pill outline">' + lvlLabel + "</span>"),
        elem("div", "dc-s-body",
          '<p class="case-meta"><span class="pill outline">' + esc(c.market) + "</span></p>" +
          '<p class="case-participants"><strong>Participants.</strong> ' + esc(c.participants) + "</p>" +
          "<p><strong>The load.</strong> " + esc(c.load) + "</p>" +
          "<p><strong>The generation.</strong> " + esc(c.gen) + "</p>" +
          "<p><strong>The wires.</strong> " + esc(c.tnd) + "</p>" +
          "<p><strong>The agreement stack.</strong> " + esc(c.agreement) + "</p>" +
          "<p><strong>Unlike a standard PPA.</strong> " + esc(c.unique) + "</p>" +
          '<p style="margin-bottom:4px"><strong>Filings &amp; history.</strong></p>' +
          '<ul class="case-history">' + history + "</ul>" +
          "<p><strong>The lesson.</strong> " + esc(c.lesson) + "</p>" +
          glossaryChips(c.glossaryRefs) +
          '<p class="src" style="margin-top:10px"><strong>Documents &amp; sources:</strong> ' + sources + "</p>")
      );
      wrap.appendChild(det);
      wireChips(det);
    });
  }

  function loadDatacenter() {
    return fetch(dataUrl("data/datacenter.json")).then(function (r) { return r.json(); }).then(renderDatacenter)
      .catch(function (e) {
        var w = document.getElementById("dc-why");
        if (w) w.textContent = "Could not load data-center deals (" + e.message + "). Serve over http (see README).";
      });
  }

  /* ============ PERSPECTIVES ============ */
  function renderPerspectives(data) {
    var v = document.getElementById("voices");
    if (v) v.innerHTML = (data.voices || []).map(function (p) {
      return '<article class="card voice-card" data-level="' + p.level + '">' +
        '<p class="eyebrow">' + esc(p.angle) + "</p>" +
        "<h3>" + esc(p.name) + "</h3>" +
        '<div class="voice-role">' + esc(p.role) + "</div>" +
        "<p>" + esc(p.view) + "</p>" +
        '<p class="voice-takeaway"><strong>Takeaway.</strong> ' + esc(p.takeaway) + "</p>" +
        '<p class="src"><a href="' + esc(p.url) + '">' + esc(p.source) + "</a></p>" +
        "</article>";
    }).join("");
    var r = document.getElementById("resources");
    if (r) r.innerHTML = (data.resources || []).map(function (x) {
      return '<li class="resource" data-level="' + x.level + '">' +
        '<span class="pill outline">' + esc(x.kind) + "</span> " +
        '<a href="' + esc(x.url) + '">' + esc(x.label) + "</a></li>";
    }).join("");
  }
  function loadPerspectives() {
    return fetch(dataUrl("data/perspectives.json")).then(function (r) { return r.json(); }).then(renderPerspectives)
      .catch(function (e) {
        var v = document.getElementById("voices");
        if (v) v.innerHTML = '<p class="src" style="border:none">Could not load perspectives (' + e.message + ").</p>";
      });
  }

  function init() {
    Promise.all([loadExamples(), loadDatacenter(), loadPerspectives()]).then(reapplyLevel);
    document.addEventListener("ppa:level", function () {
      // when a level hides the active example pill, fall back to the first visible one
      var active = document.querySelector('#example-pills .example-pill[aria-selected="true"]');
      if (active && active.classList.contains("lvl-hidden")) {
        var first = document.querySelector("#example-pills .example-pill:not(.lvl-hidden)");
        if (first) selectExample(first.dataset.id);
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
