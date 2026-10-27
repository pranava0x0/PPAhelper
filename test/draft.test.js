/* Draft-generator text checks: runs draft.js's pure buildPPA under Node
   (UMD export) for each technology and asserts the clauses the site's own
   lessons require. Run: node test/draft.test.js */
"use strict";
const assert = require("node:assert");
const { buildPPA } = require("../assets/js/draft.js");

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log("  ok  " + name); }
  catch (e) { console.error("FAIL  " + name + "\n      " + e.message); process.exitCode = 1; }
}

const base = { buyer: "Acme Data Centers LLC", seller: "Sunridge Energy LLC", capacity: "150",
  iso: "PJM", settlePoint: "PJM Western Hub", strike: "45", escalation: "flat", term: "15",
  cod: "December 31, 2027", govLaw: "Delaware" };
const solar = buildPPA(Object.assign({}, base, { tech: "solar PV" }));
const wind = buildPPA(Object.assign({}, base, { tech: "wind" }));
const nuclear = buildPPA(Object.assign({}, base, { tech: "nuclear" }));
const geo = buildPPA(Object.assign({}, base, { tech: "geothermal" }));

function section(text, startMark, endMark) {
  const a = text.indexOf(startMark);
  assert.ok(a > -1, "missing " + startMark);
  const b = text.indexOf(endMark, a);
  return text.slice(a, b > -1 ? b : undefined);
}

[["solar", solar], ["nuclear", nuclear]].forEach(([name, out]) => {
  test(name + ": has a Curtailment section, kept out of Force Majeure", () => {
    assert.ok(/3\.7  Curtailment\./.test(out), "no Section 3.7 Curtailment");
    const fm = section(out, "ARTICLE 9 — FORCE MAJEURE", "ARTICLE 10");
    assert.ok(!/curtailment orders/i.test(fm), "Force Majeure lists curtailment orders");
  });

  test(name + ": states the settlement direction in words", () => {
    assert.ok(out.includes("when the hub price is above the Fixed Price,"), "no in-words direction");
    assert.ok(/Seller pays Buyer; when it is below, Buyer pays Seller\./.test(out), "direction sentence changed");
    assert.ok(out.includes("→ Seller pays Buyer (market above strike)."), "worked example (strike 45 < LMP 55) lost its direction");
  });

  test(name + ": contract body carries no tool commentary or dated context line", () => {
    assert.ok(!/simulator/i.test(out), "draft mentions the simulator");
    assert.ok(!/Context as of/.test(out), "dated context line is back in Exhibit C");
    assert.ok(/\[Drafting note: re-verify the Project's federal tax-credit/.test(out), "re-verify note missing");
  });

  test(name + ": every line fits the 64-column template", () => {
    const long = out.split("\n").filter((l) => [...l].length > 64);
    assert.deepStrictEqual(long, []);
  });
});

test("nuclear: no construction-era terms", () => {
  ["REC registration", "Delay Damages", "5% safe harbor", "qualified renewable facility",
    "beginning-of-construction", "construction,", "LGIA", "achieve\n         COD", "45Y/48E"].forEach((s) =>
    assert.ok(!nuclear.includes(s), "nuclear draft still contains " + JSON.stringify(s)));
  assert.ok(!/\bCOD\b/.test(nuclear), "nuclear draft still refers to COD");
});

test("nuclear: operating-plant terms replace them", () => {
  assert.ok(/"Delivery Start Date" means December 31, 2027/.test(nuclear), "no Delivery Start Date definition");
  assert.ok(/8\.2  Availability Guarantee\./.test(nuclear), "no availability clause in place of delay damages");
  assert.ok(/NRC\s+operating license/.test(section(nuclear, "EXHIBIT B", "EXHIBIT C")),
    "Exhibit B does not ask for the operating license");
  assert.ok(/certificate registration and transfer/.test(nuclear), "4.3 not branched to certificates");
});

test("renewable path keeps COD, delay damages, and the construction-start rep", () => {
  [solar, wind, geo].forEach((out) => {
    assert.ok(/8\.2  Delay Damages\./.test(out), "delay damages missing");
    assert.ok(/"COD" or "Commercial Operation Date"/.test(out), "COD definition missing");
    assert.ok(/beginning-of-construction/.test(out), "construction-start rep missing");
    assert.ok(/REC registration/.test(out), "REC registration missing");
    assert.ok(/construction,\s+environmental, and land-use permits/.test(out), "construction permits CP missing");
  });
});

test("wind/solar credit cutoff shows only for wind or solar", () => {
  assert.ok(/Jul 4, 2026/.test(solar) && /Jul 4, 2026/.test(wind), "cutoff missing for wind/solar");
  assert.ok(/Jul 4, 2026/.test(buildPPA(Object.assign({}, base, { tech: "solar + battery storage" }))),
    "cutoff missing for solar + storage");
  assert.ok(!/Jul 4, 2026/.test(geo) && !/Jul 4, 2026/.test(nuclear), "wind/solar cutoff shown for geothermal/nuclear");
});

test("blank inputs fall back to bracketed placeholders", () => {
  const out = buildPPA({});
  assert.ok(out.includes("[BUYER NAME]") && out.includes("[STRIKE PRICE]") && out.includes("[TARGET COD DATE]"));
  assert.ok(buildPPA({ tech: "nuclear" }).includes("[DELIVERY START DATE]"));
});

console.log("\ndraft.test.js: " + passed + " passed");
