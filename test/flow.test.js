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
const css = read("assets/css/styles.css");
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

test("from-scratch path includes contract choice and signature sequence", () => {
  assert.ok(html.includes('id="choose-contract"'), "load/generation contract-choice section missing");
  assert.ok(html.includes('id="need-to-signature"'), "need-to-signature section missing");
  assert.ok(/12 months of hourly use/.test(html), "signing path must begin from interval load data");
  assert.ok(/conditions precedent/.test(html), "signing path must distinguish signature from operation");
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

test("checkpoint options render shuffled; scoring never uses the position", () => {
  const quiz = read("assets/js/quiz.js");
  assert.ok(/function shuffled/.test(quiz) && /shuffled\(q\.opts\)/.test(quiz), "quiz.js does not shuffle q.opts");
  assert.ok(!/q\.opts\[\w+\]\.correct/.test(quiz), "quiz.js marks the correct answer by index into q.opts");
  assert.ok(/c\.opt\.correct/.test(quiz) && /o\.correct/.test(quiz), "scoring must read the option object");
});

/* A tiny fake DOM: just what quiz.js touches (createElement, appendChild,
   textContent, dataset, classList, click listeners, one querySelectorAll). */
function fakeDom() {
  function node(tag) {
    const n = {
      tagName: tag, className: "", children: [], dataset: {}, hidden: false, disabled: false,
      attrs: {}, listeners: {}, ownText: "",
      get firstChild() { return n.children[0] || null; },
      appendChild(c) { n.children.push(c); return c; },
      removeChild(c) { n.children.splice(n.children.indexOf(c), 1); return c; },
      setAttribute(k, v) { n.attrs[k] = String(v); },
      getAttribute(k) { return k in n.attrs ? n.attrs[k] : null; },
      addEventListener(type, fn) { (n.listeners[type] = n.listeners[type] || []).push(fn); },
      click() { if (!n.disabled) (n.listeners.click || []).forEach((fn) => fn()); },
      classList: {
        add(c) { if (!n.className.split(" ").includes(c)) n.className = (n.className + " " + c).trim(); },
        contains(c) { return n.className.split(" ").includes(c); }
      },
      set textContent(v) { n.children = []; n.ownText = String(v); },
      get textContent() { return n.ownText + n.children.map((c) => c.textContent).join(""); }
    };
    return n;
  }
  const root = node("div");
  root.setAttribute("data-quiz", "simulator");
  const document = {
    readyState: "complete",
    createElement: node,
    createTextNode: (t) => ({ textContent: String(t) }),
    querySelectorAll: (sel) => (sel === "[data-quiz]" ? [root] : [])
  };
  return { document, root };
}
function findAll(n, pred, out = []) {
  if (pred(n)) out.push(n);
  (n.children || []).forEach((c) => findAll(c, pred, out));
  return out;
}

test("quiz.js in a fake DOM: shuffled options, clicking the correct one scores it", () => {
  const vm = require("node:vm");
  const { document, root } = fakeDom();
  const results = [];
  const ctx = { document };
  ctx.window = ctx;
  ctx.PPA_QUIZ_BANKS = { simulator: banks.simulator };
  ctx.PPA = { progress: { quizResult: (id, score, total) => results.push([id, score, total]) } };
  vm.createContext(ctx);
  vm.runInContext("Math.random = function () { return 0; };", ctx); // j = 0 every swap: first option ends last
  vm.runInContext(read("assets/js/quiz.js"), ctx);

  const cards = findAll(root, (n) => n.className === "quiz-q");
  assert.strictEqual(cards.length, banks.simulator.length, "rendered " + cards.length + " questions");
  const score = findAll(root, (n) => n.className === "quiz-score")[0];
  assert.strictEqual(score.textContent, "0 / 0");

  cards.forEach((card, qi) => {
    const q = banks.simulator[qi];
    const correctText = q.opts.find((o) => o.correct).t;
    const btns = findAll(card, (n) => n.tagName === "button" && n.className.startsWith("quiz-opt"));
    assert.strictEqual(btns.length, q.opts.length);
    const at = btns.findIndex((b) => b.children[1].textContent === correctText);
    assert.ok(at > -1, "correct option not rendered for question " + (qi + 1));
    if (q.opts[0].correct) assert.notStrictEqual(at, 0, "question " + (qi + 1) + ": correct option was not shuffled off A");
    if (qi === 0) {
      btns[at].click();
      assert.strictEqual(score.textContent, "1 / 1", "clicking the correct option did not score");
      assert.ok(btns[at].classList.contains("correct"), "correct option not marked");
      btns[(at + 1) % btns.length].click(); // a second click on an answered card is ignored
      assert.strictEqual(score.textContent, "1 / 1", "an answered question scored twice");
    } else if (qi === 1) {
      const wrong = btns[(at + 1) % btns.length];
      wrong.click();
      assert.strictEqual(score.textContent, "1 / 2", "a wrong answer changed the score");
      assert.ok(wrong.classList.contains("wrong") && btns[at].classList.contains("correct"));
    } else {
      btns[at].click();
    }
  });
  const total = banks.simulator.length;
  assert.strictEqual(score.textContent, (total - 1) + " / " + total);
  assert.deepStrictEqual(results, [["simulator", total - 1, total]], "finished run not reported to PPA.progress");
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

/* ---- Pass C: Newcomer ↔ Practitioner consistency ---- */

test("course numbers are unified across levels (no per-level hiding)", () => {
  assert.ok(!/nav\.views\.lvl2\s+\.course-num/.test(css),
    "styles.css still hides course numbers for practitioners — numbering must agree in both modes");
  assert.ok(!/classList\.toggle\("lvl2"/.test(appJs),
    "app.js still toggles the nav .lvl2 class that hid course numbers");
});

test("newcomer stubs: builder wired and there are gated sections to stub", () => {
  assert.ok(/function buildLevelStubs/.test(appJs), "buildLevelStubs missing from app.js");
  assert.ok(/buildLevelStubs\(\);/.test(appJs), "buildLevelStubs never called in init");
  assert.ok(/\[data-level="2"\]/.test(appJs), "buildLevelStubs must query [data-level=2] sections");
  assert.ok(/data-level-only", "1"/.test(appJs), "stubs must carry data-level-only=1 so applyLevel swaps them");
  // there must be practitioner sections with an h2 for the stubs to represent
  const gatedH2 = (html.match(/data-level="2"/g) || []).length;
  assert.ok(gatedH2 >= 8, "suspiciously few gated practitioner blocks: " + gatedH2);
});

test("partial-state count lines: hosts present and wired into applyLevel", () => {
  const hosts = [...html.matchAll(/data-level-count="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(hosts.length >= 4, "expected >=4 level-count hosts, got " + hosts.length);
  hosts.forEach((sel) => {
    const id = sel.replace(/^#/, "");
    assert.ok(html.includes('id="' + id + '"'), "count host targets missing container '" + sel + "'");
  });
  assert.ok(/function updateLevelCounts/.test(appJs), "updateLevelCounts missing from app.js");
  assert.ok(/updateLevelCounts\(level\)/.test(appJs), "updateLevelCounts not called from applyLevel");
});

/* ---- Round 11 (2026-10-22): section order, checkpoint counts, Sunridge arithmetic ---- */
test("Learn: contract choice comes after the Scope 2 chain and before Who's who", () => {
  const at = (id) => html.indexOf('id="' + id + '"');
  ["scope-2-chain", "choose-contract", "whos-who"].forEach(id => assert.ok(at(id) > -1, "missing #" + id));
  assert.ok(at("scope-2-chain") < at("choose-contract") && at("choose-contract") < at("whos-who"),
    "choose-contract must sit between scope-2-chain and whos-who");
});

test("Data centers: decoder, then case studies and VPPs, then Structures", () => {
  const view = html.slice(html.indexOf('id="view-datacenter"'), html.indexOf('id="view-perspectives"'));
  const order = ['id="headline-decoder"', 'id="case-studies"', 'id="vpp-ppas"', 'id="dc-structures"',
    'id="tech-contracts"', 'id="serve-the-load"', 'id="large-load"', 'id="gigawatt-playbook"',
    'id="recent-deals"', 'id="checkpoint-datacenter"'].map(m => view.indexOf(m));
  order.forEach((v, i) => assert.ok(v > -1, "missing data-center anchor #" + i));
  for (let i = 1; i < order.length; i++) assert.ok(order[i - 1] < order[i], "data-center section out of order at #" + i);
});

test("checkpoint notes state the bank's real question count and pass mark", () => {
  const words = { two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 };
  [...html.matchAll(/<p class="quiz-note">(\w+) questions[^<]*?(\w+) right marks[^<]*<\/p>\s*<div class="quiz" data-quiz="([a-z]+)"/g)]
    .forEach(([, n, pass, bank]) => {
      const total = banks[bank].length;
      assert.strictEqual(words[n.toLowerCase()], total, bank + ": note says " + n + " questions, bank has " + total);
      assert.strictEqual(words[pass.toLowerCase()], total - 1, bank + ": pass mark must be total − 1");
    });
});

test("Sunridge settlement cells equal (hub − strike) × volume, with the right direction", () => {
  const table = html.slice(html.indexOf("Three months of settlement after COD"), html.indexOf("This is basis risk in action"));
  const rows = [...table.matchAll(/<td class="num">\$(\d+)<\/td>\s*<td class="num">\$(\d+)<\/td>\s*<td class="num">\$(\d+)<\/td>\s*<td class="num">([\d,]+) MWh<\/td>\s*<td class="num (?:debit|credit)">([−+])\$([\d,]+) (buyer→gen\.|gen\.→buyer)<\/td>/g)];
  assert.strictEqual(rows.length, 3, "expected 3 Sunridge settlement rows, parsed " + rows.length);
  rows.forEach(([, hub, , strike, vol, sign, amt, dir]) => {
    const v = (Number(hub) - Number(strike)) * Number(vol.replace(/,/g, ""));
    assert.strictEqual(Number(amt.replace(/,/g, "")), Math.abs(v), "settlement amount wrong for hub $" + hub);
    assert.strictEqual(sign === "+" ? 1 : -1, Math.sign(v), "sign wrong for hub $" + hub);
    assert.strictEqual(dir, v > 0 ? "gen.→buyer" : "buyer→gen.", "direction wrong for hub $" + hub);
  });
  const vols = rows.map(r => Number(r[4].replace(/,/g, "")));
  assert.ok(vols[1] > vols[0] && vols[2] > vols[0], "solar volumes must be higher in Jul/Aug than in Jan");
});

console.log("\nflow.test.js: " + passed + " passed (" +
  courseViews.length + " stops, " + Object.keys(banks).length + " quiz banks checked)");
