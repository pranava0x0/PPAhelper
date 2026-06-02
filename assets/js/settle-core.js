/* settle-core.js — pure VPPA settlement math. Single source of truth.
   Used by the browser simulator (assets/js/simulator.js) and the Node tests
   (test/settle.test.js). UMD wrapper so it loads in both.

   Convention (buyer's perspective): per period, settlement = (LMP - strike) * volume.
   Positive => generator pays buyer. Negative => buyer pays generator. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.PPASettle = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function computeSettlement(strike, volume, lmp) {
    strike = Number(strike) || 0;
    volume = Number(volume) || 0;
    lmp = lmp || [];

    var monthly = [], netToBuyer = 0, totalLmpCost = 0, totalVol = 0,
        monthsITMBuyer = 0, sumLmp = 0;

    for (var i = 0; i < lmp.length; i++) {
      var v = Number(lmp[i]) || 0;
      var diff = v - strike;
      var settleBuyer = diff * volume; // + => generator pays buyer
      monthly.push({ lmp: v, diff: diff, settleBuyer: settleBuyer });
      netToBuyer += settleBuyer;
      totalLmpCost += v * volume;
      totalVol += volume;
      sumLmp += v;
      if (v > strike) monthsITMBuyer++;
    }

    var n = lmp.length || 1;
    // The hedge identity: buyer's all-in cost = market cost minus the settlement
    // it receives, divided by volume. This always equals the strike.
    var effectivePrice = totalVol > 0 ? (totalLmpCost - netToBuyer) / totalVol : strike;

    return {
      monthly: monthly,
      netToBuyer: netToBuyer,
      totalLmpCost: totalLmpCost,
      totalVol: totalVol,
      monthsITMBuyer: monthsITMBuyer,
      avgLmp: sumLmp / n,
      effectivePrice: effectivePrice
    };
  }

  return { computeSettlement: computeSettlement };
});
