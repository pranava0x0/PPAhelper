/* Lazy-loader behaviour: runs app.js's per-tab loading block (VIEW_SCRIPTS
   through showLoadError) in a vm sandbox with a stub document, so the
   ensureView / onViewLoad race is tested as code, not as a regex.
   Regression: a loader registered while a tab's scripts were still loading
   ran twice (datacenter.json rendered twice on a #datacenter reload).
   Run: node test/loader.test.js */
"use strict";
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

let passed = 0;
const queue = [];
function test(name, fn) { queue.push([name, fn]); }

const appJs = fs.readFileSync(path.join(__dirname, "..", "assets/js/app.js"), "utf8");
const start = appJs.indexOf("  var VIEW_SCRIPTS = {");
const end = appJs.indexOf("  /* Keep the active tab on screen");
assert.ok(start > -1 && end > start, "lazy-loading block not found in app.js");
const block = appJs.slice(start, end);

const flush = () => new Promise((r) => setImmediate(r));

/* Fresh sandbox per test. Injected <script> tags stay pending until the test
   calls finishScripts(), which mimics the network finishing. */
function sandbox() {
  const scripts = [];
  const panels = {};
  function panel(name) {
    if (!panels[name]) {
      const kids = [];
      panels[name] = {
        kids,
        querySelector(sel) {
          if (sel === "h1") return null;
          if (sel === ".load-error") return kids.find((k) => k.className.includes("load-error")) || null;
          return null;
        },
        insertBefore(node) { node.remove = () => kids.splice(kids.indexOf(node), 1); kids.push(node); },
        get firstChild() { return kids[0] || null; }
      };
    }
    return panels[name];
  }
  const document = {
    createElement() { return { className: "", setAttribute() {} }; },
    getElementById(id) { return id.startsWith("view-") ? panel(id.slice(5)) : null; },
    body: { appendChild(s) { scripts.push(s); } }
  };
  const ctx = {
    document, console: { error() {} }, Promise,
    applied: 0,
    dataUrl: (p) => p
  };
  vm.createContext(ctx);
  vm.runInContext("var currentLevel = '1'; function applyLevel() { applied++; }\n" + block +
    "\nthis.ensureView = ensureView; this.onViewLoad = onViewLoad;", ctx);
  return {
    ctx, panels: panel,
    finishScripts() { scripts.splice(0).forEach((s) => s.onload()); },
    failScripts() { scripts.splice(0).forEach((s) => s.onerror()); }
  };
}

async function drain(sb) {
  // datacenter loads two scripts in sequence; let each hop settle
  for (let i = 0; i < 5; i++) { sb.finishScripts(); await flush(); }
}

test("loader registered while the tab's scripts are loading runs exactly once", async () => {
  const sb = sandbox();
  let runs = 0;
  const ready = sb.ctx.ensureView("datacenter");           // initial #datacenter hash
  sb.ctx.onViewLoad("datacenter", () => { runs++; return Promise.resolve(); }); // content.js init
  await drain(sb);
  await ready;
  await flush();
  assert.strictEqual(runs, 1, "loader ran " + runs + " times");
});

test("loader registered after the tab finished loading runs exactly once", async () => {
  const sb = sandbox();
  let runs = 0;
  const ready = sb.ctx.ensureView("datacenter");
  await drain(sb);
  await ready;
  sb.ctx.onViewLoad("datacenter", () => { runs++; return Promise.resolve(); });
  await sb.ctx.ensureView("datacenter");
  assert.strictEqual(runs, 1, "late loader ran " + runs + " times");
});

test("loader registered before the first visit runs once on that visit, not again on revisit", async () => {
  const sb = sandbox();
  let runs = 0;
  sb.ctx.onViewLoad("examples", () => { runs++; return Promise.resolve(); });
  await sb.ctx.ensureView("examples");
  await sb.ctx.ensureView("examples");
  assert.strictEqual(runs, 1);
});

test("a failed loader clears the cached promise, shows a note, and retries next visit", async () => {
  const sb = sandbox();
  let runs = 0, fail = true;
  sb.ctx.onViewLoad("examples", () => {
    runs++;
    return fail ? Promise.reject(new Error("examples 500")) : Promise.resolve();
  });
  await sb.ctx.ensureView("examples");
  assert.ok(sb.panels("examples").querySelector(".load-error"), "no load-error note after a failure");
  fail = false;
  await sb.ctx.ensureView("examples");
  assert.strictEqual(runs, 2, "the loader was not retried");
  assert.strictEqual(sb.panels("examples").querySelector(".load-error"), null,
    "load-error note survived a successful retry");
});

test("a script that fails to load is retried on the next visit", async () => {
  const sb = sandbox();
  let runs = 0;
  sb.ctx.onViewLoad("ppadraft", () => { runs++; return Promise.resolve(); });
  const first = sb.ctx.ensureView("ppadraft");
  await flush();
  sb.failScripts();
  await first;
  assert.strictEqual(runs, 0, "loader ran although draft.js failed");
  const second = sb.ctx.ensureView("ppadraft");
  await drain(sb);
  await second;
  assert.strictEqual(runs, 1);
  assert.strictEqual(sb.panels("ppadraft").querySelector(".load-error"), null);
});

(async () => {
  for (const [name, fn] of queue) {
    try { await fn(); passed++; console.log("  ok  " + name); }
    catch (e) { console.error("FAIL  " + name + "\n      " + e.message); process.exitCode = 1; }
  }
  console.log("\nloader.test.js: " + passed + " passed");
})();
