/* Validates the glossary single-source-of-truth. Run: node test/data.test.js
   No dependencies. Exits non-zero on failure. */
"use strict";
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log("  ok  " + name); }
  catch (e) { console.error("FAIL  " + name + "\n      " + e.message); process.exitCode = 1; }
}

const raw = fs.readFileSync(path.join(__dirname, "..", "data", "glossary.json"), "utf8");
let data;

test("glossary.json is valid JSON", () => { data = JSON.parse(raw); });
test("has a non-empty terms array", () => {
  assert.ok(Array.isArray(data.terms) && data.terms.length > 0);
});
test("has an updated date", () => { assert.ok(typeof data.updated === "string" && data.updated); });

const STATUSES = ["verified", "secondary", "needs-research"];

test("every term has term/category/def and a valid status", () => {
  data.terms.forEach((t, i) => {
    assert.ok(t.term && typeof t.term === "string", "term #" + i + " missing term");
    assert.ok(t.category && typeof t.category === "string", t.term + ": missing category");
    assert.ok(t.def && t.def.length > 10, t.term + ": missing/short def");
    assert.ok(STATUSES.includes(t.status), t.term + ": bad status '" + t.status + "'");
  });
});

test("verified/secondary terms cite a source with an http(s) URL", () => {
  data.terms.filter(t => t.status !== "needs-research").forEach(t => {
    assert.ok(t.source && t.source.length, t.term + ": missing source");
    assert.ok(/^https?:\/\//.test(t.url || ""), t.term + ": bad/missing url");
  });
});

test("no duplicate terms", () => {
  const seen = new Set();
  data.terms.forEach(t => {
    const k = t.term.toLowerCase();
    assert.ok(!seen.has(k), "duplicate term: " + t.term);
    seen.add(k);
  });
});

test("no machine-local paths leaked into URLs (policy)", () => {
  data.terms.forEach(t => {
    assert.ok(!/\/Users\//.test(t.url || ""), t.term + ": local path in url");
  });
});

console.log("\ndata.test.js: " + passed + " passed (" + (data ? data.terms.length : 0) + " terms checked)");
