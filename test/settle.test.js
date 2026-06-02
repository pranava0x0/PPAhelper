/* Tests for the VPPA settlement math. Run: node test/settle.test.js
   No dependencies — plain Node + assertions. Exits non-zero on failure. */
"use strict";
const assert = require("node:assert");
const { computeSettlement } = require("../assets/js/settle-core.js");

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log("  ok  " + name); }
  catch (e) { console.error("FAIL  " + name + "\n      " + e.message); process.exitCode = 1; }
}

const CALM = [42, 40, 41, 43, 45, 48, 52, 51, 47, 44, 43, 46];

test("calm scenario nets +$50,000 to the buyer", () => {
  const r = computeSettlement(45, 25000, CALM);
  assert.strictEqual(r.netToBuyer, 50000);
});

test("calm scenario: 5 of 12 months in the money for the buyer", () => {
  const r = computeSettlement(45, 25000, CALM);
  assert.strictEqual(r.monthsITMBuyer, 5);
});

test("effective price equals the strike (the hedge identity)", () => {
  const r = computeSettlement(45, 25000, CALM);
  assert.strictEqual(r.effectivePrice, 45);
});

test("hedge identity holds for ANY price path", () => {
  const wild = [5, 250, 0, 99, 33, 180, 12, 60, 75, 1, 400, 22];
  const r = computeSettlement(37.5, 18000, wild);
  assert.ok(Math.abs(r.effectivePrice - 37.5) < 1e-9, "effective " + r.effectivePrice);
});

test("all months above strike: generator pays buyer (net positive), all ITM", () => {
  const r = computeSettlement(40, 10000, [50, 60, 70]);
  assert.ok(r.netToBuyer > 0);
  assert.strictEqual(r.monthsITMBuyer, 3);
});

test("all months below strike: buyer pays generator (net negative), none ITM", () => {
  const r = computeSettlement(60, 10000, [50, 40, 30]);
  assert.ok(r.netToBuyer < 0);
  assert.strictEqual(r.monthsITMBuyer, 0);
});

test("flat at strike: zero settlement, not in the money", () => {
  const r = computeSettlement(45, 25000, [45, 45, 45]);
  assert.strictEqual(r.netToBuyer, 0);
  assert.strictEqual(r.monthsITMBuyer, 0);
});

test("monthly breakdown matches (LMP - strike) * volume", () => {
  const r = computeSettlement(45, 1000, [50, 40]);
  assert.strictEqual(r.monthly[0].settleBuyer, 5000);
  assert.strictEqual(r.monthly[1].settleBuyer, -5000);
});

test("empty series: zero totals, effective price falls back to strike", () => {
  const r = computeSettlement(45, 25000, []);
  assert.strictEqual(r.netToBuyer, 0);
  assert.strictEqual(r.totalVol, 0);
  assert.strictEqual(r.effectivePrice, 45);
});

test("zero volume: no settlement, effective price still the strike", () => {
  const r = computeSettlement(45, 0, CALM);
  assert.strictEqual(r.netToBuyer, 0);
  assert.strictEqual(r.effectivePrice, 45);
});

test("garbage inputs coerce, do not throw", () => {
  const r = computeSettlement("abc", null, [NaN, "12", undefined, 30]);
  assert.ok(Number.isFinite(r.netToBuyer));
});

console.log("\nsettle.test.js: " + passed + " passed");
