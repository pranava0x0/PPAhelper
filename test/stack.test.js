/* Supply-stack math: dispatch order, battery conservation, hourly identity.
   Run: node test/stack.test.js */
"use strict";
const assert = require("node:assert");
const { computeStack, SOLAR_SHAPE, WIND_SHAPE } = require("../assets/js/stack-core.js");

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log("  ok  " + name); }
  catch (e) { console.error("FAIL  " + name + "\n      " + e.message); process.exitCode = 1; }
}
const close = (a, b, eps) => Math.abs(a - b) <= (eps == null ? 1e-6 : eps);

test("profiles are 24 hours, normalized 0..1", () => {
  [SOLAR_SHAPE, WIND_SHAPE].forEach((p) => {
    assert.strictEqual(p.length, 24);
    p.forEach((v) => assert.ok(v >= 0 && v <= 1));
  });
  assert.strictEqual(Math.max(...SOLAR_SHAPE), 1, "solar peaks at 1.0");
  assert.ok(SOLAR_SHAPE[0] === 0 && SOLAR_SHAPE[23] === 0, "solar is dark overnight");
});

test("hourly identity: supply components + grid always equal load", () => {
  const r = computeStack({ loadMW: 1000, nuclearMW: 300, gasMW: 200, solarMW: 800, windMW: 400, battMW: 200, battHours: 4 });
  r.hours.forEach((h, i) => {
    const served = h.nuclear + h.solar + h.wind + h.batt + h.gas + h.grid;
    assert.ok(close(served, h.load), "hour " + i + ": served " + served + " != load " + h.load);
  });
});

test("flat nuclear at load: 24/24 covered, 100% CFE, zero open position", () => {
  const r = computeStack({ loadMW: 1000, nuclearMW: 1000 });
  assert.strictEqual(r.kpis.coveredHours, 24);
  assert.ok(close(r.kpis.cfeShare, 1));
  assert.ok(close(r.kpis.openMWh, 0));
  assert.ok(close(r.kpis.gasMWh, 0));
});

test("gas toll alone covers the load but earns 0% CFE", () => {
  const r = computeStack({ loadMW: 1000, gasMW: 1000 });
  assert.strictEqual(r.kpis.coveredHours, 24);
  assert.ok(close(r.kpis.cfeShare, 0));
  assert.ok(close(r.kpis.openMWh, 0));
});

test("solar-only same-nameplate: right energy fraction, wrong hours", () => {
  const r = computeStack({ loadMW: 1000, solarMW: 1000 });
  const solarSum = SOLAR_SHAPE.reduce((a, b) => a + b, 0) * 1000;
  assert.ok(close(r.kpis.cleanMWh, solarSum));
  assert.ok(close(r.kpis.cfeShare, solarSum / 24000));
  // covered only in the hours where the shape reaches 1.0
  assert.strictEqual(r.kpis.coveredHours, SOLAR_SHAPE.filter((v) => v >= 1).length);
  assert.ok(close(r.kpis.openMWh, 24000 - solarSum));
});

test("battery stores only surplus and returns rte of it", () => {
  const rte = 0.82;
  const r = computeStack({ loadMW: 1000, solarMW: 3000, battMW: 500, battHours: 4, rte });
  const charged = r.hours.reduce((a, h) => a + h.battCharge, 0);
  const discharged = r.hours.reduce((a, h) => a + h.batt, 0);
  assert.ok(close(r.kpis.storedMWh, charged));
  assert.ok(charged <= (500 * 4) / rte + 1e-9, "charge side cannot exceed deliverable ÷ rte");
  assert.ok(discharged <= charged * rte + 1e-9, "cannot discharge more than rte of stored");
  assert.ok(close(discharged, charged * rte), "fully discharges into a deep deficit");
  r.hours.forEach((h, i) => {
    assert.ok(h.battCharge === 0 || h.deficit <= 1e-9, "hour " + i + " charges only from surplus");
    assert.ok(h.batt === 0 || h.battCharge === 0, "hour " + i + " never charges and discharges at once");
  });
});

test("duration means hours at full power: a 500 MW / 4 h battery delivers 2,000 MWh", () => {
  // Codex PR #8 finding: the old model capped *charged* energy at MW × hours and
  // took RTE off it, so a "4-hour" battery delivered 3.28 hours. Losses belong
  // on the charge side; the label promises deliverable energy.
  const r = computeStack({ loadMW: 1000, solarMW: 3000, battMW: 500, battHours: 4, rte: 0.82 });
  const discharged = r.hours.reduce((a, h) => a + h.batt, 0);
  assert.ok(close(discharged, 500 * 4, 1e-6), "expected 2,000 MWh delivered, got " + discharged);
});

test("dispatch order: battery displaces the marginal source (gas when gas is marginal)", () => {
  // gas alone can serve the whole deficit, so the battery's discharge displaces gas burn
  const noBatt = computeStack({ loadMW: 1000, solarMW: 2000, gasMW: 1000 });
  const withBatt = computeStack({ loadMW: 1000, solarMW: 2000, gasMW: 1000, battMW: 400, battHours: 4 });
  assert.ok(close(noBatt.kpis.openMWh, 0) && close(withBatt.kpis.openMWh, 0));
  assert.ok(withBatt.kpis.gasMWh < noBatt.kpis.gasMWh, "battery should displace gas burn");
  // when the deficit exceeds battery + gas, the battery displaces grid instead
  const deep = computeStack({ loadMW: 1000, solarMW: 2000, gasMW: 400, battMW: 400, battHours: 4 });
  const deepNoBatt = computeStack({ loadMW: 1000, solarMW: 2000, gasMW: 400 });
  assert.ok(deep.kpis.openMWh < deepNoBatt.kpis.openMWh, "battery should cut the open position");
  assert.ok(close(deep.kpis.gasMWh, deepNoBatt.kpis.gasMWh), "gas stays maxed under a deep deficit");
});

test("battery discharge targets the deepest deficit hours first", () => {
  const r = computeStack({ loadMW: 1000, solarMW: 1000, windMW: 500, battMW: 300, battHours: 3 });
  const drained = r.hours.filter((h) => h.batt > 0);
  const skipped = r.hours.filter((h) => h.deficit > 0 && h.batt === 0);
  if (drained.length && skipped.length) {
    const minServed = Math.min(...drained.map((h) => h.deficit));
    const maxSkipped = Math.max(...skipped.map((h) => h.deficit));
    assert.ok(minServed >= maxSkipped - 1e-9,
      "an hour with deficit " + maxSkipped + " was skipped while " + minServed + " got battery");
  }
  const discharged = r.hours.reduce((a, h) => a + h.batt, 0);
  assert.ok(discharged > 0, "scenario should exercise the battery");
});

test("kpis are internally consistent (clean + gas + open = load energy)", () => {
  const r = computeStack({ loadMW: 1200, nuclearMW: 400, gasMW: 300, solarMW: 900, windMW: 500, battMW: 300, battHours: 2 });
  assert.ok(close(r.kpis.cleanMWh + r.kpis.gasMWh + r.kpis.openMWh, r.kpis.loadMWh));
});

test("garbage inputs coerce to zero instead of NaN", () => {
  const r = computeStack({ loadMW: "x", nuclearMW: -5, solarMW: null });
  assert.strictEqual(r.kpis.loadMWh, 0);
  assert.strictEqual(r.kpis.cfeShare, 0);
  assert.strictEqual(r.kpis.coveredHours, 0);
  r.hours.forEach((h) => assert.ok(!Number.isNaN(h.grid)));
});

console.log("\nstack.test.js: " + passed + " passed");
