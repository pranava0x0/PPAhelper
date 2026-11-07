/* Browser acceptance + interaction measurements. Optional external Playwright;
   no runtime dependency or install step. See uat.md for the invocation. */
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.PPA_PLAYWRIGHT_PATH || "playwright");
const url = process.env.PPA_UAT_URL || "http://localhost:8000";
const out = path.resolve(".sessions/uat");
const shots = path.resolve("uat-screenshots");
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync(shots, { recursive: true });
const cases = require("../data/datacenter.json");
const runDate = process.env.PPA_UAT_DATE || new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());
const caseCount = cases.caseStudies.length + cases.vppCases.length;
const pause = p => p.waitForTimeout(100); // let scroll and paint observers deliver

async function reset(p) {
  await p.goto(url);
  await p.waitForFunction(() => window.PPA && document.querySelector("#glossary-list .term"));
  await p.evaluate(() => {
    window.uat = { clicks: 0, inputs: 0, keys: 0, viewChanges: 0, scrollPx: 0, horizontalPx: 0 };
    window.uatY = scrollY;
    window.uatX = document.querySelector("nav.views").scrollLeft;
  });
}

async function reach(p, locator) {
  let gestures = 0;
  for (let i = 0; i < 90; i++) {
    const b = await locator.boundingBox();
    assert.ok(b, "target is hidden");
    const top = await p.locator(".masthead").evaluate(el => el.getBoundingClientRect().bottom);
    const height = p.viewportSize().height;
    if (b.y >= top + 4 && b.y < height - 45) return gestures;
    await p.mouse.move(p.viewportSize().width - 12, height - 90);
    await p.mouse.wheel(0, b.y < top ? -height * 0.7 : height * 0.7);
    gestures++;
    await pause(p);
  }
  throw new Error("Could not reach " + locator + ": " + JSON.stringify(await locator.boundingBox()));
}

async function search(p, query, label) {
  await p.locator("#search-btn").click();
  await p.locator(".palette input").fill(query);
  await p.waitForFunction(() => document.querySelector(".palette-status").hidden);
  const option = p.locator('.palette-list [role="option"]').filter({ hasText: label }).first();
  await option.click();
  await pause(p);
}

async function snapshot(p, name, wheels, start) {
  await pause(p);
  const result = await p.evaluate(() => ({ ...window.uat,
    overflow: document.documentElement.scrollWidth - innerWidth,
    focus: document.activeElement.tagName,
    view: window.PPA.currentView()
  }));
  assert.equal(result.overflow, 0, name + ": document overflow");
  return { name, ...result, manualScrollGestures: wheels, elapsedMs: Math.round(performance.now() - start) };
}

async function instrument(context) {
  await context.addInitScript(() => {
    window.uat = { clicks: 0, inputs: 0, keys: 0, viewChanges: 0, scrollPx: 0, horizontalPx: 0 };
    window.uatY = 0; window.uatX = 0;
    document.addEventListener("click", e => { if (e.isTrusted) window.uat.clicks++; }, true);
    document.addEventListener("input", () => window.uat.inputs++, true);
    document.addEventListener("keydown", () => window.uat.keys++, true);
    addEventListener("scroll", () => {
      window.uat.scrollPx += Math.abs(scrollY - window.uatY); window.uatY = scrollY;
    });
    document.addEventListener("scroll", e => {
      if (e.target.matches && e.target.matches("nav.views")) {
        window.uat.horizontalPx += Math.abs(e.target.scrollLeft - window.uatX);
        window.uatX = e.target.scrollLeft;
      }
    }, true);
    const replace = history.replaceState.bind(history);
    history.replaceState = function (...args) {
      const before = location.hash; replace(...args);
      if (before !== location.hash) window.uat.viewChanges++;
    };
    window.lab = { cls: 0, longTasks: [], lcp: 0 };
    new PerformanceObserver(list => list.getEntries().forEach(e => {
      if (!e.hadRecentInput) window.lab.cls += e.value;
    })).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver(list => list.getEntries().forEach(e => window.lab.longTasks.push(e.duration)))
      .observe({ type: "longtask", buffered: true });
    new PerformanceObserver(list => list.getEntries().forEach(e => window.lab.lcp = e.startTime))
      .observe({ type: "largest-contentful-paint", buffered: true });
  });
}

