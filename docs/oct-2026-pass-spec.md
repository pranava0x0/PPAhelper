# October 2026 pass — implementation spec

Branch `claude/oct-2026-pass`. Written 2026-10-22 after a research sweep (dockets, deals, policy, discourse, x.com), a persona content review, and a measured UX/performance audit. Research notes live outside the repo; the verified facts land in `docs/research-us-ppa.md` Round 11.

## Why this pass

Two weeks since Round 10 and the facts moved: FERC ruled on PJM's large-load filing, three hyperscaler nuclear PPAs took a new form (uprates), a second tenant signed under the NIPSCO GenCo structure, a federal court kept the xAI Clean Air Act suit alive, and the tax-credit safe harbor the site describes was vacated in June. Separately, a geometry audit found the mobile masthead eats 141 px of every screen, six of nine tabs are hidden with no affordance, and the simulator's result sits two screens below the control the learner just changed.

## Part 1 — UX and performance (measured)

Numbers from `getBoundingClientRect` at 375×812 / 768×1024 / 1024×768 on main @ 4f91afb.

| Finding | Today | Target |
|---|---|---|
| Sticky masthead at ≤639px | 141 px (brand 32, controls 34, nav 44, padding) | ≤ 100 px: wordmark + level toggle + icon-only Search + theme on one row |
| Tab bar overflow | scrollWidth 1143 vs 375 / 753 / 1009 px: 6 tabs hidden on phones, Coverage cut even at 1024 | no tab hidden without a visible cue: shorter labels ≤1023px, right-edge fade when overflowing, active tab scrolled into view on switch |
| Simulator on phones | inputs at 284 px, KPI result at 1,439, chart at 1,748 (2 screens below the edit) | result strip (direction + amount + effective price) directly under the controls at ≤1023px |
| Sub-44 px targets | 54 in Learn: level toggle 32 tall, Search 34, theme 34, TOC links 21, inline nav-link-btn 22–25 | all controls ≥ 44 px on coarse pointers; inline text links exempt |
| Masthead `backdrop-filter: blur(8px)` | re-blurs a 141 px band every scroll frame | opaque `var(--bg)` background, no filter |
| First-load payload | ~119 KB gz + 36 KB gz of JSON for tabs not shown, 10 scripts on every visit | lazy-load `draft.js`, `projfin.js`, `simulator.js`+`settle-core.js`, `stack.js`+`stack-core.js` and the three JSON files on first switch to their tab; keep `?v=` threading |
| Checkpoint answer position | correct option always listed first in every bank | shuffle at render, keep `correct` by reference |
| Case studies on phones | glance table 1,529 px down, behind Structures | "Jump to the cases" chip in the Data centers intro |

### Mechanism notes

- Every per-tab script already guards `document.readyState`, so injecting it late runs `init()` immediately. A loader in `app.js` (`ensureView(name)`) appends `<script defer>` tags from a per-view manifest and resolves when they load; `switchView` awaits it before `reapplyLevel`. `content.js` fetches each JSON on demand instead of all three at init. The `ui.test.js` guard that every data fetch carries `?v=` must keep passing: the manifest reuses `DATA_V`.
- Quiz shuffle: `quiz.js` renders options in a shuffled copy; scoring compares the chosen option object/text to `bank.correct`, never the index. `flow.test.js` keeps asserting that each bank's `correct` is one of its options.
- Tab bar: CSS only for labels (`data-short` attribute + `@media (max-width:1023px)`), fade via a `.views.overflowing::after` class toggled on load/resize, `scrollIntoView({inline:'center', block:'nearest'})` on switch (guard reduced-motion).
- Simulator: on ≤1023px, CSS `order` inside `.sim-layout` puts the KPI block right after the controls; no JS change.

## Part 2 — Content

Sources for every fact below are in `docs/research-us-ppa.md` Round 11 (written in this pass). Names of commentators never appear in shipped copy; cite organizations, filings, orders and papers.

### 2a. Status refreshes (data/datacenter.json `caseStudies`)

