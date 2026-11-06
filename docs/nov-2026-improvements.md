# Case studies and navigation — November 2026

## Scope

Add two contract examples in the existing case schema: Google's financially settled hydro PPAs with Brookfield, and Meta's operating-plant PPA at Clinton. Keep signed capacity separate from a framework ceiling, existing output separate from an uprate, and public announcements separate from undisclosed contract terms. Exercises are teaching scenarios, not reported contract provisions. Existing case statuses retain their capture dates.

The smallest approach extends the current JSON and search palette. Splitting long tabs into pages would reduce page depth but change the course structure and routing. A separate case browser would add another navigation surface. This pass extends the existing surfaces.

## Search behavior

Trigger: open Search and enter a case name or contract phrase. Inputs: case title, market, four glance fields, level, stable case ID. Load case metadata on first search, with the existing versioned fetch. Include both course levels in case results and label practitioner cases. Selecting a result waits for the data-center view, switches level if required, opens the case, scrolls its summary into view and places keyboard focus there. A failed metadata fetch must show an explicit retry state. Success: a cold visit can reach any case in two clicks and one text entry, without manually scrolling the case list; the case lesson follows its facts and its document links remain reachable.

## Copy

Use contract, delivery, cost and risk terms. Preserve quotations, legal names, source URLs and technical definitions where needed to identify the underlying material. Keep settlement direction consistent with `(LMP − strike) × MWh`: positive means generator pays buyer. Replace promotional summaries with specific mechanisms and limitations.

## Verification

Run all dependency-free Node tests. Use Chrome at 375×812, 768×1024 and 1440×900, with fresh contexts and a liveness check. Measure cold-load requests/bytes, navigation timing, paint, layout shift and long tasks. Measure clicks, text inputs, view changes, manual scroll gestures and automatic scroll distance separately. Cover case lesson and source, settlement scenario/result, draft generation, finance preset, stack preset and glossary lookup. Screenshots stay local; record results and the test environment in `uat.md`. Local timings are laboratory observations, not production Core Web Vitals.

## Review

Open a pull request after validation. Round one checks source facts, settlement and risk direction, and loader/search failures. Round two checks the final diff, accessibility, course flow and the meaning of the measured results. Address findings, rerun affected checks and merge after both rounds pass.

Case checkpoint: all seven Node test files passed. Live Chrome at all three widths rendered the two new cases without script errors or document overflow; the Clinton lesson and both source links appeared within the initial opened-case viewport. JSON diff adds two records and updates the file date; older records remain intact.

Navigation checkpoint: all eight Node test files and the Chrome acceptance runner pass. Each of seventeen case destinations is reachable at all three widths; loading failures recover through Retry, with a single shared successful data request. Explicit result links replace finance/supply result scrolling; draft generation focuses the output. Live screenshots caught the sticky-contents offset issue, now asserted in the runner.

Copy checkpoint: revised definitions, exercises and summaries together. The nuclear comparison no longer assumes every deal is a flat, full-output block or asserts an undisclosed premium. REC conveyance is described alongside the price hedge; reporting eligibility depends on the applicable criteria. The existing hydro deal row now uses the same primary source and signed-vs-framework distinction as its case. All eight Node suites and the three-width browser runner pass after these edits. Touch selection also passes at 375 and 768 px. A separate local lab run with 4× CPU slowdown, 150 ms latency and 1.6 Mbps download observed FCP at 1.07 s and DOM-ready at 2.36 s.

## Review round one

Reviewed the source announcements and transaction counsel's hydro description against each new case field, then read the search/loader and view changes as a diff. The hydro hedge is financially settled, the 3,000 MW framework is not an executed PPA for that full quantity, and the Clinton start remains a future milestone. Corrected the Clinton timeline order and put capture dates in overview rows instead of applying the earlier date to every case.

Code findings addressed: Enter on Retry now invokes the button rather than selecting a search result; newcomer-only results switch back from Practitioner; ungated workbench targets no longer force Practitioner. Source links and result controls meet the 44 px target. Filed-PPA clause selection now uses the same measured jump and focus behavior as other destinations. The browser runner covers both keyboard regressions, all views, and a ninth measured journey for a filed clause. It can reproduce the slow-CPU/network check with `PPA_UAT_STRESS=1`.


## Review round two

Reviewed the final code and content diff, then checked the measured learning paths, light/dark screenshots, contrast and focus. The slow-network run found a real first-paint shift (0.463): deferred JavaScript inserted the chooser and contents ahead of already-visible material. The initial Learn contents and practitioner index now ship in HTML, with stored presentation applied before paint. Native parity tests compare their targets and labels to the canonical lists. The stress runner checks fresh and saved Practitioner visits and rejects shifts of 0.1 or more; both finish at 0.005. No additional dependency or build step was introduced.

Final validation: all eight native suites pass; Chrome covers nine views, seventeen case destinations and nine measured journeys at each of three widths, including keyboard retry, both directions of mode switching, source/input/result focus and failure recovery. Source announcements and counsel's description support the new cases; undisclosed commercial terms remain unknown. The remaining simulator/draft scroll costs and lab-versus-field limits are recorded in `uat.md`. No unresolved blocker from either review remains.

A final smoke test also exercised the static chooser and practitioner chip, finance result/input focus, and normal-motion case jumps at all three widths.
