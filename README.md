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
node test/stack.test.js    # supply-stack math: dispatch, battery conservation (10 cases)
node test/data.test.js     # glossary single-source-of-truth integrity
node test/ui.test.js       # index.html / app.js / glossary cross-file integrity
node test/flow.test.js     # course flow: nav order, practitioner-index anchors, quiz banks
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
assets/js/stack-core.js  # pure supply-stack math for a flat load (shared by browser + tests)
assets/js/stack.js       # "Serve the load" gigawatt stack builder (Data centers tab)
assets/js/draft.js       # Draft-PPA generator: form inputs -> full VPPA template
assets/js/quiz-banks.js  # checkpoint question banks, one per course stop (shared with tests)
assets/js/quiz.js        # checkpoint engine: renders banks, reports scores to course progress
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

**Seven-stop course; five domain research passes plus a curriculum benchmark.** The course covers foundations, settlement, drafting, a practice VPPA, project finance, data-center power, and expert perspectives, with glossary and coverage references. The Learn stop now starts from a load or generator, compares six contract routes, and follows the transaction from a one-page load brief through signature and operations. Nine load/gen/wires case studies carry the same decision pattern: brief, four decisions, failure test, and learner exercise. An at-a-glance table above them summarizes the load, supply, contract form, and status of each. A two-mode Newcomer / Practitioner switch controls depth; checkpoints, progress, and quick navigation (`/` or Ctrl-K) connect the stops. Domain sources and the course benchmarks from U.S. Commerce CLDP, DOE Better Buildings/FEMP, and Open University are tracked in **Coverage & sources**.

The settlement simulator and example term sheets illustrate contract mechanics; they are not market data, legal advice, or financial advice. Data-center deals are point-in-time as of mid-2026.
