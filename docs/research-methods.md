# Research methods — cost vs. reliability

How to gather source data for this project, cheapest-first. Written after a deep-research run cost ~3.5M tokens (and a re-run failed at 1.4M, returning nothing — see [AGENTS.md → Running multi-agent workflows](../AGENTS.md)).

## The options, cheapest to most expensive

| Method | Rough cost | Reliability | Best for |
|---|---|---|---|
| **0. Curated static sources** (bookmark NREL, LBNL, FERC, IRS, EPA, EEI; read directly) | ~0 tokens | Highest (you read the primary doc) | Durable definitions, standard forms, official data tables |
| **1. Inline WebSearch + few WebFetch** (what Round 2 used) | ~tens of K tokens | High, *self-checked* — you read each snippet and decide | Filling specific named gaps; narrow questions; quick fact-finding |
| **2. Small bounded workflow** (5–8 search agents, **no** verify fan-out) | ~hundreds of K | Medium-high; parallel but you still synthesize | A handful of independent angles you want covered at once |
| **3. Full deep-research workflow** (5 angles → fetch → 3-vote verify → synthesize, ~100 agents) | **millions** | High *when it completes* — adversarial fact-check; fragile to one bad agent | A genuinely broad, open-ended question where you need cited, fact-checked breadth and can't enumerate the sub-questions yourself |

## What Round 2 actually did

Eight targeted `WebSearch` calls (domain-filtered to `ferc.gov`, `irs.gov`, `nrel.gov`, `lbl.gov`, `epa.gov`, `energy.gov`, `worldbank.org`) plus attempted fetches. It filled six gap areas with **primary government / national-lab citations** for a tiny fraction of the deep-research cost, and nothing crashed because there were no schema-constrained subagents to derail.

Snippet quality was high enough that most facts came straight from the search result text — `WebFetch` was only needed for dense PDFs (and one failed on a TLS cert, recovered from the search snippet).

## Recommendation: tier up, don't start at the top

1. **Know the gap? Start at tier 1.** Domain-filtered `WebSearch` to the authoritative source, read the snippet, fetch only when a PDF/table needs it. This is the default for this project.
2. **Need several independent angles fast?** Tier 2 — a small bounded workflow with `parallel()` over searches and **no** verify fan-out (the fan-out is what failed and what costs the most).
3. **Truly broad, can't enumerate the sub-questions, need adversarial fact-checking?** Tier 3 — the full workflow. Budget for millions of tokens, run it when the tool environment is stable, and **resume** rather than restart if it fails.

### Why not always tier 3
The deep-research workflow's value is the **3-vote adversarial verify** — but that same fan-out (60–75 concurrent schema agents) is its fragility: one agent that fails to emit structured output can abort the batch and discard everything. For known, narrow gaps, tier 1 gets primary sources at ~1% of the cost with none of that risk. Reserve the heavy tool for when breadth and fact-checking genuinely justify it.

## Source shortlist for this domain (tier 0/1 starting points)
- **FERC** — wholesale jurisdiction, market-based rates, PURPA QFs: ferc.gov/qf, ferc.gov/power-sales-and-markets
- **IRS** — ITC/PTC, transferability, elective pay: irs.gov/credits-deductions/elective-pay-and-transferability
- **Berkeley Lab (LBNL/EMP)** — empirical PPA prices, LCOE, deployment: emp.lbl.gov/utility-scale-solar (+ Wind Technologies Market Report)
- **NREL** — PPA checklists, standard contracts, curtailment, community solar: nrel.gov/analysis, docs.nrel.gov
- **EPA Green Power Partnership** — green-power procurement, REC definitions, PPA types
- **EEI** — the Master P&S Agreement (wholesale standard form)
- **World Bank PPP** — bankability, credit support, guarantees (skews international; use for fundamentals)
