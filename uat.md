# UAT results — PPA Helper

Created November 6, 2026. Last run November 7, 2026. The November 6 results below remain the PR #13 baseline; the follow-up section records PR #14.

Static HTML/CSS/JavaScript. Serve with `python3 -m http.server 8000` and open `http://localhost:8000`. Nine views, seven course stops. No package installation is needed.

## Reproduce

Run the native suite with `for file in test/*.test.js; do node "$file" || exit 1; done`.

Run `PPA_PLAYWRIGHT_PATH=/absolute/path/to/playwright node test/uat.cjs` using an existing Playwright installation and Chrome. `PPA_UAT_URL` overrides localhost. Add `PPA_UAT_STRESS=1` to repeat the throttled check for first visits and saved Practitioner mode. The optional runner writes `.sessions/uat/report.json` and dated screenshots in `uat-screenshots/`, both ignored by Git. `PPA_UAT_DATE` overrides the screenshot date.

## Critical flows

- Search from a fresh Learn visit → case → lesson and first document link. Check all seventeen cases and both VPP examples, including Sierra Estrella and UAMPS / NuScale.
- Search a practitioner case from Newcomer → automatic mode change → expanded case with summary focused.
- Search → simulator → Summer spike → View settlement results → settlement result. Return with Edit simulator inputs.
- Search → debt workbench → Onshore wind → View finance results → debt amount. Return with Edit finance inputs.
- Search → stack builder → solar preset → View supply results → open position. Return with Edit supply inputs.
- Search → Draft PPA → Generate → output visible and focused. Return to inputs, edit buyer and final field, regenerate and compare the downloaded text with the displayed text. Every draft field provides a 44 px target.
- Search → Letter of Credit → exactly one glossary definition.
- No matches, keyboard selection, Tab containment, Escape return focus, and HTTP 503 → retry → case.

## Method and limits

Chrome at 375×812, 768×1024 and 1440×900. Fresh contexts for cold loads; subsequent flows reset to Learn and keep the browser cache. Reduced motion is enabled to make automatic jumps deterministic. `innerWidth` and `document.hidden` establish browser liveness. These are responsive browser tests, not tests on physical phones or Safari.

Clicks count trusted browser click events; a programmatic mode-switch click does not count as a user action. Filling a query counts as one input action, not one keystroke per character. A view navigation is a change to the app's tab hash. Wheel gestures are sent explicitly in 70%-viewport increments until the target is visible; Playwright's implicit element scrolling is not used to shorten a path. Automatic jump distance is recorded separately from gesture counts. Horizontal tab scrolling is recorded separately too. Elapsed journey times include automation and settling waits, so they are reproducibility figures, not human task times. Document-link reachability is measured to the link; following it adds one click and an external navigation.

Cold timing measurements cover navigation, first contentful paint, observed LCP, layout shifts and long tasks. Bytes are uncompressed response bodies as reported by Resource Timing, excluding favicon and the HTML navigation. Request counts exclude HTML and favicon. Local HTTP timings do not predict public-host latency or field Core Web Vitals.

## Baseline findings

Before this pass, searching `Talen` returned no case matches. The last visible newcomer case in the overview started at y=3,102 on mobile, 1,908 on tablet and 1,429 on desktop. In the opened Fervo case, the first source was at viewport y=3,118 / 1,745 / 1,344; the lesson at y=646 / 406 / 388. Those are measured positions, not estimated click counts.

The first revised run reached case lessons and document links in two clicks and one text entry, with zero manual scrolling at all widths. It also exposed finance-result scrolling (4 / 3 / 1 gestures) and a desktop sticky contents bar covering a case summary. Result jump controls, generated-output focus and dynamic sticky offsets address those findings. The final counts below include these fixes.

## Coverage

| Area | Last tested | Result |
| --- | --- | --- |
| Cases, source links and level changes | 2026-11-06 | All seventeen reachable |
| Simulator, finance, supply stack, draft | 2026-11-06 | Outputs update; result paths measured |
| Search and glossary | 2026-11-06 | Empty state, keyboard and retry covered |
| Mobile/tablet/desktop, light/dark | 2026-11-06 | Screenshots inspected; no document overflow |

## November 6 results (PR #13)

Chrome 157.0.8103.38, local HTTP. All eight native test files pass. All nine views and seventeen case destinations pass at each width; nine journeys per width are measured below. All journeys include one text-entry action and one app-view navigation. Counts end at the named information, before any external document navigation.

| Destination | Clicks | Manual wheel gestures: phone / tablet / desktop |
| --- | ---: | ---: |
| Hydro lesson and document link | 2 | 0 / 0 / 0 |
| Practitioner case from Newcomer | 2 | 0 / 0 / 0 |
| VPP example | 2 | 0 / 0 / 0 |
| Settlement scenario and result | 3 | 1 / 2 / 0 |
| Finance preset and debt result | 4 | 0 / 0 / 0 |
| Stack preset and open position | 4 | 0 / 0 / 0 |
| Generate draft and read output | 3 | 2 / 1 / 2 |
| Glossary definition | 2 | 0 / 0 / 0 |
| Filed PPA clause explanation | 4 | 1 / 0 / 0 |

Automatic document movement is still substantial in long tabs: the hydro-case jump travels 4,834 / 2,789 / 1,918 px and the stack journey 15,538 / 9,445 / 6,701 px at the three widths. These distances are not manual scroll counts. The tab bar also moves automatically on narrow screens; the report records that distance separately. Reduced-motion mode jumps immediately. A normal-motion smoke test also reaches the hydro destination at each width.

