# docs/design.md — PPA Helper (project identity)

> Extends the base [DESIGN.md](../DESIGN.md). Project wins on conflict.
> (Lives in `docs/` because the macOS filesystem is case-insensitive — a root `design.md` would clobber `DESIGN.md`.)

## Identity in one line
**A power-market trading terminal rendered as an editorial broadsheet** — the seriousness of a contract document, the live numbers of a trading desk.

- **Reference point:** the FT/Bloomberg terminal crossed with a printed contract. Calm authority, rule lines, a monospace data tape.
- **Subject-anchored palette:** ink on warm paper (the contract), with **copper** as the single accent (the wire — electricity's actual conductor, not the AI violet). Directional money flows get their own semantic greens/clays, used only on real settlement numbers.
- **Type pairing:** serif display (Charter/Georgia stack) for headings + KPI numerals — editorial gravitas; system sans for body/UI; **mono for all market data** (prices, $/MWh, LMP, settlement amounts) — the terminal tape.
- **One memorable move:** a **monospace data spine** — every price and settlement figure renders in mono with tabular numerals, aligned like a ticker tape, under a thin masthead rule.

## Tokens (see assets/css/styles.css `:root` for the source of truth)
- `--bg` warm paper `#f3efe6` / dark ink `#15181b`
- `--accent` copper `#b06a2c`
- Semantic money-flow: `--flow-credit` grid-green (party receives) / `--flow-debit` clay-red (party pays). These color **only** settlement direction, never chrome.

## Rules specific to this project
- **No emoji.** Outline pills and rule lines do the badge work.
- **Every number cites a source** or is clearly a user-entered input/simulation. Verified facts link to the primary source; the simulator is labeled as an illustration, not market data.
- **Coverage honesty:** a visible scorecard separates `verified` content from `needs-research` gaps (mirrors [research-us-ppa.md](research-us-ppa.md)). Never present a gap as settled.
- **Voice:** plain and specific. No "comprehensive", "robust", "seamless", "unlock". Lead with the number or the name.
