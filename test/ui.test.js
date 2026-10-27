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

// --- "On this page" contents bar ---
test("per-view TOC is built, level-synced, and uses data-scroll-to (not hash links)", () => {
  assert.ok(/function buildTocs/.test(appJs), "buildTocs missing from app.js");
  assert.ok(/syncTocs\(\);/.test(appJs.match(/function applyLevel[\s\S]*?\n  \}/)[0]),
    "applyLevel does not call syncTocs — TOC entries won't follow the level filter");
  assert.ok(!/\.toc[\s\S]{0,400}?a\.href = "#/.test(appJs),
    "TOC must use data-scroll-to buttons; hash hrefs would trigger the view router");
  const css = read("assets/css/styles.css");
  assert.ok(/\.toc-link/.test(css) && /scroll-margin-top/.test(css),
    ".toc-link styles or the sticky-masthead scroll-margin offset missing");
});

// --- Data fetches must ride the asset version (stale-JSON scar, 2026-08-08) ---
test("every data/*.json fetch is versioned via dataUrl()", () => {
  const fs2 = require("node:fs");
  ["assets/js/app.js", "assets/js/content.js"].forEach((f) => {
    const src = read(f);
    assert.ok(!/fetch\(\s*"data\//.test(src),
      f + " fetches data/*.json without dataUrl() — a deploy can serve stale JSON to fresh JS");
    if (/fetch\(/.test(src)) assert.ok(/function dataUrl/.test(src), f + " missing dataUrl helper");
  });
});

// --- DESIGN.md scar tissue: the [hidden] guard must exist ---
test("[hidden] display guard is present in CSS", () => {
  const css = read("assets/css/styles.css");
  assert.ok(/\[hidden\]\s*\{\s*display:\s*none/.test(css), "[hidden] { display: none } guard missing");
});

test("decorative eyebrow labels are removed", () => {
  assert.ok(!/class=["'][^"']*eyebrow/.test(html), "index.html still uses decorative eyebrow labels");
  assert.ok(!/\.eyebrow\s*\{/.test(read("assets/css/styles.css")), "eyebrow CSS rule still exists");
  assert.ok(!/className\s*=\s*["']eyebrow/.test(appJs), "app.js still generates eyebrow labels");
});

test("case-study glance table host sits above the accordions and is rendered", () => {
  const glanceAt = html.indexOf('id="dc-cases-glance"');
  const casesAt = html.indexOf('id="dc-cases"');
  assert.ok(glanceAt > -1, "index.html missing #dc-cases-glance host");
  assert.ok(casesAt > -1 && glanceAt < casesAt, "#dc-cases-glance must come before #dc-cases");
  const content = read("assets/js/content.js");
  assert.ok(/dc-cases-glance/.test(content), "content.js never renders dc-cases-glance");
  const glanceFn = content.slice(content.indexOf("function renderCaseGlance"), content.indexOf("function openCase"));
  assert.ok(glanceFn.length > 200 && !/innerHTML/.test(glanceFn), "renderCaseGlance must build the table with createElement, not innerHTML");
});

test("browser scripts remain valid JavaScript", () => {
  const vm = require("node:vm");
  ["assets/js/app.js", "assets/js/content.js", "assets/js/quiz-banks.js", "assets/js/quiz.js"].forEach((file) => {
    assert.doesNotThrow(() => new vm.Script(read(file)), file + " has a syntax error");
  });
});

// --- Per-tab lazy loading (Oct 2026 pass): manifest in app.js replaces the script tags ---
const manifestBlock = appJs.match(/var VIEW_SCRIPTS = \{([\s\S]*?)\};/);
const manifest = {};
if (manifestBlock) {
  for (const m of manifestBlock[1].matchAll(/(\w+):\s*\[([^\]]*)\]/g)) {
    manifest[m[1]] = [...m[2].matchAll(/"([\w.-]+\.js)"/g)].map((x) => x[1]);
  }
}
const lazyFiles = Object.values(manifest).flat();

test("lazy-load manifest maps each tab to its scripts", () => {
  assert.ok(manifestBlock, "VIEW_SCRIPTS manifest missing from app.js");
  assert.deepStrictEqual(manifest, {
    simulator: ["settle-core.js", "simulator.js"],
    ppadraft: ["draft.js"],
    projfin: ["projfin.js"],
    datacenter: ["stack-core.js", "stack.js"]
  }, "manifest drifted (core files must precede their UI script)");
  Object.keys(manifest).forEach((v) => assert.ok(viewIds.has(v), "manifest view '" + v + "' has no #view-" + v));
});

test("every lazy file exists on disk and is valid JavaScript", () => {
  const vm = require("node:vm");
  lazyFiles.forEach((f) => {
    const p = path.join(__dirname, "..", "assets/js", f);
    assert.ok(fs.existsSync(p), "manifest file missing: assets/js/" + f);
    assert.doesNotThrow(() => new vm.Script(fs.readFileSync(p, "utf8")), f + " has a syntax error");
    assert.ok(/document\.readyState/.test(fs.readFileSync(p, "utf8")) || /-core\.js$/.test(f),
      f + " must guard document.readyState so a late insert still runs init()");
  });
});

test("lazy files ride the same ?v= as the page (no script tags, versioned src)", () => {
  lazyFiles.forEach((f) => assert.ok(!new RegExp('<script[^>]+' + f.replace(".", "\\.")).test(html),
    f + " is still a <script> tag in index.html — it should load via the manifest"));
  const tags = [...html.matchAll(/<script src="assets\/js\/([\w.-]+)\?v=([\w-]+)"/g)];
  assert.deepStrictEqual(tags.map((m) => m[1]), ["quiz-banks.js", "quiz.js", "app.js", "content.js"],
    "eager scripts changed");
  const versions = new Set([...html.matchAll(/\?v=([\w-]+)/g)].map((m) => m[1]));
  assert.strictEqual(versions.size, 1, "index.html mixes ?v= strings: " + [...versions].join(", "));
  assert.ok(/s\.src = dataUrl\("assets\/js\/" \+ file\)/.test(appJs),
    "lazy script src must go through dataUrl() so it carries app.js's ?v=");
  assert.ok(/return ensureView\(name\)/.test(appJs), "showView must return ensureView(name)");
});

test("content.js fetches tab JSON on first visit via PPA.onViewLoad", () => {
  const content = read("assets/js/content.js");
  const map = content.match(/var VIEW_DATA = \{([^}]*)\}/);
  assert.ok(map, "VIEW_DATA map missing from content.js");
  ["examples: loadExamples", "datacenter: loadDatacenter", "perspectives: loadPerspectives"].forEach((pair) =>
    assert.ok(map[1].includes(pair), "VIEW_DATA missing " + pair));
  assert.ok(/ppa\.onViewLoad\(/.test(content), "content.js never registers with PPA.onViewLoad");
  assert.ok(/function onViewLoad/.test(appJs), "app.js missing onViewLoad");
});

// --- Masthead + tab bar (Oct 2026 pass) ---
const css = read("assets/css/styles.css");
test("masthead is opaque: no backdrop-filter", () => {
  const block = css.match(/\.masthead \{[^}]*\}/);
  assert.ok(block, ".masthead rule not found");
  assert.ok(!/backdrop-filter/.test(block[0]), ".masthead still sets backdrop-filter");
  assert.ok(/background: var\(--bg\)/.test(block[0]), ".masthead background must be opaque var(--bg)");
});

test("every nav tab carries a data-short label, swapped in by CSS below 1024px", () => {
  const navBtns = [...html.matchAll(/<button class="nav-btn[^"]*"[^>]*>/g)].map((m) => m[0]);
  assert.strictEqual(navBtns.length, tabNames.length, "nav-btn count != tab count");
  navBtns.forEach((b) => assert.ok(/data-short="[^"]+"/.test(b), "nav button lacks data-short: " + b));
  assert.ok(/getAttribute\("data-short"\)/.test(appJs), "app.js never reads data-short");
  const narrowNav = css.match(/@media \(max-width: 1023px\) \{([\s\S]*?)\n\}/);
  assert.ok(narrowNav, "no <=1023px nav label block");
  assert.ok(/\.nav-btn\[data-short\] \.nav-short \{ display: inline; \}/.test(narrowNav[1]),
    "the <=1023px block never shows .nav-short");
  const fade = css.match(/nav\.views\.overflowing::after \{([^}]*)\}/);
  assert.ok(fade && /"overflowing"/.test(appJs), "tab-bar overflow fade (class + pseudo-element) missing");
  assert.ok(/pointer-events: none/.test(fade[1]), "overflow fade must not swallow taps on the last tab");
});

test("Resume chip stays reachable on phones: icon-only at the start of the tab row", () => {
  const phone = [...css.matchAll(/@media \(max-width: 639px\) \{([\s\S]*?)\n\}/g)].map((m) => m[1]).join("\n");
  assert.ok(!/\.progress-chip \{ display: none; \}/.test(phone), "the <=639px CSS hides the Resume chip again");
  assert.ok(/\.masthead > \.progress-chip \{[^}]*width: 44px; height: 44px/.test(phone), "phone chip is not 44x44");
  assert.ok(/\.masthead > \.progress-chip \.pc-label \{ display: none; \}/.test(phone), "phone chip label not hidden");
  const fn = appJs.slice(appJs.indexOf("function buildProgressChip"), appJs.indexOf("function buildBackToTop"));
  assert.ok(/matchMedia\("\(max-width: 639px\)"\)/.test(fn) && /insertBefore\(b, nav\)/.test(fn),
    "buildProgressChip no longer moves the chip before the tab bar on narrow screens");
  assert.ok(/makeIcon\(ICON_RESUME/.test(fn), "chip has no icon for its icon-only state");
  const refresh = appJs.slice(appJs.indexOf("function refreshProgressUI"), appJs.indexOf("/* ---------- first-visit"));
  assert.ok(!/chip\.textContent =/.test(refresh), "refreshProgressUI overwrites the chip's icon with text");
  assert.ok(/chip\.setAttribute\("aria-label", "Resume the course/.test(refresh), "chip lost its full aria-label");
});

test("masthead controls reach 44px on coarse pointers / narrow screens", () => {
  const m = css.match(/@media \(pointer: coarse\), \(max-width: 860px\) \{([\s\S]*?)\n\}/);
  assert.ok(m, "coarse-pointer touch-target block missing");
  assert.ok(/\.level-filter button[^{]*\{[^}]*min-height: 44px/.test(m[1]), "level toggle not 44px");
  assert.ok(/\.theme-toggle \{ width: 44px; height: 44px/.test(m[1]), "theme toggle not 44px");
  assert.ok(/\.toc-link \{ min-height: 44px/.test(m[1]), "TOC links not 44px");
  assert.ok(/\.nav-link-btn/.test(m[1]), "inline nav-link buttons not enlarged");
});

console.log("\nui.test.js: " + passed + " passed (" + tabNames.length + " tabs, " +
  [...html.matchAll(/data-term="([^"]+)"/g)].length + " inline terms checked)");
