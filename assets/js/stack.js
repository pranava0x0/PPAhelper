/* stack.js — "Serve the load" supply-stack builder (Data centers tab).
   UI over assets/js/stack-core.js: inputs -> hourly stacked chart + KPIs.
   All DOM is built with createElement/createElementNS; the chart redraws on
   input and on the ppa:rerender theme event. Illustration, not market data. */
(function () {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";
  var FIELDS = ["load", "nuclear", "solar", "wind", "batt", "batthrs", "gas"];
  var PRESETS = {
    solar:    { load: 1000, nuclear: 0,   solar: 4000, wind: 0,   batt: 0,   batthrs: 4, gas: 0 },
    renstor:  { load: 1000, nuclear: 0,   solar: 2500, wind: 800, batt: 500, batthrs: 4, gas: 0 },
    anchored: { load: 1000, nuclear: 400, solar: 1200, wind: 400, batt: 300, batthrs: 4, gas: 300 }
  };
  var LAYERS = [
    { key: "nuclear", token: "--stack-nuclear" },
    { key: "solar",   token: "--stack-solar" },
    { key: "wind",    token: "--stack-wind" },
    { key: "batt",    token: "--stack-batt" },
    { key: "gas",     token: "--stack-gas" },
    { key: "grid",    token: "--stack-grid" }
  ];
  var num = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
  var pct = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 0 });

  var els = {};
  var lastResult = null;

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#888";
  }

  function svgEl(tag, attrs) {
    var el = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    return el;
  }

  function readInputs() {
    return {
      loadMW: parseFloat(els.load.value) || 0,
      nuclearMW: parseFloat(els.nuclear.value) || 0,
      solarMW: parseFloat(els.solar.value) || 0,
      windMW: parseFloat(els.wind.value) || 0,
      battMW: parseFloat(els.batt.value) || 0,
      battHours: parseFloat(els.batthrs.value) || 0,
      gasMW: parseFloat(els.gas.value) || 0
    };
  }

  function banner(k) {
    if (k.loadMWh <= 0) return "Set a campus load to start.";
    var cfe = pct.format(k.cfeShare);
    if (k.coveredHours === 24 && k.cfeShare >= 0.9) {
      return "Covered 24/24 at " + cfe + " carbon-free — the stack gigawatt buyers actually sign.";
    }
    if (k.coveredHours === 24) {
      return "Covered around the clock — but only " + cfe + " carbon-free. The gas toll is doing the firming.";
    }
    return (24 - k.coveredHours) + " hours/day short: " + num.format(Math.round(k.openMWh)) +
      " MWh bought at spot. That open position is unhedged market risk.";
  }

  function recompute() {
    var r = window.PPAStack.computeStack(readInputs());
    lastResult = r;
    var k = r.kpis;
    els.covered.textContent = k.coveredHours + " / 24";
    els.cfe.textContent = pct.format(k.cfeShare);
    els.open.textContent = num.format(Math.round(k.openMWh));
    els.surplus.textContent = num.format(Math.round(k.surplusMWh));
    els.banner.textContent = banner(k);
    drawChart();
  }

  function drawChart() {
    if (!lastResult) return;
    var svg = els.chart;
    var hours = lastResult.hours;
    var W = 720, H = 260, padL = 52, padR = 14, padT = 14, padB = 26;
    var plotW = W - padL - padR, plotH = H - padT - padB;
    var load = hours[0] ? hours[0].load : 0;

    var maxV = load;
    hours.forEach(function (h) {
      maxV = Math.max(maxV, h.load + h.surplus + h.battCharge);
    });
    maxV = (maxV || 10) * 1.08;

    function x(i) { return padL + i * (plotW / 24); }
    function y(v) { return padT + plotH * (1 - v / maxV); }
    var bw = (plotW / 24) * 0.82;

    var frag = document.createDocumentFragment();
    var cBorder = cssVar("--border"), cText = cssVar("--text-muted"), cRule = cssVar("--rule");

    // y gridlines: 0, load, max
    [0, load, maxV / 1.08].forEach(function (v, idx) {
      if (v <= 0 && idx > 0) return;
      frag.appendChild(svgEl("line", { x1: padL, y1: y(v).toFixed(1), x2: W - padR, y2: y(v).toFixed(1),
        stroke: cBorder, "stroke-width": 1, opacity: 0.5 }));
      var t = svgEl("text", { x: padL - 6, y: (y(v) + 3).toFixed(1), "text-anchor": "end",
        "font-size": 10, "font-family": "ui-monospace,monospace", fill: cText });
      t.textContent = num.format(Math.round(v));
      frag.appendChild(t);
    });

    // stacked consumption bars + translucent surplus above the load line
    hours.forEach(function (h, i) {
      var base = 0;
      var bx = (x(i) + (plotW / 24 - bw) / 2).toFixed(1);
      LAYERS.forEach(function (L) {
        var v = h[L.key];
        if (v <= 0) return;
        var yTop = y(base + v), hh = y(base) - y(base + v);
        frag.appendChild(svgEl("rect", { x: bx, y: yTop.toFixed(1), width: bw.toFixed(1),
          height: Math.max(hh, 0.5).toFixed(1), fill: cssVar(L.token),
          opacity: L.key === "grid" ? 0.55 : 0.9 }));
        base += v;
      });
      var extra = h.surplus + h.battCharge;
      if (extra > 0) {
        var yTop2 = y(load + extra), hh2 = y(load) - y(load + extra);
        frag.appendChild(svgEl("rect", { x: bx, y: yTop2.toFixed(1), width: bw.toFixed(1),
          height: Math.max(hh2, 0.5).toFixed(1), fill: cssVar("--stack-solar"), opacity: 0.18 }));
      }
      if (i % 3 === 0) {
        var lbl = svgEl("text", { x: (x(i) + plotW / 48).toFixed(1), y: H - 8, "text-anchor": "middle",
          "font-size": 9.5, "font-family": "ui-monospace,monospace", fill: cText });
        lbl.textContent = i;
        frag.appendChild(lbl);
      }
    });

    // flat load line on top
    if (load > 0) {
      frag.appendChild(svgEl("line", { x1: padL, y1: y(load).toFixed(1), x2: W - padR, y2: y(load).toFixed(1),
        stroke: cRule, "stroke-width": 1.5, "stroke-dasharray": "5 4" }));
      var loadLbl = svgEl("text", { x: W - padR, y: (y(load) - 5).toFixed(1), "text-anchor": "end",
        "font-size": 10, "font-family": "ui-monospace,monospace", fill: cText });
      loadLbl.textContent = "load " + num.format(load) + " MW";
      frag.appendChild(loadLbl);
    }

    svg.replaceChildren(frag);
  }

  function applyPreset(key) {
    var p = PRESETS[key];
    if (!p) return;
    FIELDS.forEach(function (f) { els[f].value = p[f]; });
    els.presets.querySelectorAll(".scenario-btn").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.preset === key ? "true" : "false");
    });
    recompute();
  }

  function markCustom() {
    els.presets.querySelectorAll(".scenario-btn").forEach(function (b) {
      b.setAttribute("aria-pressed", "false");
    });
  }

  function init() {
    var root = document.getElementById("st-controls");
    if (!root || !window.PPAStack) return;
    FIELDS.forEach(function (f) { els[f] = document.getElementById("st-" + f); });
    ["banner", "covered", "cfe", "open", "surplus", "chart", "presets"].forEach(function (id) {
      els[id] = document.getElementById("st-" + id);
    });
    FIELDS.forEach(function (f) {
      els[f].addEventListener("input", function () { markCustom(); recompute(); });
    });
    els.presets.querySelectorAll(".scenario-btn").forEach(function (b) {
      b.addEventListener("click", function () { applyPreset(b.dataset.preset); });
    });
    document.addEventListener("ppa:rerender", drawChart);
    recompute();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
