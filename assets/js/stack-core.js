/* stack-core.js — pure supply-stack math for a flat data-center load.
   Single source of truth for the "Serve the load" builder (assets/js/stack.js)
   and the Node tests (test/stack.test.js). UMD wrapper so it loads in both.

   Model: one representative clear day, 24 hours, flat load. Dispatch order per
   hour: nuclear → solar → wind → battery discharge → gas toll → grid residual.
   The battery charges only from surplus zero-marginal supply (nuclear + solar
   + wind above load), never from gas or grid, and returns rte (default 0.82,
   EIA fleet average) of what it stores. Discharge is allocated to the deepest
   deficit hours first (how an operator schedules against scarcity), limited by
   power (MW) and stored energy (MWh).

   This is an illustration of portfolio mechanics, not a production-cost model:
   the solar/wind shapes are a clear-day profile; annual capacity factors are
   lower (EIA: solar ~25%, onshore wind ~34%). */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.PPAStack = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var SOLAR_SHAPE = [0, 0, 0, 0, 0, 0, 0.10, 0.30, 0.55, 0.75, 0.90, 1.00,
                     1.00, 0.95, 0.85, 0.70, 0.50, 0.30, 0.12, 0.03, 0, 0, 0, 0];
  var WIND_SHAPE  = [0.55, 0.55, 0.50, 0.50, 0.50, 0.45, 0.40, 0.35, 0.30, 0.25, 0.25, 0.20,
                     0.20, 0.20, 0.25, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50, 0.50, 0.55, 0.55];

  function nn(x) { var v = Number(x); return isFinite(v) && v > 0 ? v : 0; }

  /* inputs: { loadMW, nuclearMW, gasMW, solarMW, windMW, battMW, battHours, rte } */
  function computeStack(inputs) {
    inputs = inputs || {};
    var load = nn(inputs.loadMW);
    var nuc = nn(inputs.nuclearMW), gas = nn(inputs.gasMW);
    var sol = nn(inputs.solarMW), win = nn(inputs.windMW);
    var battMW = nn(inputs.battMW), battHours = nn(inputs.battHours);
    var rte = inputs.rte == null ? 0.82 : Math.min(1, nn(inputs.rte));
    var battCap = battMW * battHours; // MWh of storage (energy in)

    var hours = [], h;
    // Pass 1: direct dispatch of must-run supply; find surplus + deficit.
    for (h = 0; h < 24; h++) {
      var solGen = sol * SOLAR_SHAPE[h], winGen = win * WIND_SHAPE[h];
      var nucUsed = Math.min(nuc, load);
      var solUsed = Math.min(solGen, load - nucUsed);
      var winUsed = Math.min(winGen, load - nucUsed - solUsed);
      var surplus = (nuc + solGen + winGen) - (nucUsed + solUsed + winUsed);
      hours.push({
        load: load, nuclear: nucUsed, solar: solUsed, wind: winUsed,
        surplus: surplus, batt: 0, battCharge: 0, gas: 0, grid: 0,
        deficit: load - nucUsed - solUsed - winUsed
      });
    }

    // Pass 2: charge from surplus, chronologically, limited by power and capacity.
    var stored = 0;
    for (h = 0; h < 24; h++) {
      var charge = Math.min(hours[h].surplus, battMW, battCap - stored);
      hours[h].battCharge = charge;
      hours[h].surplus -= charge;
      stored += charge;
    }

    // Pass 3: discharge into the deepest deficit hours first; then gas, then grid.
    var deliverable = stored * rte;
    var order = hours.map(function (_, i) { return i; })
      .sort(function (a, b) { return hours[b].deficit - hours[a].deficit || a - b; });
    order.forEach(function (i) {
      var batt = Math.min(hours[i].deficit, battMW, deliverable);
      deliverable -= batt;
      hours[i].batt = batt;
    });
    for (h = 0; h < 24; h++) {
      var d = hours[h].deficit - hours[h].batt;
      var gasUsed = Math.min(d, gas);
      hours[h].gas = gasUsed;
      hours[h].grid = d - gasUsed;
    }

    var loadMWh = load * 24, cleanMWh = 0, openMWh = 0, surplusMWh = 0,
        gasMWh = 0, covered = 0;
    for (h = 0; h < 24; h++) {
      cleanMWh += hours[h].nuclear + hours[h].solar + hours[h].wind + hours[h].batt;
      openMWh += hours[h].grid;
      surplusMWh += hours[h].surplus;
      gasMWh += hours[h].gas;
      if (hours[h].grid < 1e-9) covered++;
    }

    return {
      hours: hours,
      kpis: {
        loadMWh: loadMWh,
        cleanMWh: cleanMWh,
        gasMWh: gasMWh,
        openMWh: openMWh,
        surplusMWh: surplusMWh,
        storedMWh: stored,
        cfeShare: loadMWh > 0 ? cleanMWh / loadMWh : 0,
        coveredHours: load > 0 ? covered : 0
      }
    };
  }

  return { computeStack: computeStack, SOLAR_SHAPE: SOLAR_SHAPE, WIND_SHAPE: WIND_SHAPE };
});
