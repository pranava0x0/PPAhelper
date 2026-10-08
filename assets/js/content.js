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
          "<p><strong>Why it fits.</strong> " + esc(s.whyClever) + "</p>" +
          "<p><strong>Trade-offs.</strong> " + esc(s.tradeoffs) + "</p>" +
          '<p class="caption"><strong>Seen in:</strong> ' + esc(s.example) +
            (s.url ? ' · <a href="' + esc(s.url) + '">' + esc(s.source) + "</a>" : "") + "</p>" +
          glossaryChips(s.glossaryRefs) +
        "</div>";
      sWrap.appendChild(det);
      wireChips(det);
    });

    renderCases(data.caseStudies, "dc-cases");
    renderCaseGlance(data.caseStudies, data.casesAsOf, "dc-cases-glance", "dc-cases");
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
            "<td>" + esc(x.structure) + (x.note ? '<br><span class="caption">' + esc(x.note) + "</span>" : "") + "</td>" +
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
     participants, and multi-source citation lines. Built with plain DOM
     APIs per the AGENTS.md markup-assignment invariant for new render code. */
  function renderCases(cases, containerId) {
    var wrap = document.getElementById(containerId);
    if (!wrap) return;

    function el(tag, cls, text) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text != null) e.textContent = text;
      return e;
    }
    function labeled(label, text, cls) {
      var p = el("p", cls || null);
      p.appendChild(el("strong", null, label));
      p.appendChild(document.createTextNode(" " + text));
      return p;
    }

    wrap.replaceChildren();
    (cases || []).forEach(function (c) {
      var det = el("details", "dc-structure case-study");
      det.id = containerId + "-" + c.id;
      det.setAttribute("data-level", c.level);

      var summary = document.createElement("summary");
      summary.append(
        el("span", "dc-s-name", c.title),
        el("span", "pill outline", c.level === 1 ? "Newcomer" : "Practitioner"));

      var body = el("div", "dc-s-body");
      var meta = el("p", "case-meta");
      meta.appendChild(el("span", "pill outline", c.market));
      body.appendChild(meta);
      // Key facts and the takeaway lead, so an opened case answers
      // "what happened" before the long-form narrative starts.
      if (c.glance) {
        var facts = el("dl", "case-facts");
        GLANCE_FIELDS.forEach(function (f) {
          var cell = el("div");
          cell.append(el("dt", null, f.label), el("dd", null, c.glance[f.key] || "—"));
          facts.appendChild(cell);
        });
        body.appendChild(facts);
      }
      body.appendChild(labeled("The lesson.", c.lesson));
      if (c.brief) body.appendChild(labeled("The brief.", c.brief));
      body.appendChild(labeled("Participants.", c.participants, "case-participants"));
      body.appendChild(labeled("The load.", c.load));
      body.appendChild(labeled("The generation.", c.gen));
      body.appendChild(labeled("The wires.", c.tnd));
      body.appendChild(labeled("The agreement stack.", c.agreement));
      body.appendChild(labeled("Unlike a standard PPA.", c.unique));

      if (c.decisions && c.decisions.length) {
        var dLabel = el("p");
        dLabel.setAttribute("style", "margin-bottom:4px");
        dLabel.appendChild(el("strong", null, "How the decision unfolded."));
        body.appendChild(dLabel);
        var decisions = el("ol", "case-decisions");
        c.decisions.forEach(function (decision) {
          decisions.appendChild(el("li", null, decision));
        });
        body.appendChild(decisions);
        body.appendChild(labeled("What would make it fail.", c.failureTest, "case-failure"));
        body.appendChild(labeled("Your turn.", c.yourTurn, "case-prompt"));
      }

      var hLabel = el("p");
      hLabel.setAttribute("style", "margin-bottom:4px");
      hLabel.appendChild(el("strong", null, "Filings & history."));
      body.appendChild(hLabel);
      var ul = el("ul", "case-history");
      (c.history || []).forEach(function (h) {
        var li = document.createElement("li");
        li.appendChild(el("span", "mono case-date", h.date));
        li.appendChild(document.createTextNode(" " + h.event));
        ul.appendChild(li);
      });
      body.appendChild(ul);

      if (c.glossaryRefs && c.glossaryRefs.length) {
        var chips = el("div", "chips");
        c.glossaryRefs.forEach(function (r) {
          var b = el("button", "chip gloss-chip", r);
          b.type = "button";
          b.setAttribute("data-term", r);
          chips.appendChild(b);
        });
        body.appendChild(chips);
      }

      var src = el("p", "src");
      src.setAttribute("style", "margin-top:10px");
      src.appendChild(el("strong", null, "Documents & sources: "));
      (c.sources || []).forEach(function (s, i) {
        if (i) src.appendChild(document.createTextNode(" · "));
        var a = document.createElement("a");
        a.href = s.url;
        a.textContent = s.label;
        src.appendChild(a);
      });
      body.appendChild(src);

      det.append(summary, body);
      wrap.appendChild(det);
      wireChips(det);
    });
  }

  var GLANCE_FIELDS = [
    { key: "load", label: "Load" },
    { key: "supply", label: "Supply" },
    { key: "contract", label: "Contract" },
    { key: "status", label: "Status" }
  ];

  /* One-row-per-case summary above the accordions. Each title opens and
     scrolls to its case. Rows carry data-level so the Newcomer filter hides
     Practitioner cases here too. Stacks into cards under 640px (CSS). */
  function renderCaseGlance(cases, asOf, hostId, casesId) {
    var host = document.getElementById(hostId);
    if (!host) return;
    host.replaceChildren();
    if (!cases || !cases.length) return;

    var columns = ["Case", "Market"].concat(GLANCE_FIELDS.map(function (f) { return f.label; }));
    var table = document.createElement("table");
    table.className = "case-glance";
    // explicit roles keep table semantics when the mobile CSS restyles rows as blocks
    table.setAttribute("role", "table");
    var caption = document.createElement("caption");
    caption.className = "visually-hidden";
    caption.textContent = "Case studies at a glance";
    table.appendChild(caption);

    var thead = document.createElement("thead");
    thead.setAttribute("role", "rowgroup");
    var hr = document.createElement("tr");
    hr.setAttribute("role", "row");
    columns.forEach(function (name) {
      var th = document.createElement("th");
      th.scope = "col";
      th.setAttribute("role", "columnheader");
      th.textContent = name === "Status" && asOf ? "Status · as of " + asOf : name;
      hr.appendChild(th);
    });
    thead.appendChild(hr);

    var tbody = document.createElement("tbody");
    tbody.setAttribute("role", "rowgroup");
    cases.forEach(function (c) {
      var g = c.glance || {};
      var tr = document.createElement("tr");
      tr.setAttribute("role", "row");
      tr.setAttribute("data-level", c.level);

      function cell(label) {
        var td = document.createElement("td");
        td.setAttribute("role", "cell");
        td.setAttribute("data-label", label);
        tr.appendChild(td);
        return td;
      }

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "glance-link";
      btn.textContent = c.title;
      btn.addEventListener("click", function () { openCase(casesId + "-" + c.id); });
      var caseTd = cell("Case");
      caseTd.className = "glance-case";
      caseTd.appendChild(btn);
      cell("Market").textContent = c.market || "—";
      GLANCE_FIELDS.forEach(function (f) { cell(f.label).textContent = g[f.key] || "—"; });
      tbody.appendChild(tr);
    });

    table.append(thead, tbody);
    var wrapDiv = document.createElement("div");
    wrapDiv.className = "table-wrap";
    wrapDiv.appendChild(table);
    host.appendChild(wrapDiv);
    reapplyLevel();
  }

  function openCase(detailsId) {
    var det = document.getElementById(detailsId);
    if (!det) return;
    det.open = true;
    var smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    det.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    var summary = det.querySelector("summary");
    if (summary) summary.focus({ preventScroll: true });
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
        '<p class="section-label">' + esc(p.angle) + "</p>" +
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
        if (v) v.innerHTML = '<p class="caption">Could not load perspectives (' + e.message + ").</p>";
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
