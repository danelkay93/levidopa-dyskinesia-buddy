# Levodopa Day Map agent routing

Follow the project's approved product brief, design decisions, and medical/privacy boundaries. The current implementation is the approved Forecast Journey direction; tooling must not reopen that decision without explicit user instruction.

## Intent and Impeccable

- Use Intent to establish or revisit users, jobs, evidence, ethics, product hierarchy, accessibility strategy, flows, and success criteria.
- Route focused flow work to Journey, screen structure to Wireframe, success criteria to Measure, and cultural or language adaptation to Localize.
- Use Impeccable after product intent is settled for visual direction, typography, composition, tokens, motion, rendered critique, technical frontend audit, live browser iteration, and final polish.
- Do not run overlapping broad reviews. Intent `evaluate` owns user-goal fit, comprehension, ethics, and system-level UX. Impeccable `critique` owns rendered visual craft. Impeccable `audit` owns technical accessibility, responsive behavior, theming, performance, and deterministic detector evidence.
- When Impeccable finds a strategic or medical-semantic contradiction, return only that named contradiction to Intent; do not reopen the entire project.
- When Intent identifies a visual-craft defect, route only that finding to the narrow Impeccable command.

## Project-specific specialist timing

- Journey and Wireframe are relevant when a flow or screen structure is being changed.
- Measure is relevant for defining validation criteria and post-release learning; do not add analytics, remote logging, or patient-data collection without explicit approval.
- Localize is dormant while the approved scope remains English-only. Use it only for localization readiness or after the user expands language/market scope.

## Impeccable runtime

- The project-local Impeccable runtime lives under `.agents/skills/impeccable/`; use its scripts rather than a transient `npx` detector.
- The design hook is advisory. Treat findings as evidence, not authority, and never silence a rule without explicit confirmation that the flagged pattern is intentional.
- Preserve the approved design and validated deterministic model. A detector warning never authorizes a medical-semantic, product-hierarchy, or model change.