| id | new `glance.status` (≤90 chars) | new `history` row |
|---|---|---|
| aws-talen | `FERC rejected PJM's curtail-to-connect IRAS Oct 9; §205 large-load filing due Nov 16` | Oct 9, 2026: FERC (ER26-3515) accepts PJM's large-load definition and 50 MW registry but rejects the Interim Resource Adequacy Service and bring-your-own-new-capacity rules as reaching into state retail jurisdiction; a concurrence says states must set curtailment priority. |
| pjm-backstop | keep; add the same Oct 9 row (IRAS was the companion to the backstop) | same row |
| nipsco-amazon | `IURC-approved Jun 17; service Jan 1, 2027; Microsoft became GenCo's third tenant Oct 16` | Oct 16, 2026: NiSource signs a 20-year, ~1,100 MW deal with Microsoft under the same GenCo structure (its third hyperscale tenant after Amazon and Alphabet) and contracts 600 MW of battery storage under a toll; projected savings to existing customers raised to $1.75B from $1.4B (company figure). |
| xai-memphis | `Clean Air Act suit survives: court denied DOJ's motion to dismiss Oct 19, 2026` | Jun 15, 2026: DOJ moves to intervene on xAI's side and to dismiss; xAI argues standing. Oct 19, 2026: the N.D. Miss. court lets the government join but denies dismissal; whether the law was broken is undecided. |
| meta-entergy | `Second build (U-37882) heard Oct 7–9; load disclosed as 4,500 MW; LPSC vote set Dec 16, 2026` | Aug 12, 2026: LPSC votes 3–1 to shield Meta's job and load-projection records from the subpoena. Oct 7–9, 2026: evidentiary hearing; Entergy's CEO discloses the campus will draw 4,500 MW; final vote scheduled Dec 16. |

Deals table: mark the CoreWeave × Core Scientific row terminated (Core Scientific stockholders voted the $9B all-stock deal down Oct 30, 2025; the landlord relationship continues) — keep the row, change `structure`/`note`, it teaches that vertical integration can fail on price. Split the Google / Fervo / Intersect row into the 115 MW NV Energy Clean Transition Tariff deal (Jun 2024) and the Intersect Power investment (Dec 2025, verify in Round 10/11 before writing a date; if unverifiable, drop the date). Add rows: Google × Constellation (Oct 6, 2026), Amazon × Constellation Calvert Cliffs (Sep 30, 2026), Microsoft × NiSource (Oct 16, 2026), Google × DTE (Oct 1, 2026), Google × Black Hills (Oct 6, 2026), Oracle × We Energies (Oct 2026, PSC approval pending).

### 2b. New case studies (same schema as the existing nine: glance, brief, decisions[4], failureTest, yourTurn, history, lesson, glossaryRefs, sources; every glance cell ≤ 90 chars)

1. `google-constellation-uprate` — "Google × Constellation — PJM fleet: the uprate PPA" (level 1). 20-year PPA for 890 MW of uprates across Constellation's Illinois / Pennsylvania / New Jersey reactors (first output 2028, all by end-2032, >$4.3B of plant investment) plus a separate 15-year agreement for ~2,700 MW of existing output; price undisclosed. Comparator inside the case: Amazon × Constellation, Calvert Cliffs (Sep 30, 2026): 690 MW for 20 years, ~190 MW of it an uprate (2030–32), tied to a 20-year license renewal and a PJM retail supply agreement. Form taught: the buyer pays for megawatts that did not exist, so the additionality objection to existing-nuclear deals mostly falls away; the buyer now carries construction and licensing schedule risk. Lesson sentence as in the adjudicated plan.
2. `blackhills-google` — "Google × Black Hills — Cheyenne: the customer-bears-all tariff" (level 2). Large Power Contract Service agreement + Generation Facilities Agreement (8-K, effective Sep 30, 2026): 564 MW new gas at Cheyenne Prairie ($1.8B, 2027–29) built and owned by a non-regulated affiliate; up to 590 MW of grid service; ~2.1 GW of third-party Wyoming resources in a privately managed microgrid (~2.7 GW with reserves); term to 2048; Google advances $399M, refundable by Jun 30, 2027; CPCNs and siting permits pending; prices undisclosed. Form: "the customer pays everything" made true by advances, term and a cost-adjustment mechanism.
3. `dte-google` — "Google × DTE Electric — Van Buren, Michigan: the customer-funded utility build" (level 2). MPSC case U-22058, unanimous conditional approval Oct 1, 2026, Michigan's first hyperscale contracts through a contested case: 20-year primary supply agreement (standard large-customer term is 5), Google funds up to 1,600 MW of renewables and 480 MW of storage that DTE develops, owns and operates ("clean capacity accelerator"); service Dec 2027, full load Dec 2028; the Attorney General argued the protections were inadequate. Form: customer-funded, utility-owned resources inside an ESA. Do not conflate with the unnamed 1.4 GW DTE row already in the deals table.
4. `oracle-weenergies` — "Oracle × We Energies — Port Washington: the subscription to a utility PPA" (level 2). Oracle subscribes to a share of the output We Energies buys from Point Beach under a new PPA running to 2050/2053 (the current one ends 2030/2033); supplies the Port Washington campus; needs Wisconsin PSC approval; the utility projects ~$300M of customer savings over about five years (Oracle frames it as 2027–33). Form: a customer takes a slice of a utility's existing supply contract; savings count only if the commission accepts the cost allocation.

