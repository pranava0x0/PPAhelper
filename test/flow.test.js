/* Course-flow integrity: the nav order matches the COURSE spine, the
   practitioner-index anchors resolve, the quiz banks are well-formed, and
   every checkpoint container is wired to a bank. Run: node test/flow.test.js */
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
const banks = require("../assets/js/quiz-banks.js");

const courseBlock = appJs.match(/var COURSE = \[([\s\S]*?)\];/);
const courseViews = courseBlock ? [...courseBlock[1].matchAll(/view: "([a-z]+)"/g)].map((m) => m[1]) : [];

test("COURSE has 7 stops and every stop has a view section", () => {
  assert.strictEqual(courseViews.length, 7, "expected 7 course stops, got " + courseViews.length);
  courseViews.forEach((v) => assert.ok(html.includes('id="view-' + v + '"'), "no #view-" + v));
});

test("nav button order = course order, then glossary + coverage", () => {
  const tabs = [...html.matchAll(/id="tab-([a-z]+)"/g)].map((m) => m[1]);
  assert.deepStrictEqual(tabs, [...courseViews, "glossary", "coverage"],
    "nav tabs out of order vs the COURSE spine");
});

test("every PRAC_INDEX target id exists in index.html", () => {
  const block = appJs.match(/var PRAC_INDEX = \[([\s\S]*?)\];/);
  assert.ok(block, "PRAC_INDEX not found in app.js");
  const targets = [...block[1].matchAll(/target: "([a-z0-9-]+)"/g)].map((m) => m[1]);
  assert.ok(targets.length >= 10, "suspiciously few practitioner targets: " + targets.length);
  targets.forEach((t) => assert.ok(html.includes('id="' + t + '"'), "missing anchor id '" + t + "'"));
});

test("path chooser and practitioner index slots exist (index is level-2 gated)", () => {
  assert.ok(/<div id="path-chooser"/.test(html), "#path-chooser missing");
  const prac = html.match(/<div id="prac-index"[^>]*>/);
  assert.ok(prac, "#prac-index missing");
  assert.ok(/data-level="2"/.test(prac[0]), '#prac-index must carry data-level="2"');
});

test("quiz banks are well-formed (>=3 options, exactly one correct, explanations)", () => {
  const names = Object.keys(banks);
  assert.ok(names.length >= 5, "expected 5 banks, got " + names.length);
  names.forEach((name) => {
    const qs = banks[name];
    const min = name === "datacenter" ? 2 : 3;
    assert.ok(Array.isArray(qs) && qs.length >= min, name + " has fewer than " + min + " questions");
    qs.forEach((q, i) => {
      assert.ok(q.prompt && q.prompt.length > 10, name + "[" + i + "] prompt too short");
      assert.ok(Array.isArray(q.opts) && q.opts.length >= 3, name + "[" + i + "] needs >=3 options");
      assert.strictEqual(q.opts.filter((o) => o.correct).length, 1,
        name + "[" + i + "] must have exactly one correct option");
      assert.ok(q.explain && q.explain.length > 20, name + "[" + i + "] explanation missing");
    });
  });
});

test("every data-quiz container has a bank and vice versa (perspectives exempt)", () => {
  const containers = [...html.matchAll(/data-quiz="([a-z]+)"/g)].map((m) => m[1]);
  assert.deepStrictEqual([...containers].sort(), Object.keys(banks).sort(),
    "data-quiz containers and quiz banks out of sync");
  assert.ok(!containers.includes("perspectives"), "perspectives is opinion content — no checkpoint");
});

test("quiz results feed course progress; storage keys are stable", () => {
  assert.ok(/quizResult/.test(read("assets/js/quiz.js")), "quiz.js never reports results to PPA.progress");
  assert.ok(/"ppa-progress"/.test(appJs), "progress storage key missing from app.js");
  assert.ok(/"ppa-chooser-done"/.test(appJs), "chooser flag key missing from app.js");
});

test("quick-nav palette: masthead button plus / and Ctrl-K bindings", () => {
  assert.ok(/buildSearchButton/.test(appJs) && /openPalette/.test(appJs), "palette wiring missing from app.js");
  assert.ok(/e\.key === "\/"/.test(appJs), "slash shortcut missing");
  assert.ok(/toLowerCase\(\) === "k"/.test(appJs), "Ctrl/Cmd-K shortcut missing");
});

console.log("\nflow.test.js: " + passed + " passed (" +
  courseViews.length + " stops, " + Object.keys(banks).length + " quiz banks checked)");
