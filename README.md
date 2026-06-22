# PPA Helper

A hands-on tool for learning to originate, negotiate, and approve **US power purchase agreements**. Built around a virtual-PPA settlement simulator, with cited foundations, a glossary, and an honest coverage scorecard.

Static site — plain HTML, CSS, and vanilla JS. No build step, no dependencies, no backend. Deploys to GitHub Pages as-is.

## Run locally

The page fetches `data/glossary.json`, so it must be served over HTTP (opening `index.html` with `file://` will block the fetch).

```bash
cd PPAhelper
python3 -m http.server 8000
# then open http://localhost:8000
```

## Run tests

No dependencies — plain Node, no install.

```bash
node test/settle.test.js   # VPPA settlement math (11 cases)
node test/data.test.js     # glossary single-source-of-truth integrity
node test/ui.test.js       # index.html / app.js / glossary cross-file integrity
```

## Deploy to GitHub Pages

1. Push the repo to GitHub.
2. Settings → Pages → Build and deployment → **Deploy from a branch**, branch = your default, folder = **`/ (root)`**.
3. The `.nojekyll` file makes Pages serve the files as-is (no Jekyll processing).

## Layout

```
index.html               # masthead, view-switcher, the six views
assets/css/styles.css    # copper-on-paper terminal/broadsheet identity (see docs/design.md)
assets/js/settle-core.js # pure VPPA settlement math (shared by browser + tests)
assets/js/simulator.js   # simulator UI: scenarios, SVG chart, editable table
assets/js/draft.js       # Draft-PPA generator: form inputs -> full VPPA template
assets/js/quiz.js        # self-check quiz (settlement, basis, risk allocation)
assets/js/app.js         # view switching, theme toggle, glossary, tooltips, level filter
assets/js/content.js     # renders Example PPAs + Data centers tabs from JSON
data/glossary.json       # single source of truth for terms (feeds glossary + tooltips)
data/examples.json       # annotated example term sheets (clause -> glossary links)
data/datacenter.json     # data-center structures + recent hyperscaler/neocloud deals
data/perspectives.json   # expert viewpoints + "keep learning" resources
test/                    # dependency-free Node tests (math + data + cross-file integrity)
docs/research-us-ppa.md  # fact-checked research the content is built on
docs/research-methods.md # how to gather more data cheaply (cost vs. reliability)
docs/design.md           # project visual identity (extends DESIGN.md)
backlog.md               # deferred scope and feature ideas
```

## Status

**Seven tabs live; four research passes done.** Foundations, Example PPAs (annotated), the settlement simulator, Data centers, Perspectives, the glossary (48 cited terms), and the coverage page. An experience-level filter (Newcomer / Practitioner / All) lets the same content serve newcomers and experts. Research has run in four passes — a fact-checked deep-research run, a government / national-lab pass (FERC, IRS, EPA, NREL, Berkeley Lab), a data-center deals pass, and an expert-perspectives pass (Jigar Shah, Tyler Norris, Lucia Tian, Rich Powell) — all tracked in the in-app **Coverage & sources** view and `docs/research-us-ppa.md`. Next phases (pricing payoff explorer, basis-risk visualizer, deal-lifecycle walkthrough, quizzes) are in `backlog.md`.

The settlement simulator and example term sheets illustrate contract mechanics; they are not market data, legal advice, or financial advice. Data-center deals are point-in-time as of mid-2026.