### 2c. Corrections (index.html line numbers from main @ 4f91afb; re-grep before editing)

1. **Risk-allocation table, lines ~805–834.** Basis row: developer column must say the developer prefers node (or a basis collar) so the node-to-hub gap is not its exposure; the buyer column asks for hub settlement for a clean hedge; the "typical" column states the hub-settled norm with basis on the seller. Credit-support row: the buyer's ask is one-way (developer posts); the developer's ask is two-way or a parent guarantee from the buyer. Add a drafting-bank quiz question on hub-vs-node preference.
2. **Sunridge settlement table, lines ~462–503.** Solar volumes are inverted. Use Jan 12,000 MWh, Jul 24,000, Aug 22,000 and recompute every settlement cell and the running totals ((hub − strike) × MWh: Jan (38−43)×12,000 = −$60,000 buyer→gen; Jul (71−43)×24,000 = +$672,000 gen→buyer; Aug (65−43)×22,000 = +$484,000 gen→buyer). Re-derive any prose that quotes those amounts (grep 75,000 / 280,000 / 264,000). Keep the August basis-wipe point: node $22 vs strike $43 → realized ≈ $0/MWh.
3. **Line ~277 and draft.js SETTLE_POINTS.** "PJM Western Hub (AEP-Dayton)" → "PJM Western Hub" (AEP-Dayton is a separate hub).
4. **Line ~278.** Replace "Capacity prices spiked" with numbers: 2027/28 BRA cleared at $333.44/MW-day with the RTO 6,623 MW short; 2028/29 cleared at the $325 cap, 6,831 MW short, ~$16.4B; every load in the zone pays through its supplier.
5. **Lines ~238 and ~1182.** Drop "most common"; say discount-to-market with a floor is one common corporate structure; delete the "set the strike to your floor" workaround (the floor-plus-discount payoff caps the buyer's upside at the spread, which a flat strike cannot imitate). Line ~1181 "ERCOT North Hub averaged ~$45/MWh in 2024": cite or soften to "roughly $40–50".
6. **Line ~895 standard offer.** "maximum spot price exposure" is wrong for a regulated tariff: regulated → tariff rate set in a rate case; restructured → default service that passes through market cost.
7. **Lines ~906–907 and glossary "Sleeved PPA".** Sleeving is a fee-based pass-through; the buyer keeps price and shape exposure; works in regulated territories where direct contracting is barred. Fix both and the market tag.
8. **ESA, lines ~902 and ~1629 and glossary.** Define once: an ESA is a bilateral supply contract; two variants — (a) with a competitive retail supplier in a restructured market, (b) a regulated utility's large-load service agreement under a tariff (ramp, minimum take, collateral). Both sections point at the one definition.
9. **Line ~130.** "PPAs are now the main way new US generation gets financed" → "a major route for merchant-region wind and solar".
10. **Lines ~236 and ~1208.** "locks in the strike as its effective price" → true only if the buyer's power cost tracks the hub; a retail-supplied buyer keeps retail-minus-hub exposure (partial hedge plus RECs).
11. **Tax credits (lines ~523–524, ~831–834, ~1378, ~1812, projfin quiz Q4, glossary IRA entries, draft.js Exhibit C change-in-law).** Replace the hypothetical with the regime: the July 2025 law phases out 45Y/48E for wind and solar (began construction by Jul 4, 2026, or placed in service by Dec 31, 2027); storage, nuclear and geothermal keep full value for construction starting through 2033 then 75% / 50% / 0; foreign-entity ("prohibited foreign entity") limits apply to construction beginning after Dec 31, 2025; Treasury's Notice 2025-42 (Aug 2025) removed the 5% safe harbor for wind and solar and was vacated in full by the D.D.C. on Jun 6, 2026 (Oregon Environmental Council v. IRS), appeal status unconfirmed as of Oct 2026. Rewrite the change-in-law card as "tax-credit and trade policy risk" with the construction-start date as the thing a 2026 PPA negotiates. Coverage page row for IRA → "Verified (R2, primary) — regime changed Jul 2025; R11".
12. **Scope 2, line ~349.** The GHG Protocol consultation on hourly matching and deliverability closed Jan 31, 2026; most respondents opposed both proposals; final timing disputed (2027 or later); current market-based rules stay in force. Keep the hourly-matching teaching, label it "proposed, not final".
13. **Nuclear paragraph, line ~1521.** After "no new carbon-free MWh when an operating plant changes offtaker", add: an uprate PPA is the exception — see the Google × Constellation case — and a flat block is unit-contingent unless the contract says who buys replacement energy during refueling outages.
14. **Large-load section, line ~1622 onward.** Add Texas: Gov. Abbott's Aug 3, 2026 directive to PUCT and ERCOT to audit every queued data center and hold approvals until the audit ends; ERCOT paused its first batch study; no end date — a queue freeze no PPA clause cures. Add "six FERC-jurisdictional RTOs/ISOs; ERCOT sits outside FERC's reach and is handled by SB6 and the PUCT". Add three sentences on the wholesale/retail fork (why FERC rejected IRAS). Add a five-item commission test box (cost causation, stranded-asset risk, cross-class subsidy, term vs asset life, exit and collateral) and apply it in one line each to DTE, Black Hills, NIPSCO, Oracle. Rename "demand ratchet" to "minimum take" where it means minimum billing demand, and define ratchet separately in the glossary. Add a short "flexible-connection terms" list beside the ESA table (notice, event length, annual-hours cap, backup-generator rules, firm vs non-firm tier, compensation or credit against minimum take) — no invented numbers.
15. **Data centers intro.** Add a six-line "headline decoder" card above Structures: nameplate vs delivered; "up to"; framework vs signed contract; announced vs signed vs operating; "price undisclosed"; PPA vs ESA vs tariff.
16. **Bankability, lines ~412–428.** Add a "what lenders haircut" list (basis, curtailment, negative hours, P90 volume, reserves) and one sentence tying Crane's 20-year full-output PPA to loan sizing.
17. **LCOE.** Where the site compares costs (tolling / nuclear premium), add one sentence: LCOE ignores firmness; compare cost per matched hour. Update the glossary LCOE entry's dated figure label to "2023 data, superseded".
18. **Quiz consistency.** Data-center bank Q6 "a quarter" vs line ~1528: both must say about a quarter (25% capacity factor). Learn Q4 wording follows correction 9.
19. **Draft generator (draft.js).** Add a Curtailment section (buyer pays for delivered MWh; grid-ordered curtailment is the seller's risk unless "deemed generation" is elected; buyer-instructed curtailment is paid); remove "curtailment orders" from the Force Majeure list; branch the REC / WREGIS / "qualified renewable facility" / "develop and construct" language by technology (existing nuclear: environmental attributes or EACs, "operating facility"); make 2.1 consistent with 2.3 ("effective price equals the Fixed Price before basis"). Keep the (Fixed − Floating) sign but state direction in words next to every formula, matching settle-core's who-pays conclusion.

### 2d. Structure (small moves only; the big reorganizations go to backlog)

- Learn: move "Choose a contract from the load and the generator" (h2 `choose-contract`) to after the Scope 2 section and before "Who's who", so tolling / sleeved / ESA / hub are defined before the matrix uses them. Update the TOC order and `flow.test.js` if it pins order.
- Data centers: order becomes intro + decoder → Case studies (glance table + accordions) → VPPs → Structures → technology→contract → tolling → Serve the load → Connecting the load → Playbook → Recent deals → Checkpoint. Update the TOC.
- Backlog (not this pass): Careers tab split; merge the four sequencing frameworks; counterparty-vocabulary table; strike build-up / solve-for-price in the workbench; hedge-effectiveness and MtM accounting; nuclear-restart workbench preset.

### 2e. Glossary additions

Uprate; License renewal (NRC); Subscription (to a utility PPA); Bring-your-own-new-capacity (BYONC); Affiliate PPA / GenCo; 5% safe harbor; Load curtailment vs supply curtailment (one entry, two senses); Minimum take vs demand ratchet. Each with a one-sentence definition and a source URL; wire tooltips where the term appears.

### 2f. Quiz additions (one each, plausible distractors of equal length)

Drafting: hub vs node preference. Data centers: why an uprate PPA answers the additionality objection; which mechanism keeps other ratepayers whole in a customer-funded build. Project finance: what the 2026 construction-start date does to a solar PPA's price.

### 2g. Research, coverage, README

`docs/research-us-ppa.md` Round 11 with every source URL used above; coverage scorecard rows updated (IRA regime, Scope 2 status, uprate PPAs, customer-funded utility builds). Coverage view in index.html mirrors it. README "Status" paragraph and footer date; `casesAsOf` → Oct 22, 2026; cache-bust `?v=20261022a`.

## Verification

- `node test/*.test.js` all green (settle, stack, data, flow, ui).
- Browser at 375×812 and desktop: masthead height, no horizontal page overflow, simulator result visible after editing the strike without scrolling, every tab reachable, lazy-loaded tabs render on first switch and after reload with a hash (`#datacenter`), checkpoints render questions with shuffled options.
- Expert directional sweep (ppa-expert-review Step 1 grep) over all new copy.
- Cache-bust `?v=` bumped once per editing pass.
