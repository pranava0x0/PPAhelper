# Second November pass — cases and result paths

## Scope and choice

Extend the existing case library and remove the scroll costs left by PR #13. Splitting long tabs into separate pages would reduce document depth but require a routing redesign. A separate examples browser would add another surface. This pass uses the existing views, search and result-jump controls.

Add Sierra Estrella / SRP as a battery toll example and UAMPS / NuScale as a cancelled development-and-subscription example. Use the existing case schema, primary sources, explicit capture dates and undisclosed-term limits. Distinguish a planned project from an operating resource; technology approval from a site operating license; MW from MWh; and a storage toll from an as-generated PPA. Exercises are hypothetical diligence tasks, not reported contract terms. Earlier cases retain their evidence dates.

## Interaction specification

- Draft: on entering the draft view, the existing Generate control appears before the inputs and stays available while editing. It reads the same fields as before; blank fields remain bracketed. Success means generation needs no manual scrolling from the start of the view and moves focus to the resulting draft. Provide a route back to the inputs.
- Simulator: scenario buttons appear before contract inputs. An explicit result jump uses the existing measured offset/focus mechanism. Success means a scenario and its settlement result can be reached without a manual scroll at 375×812, 768×1024 and 1440×900. Keep the settlement convention and calculation unchanged.
- Copy: revise claims that overstate delivery certainty or imply unpublished terms. Keep attributed quotations, document names and source URLs intact. Carry forward the previous editorial scope and PR-description preference.

## Validation and release

Run native tests and the browser acceptance runner before and after the change. Record clicks, query inputs, view changes, manual wheel gestures, automatic scroll distance, cold-load requests/bytes, paint and layout shift. Test all cases and views at three widths, plus touch, keyboard, empty/failure states and throttled fresh/saved visits. Inspect screenshots. Preserve PR #13 measurements as dated historical results in `uat.md`.

Open the next pull request after the first verified implementation. Review round one covers source accuracy, contract/risk direction, DOM behavior and failure recovery. Review round two covers the final diff, learning flow, accessibility and measured performance. Address findings, rerun affected checks, merge, then verify the public Pages deployment.

Case checkpoint: the existing data-integrity suite validates both records without a schema change. All eight native suites pass. Live Chrome reaches all nineteen cases and all nine views at three widths; the two new case lessons and first document links require two clicks and a query, with no manual scrolling. Reviewed the JSON diff and new-case screenshots. The Sierra Estrella contract type is taken from slide 3 of the developer's September 1, 2023 legislative presentation; the November 7, 2023 settlement effective date is kept distinct from UAMPS's November 8 announcement.

Flow checkpoint: all eight native suites and eleven measured browser journeys at each width pass. Simulator results take four clicks and one query; generated output takes three clicks and one query. Both paths require zero manual wheel gestures at all three widths. The draft action remains reachable after editing the final field; regeneration uses the edited buyer name and the downloaded file exactly matches the visible output. Inspected mobile, tablet and desktop result screenshots. The runner waits for the next-frame result jump before measuring reachability, so an automation race does not count as manual scrolling.

Copy checkpoint: replaced unsupported market-price and basis ranges with the simulator's actual assumptions. Storage performance and dispatch rights now depend on the stated contract limits rather than a universal availability percentage. Crane's announcement is no longer used to infer a settlement mechanism, and Fervo's expansion option is no longer treated as evidence of basis allocation. Simplified the generator introduction to describe the actual input/regeneration flow. Source titles, names, URLs, quotations and technical accounting definitions retain their meaning.

## Review round one

Read the PR diff and checked both new cases against the developer overview, slide 3 of the legislative presentation, UAMPS's archive and the SEC settlement recitals. Confirmed 250 MW / 1,000 MWh, June 2024 operation, the 20-year toll classification, six proposed modules / 462 MWe, insufficient subscription and the distinct November 7/8 dates. The new exercises do not claim unpublished guarantees or reimbursement amounts. Reconciled settlement direction with `settle-core.js` and checked the draft's opposite signed convention remains explicit.

Finding: draft text inputs and selects retained browser-default sizes because only number inputs matched the shared rule. Applied the existing field treatment to every draft input/select with a 44 px minimum, and added browser dimension checks. Regeneration now verifies both the buyer and final governing-law input in the resulting download.

## Review round two

Re-read the final HTML, controller, style and measurement diffs. Checked result-return targets, next-frame focus, sticky offsets, single Generate binding and lazy-load behavior. Normal-motion case and draft jumps pass at all three widths; touch selection passes at 375 and 768 px. Clipboard contents match the draft, keyboard Tab reaches the buyer field with a visible 2 px outline, and all draft controls have 44 px targets. Inspected the form and output in both themes.

Finding: browser-default placeholder gray measured 4.07:1 in light mode. Applied the existing muted-text token with full opacity. Rechecking entered text, placeholder text, selects and actions in both themes gives a minimum 5.16:1. This pass checks pseudo-element text as well as the input's main text color.

Measurement finding: one cold sample had missing FCP and a zero observed LCP because the fixed wait expired before the observers delivered. The runner now waits for both paint observations in cold and throttled contexts; it cannot silently report an unobserved paint as zero. Repeated the complete browser run after the correction.

The automated GitHub review of the initial implementation completed without findings. Both local review rounds and their fixes are recorded here; final timings and remaining costs are in `uat.md`. Screenshots and raw local reports are ignored artifacts in `uat-screenshots/` and `.sessions/uat/`. The additional normal-motion/touch/contrast/clipboard smoke report is `.sessions/uat/access-round14.json`. These are Chrome lab checks, not physical-device, Safari or full screen-reader certification.
