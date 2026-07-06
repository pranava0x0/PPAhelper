# docs/design.md — PPA Helper (project identity)

> Extends the base [DESIGN.md](../DESIGN.md). Project wins on conflict.
> (Lives in `docs/` because the macOS filesystem is case-insensitive — a root `design.md` would clobber `DESIGN.md`.)

## Identity in one line
**A clean-energy markets & finance workbench** — the calm precision of a fintech dashboard, the live numbers of a trading desk. *(Re-skinned 2026-07-05 from the earlier "editorial broadsheet on warm paper" identity — see history below.)*

- **Reference point:** a modern analytics product (Linear/Stripe-era clarity) crossed with a trading desk. Cool surfaces, soft elevation, one confident accent, a monospace data tape.
- **Subject-anchored palette:** cool near-white surfaces (`--bg`/`--surface`) with **electric blue** as the single brand accent — the charge in the wire. Directional money flows keep their own semantic green/red, used only on real settlement numbers.
- **Type pairing:** a **grotesque sans display** (Inter / system-ui) for headings, the wordmark, and KPI numerals — product clarity, not editorial gravitas; the same sans for body/UI; **mono for all market data** (prices, $/MWh, LMP, settlement amounts, project-finance figures) — the terminal tape.
- **One memorable move:** a **monospace data spine** — every price, settlement, and finance figure renders in mono with tabular numerals, under a thin blurred masthead rule; cards carry soft elevation rather than hairline warm borders.

## Tokens (see assets/css/styles.css `:root` for the source of truth)
- `--bg` cool near-white `#f4f6f9` / dark slate `#0b0f14`
- `--accent` electric blue `#2563eb` (light) / `#5b9bff` (dark)
- Semantic money-flow: `--flow-credit` green (party receives) / `--flow-debit` red (party pays). These color **only** settlement direction, never chrome.
- `--shadow-card` / `--shadow-pop` — soft elevation replaces the old double-rule broadsheet framing.

### History
- **2026-07-05 re-skin:** moved off the warm-paper + copper + serif "editorial broadsheet" identity (which read too close to the Anthropic/Claude default aesthetic) to the cooler product/fintech look above. Structure, mono data spine, money-flow semantics, and coverage-honesty rules all unchanged; only palette, display type, and framing (borders→elevation, double rule→single) changed.

## Rules specific to this project
- **No emoji.** Outline pills and rule lines do the badge work.
- **Every number cites a source** or is clearly a user-entered input/simulation. Verified facts link to the primary source; the simulator is labeled as an illustration, not market data.
- **Coverage honesty:** a visible scorecard separates `verified` content from `needs-research` gaps (mirrors [research-us-ppa.md](research-us-ppa.md)). Never present a gap as settled.
- **Voice:** plain and specific. No "comprehensive", "robust", "seamless", "unlock". Lead with the number or the name.
