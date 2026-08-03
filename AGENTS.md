# Levodopa Day Map agent routing

Follow the project's approved product brief, recorded user decisions, and medical/privacy boundaries. The current React implementation is an engineering baseline and an unapproved presentation candidate. It is not visual-design authority and must not be described as approved.

## Current phase: design recovery

- Preserve the deterministic model, domain separation, sharing and editing behavior, synthetic fixtures, and verification infrastructure unless a separately evidenced defect requires a narrow fix.
- Treat the incumbent Forecast Journey UI, `DESIGN.md`, `design-qa.md`, and historical screenshots as evidence and anti-reference, not as golden baselines.
- Run assessment and redesign sequentially: Intent `evaluate` -> routed Journey / Organize / Include / Wireframe work -> Impeccable `shape` and three comparable high-fidelity directions -> explicit user approval -> Specify -> implementation.
- Do not use `polish`, `live`, detector results, or passing automated checks to convert the incumbent presentation into an approved direction.
- Do not edit the presentation layer until the user approves one rendered direction. Correctness, accessibility, tooling, and model fixes remain separate bounded work.
- The approval state and protected engineering boundaries are recorded in `docs/design-recovery/status.md`.

## Intent and Impeccable

- Use Intent to establish or revisit users, jobs, evidence, ethics, product hierarchy, accessibility strategy, flows, and success criteria.
- Route focused flow work to Journey, screen structure to Wireframe, success criteria to Measure, and cultural or language adaptation to Localize.
- Use Impeccable after product intent is settled for visual direction, typography, composition, tokens, motion, rendered critique, technical frontend audit, live browser iteration, and final polish.
- Do not run overlapping broad reviews. Intent `evaluate` owns user-goal fit, comprehension, ethics, and system-level UX. Impeccable `critique` owns rendered visual craft. Impeccable `audit` owns technical accessibility, responsive behavior, theming, performance, and deterministic detector evidence.
- When Impeccable finds a strategic or medical-semantic contradiction, return only that named contradiction to Intent; do not reopen the entire project.
- When Intent identifies a visual-craft defect, route only that finding to the narrow Impeccable command.
- A clean Impeccable Doctor or detector report proves only tooling/schema consistency and rule results. It does not prove product quality, visual approval, or design fidelity.

## Project-specific specialist timing

- During design recovery, Journey, Organize, Include, and Wireframe are required owners for routed structural findings before visual directions are generated.
- Measure is relevant for defining validation criteria and post-release learning; do not add analytics, remote logging, or patient-data collection without explicit approval.
- Localize is dormant while the approved scope remains English-only. Use it only for localization readiness or after the user expands language/market scope.

## Impeccable runtime

- The project-local Impeccable runtime lives under `.agents/skills/impeccable/`; use its scripts rather than a transient `npx` detector.
- The design hook is advisory. Treat findings as evidence, not authority, and never silence a rule without explicit confirmation that the flagged pattern is intentional.
- Preserve the validated deterministic model and approved product constraints. A detector warning never authorizes a medical-semantic, product-hierarchy, model, or design-approval change.
