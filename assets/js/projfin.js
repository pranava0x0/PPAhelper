/* Project-finance workbench — debt sizing to a target DSCR, capital-stack split,
   and levered equity IRR (contracted + merchant tail).
   A teaching model: flat pricing, no tax, no degradation, no reserves. */
(function () {
  "use strict";

  var HOURS = 8760;
  var GEARING_CAP = 0.75; // lenders rarely fund more than ~75% of capex

  var PRESETS = {
    solar:   { mw: 100, capex: 1100, cf: 29, opex: 15, price: 37, tenor: 15, rate: 6.0, dscr: 1.30, itc: 30, merchYrs: 10, merchPrice: 30 },
    wind:    { mw: 200, capex: 1450, cf: 43, opex: 32, price: 38, tenor: 12, rate: 6.0, dscr: 1.35, itc: 30, merchYrs: 10, merchPrice: 30 },
    storage: { mw: 150, capex: 1800, cf: 30, opex: 22, price: 58, tenor: 15, rate: 6.5, dscr: 1.40, itc: 30, merchYrs: 8,  merchPrice: 42 }
  };

  var usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  var pct1 = function (x) { return (x * 100).toFixed(1) + "%"; };

  var els = {};

  function money(x) {
    // compact $ for large figures
    var a = Math.abs(x);
    if (a >= 1e9) return (x / 1e9).toFixed(2) + "B";
    if (a >= 1e6) return (x / 1e6).toFixed(1) + "M";
    if (a >= 1e3) return (x / 1e3).toFixed(0) + "k";
    return String(Math.round(x));
  }
  function dollarsCompact(x) { return "$" + money(x); }

  // Present value of a level annuity of 1 over n years at rate r.
  function annuityFactor(r, n) {
    if (n <= 0) return 0;
    if (r === 0) return n;
    return (1 - Math.pow(1 + r, -n)) / r;
  }
  // Level annual payment that amortizes principal P over n years at rate r.
  function levelPayment(P, r, n) {
    if (n <= 0) return 0;
    if (r === 0) return P / n;
    return P * r / (1 - Math.pow(1 + r, -n));
  }

  // IRR by bisection on NPV; cf[0] is the (negative) equity outlay.
  function irr(cf) {
    function npv(rate) {
      var s = 0;
      for (var t = 0; t < cf.length; t++) s += cf[t] / Math.pow(1 + rate, t);
      return s;
    }
    // need a sign change to have a root
    if (npv(-0.9) * npv(2) > 0) return null;
    var lo = -0.9, hi = 2, mid = 0;
    for (var i = 0; i < 200; i++) {
      mid = (lo + hi) / 2;
      var v = npv(mid);
      if (Math.abs(v) < 1) break;
      if (npv(lo) * v < 0) hi = mid; else lo = mid;
    }
    return mid;
  }

  function num(id, min) {
    var v = parseFloat(els[id].value);
    if (!isFinite(v)) v = 0;
    if (min != null && v < min) v = min;
    return v;
  }

  function recompute() {
    var mw = num("mw", 0), capexKw = num("capex", 0), cf = num("cf", 0) / 100,
        opexKw = num("opex", 0), price = num("price", 0), tenor = Math.round(num("tenor", 1)),
        rate = num("rate", 0) / 100, dscr = num("dscr", 1) || 1, itc = num("itc", 0) / 100,
        merchYrs = Math.round(num("merchYrs", 0)), merchPrice = num("merchPrice", 0);

    var gen = mw * HOURS * cf;               // MWh / yr
    var revenue = gen * price;               // $/yr
    var opex = mw * 1000 * opexKw;           // $/yr
    var cfads = revenue - opex;              // $/yr
    var capex = mw * 1000 * capexKw;         // $

    // Debt the contracted cash flow supports at the target DSCR, capped at gearing.
    // Construction stack is debt + equity; the ITC arrives as year-1 cash (see below).
    var dsCapacity = Math.max(cfads, 0) / dscr;                 // max annual debt service
    var sizedDebt = dsCapacity * annuityFactor(rate, tenor);
    var debt = Math.min(sizedDebt, capex * GEARING_CAP);
    debt = Math.max(debt, 0);
    var equity = Math.max(capex - debt, 0);
    var gearing = capex > 0 ? debt / capex : 0;
    var payment = levelPayment(debt, rate, tenor);
    var actualDscr = payment > 0 ? cfads / payment : Infinity;
    var itcCash = capex * itc;                                  // credit monetized in year 1

    // Equity cash flows: outlay, then contracted years (ITC monetized in year 1),
    // then the merchant tail.
    var contractedCF = cfads - payment;
    var merchRevenue = gen * merchPrice;
    var merchCF = merchRevenue - opex;       // no debt service in the tail
    var cfContracted = [-equity];
    for (var y = 0; y < tenor; y++) cfContracted.push(contractedCF + (y === 0 ? itcCash : 0));
    var cfFull = cfContracted.slice();
    for (var m = 0; m < merchYrs; m++) cfFull.push(merchCF);

    var irrContracted = irr(cfContracted);
    var irrFull = irr(cfFull);

    // ---- KPIs ----
    els.revenue.textContent = dollarsCompact(revenue);
    els.genSub.textContent = Math.round(gen).toLocaleString("en-US") + " MWh/yr @ " + usd.format(price) + "/MWh";
    els.cfads.textContent = dollarsCompact(cfads);
    els.debt.textContent = dollarsCompact(debt);
    els.debtSub.textContent = debt >= capex * GEARING_CAP - 1
      ? "capped at " + Math.round(GEARING_CAP * 100) + "% gearing (DSCR " + (isFinite(actualDscr) ? actualDscr.toFixed(2) : "—") + "×)"
      : "sized to " + dscr.toFixed(2) + "× DSCR";
    els.gearing.textContent = pct1(gearing);
    els.equity.textContent = dollarsCompact(equity);
    els.irr.textContent = irrFull == null ? "n/a" : pct1(irrFull);
    els.irr.className = "k-val mono" + (irrFull != null && irrFull >= 0 ? " credit" : (irrFull != null ? " debit" : ""));

    // ---- capital-stack bar (construction: debt + equity, summing to capex) ----
    var dPct = capex > 0 ? (debt / capex) * 100 : 0;
    var ePct = Math.max(100 - dPct, 0);
    function seg(cls, pct, label) {
      return '<span class="cap-seg ' + cls + '" style="width:' + pct.toFixed(1) + '%">' + (pct > 12 ? label : "") + '</span>';
    }
    els.capstack.innerHTML = seg("cap-debt", dPct, "Debt") + seg("cap-equity", ePct, "Equity");
    els.capLegend.innerHTML =
      '<span><span class="swatch cap-debt"></span> Senior debt ' + dollarsCompact(debt) + ' (' + pct1(debt / (capex || 1)) + ')</span>' +
      '<span><span class="swatch cap-equity"></span> Sponsor equity ' + dollarsCompact(equity) + ' (' + pct1(equity / (capex || 1)) + ')</span>' +
      (itcCash > 0 ? '<span><span class="swatch cap-tax"></span> ITC monetized yr 1: ' + dollarsCompact(itcCash) + ' back to equity</span>' : "");

    // ---- banner ----
    var cls = "credit", msg;
    var tail = merchYrs > 0 && irrFull != null
      ? " Add the " + merchYrs + "-year merchant tail at " + usd.format(merchPrice) + "/MWh and the levered equity return reaches <strong class=\"mono\">" + pct1(irrFull) + "</strong>."
      : "";
    if (cfads <= 0) {
      cls = "debit";
      msg = "At this price and cost the project's operating cash flow is <strong class=\"mono\">" + dollarsCompact(cfads) +
        "/yr</strong> — negative. No lender advances debt against a loss; the PPA price or the cost assumptions have to change before this is financeable.";
    } else if (irrFull == null || irrFull < 0) {
      cls = "debit";
      msg = "This PPA supports <strong class=\"mono\">" + dollarsCompact(debt) + "</strong> of debt (" + pct1(gearing) +
        " gearing at a " + dscr.toFixed(2) + "× DSCR), but even with the merchant tail the <strong class=\"mono\">" + dollarsCompact(equity) +
        "</strong> of sponsor equity doesn't earn a positive return. The price is too thin, the capex too high, or the tenor too short to finance.";
    } else {
      msg = "This PPA supports <strong class=\"mono\">" + dollarsCompact(debt) + "</strong> of debt (" + pct1(gearing) +
        " gearing) at a " + dscr.toFixed(2) + "× DSCR. The sponsor funds <strong class=\"mono\">" + dollarsCompact(equity) +
        "</strong> of equity and earns <strong class=\"mono\">" + (irrContracted == null ? "—" : pct1(irrContracted)) +
        "</strong> over the contracted term — most of the cash flow is going to the lender, which is what a 1.3× DSCR looks like." + tail;
    }
    els.banner.className = "direction-banner " + cls;
    els.banner.innerHTML = msg;
    els.irrSub.textContent = merchYrs > 0 ? "levered, incl. " + merchYrs + "-yr merchant tail" : "levered, contracted term only";
  }

  function applyPreset(key) {
    var p = PRESETS[key];
    if (!p) return;
    els.mw.value = p.mw; els.capex.value = p.capex; els.cf.value = p.cf; els.opex.value = p.opex;
    els.price.value = p.price; els.tenor.value = p.tenor; els.rate.value = p.rate; els.dscr.value = p.dscr;
    els.itc.value = p.itc; els.merchYrs.value = p.merchYrs; els.merchPrice.value = p.merchPrice;
    els.presets.querySelectorAll(".scenario-btn").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.preset === key ? "true" : "false");
    });
    recompute();
  }

  function markCustom() {
    els.presets.querySelectorAll(".scenario-btn").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
  }

  function init() {
    var ids = {
      controls: "pf-controls", presets: "pf-presets", mw: "pf-mw", capex: "pf-capex", cf: "pf-cf",
      opex: "pf-opex", price: "pf-price", tenor: "pf-tenor", rate: "pf-rate", dscr: "pf-dscr", itc: "pf-itc",
      merchYrs: "pf-merch-yrs", merchPrice: "pf-merch-price",
      banner: "pf-banner", revenue: "pf-revenue", genSub: "pf-gen-sub", cfads: "pf-cfads",
      debt: "pf-debt", debtSub: "pf-debt-sub", gearing: "pf-gearing", equity: "pf-equity",
      irr: "pf-irr", irrSub: "pf-irr-sub", capstack: "pf-capstack", capLegend: "pf-capstack-legend"
    };
    var ok = true;
    Object.keys(ids).forEach(function (k) { els[k] = document.getElementById(ids[k]); if (!els[k]) ok = false; });
    if (!ok) return;

    ["mw", "capex", "cf", "opex", "price", "tenor", "rate", "dscr", "itc", "merchYrs", "merchPrice"].forEach(function (k) {
      els[k].addEventListener("input", function () { markCustom(); recompute(); });
    });
    els.presets.querySelectorAll(".scenario-btn").forEach(function (b) {
      b.addEventListener("click", function () { applyPreset(b.dataset.preset); });
    });

    applyPreset("solar");   // single source of truth for the initial state
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
