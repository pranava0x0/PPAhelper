/* Static UI-integrity checks over index.html + app.js + glossary.json.
   No DOM engine, no deps — guards regressions that pure-JS eval misses
   (e.g. a control that filters itself, or an inline tooltip term that
   doesn't resolve). Run: node test/ui.test.js */
"use strict";
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log("  ok  " + name); }
  catch (e) { console.error("FAIL  " + name + "\n      " + e.message); process.exitCode = 1; }
}
const read = (p) => fs.readFileSync(path.join(__dirname, "..", p), "utf8");

const html = read("index.html");
const appJs = read("assets/js/app.js");
const glossary = JSON.parse(read("data/glossary.json"));
const termSet = new Set(glossary.terms.map((t) => t.term));

function decode(s) {
  return s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
}

// --- Regression for the level-filter "self-filtering" bug ---
test("level-filter control does NOT use the content-filter attribute data-level", () => {
  const m = html.match(/<div class="level-filter"[\s\S]*?<\/div>/);
  assert.ok(m, "level-filter block not found");
  const block = m[0];
  assert.ok(!/data-level=/.test(block),
    "level-filter buttons use data-level — applyLevel() will hide the control itself");
  assert.strictEqual((block.match(/data-setlevel=/g) || []).length, 2,
    "expected 2 data-setlevel buttons (Newcomer / Practitioner — All was removed)");
  assert.ok(!/data-setlevel="all"/.test(block), "the removed All mode is back in the markup");
});

// --- Two-level filter: the modes must actually differ in both directions ---
test("newcomer-only on-ramp content exists and app.js handles data-level-only", () => {
  assert.ok(/data-level-only="1"/.test(html),
    "no data-level-only content — Practitioner would be a superset, not a different mode");
  assert.ok(/data-level-only/.test(appJs), "app.js never reads data-level-only");
  assert.ok(!/level === "all"/.test(appJs), "app.js still special-cases the removed 'all' level");
  assert.ok(/saved === "all"/.test(appJs), "localStorage migration for saved 'all' level missing");
});

test("applyLevel is driven by data-setlevel in app.js", () => {
  assert.ok(/dataset\.setlevel/.test(appJs), "app.js should read dataset.setlevel");
  assert.ok(!/applyLevel\(b\.dataset\.level\)/.test(appJs), "stale dataset.level wiring present");
});

// --- Nav / view consistency ---
const tabNames = [...html.matchAll(/id="tab-([a-z]+)"/g)].map((m) => m[1]);
const viewIds = new Set([...html.matchAll(/id="view-([a-z]+)"/g)].map((m) => m[1]));

test("every nav tab has a matching view section", () => {
  assert.ok(tabNames.length >= 6, "too few tabs found");
  tabNames.forEach((t) => assert.ok(viewIds.has(t), "tab '" + t + "' has no #view-" + t));
});

test("every data-view target resolves to a view section", () => {
  const targets = new Set([...html.matchAll(/data-view="([a-z]+)"/g)].map((m) => m[1]));
  targets.forEach((v) => assert.ok(viewIds.has(v), "data-view='" + v + "' has no matching view"));
});

test("app.js VIEWS array matches the nav tabs", () => {
  const m = appJs.match(/var VIEWS = \[([^\]]*)\]/);
  assert.ok(m, "VIEWS array not found in app.js");
  const views = m[1].match(/"([a-z]+)"/g).map((s) => s.replace(/"/g, ""));
  assert.deepStrictEqual([...views].sort(), [...tabNames].sort(),
    "VIEWS array and nav tabs are out of sync");
});

// --- Inline glossary tooltips must resolve ---
test("every inline data-term tooltip resolves to a glossary term", () => {
  const terms = [...html.matchAll(/data-term="([^"]+)"/g)].map((m) => decode(m[1]));
  assert.ok(terms.length > 0, "no inline glossary terms found");
  const missing = terms.filter((t) => !termSet.has(t));
  assert.deepStrictEqual(missing, [], "inline data-term values not in glossary: " + missing.join(" | "));
});

// --- Hover explainer card + acronym auto-tagging (replaces title-attribute tooltips) ---
test("explainer card replaces title tooltips; acronym map resolves to real terms", () => {
  assert.ok(!/setAttribute\("title"/.test(appJs),
    "app.js still sets title-attribute tooltips (broken on touch, poor for screen readers)");
  assert.ok(/term-card/.test(appJs) && /autoTagAcronyms/.test(appJs),
    "term-card popover or autoTagAcronyms missing from app.js");
  const css = read("assets/css/styles.css");
  assert.ok(/\.term-card\s*\{/.test(css), ".term-card styles missing");
  // every acronym app.js will extract must map to exactly one glossary term
  const acr = new Map();
  glossary.terms.forEach((t) => {
    const m = t.term.match(/\(([A-Z][A-Za-z&-]{1,9})\)/);
    if (m && !acr.has(m[1])) acr.set(m[1], t.term);
  });
  assert.ok(acr.size >= 15, "expected 15+ parenthesized acronyms in glossary, got " + acr.size);
  acr.forEach((term, a) => assert.ok(termSet.has(term), "acronym " + a + " maps to missing term " + term));
});

// --- DESIGN.md scar tissue: the [hidden] guard must exist ---
test("[hidden] display guard is present in CSS", () => {
  const css = read("assets/css/styles.css");
  assert.ok(/\[hidden\]\s*\{\s*display:\s*none/.test(css), "[hidden] { display: none } guard missing");
});

console.log("\nui.test.js: " + passed + " passed (" + tabNames.length + " tabs, " +
  [...html.matchAll(/data-term="([^"]+)"/g)].length + " inline terms checked)");
