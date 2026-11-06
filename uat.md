# UAT baseline — PPA Helper

Created and last run: November 6, 2026.

Static HTML/CSS/JavaScript. Serve with `python3 -m http.server 8000` and open `http://localhost:8000`. Nine views, seven course stops. No package installation is needed.

## Reproduce

Run the native suite with `for file in test/*.test.js; do node "$file" || exit 1; done`.

Run `PPA_PLAYWRIGHT_PATH=/absolute/path/to/playwright node test/uat.cjs` using an existing Playwright installation and Chrome. `PPA_UAT_URL` overrides localhost. The optional runner writes `.sessions/uat/report.json` and `uat-screenshots/2026-11-06_*.png`, both ignored by Git.

## Critical flows

- Search from a fresh Learn visit → case → lesson and first document link. Check all fifteen cases and both VPP examples.
- Search a practitioner case from Newcomer → automatic mode change → expanded case with summary focused.
- Search → simulator → Summer spike → settlement result.
- Search → debt workbench → Onshore wind → View finance results → debt amount. Return with Edit finance inputs.
- Search → stack builder → solar preset → View supply results → open position. Return with Edit supply inputs.
- Search → Draft PPA → Generate → output visible and focused.
- Search → Letter of Credit → exactly one glossary definition.
- No matches, keyboard selection, Tab containment, Escape return focus, and HTTP 503 → retry → case.

## Method and limits

Chrome at 375×812, 768×1024 and 1440×900. Fresh contexts for cold loads; subsequent flows reset to Learn and keep the browser cache. Reduced motion is enabled to make automatic jumps deterministic. `innerWidth` and `document.hidden` establish browser liveness. These are responsive browser tests, not tests on physical phones or Safari.

Clicks count trusted browser click events; a programmatic mode-switch click does not count as a user action. Filling a query counts as one input action, not one keystroke per character. A view navigation is a change to the app's tab hash. Wheel gestures are sent explicitly in 70%-viewport increments until the target is visible; Playwright's implicit element scrolling is not used to shorten a path. Automatic jump distance is recorded separately from gesture counts. Horizontal tab scrolling is recorded separately too. Elapsed journey times include automation and settling waits, so they are reproducibility figures, not human task times. Document-link reachability is measured to the link; following it adds one click and an external navigation.

Cold timing measurements cover navigation, first contentful paint, observed LCP, layout shifts and long tasks. Bytes are uncompressed response bodies as reported by Resource Timing, excluding favicon and the HTML navigation. Request counts exclude HTML and favicon. Local HTTP timings do not predict public-host latency or field Core Web Vitals.

## Baseline findings

Before this pass, searching `Talen` returned no case matches. The last visible newcomer case in the overview started at y=3,102 on mobile, 1,908 on tablet and 1,429 on desktop. In the opened Fervo case, the first source was at viewport y=3,118 / 1,745 / 1,344; the lesson at y=646 / 406 / 388. Those are measured positions, not estimated click counts.

The first revised run reached case lessons and document links in two clicks and one text entry, with zero manual scrolling at all widths. It also exposed finance-result scrolling (4 / 3 / 1 gestures) and a desktop sticky contents bar covering a case summary. Result jump controls, generated-output focus and dynamic sticky offsets address those findings. Final results follow after the last copy and review pass.

## Coverage

| Area | Last tested | Result |
| --- | --- | --- |
| Cases, source links and level changes | 2026-11-06 | All seventeen reachable |
| Simulator, finance, supply stack, draft | 2026-11-06 | Outputs update; result paths measured |
| Search and glossary | 2026-11-06 | Empty state, keyboard and retry covered |
| Mobile/tablet/desktop, light/dark | 2026-11-06 | Screenshots inspected; no document overflow |

Remaining measurements and review findings are recorded below as the final pass completes.