async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const report = { date: new Date().toISOString(), browser: browser.version(), viewports: [] };
  try {
    for (const [width, height] of [[375, 812], [768, 1024], [1440, 900]]) {
      const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
      await instrument(context);
      const p = await context.newPage();
      const errors = [];
      p.on("pageerror", e => errors.push(e.message));
      await reset(p);
      await p.waitForFunction(() => performance.getEntriesByName("first-contentful-paint").length > 0 && window.lab.lcp > 0);
      await pause(p);
      const cold = await p.evaluate(() => {
        const resources = performance.getEntriesByType("resource").filter(r => !r.name.endsWith("favicon.ico"));
        return { width: innerWidth, hidden: document.hidden,
          domMs: performance.getEntriesByType("navigation")[0].domContentLoadedEventEnd,
          fcpMs: performance.getEntriesByName("first-contentful-paint")[0]?.startTime,
          lcpMs: window.lab.lcp, cls: window.lab.cls, longTasks: window.lab.longTasks,
          requests: resources.length, bytes: resources.reduce((s, r) => s + r.encodedBodySize, 0),
          resources: resources.map(r => new URL(r.name).pathname) };
      });
      assert.equal(cold.width, width); assert.equal(cold.hidden, false);
      assert.ok(!cold.resources.includes("/data/datacenter.json"), "case data loaded before search");
      await p.screenshot({ path: path.join(shots, `${runDate}_${width}-home.png`) });
      const journeys = [];
      for (const [name, query, label, id] of [
        ["Hydro lesson and document link", "Brookfield", "Pennsylvania hydro", "dc-cases-google-brookfield-hydro"],
        ["Battery toll case", "Sierra Estrella", "battery toll", "dc-cases-srp-sierra-estrella"],
        ["Cancelled development case", "UAMPS", "UAMPS", "dc-cases-uamps-nuscale-cancellation"],
        ["Practitioner case from Newcomer", "NIPSCO", "Indiana", "dc-cases-nipsco-amazon"],
        ["VPP example", "CalReady", "CalReady", "vpp-cases-sunrun-calready"]
      ]) {
        await reset(p);
        await p.locator('[data-setlevel="1"]').click();
        await p.evaluate(() => window.uat.clicks = 0); // establish the journey's stated starting mode
        const start = performance.now();
        await search(p, query, label);
        await p.waitForFunction(id => document.getElementById(id)?.open, id);
        assert.equal(await p.locator(`#${id} summary`).evaluate(el => el === document.activeElement), true);
        const headingVisible = await p.locator(`#${id} summary`).evaluate(el => {
          const header = document.querySelector(".masthead").getBoundingClientRect().bottom;
          const toc = el.closest(".view").querySelector(".toc");
          const edge = getComputedStyle(toc).position === "sticky" ? toc.getBoundingClientRect().bottom : header;
          return el.getBoundingClientRect().top >= edge;
        });
        assert.equal(headingVisible, true, "case summary covered by sticky navigation");
        const source = p.locator(`#${id} .src a`).first();
        const sourceBox = await source.boundingBox();
        assert.ok(sourceBox.y > 0 && sourceBox.y < height, "first document link below viewport");
        const requests = await p.evaluate(() => performance.getEntriesByType("resource").filter(r => r.name.includes("/data/datacenter.json")).length);
        assert.equal(requests, 1, "search and renderer fetched the same data twice");
        const result = await snapshot(p, name, 0, start);
        assert.equal(result.clicks, 2); assert.equal(result.inputs, 1); assert.equal(result.viewChanges, 1);
        journeys.push(result);
        await p.screenshot({ path: path.join(shots, `${runDate}_${width}-${id}.png`) });
      }

      for (const [name, query, label, action, output] of [
        ["Settlement scenario and result", "Settlement simulator", "Settlement simulator", '[data-scenario="spike"]', "#kpi-net"],
        ["Finance preset and debt result", "Debt-sizing", "Debt-sizing", '#pf-presets [data-preset="wind"]', "#pf-debt"],
        ["Stack preset and open position", "Gigawatt", "Serve the load", '#st-presets [data-preset="solar"]', "#st-open"],
        ["Generate draft and read output", "Draft PPA", "Draft PPA", "#draft-generate", "#draft-output"]
      ]) {
        await reset(p); const start = performance.now();
        await search(p, query, label);
        await p.locator(action).waitFor({ state: "visible" });
        let wheels = await reach(p, p.locator(action));
        await p.locator(action).click();
        await pause(p); // result jumps are scheduled on the next animation frame
        assert.notEqual((await p.locator(output).textContent()).trim(), "—");
        assert.ok((await p.locator(output).textContent()).trim().length);
        const resultTarget = { "#kpi-net": "sim-results", "#pf-debt": "pf-results", "#st-open": "st-results" }[output];
        if (resultTarget) {
          const jump = p.locator('[data-scroll-to="' + resultTarget + '"]');
          wheels += await reach(p, jump);
          await jump.click();
          await pause(p);
        }
        wheels += await reach(p, p.locator(output));
        if (output === "#kpi-net" || output === "#draft-output") {
          assert.equal(wheels, 0, name + ": avoidable manual scrolling returned");
        }
        journeys.push(await snapshot(p, name, wheels, start));
        await p.screenshot({ path: path.join(shots, `${runDate}_${width}-${output.slice(1)}.png`) });
        if (output === "#draft-output") {
          assert.equal(await p.locator(output).evaluate(el => el === document.activeElement), true);
          assert.deepEqual(await p.locator("#draft-form input, #draft-form select").evaluateAll(els =>
            els.filter(el => el.getBoundingClientRect().height < 44 || el.getBoundingClientRect().width < 44).map(el => el.id)
          ), [], "draft fields must provide 44px targets");
          await p.locator('[data-scroll-to="draft-form"]').click();
          await pause(p);
          await reach(p, p.locator("#d-buyer"));
          await p.locator("#d-buyer").fill("Example Buyer LLC");
          await reach(p, p.locator("#d-gov-law"));
          await p.locator("#d-gov-law").fill("Texas");
          assert.equal(await reach(p, p.locator("#draft-generate")), 0, "Generate must stay reachable after editing the last field");
          await p.locator("#draft-generate").click();
          await pause(p);
          assert.ok((await p.locator(output).textContent()).includes("Example Buyer LLC"));
          assert.ok((await p.locator(output).textContent()).includes("Texas"));
          const pending = p.waitForEvent("download");
          await p.locator("#draft-download").click();
          const download = await pending;
          assert.equal(fs.readFileSync(await download.path(), "utf8"), await p.locator(output).textContent());
        }
      }
      await reset(p); let start = performance.now();
      await search(p, "Letter of Credit", "Letter of Credit");
      assert.equal(await p.locator("#glossary-list .term").count(), 1);
      journeys.push(await snapshot(p, "Glossary definition", 0, start));

      await reset(p); start = performance.now();
      await search(p, "Annotated examples", "Annotated examples");
      const example = p.locator('.example-pill[data-id="real-epe-suntower"]');
      let clauseWheels = await reach(p, example);
      await example.click();
      const clause = p.locator("#clause-list .clause-row").nth(2);
      clauseWheels += await reach(p, clause);
      await clause.click();
      await pause(p);
      clauseWheels += await reach(p, p.locator("#clause-detail"));
      assert.ok((await p.locator("#clause-detail").textContent()).trim().length > 30);
      assert.equal(await p.locator("#clause-detail").evaluate(el => el === document.activeElement), true);
      journeys.push(await snapshot(p, "Filed PPA clause explanation", clauseWheels, start));

      // Every case is reachable, including VPPs and level-gated cases.
      for (const [group, prefix] of [[cases.caseStudies, "dc-cases-"], [cases.vppCases, "vpp-cases-"]]) {
        for (const c of group) {
          await p.locator("#search-btn").click();
          await p.locator(".palette input").fill(c.title);
          await p.locator('.palette-list [role="option"]').first().click();
          await p.waitForFunction(id => document.getElementById(id)?.open, prefix + c.id);
          assert.equal(await p.locator(`#${prefix + c.id}`).isVisible(), true);
        }
      }
      // Keyboard, empty results, focus containment and escape restoration.
      await p.locator("#search-btn").click();
      await p.locator(".palette input").fill("zz-no-such-case-zz");
      assert.equal(await p.locator(".palette-empty").textContent(), "No matches.");
      assert.equal(await p.locator(".palette input").getAttribute("aria-activedescendant"), null);
      await p.keyboard.press("Tab");
      assert.equal(await p.locator(".palette input").evaluate(el => el === document.activeElement), true);
      await p.keyboard.press("Escape");
      assert.equal(await p.locator("#search-btn").evaluate(el => el === document.activeElement), true);
      await p.keyboard.press("/");
      await p.locator(".palette input").fill("Clinton");
      await p.keyboard.press("ArrowDown"); await p.keyboard.press("Enter");
      await p.waitForFunction(() => document.querySelector("#dc-cases-meta-clinton").open);
      await p.locator('[data-setlevel="2"]').click();
      await search(p, "Electricity from scratch", "Electricity from scratch");
      assert.equal(await p.locator('[data-setlevel="1"]').getAttribute("aria-pressed"), "true");
      assert.equal(await p.locator("#stage-1").isVisible(), true);
      const views = await p.locator("nav.views [data-view]").evaluateAll(els => els.map(el => el.dataset.view));
      for (const view of views) {
        await p.locator("#tab-" + view).click();
        await p.waitForFunction(view => window.PPA.currentView() === view, view);
        if (view === "perspectives") await p.locator("#voices .voice-card").first().waitFor();
        assert.equal(await p.locator("#view-" + view).isVisible(), true);
        assert.equal(await p.locator(".load-error:visible").count(), 0);
      }
      await p.locator("#theme-toggle").click();
      assert.equal(await p.locator("html").getAttribute("data-theme"), "dark");
      await p.screenshot({ path: path.join(shots, `${runDate}_${width}-dark.png`) });
      report.viewports.push({ width, height, cold, journeys, casesTested: caseCount, viewsTested: views.length, errors });
      assert.deepEqual(errors, []);
      await context.close();
      console.log(`Passed ${width}×${height}: ${journeys.length} measured journeys, ${caseCount} cases, ${views.length} views`);
    }

    const context = await browser.newContext({ viewport: { width: 375, height: 812 }, reducedMotion: "reduce" });
    await instrument(context);
    const p = await context.newPage();
    let fail = true;
    await p.route("**/data/datacenter.json*", route => fail ? route.fulfill({ status: 503, body: "Unavailable" }) : route.continue());
    await reset(p);
    await p.locator("#search-btn").click();
    await p.locator(".palette input").fill("Brookfield");
    await p.getByRole("button", { name: "Retry case search" }).waitFor();
    fail = false;
    await p.getByRole("button", { name: "Retry case search" }).focus();
    await p.keyboard.press("Enter");
    await p.locator('.palette-list [role="option"]').filter({ hasText: "Pennsylvania hydro" }).click();
    await p.waitForFunction(() => document.querySelector("#dc-cases-google-brookfield-hydro")?.open);
    report.retry = "503 then retry reaches requested case";
    await context.close();

    // Optional lab stress run: the same machine and browser, simulated slower
    // CPU/network. This does not emulate a particular physical phone.
    if (process.env.PPA_UAT_STRESS === "1") {
      for (const savedMode of [false, true]) {
        const slow = await browser.newContext({ viewport: { width: 375, height: 812 } });
        await instrument(slow);
        if (savedMode) await slow.addInitScript(() => {
          localStorage.setItem("ppa-level", "2");
          localStorage.setItem("ppa-chooser-done", "1");
        });
        const page = await slow.newPage();
        const session = await slow.newCDPSession(page);
        await session.send("Network.enable");
        await session.send("Network.emulateNetworkConditions", {
          offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 75000
        });
        await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });
        await reset(page);
        await page.waitForFunction(() => performance.getEntriesByName("first-contentful-paint").length > 0 && window.lab.lcp > 0);
        await page.waitForTimeout(300);
        const timing = await page.evaluate(() => ({
          domMs: performance.getEntriesByType("navigation")[0].domContentLoadedEventEnd,
          fcpMs: performance.getEntriesByName("first-contentful-paint")[0]?.startTime,
          lcpMs: window.lab.lcp, cls: window.lab.cls, longTasks: window.lab.longTasks
        }));
        report[savedMode ? "throttledPractitioner" : "throttled"] = timing;
        assert.ok(timing.cls < 0.1, "initial navigation caused layout shift under throttling");
        await slow.close();
      }
    }
    fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(report, null, 2) + "\n");
    console.log("Saved .sessions/uat/report.json");
  } finally { await browser.close(); }
}
main().catch(e => { console.error(e); process.exitCode = 1; });
