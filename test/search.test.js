/* Shared search/view data request: concurrency, recovery and invalid responses. */
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const code = fs.readFileSync(path.join(__dirname, "../assets/js/app.js"), "utf8");
const start = code.indexOf("  var caseData = null;");
const end = code.indexOf("  function paletteCtx", start);
assert.ok(start >= 0 && end > start);
const source = code.slice(start, end);

async function main() {
  let calls = 0, mode = "ok";
  const ctx = { dataUrl: p => p + "?v=test", fetch: async url => {
    calls++;
    assert.equal(url, "data/datacenter.json?v=test");
    return { ok: mode !== "503", status: 503, json: async () => {
      if (mode === "parse") throw new SyntaxError("invalid JSON");
      return mode === "shape" ? {} : { caseStudies: [], vppCases: [] };
    } };
  } };
  vm.createContext(ctx);
  vm.runInContext(source, ctx);
  const first = ctx.loadCaseData();
  assert.equal(ctx.loadCaseData(), first, "concurrent callers must share one promise");
  await first;
  await ctx.loadCaseData();
  assert.equal(calls, 1, "successful result must be reused");
  for (mode of ["503", "parse", "shape"]) {
    vm.runInContext(source, ctx);
    await assert.rejects(ctx.loadCaseData());
    const before = calls;
    const failedMode = mode;
    mode = "ok";
    await ctx.loadCaseData();
    assert.equal(calls, before + 1, failedMode + " failure must allow retry");
  }
  console.log("search.test.js: shared request, cached success, HTTP/JSON/schema failure recovery passed");
}
main().catch(e => { console.error(e); process.exitCode = 1; });
