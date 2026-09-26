# Learning-path expansion — implementation spec

## Problem

The site explains the parts of a PPA well, but a new learner still has to infer the transaction sequence. The largest jump is between understanding physical versus virtual delivery and knowing what to sign for a particular load or generator. The case studies document outcomes, but do not consistently show the choices that produced them.

## Approaches considered

1. Add another course tab. Fast, but it would split related material across more navigation and repeat the existing Drafting and Data centers tabs.
2. Rewrite the curriculum. Cleaner in theory, but too broad and likely to disturb tools and explanations that already work.
3. Add a decision layer to the existing course. Keep the seven stops, put the route-selection and signing sequence in Learn, and make the existing cases teach the same decision process. This is the selected approach.

## Content rule

Every new instructional block follows the same order:

1. State what the learner can decide or do.
2. Give the minimum inputs.
3. Show the decision mechanism.
4. Name the residual risk and the next document or course stop.

## Changes

### 1. Choose a contract

- Trigger: learner knows the difference between a load and a generator but does not know which agreement fits.
- Inputs: load shape, retail-market access, physical-delivery need, generation technology, dispatch rights, and clean-energy claim.
- Mechanism: a load/generation comparison matrix plus six common starting routes.
- Success: learner can shortlist a physical PPA, VPPA, green tariff/ESA, hybrid PPA, tolling agreement, or ownership/onsite structure and say why.

### 2. Get from need to signature

- Trigger: learner has selected a likely route.
- Inputs: 12 months of interval load, target date, location, risk limits, credit capacity, and approval authority.
- Mechanism: eight numbered steps from load brief through operations handoff. Each step points to the existing simulator, Drafting, Draft PPA, project-finance, or data-center workbench.
- Success: learner can name the next action and deliverable at every stage without already knowing market jargon.

### 3. Case-study decision paths

- Trigger: learner opens an existing load/gen/wires case.
- Inputs: the case's constraint, counterparties, filings, and agreement stack.
- Mechanism: add a short brief, four decision steps, a counterfactual failure test, and a prompt for the learner.
- Success: every case explains why the chosen structure fit, what would have made it fail, and what the learner should test next.

### 4. Visual and editorial cleanup

- Replace decorative uppercase eyebrow labels with sentence-case functional labels.
- Remove repeated or inflated phrasing and the duplicated price-cannibal paragraph.
- Prefer numbered steps, comparison tables, direct headings, and specific verbs.
- Preserve the existing color, type, progressive-depth modes, and no-dependency architecture.

## Research patterns borrowed

- U.S. Commerce CLDP: transaction sequence, stakeholder chairs, and risk-allocation progression.
- Open University OpenLearn: explicit outcomes, short prerequisite bridges, and completion checks.
- DOE Better Buildings and FEMP: option-first procurement comparison, organization constraints, and real transaction artifacts.
- CLDP project-finance handbook: transaction maps and lender decision lenses.

## Verification

- Data tests require every load/gen/wires case to carry the new teaching fields.
- Flow/UI tests require the new anchors and forbid the old eyebrow class.
- Full Node test suite passes.
- Browser UAT at desktop and 375×812: load the page, switch levels, use the new cross-tab links, open case studies, check console/errors and horizontal overflow.

