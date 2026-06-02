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

// ---- cross-file integrity: examples.json + datacenter.json ----
function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", name), "utf8"));
}
const termSet = new Set(data.terms.map(t => t.term));
let examples, dc;

test("examples.json is valid and every clause cites real glossary terms", () => {
  examples = load("examples.json");
  assert.ok(Array.isArray(examples.examples) && examples.examples.length, "no examples");
  examples.examples.forEach(ex => {
    assert.ok(ex.id && ex.title && ex.summary, ex.id + ": missing fields");
    assert.ok(Array.isArray(ex.clauses) && ex.clauses.length, ex.id + ": no clauses");
    ex.clauses.forEach(c => {
      assert.ok(c.label && c.value && c.annotation, ex.id + "/" + c.label + ": incomplete clause");
      assert.ok(["buyer", "seller", "both"].includes(c.party), ex.id + "/" + c.label + ": bad party");
      (c.glossaryRefs || []).forEach(r => {
        assert.ok(termSet.has(r), ex.id + "/" + c.label + ": glossaryRef not in glossary -> " + r);
      });
    });
  });
});

test("datacenter.json is valid; structures cite real terms; deals are sourced", () => {
  dc = load("datacenter.json");
  assert.ok(dc.demand && /^https?:\/\//.test(dc.demand.url || ""), "demand missing source url");
  assert.ok(Array.isArray(dc.structures) && dc.structures.length, "no structures");
  dc.structures.forEach(s => {
    assert.ok(s.name && s.what && s.whyClever && s.tradeoffs, s.id + ": incomplete structure");
    assert.ok([1, 2, 3].includes(s.level), s.id + ": bad level");
    assert.ok(/^https?:\/\//.test(s.url || ""), s.id + ": missing source url");
    (s.glossaryRefs || []).forEach(r => {
      assert.ok(termSet.has(r), s.id + ": glossaryRef not in glossary -> " + r);
    });
  });
  assert.ok(Array.isArray(dc.deals) && dc.deals.length, "no deals");
  dc.deals.forEach(x => {
    assert.ok(x.buyer && x.seller && x.tech && x.capacity, x.buyer + ": incomplete deal");
    assert.ok(/^https?:\/\//.test(x.url || ""), x.buyer + ": deal missing source url");
  });
});

test("data-center structures include newcomer-level entries", () => {
  assert.ok(dc.structures.some(s => s.level === 1), "no level-1 structures for newcomers");
});

let persp;
test("perspectives.json is valid; voices and resources are sourced", () => {
  persp = load("perspectives.json");
  assert.ok(Array.isArray(persp.voices) && persp.voices.length, "no voices");
  persp.voices.forEach(p => {
    assert.ok(p.name && p.role && p.angle && p.view && p.takeaway, p.name + ": incomplete voice");
    assert.ok(/^https?:\/\//.test(p.url || ""), p.name + ": missing source url");
    assert.ok(!/\/Users\//.test(p.url), p.name + ": local path in url");
  });
  assert.ok(Array.isArray(persp.resources) && persp.resources.length, "no resources");
  persp.resources.forEach(x => {
    assert.ok(x.label && x.kind, "resource incomplete");
    assert.ok(/^https?:\/\//.test(x.url || ""), x.label + ": missing url");
  });
});

console.log("\ndata.test.js: " + passed + " passed (" +
  data.terms.length + " terms, " +
  (examples ? examples.examples.length : 0) + " examples, " +
  (dc ? dc.deals.length : 0) + " deals, " +
  (persp ? persp.voices.length : 0) + " voices checked)");
