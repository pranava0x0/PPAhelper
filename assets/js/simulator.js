/* VPPA settlement simulator.
   Settlement convention (buyer's perspective): settlement = (LMP - strike) * volume.
   Positive => generator pays buyer. Negative => buyer pays generator.
   This is an illustration of the contract-for-differences mechanic, not market data. */
(function () {
  "use strict";

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // 12 months of LMP ($/MWh) per scenario.
  var SCENARIOS = {
    calm:    [42, 40, 41, 43, 45, 48, 52, 51, 47, 44, 43, 46],
    rising:  [30, 33, 36, 40, 44, 49, 54, 58, 62, 66, 70, 73],
    falling: [68, 64, 60, 55, 50, 46, 42, 38, 34, 31, 28, 26],
    spike:   [38, 37, 39, 42, 48, 70, 145, 120, 60, 44, 40, 39]
  };

  var usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  var usd2 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var num = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

  var state = { strike: 45, volume: 25000, side: "buyer", scenario: "calm", lmp: SCENARIOS.calm.slice(), basisSpread: 0 };

  var els = {};
  var lmpInputs = [];
  var cellRefs = []; // { strike, diff, vol, settle } per row

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#888";
  }

  function buildTable() {
    var body = els.body;
    body.innerHTML = "";
    lmpInputs = [];
    cellRefs = [];
    for (var i = 0; i < 12; i++) {
      var tr = document.createElement("tr");

      var tdMonth = document.createElement("td");
      tdMonth.textContent = MONTHS[i];
      tr.appendChild(tdMonth);

      var tdLmp = document.createElement("td");
      tdLmp.className = "num";
      var input = document.createElement("input");
      input.type = "number";
      input.step = "1";
      input.value = state.lmp[i];
      input.setAttribute("aria-label", "LMP for " + MONTHS[i]);
      input.style.cssText = "width:78px;font-family:var(--font-mono);font-variant-numeric:tabular-nums;font-size:14px;padding:4px 6px;border:1px solid var(--border);border-radius:6px;background:var(--surface-2);color:var(--text);text-align:right";
      (function (idx) {
        input.addEventListener("input", function () {
          state.lmp[idx] = parseFloat(input.value) || 0;
          markCustom();
          recompute();
        });
      })(i);
      tdLmp.appendChild(input);
      lmpInputs.push(input);
      tr.appendChild(tdLmp);

      var tdStrike = document.createElement("td"); tdStrike.className = "num";
      var tdDiff = document.createElement("td"); tdDiff.className = "num";
      var tdVol = document.createElement("td"); tdVol.className = "num";
      var tdSettle = document.createElement("td"); tdSettle.className = "num";
      tr.appendChild(tdStrike); tr.appendChild(tdDiff); tr.appendChild(tdVol); tr.appendChild(tdSettle);
      cellRefs.push({ strike: tdStrike, diff: tdDiff, vol: tdVol, settle: tdSettle });

      body.appendChild(tr);
    }
  }

  function markCustom() {
    state.scenario = "custom";
    var btns = els.scenarios.querySelectorAll(".scenario-btn");
    btns.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
  }

  function applyScenario(key) {
    state.scenario = key;
    state.lmp = SCENARIOS[key].slice();
    for (var i = 0; i < 12; i++) { lmpInputs[i].value = state.lmp[i]; }
    els.scenarios.querySelectorAll(".scenario-btn").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.scenario === key ? "true" : "false");
    });
    recompute();
  }

  function recompute() {
    var strike = state.strike, vol = state.volume, side = state.side;
    var res = PPASettle.computeSettlement(strike, vol, state.lmp);
    var totalSettleBuyer = res.netToBuyer, totalLmpCost = res.totalLmpCost,
        totalVol = res.totalVol, monthsITM = res.monthsITMBuyer;

    for (var i = 0; i < res.monthly.length; i++) {
      var m = res.monthly[i];
      var c = cellRefs[i];
      c.strike.textContent = usd.format(strike);
      c.diff.textContent = (m.diff >= 0 ? "+" : "−") + usd.format(Math.abs(m.diff));
      c.vol.textContent = num.format(vol);
      var shown = side === "buyer" ? m.settleBuyer : -m.settleBuyer;
      c.settle.textContent = (shown >= 0 ? "+" : "−") + usd.format(Math.abs(shown));
      c.settle.className = "num " + (shown >= 0 ? "credit" : "debit");
    }

    // footer
    els.footLmp.textContent = usd.format(res.avgLmp);
    els.footStrike.textContent = usd.format(strike);
    els.footVol.textContent = num.format(totalVol);
    var netShown = side === "buyer" ? totalSettleBuyer : -totalSettleBuyer;
    els.footNet.textContent = (netShown >= 0 ? "+" : "−") + usd.format(Math.abs(netShown));
    els.footNet.className = "num " + (netShown >= 0 ? "credit" : "debit");

    // KPIs
    els.kpiNet.textContent = (netShown >= 0 ? "+" : "−") + usd.format(Math.abs(netShown));
    els.kpiNet.className = "k-val " + (netShown >= 0 ? "credit" : "debit");
    els.kpiNetSub.textContent = side === "buyer"
      ? (netShown >= 0 ? "net received by the buyer" : "net paid by the buyer")
      : (netShown >= 0 ? "net received by the generator" : "net paid by the generator");

    var effective = totalVol > 0 ? (totalLmpCost - totalSettleBuyer) / totalVol : strike;
    els.kpiEff.textContent = usd2.format(effective);

    els.kpiMonths.textContent = (side === "buyer" ? monthsITM : 12 - monthsITM) + " / 12";
    els.kpiMonthsSub.textContent = side === "buyer"
      ? "buyer received money (LMP above strike)"
      : "generator received money (LMP below strike)";

    els.avgLmp.textContent = usd.format(res.avgLmp) + " /MWh";

    // direction banner
    var payer, payee, amt = Math.abs(totalSettleBuyer);
    if (totalSettleBuyer >= 0) { payer = "the generator"; payee = "the buyer"; }
    else { payer = "the buyer"; payee = "the generator"; }
    // developer's realized price (eroded by basis spread)
    var devEffective = state.strike - state.basisSpread;
    if (els.kpiDev) {
      els.kpiDev.textContent = usd2.format(devEffective);
      els.kpiDev.className = "k-val mono" + (state.basisSpread > 0 ? " debit" : "");
    }

    els.banner.className = "direction-banner " + (netShown >= 0 ? "credit" : "debit");
    var basisNote = state.basisSpread > 0
      ? " Developer's node earns <strong class=\"mono\">$" + state.basisSpread + "/MWh</strong> less than the hub — effective realized price <strong class=\"mono\">" + usd2.format(devEffective) + "/MWh</strong>."
      : "";
    els.banner.innerHTML = "Over the year, <strong>" + payer + "</strong> pays <strong>" + payee +
      "</strong> a net <strong class=\"mono\">" + usd.format(amt) + "</strong>. " +
      "The buyer's effective power price is locked at <strong class=\"mono\">" + usd2.format(effective) +
      "/MWh</strong> — the strike — no matter where the market goes." + basisNote;

    drawChart();
  }

  function drawChart() {
    var svg = els.chart;
    var W = 720, H = 260, padL = 46, padR = 14, padT = 14, padB = 28;
    var plotW = W - padL - padR, plotH = H - padT - padB;
    var strike = state.strike;
    var maxV = Math.max(strike, Math.max.apply(null, state.lmp)) * 1.12 || 10;
    function x(i) { return padL + (i + 0.5) * (plotW / 12); }
    function y(v) { return padT + plotH * (1 - v / maxV); }

    var cAccent = cssVar("--accent"), cMuted = cssVar("--text-muted"),
        cCredit = cssVar("--flow-credit"), cDebit = cssVar("--flow-debit"),
        cBorder = cssVar("--border"), cText = cssVar("--text-muted");

    var p = [];
    // y gridlines + labels (0, mid, max)
    [0, maxV / 2, maxV].forEach(function (v) {
      var yy = y(v).toFixed(1);
      p.push('<line x1="' + padL + '" y1="' + yy + '" x2="' + (W - padR) + '" y2="' + yy + '" stroke="' + cBorder + '" stroke-width="1" opacity="0.5"/>');
      p.push('<text x="' + (padL - 6) + '" y="' + (y(v) + 3).toFixed(1) + '" text-anchor="end" font-size="10" font-family="ui-monospace,monospace" fill="' + cText + '">' + Math.round(v) + '</text>');
    });

    // settlement bars (strike -> lmp), colored by sign
    var strikeY = y(strike);
    for (var i = 0; i < 12; i++) {
      var lmp = state.lmp[i];
      var lmpY = y(lmp);
      var bw = (plotW / 12) * 0.46;
      var bx = x(i) - bw / 2;
      var top = Math.min(strikeY, lmpY), h = Math.abs(strikeY - lmpY);
      var col = lmp >= strike ? cCredit : cDebit;
      p.push('<rect x="' + bx.toFixed(1) + '" y="' + top.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + Math.max(h, 0.5).toFixed(1) + '" fill="' + col + '" opacity="0.32"/>');
    }

    // strike line
    p.push('<line x1="' + padL + '" y1="' + strikeY.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + strikeY.toFixed(1) + '" stroke="' + cMuted + '" stroke-width="1.5" stroke-dasharray="5 4"/>');

    // LMP polyline + dots + month labels
    var pts = [];
    for (var j = 0; j < 12; j++) {
      pts.push(x(j).toFixed(1) + "," + y(state.lmp[j]).toFixed(1));
      p.push('<text x="' + x(j).toFixed(1) + '" y="' + (H - 9) + '" text-anchor="middle" font-size="9.5" font-family="ui-monospace,monospace" fill="' + cText + '">' + MONTHS[j].charAt(0) + '</text>');
    }
    p.push('<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + cAccent + '" stroke-width="2.5" stroke-linejoin="round"/>');
    for (var k = 0; k < 12; k++) {
      p.push('<circle cx="' + x(k).toFixed(1) + '" cy="' + y(state.lmp[k]).toFixed(1) + '" r="2.6" fill="' + cAccent + '"/>');
    }

    // node LMP line (visible when basis spread > 0)
    if (state.basisSpread) {
      var nodePts = [];
      for (var ni = 0; ni < 12; ni++) {
        nodePts.push(x(ni).toFixed(1) + "," + y(state.lmp[ni] - state.basisSpread).toFixed(1));
      }
      p.push('<polyline points="' + nodePts.join(" ") + '" fill="none" stroke="' + cMuted + '" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.8"/>');
      if (els.legendNode) els.legendNode.hidden = false;
    } else {
      if (els.legendNode) els.legendNode.hidden = true;
    }

    svg.innerHTML = p.join("");
  }

  function init() {
    els = {
      body: document.getElementById("settle-body"),
      scenarios: document.getElementById("scenarios"),
      strike: document.getElementById("strike"),
      volume: document.getElementById("volume"),
      perspective: document.getElementById("perspective"),
      chart: document.getElementById("chart"),
      banner: document.getElementById("banner"),
      kpiNet: document.getElementById("kpi-net"),
      kpiNetSub: document.getElementById("kpi-net-sub"),
      kpiEff: document.getElementById("kpi-eff"),
      kpiMonths: document.getElementById("kpi-months"),
      kpiMonthsSub: document.getElementById("kpi-months-sub"),
      avgLmp: document.getElementById("avg-lmp"),
      footLmp: document.getElementById("foot-lmp"),
      footStrike: document.getElementById("foot-strike"),
      footVol: document.getElementById("foot-vol"),
      footNet: document.getElementById("foot-net"),
      basisSpread: document.getElementById("basis-spread"),
      basisSpreadVal: document.getElementById("basis-spread-val"),
      kpiDev: document.getElementById("kpi-dev"),
      legendNode: document.getElementById("legend-node")
    };
    if (!els.body) return;

    buildTable();

    els.strike.addEventListener("input", function () { state.strike = parseFloat(els.strike.value) || 0; recompute(); });
    els.volume.addEventListener("input", function () { state.volume = parseFloat(els.volume.value) || 0; recompute(); });

    els.scenarios.querySelectorAll(".scenario-btn").forEach(function (b) {
      b.addEventListener("click", function () { applyScenario(b.dataset.scenario); });
    });

    els.perspective.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () {
        state.side = b.dataset.side;
        els.perspective.querySelectorAll("button").forEach(function (x) {
          x.setAttribute("aria-pressed", x === b ? "true" : "false");
        });
        recompute();
      });
    });

    if (els.basisSpread) {
      els.basisSpread.addEventListener("input", function () {
        state.basisSpread = parseFloat(els.basisSpread.value) || 0;
        els.basisSpreadVal.textContent = "$" + state.basisSpread + " /MWh";
        recompute();
      });
    }

    // re-draw chart colors after a theme swap
    document.addEventListener("ppa:rerender", drawChart);

    recompute();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