| Cold-load observation | Phone | Tablet | Desktop |
| --- | ---: | ---: | ---: |
| DOM ready (ms) | 85 | 33 | 31 |
| FCP / observed LCP (ms) | 88 | 56 | 52 |
| Observed layout shift | 0.005 | 0.000 | 0.000 |

Each cold page loads six subresources totaling 207,095 uncompressed bytes, plus the 193,209-byte HTML document. No data-center JSON, simulator, finance or draft controller loads until needed. No long tasks or uncaught script errors were observed in the final cold loads.

The second review caught a layout shift of **0.463** under 4× CPU slowdown, 150 ms latency and 1.6 Mbps download. Rendering the initial Learn contents, practitioner index and chooser in HTML, with preferences applied before paint, reduced it to **0.005** on both a fresh visit and a saved Practitioner visit. Final fresh-visit FCP was **1.076 s**, observed LCP **1.292 s**, and DOM-ready **2.375 s**; the returning-mode run measured **1.076 / 1.276 / 2.380 s**. Both runs had no observed long tasks. The runner now fails the stress check if initial layout shift reaches 0.1. This is a lab comparison on one host, not a field percentile or a physical-device benchmark.

Touch case selection passes at 375 and 768 px. Sampled palette text, muted text and links exceed 4.5:1 against their surfaces in both themes (lowest ratio: 5.17:1); keyboard focus is visible. New result controls, palette rows and case source links have 44 px minimum targets. Native parity checks keep the initial contents and practitioner links aligned with their canonical targets.

At PR #13, reaching Generate still took 2 / 1 / 2 gestures from the top of its form, and the simulator scenario/result path took 1 / 2 / 0. Those counts are retained as the historical baseline. Full screen-reader testing and physical-device/Safari testing were not performed.

## November 7 follow-up (PR #14)

All eight native suites pass. Chrome 157.0.8103.38 reaches nineteen cases (seventeen main cases plus two VPPs) and all nine views at each width. Eleven measured journeys per width pass, including both new cases. Each journey below includes one query input and one app-view navigation; clicks stop before following an external document. Following a source adds a click and an external navigation.

| Destination | Clicks | Manual wheel gestures: phone / tablet / desktop |
| --- | ---: | ---: |
| Hydro lesson and document link | 2 | 0 / 0 / 0 |
| Sierra Estrella battery toll | 2 | 0 / 0 / 0 |
| UAMPS / NuScale cancellation | 2 | 0 / 0 / 0 |
| Practitioner case from Newcomer | 2 | 0 / 0 / 0 |
| VPP example | 2 | 0 / 0 / 0 |
| Settlement scenario and result | 4 | 0 / 0 / 0 |
| Finance preset and debt result | 4 | 0 / 0 / 0 |
| Stack preset and open position | 4 | 0 / 0 / 0 |
| Generate draft and read output | 3 | 0 / 0 / 0 |
| Glossary definition | 2 | 0 / 0 / 0 |
| Filed PPA clause explanation | 4 | 1 / 0 / 0 |

The simulator adds an explicit result-jump click in exchange for removing manual scrolling. Generate is first in the draft form and stays available while editing. Additional checks, outside the measured journeys, return to the form, edit the buyer and final governing-law field, regenerate and compare the downloaded file byte-for-byte with the displayed output. All draft fields are at least 44 px in both dimensions. HTTP 503 recovery, empty search, keyboard selection, mode changes and console errors remain covered.

Two review rounds checked source accuracy, settlement/risk direction, the final diff and learning flow. Review one fixed browser-default field sizing. Review two fixed placeholder contrast from 4.07:1 to at least 5.16:1 across sampled field/action text in both themes. Normal-motion jumps, touch selection at 375/768 px, clipboard equality and visible 2 px keyboard focus pass. Screenshots of new cases, output views and draft fields were inspected.

The long document still moves automatically. These distances and the horizontal tab-bar movement remain recorded separately from manual gestures; a zero gesture count does not mean a zero-distance jump. The filed-clause path retains one manual gesture on phones. Full screen-reader and physical-device/Safari testing remain outside this run.

The Sierra Estrella jump moves 5,826 / 3,465 / 2,281 px automatically; the stack journey moves 16,505 / 10,302 / 7,121 px. The tab bar moves 303 / 57 / 0 px on those paths. These are traversal distances, not document heights or manual interaction counts.

| Final local cold-load observation | Phone | Tablet | Desktop |
| --- | ---: | ---: | ---: |
| DOM ready (ms) | 81 | 43 | 36 |
| FCP / observed LCP (ms) | 748 | 76 | 60 |
| Observed layout shift | 0.000 | 0.000 | 0.000 |

Six initial subresources total 207,639 uncompressed bytes, plus the 193,686-byte HTML document. The added cases remain lazy-loaded, as do simulator, finance, stack and draft controllers. No cold-load long tasks or uncaught script errors were observed. These are single local lab samples; first-browser paint varied between runs. The runner now waits for actual FCP and LCP observations instead of assuming a fixed delay is sufficient.

With 4× CPU slowdown, 150 ms latency and 1.6 Mbps download, the final fresh visit measured FCP **1.112 s**, observed LCP **1.328 s**, DOM ready **2.392 s** and layout shift **0.005**, with no long tasks. Saved Practitioner mode measured **1.188 / 1.396 / 2.417 s** and **0.005** shift, with one 56 ms long task. Both pass the enforced 0.1 shift ceiling. The request count is unchanged; this run does not establish a field performance improvement. Raw reports: `.sessions/uat/pr14-local-final.json` and `.sessions/uat/access-round14.json`.
