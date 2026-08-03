# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary experience, **My Day**, is for a person in their mid-60s living with Parkinson's who needs a calm, immediately understandable account of what is happening during a medication day. Important interactions must remain forgiving when tremor, rigidity, fatigue, or reduced dexterity affect use.

The optional **Analyze** experience is for an analytically sophisticated caregiver, researcher, or clinician who needs the deterministic model, dose contributions, and schedule-relative detail without forcing that complexity into My Day.

## Product Purpose

Levodopa Day Map turns a medication schedule into a phone-first visual day journey. It helps someone understand dose timing and the model's changing schedule-relative state, inspect more detail when useful, and edit or share a synthetic or explicitly approved schedule without a backend.

Success means the primary user can answer “What is happening during her medication day?” quickly and without confusing modeled exposure, observed symptoms, uncertainty, or clinical advice.

## Positioning

The product pairs a plain-language, forecast-like day journey with a separately disclosed deterministic PK/effect-site analysis. It is a schedule visualizer and communication aid, not a dosing optimizer, symptom predictor, or clinical decision system.

## Operating Context

The application is phone-first and also supports phone landscape and tablet layouts. It runs as a static GitHub Pages application. Schedule editing, import, export, and URL-based sharing remain local and database-free. Public examples and automated artifacts use deterministic synthetic fixtures.

## Capabilities and Constraints

- Keep My Day and Analyze as genuinely distinct levels of detail.
- Preserve the validated deterministic PK/effect-site model as a separately tested layer. Derived period labels are documented display heuristics, not clinical thresholds.
- Distinguish doses, modeled exposure, observed symptoms, uncertainty, and interpretation in both copy and encoding.
- Support schedule editing and backend-free sharing, including malformed-link recovery and midnight wrapping.
- Keep meaningful states directly addressable for automated browser verification.
- Remain English-only for the current release; Hebrew and RTL are out of scope.
- Do not add a backend, authentication, database, analytics, remote logging, cloud patient-data storage, or patient-identifying information.
- Do not introduce medication recommendations, clinical cutoffs, or patient-specific predictions without separate evidence, documentation, tests, and explicit approval.

## Brand Commitments

The governing direction is **Forecast Journey**: calm clinical modernism with human warmth, plain language before technical terminology, progressive disclosure, and restrained depth. Fashionable effects must never obscure medication values, medically meaningful color, warnings, labels, or interaction affordances.

## Evidence on Hand

- `design-qa.md` records visual, interaction, accessibility, model, and release-check findings for the approved implementation.
- `docs/implementation-notes.md` records architecture, model status, state boundaries, deployment, and browser-verification limits.
- `docs/visual-difference-report.md` records differences from the approved design package.
- The repository's fixtures and automated tests are the public evidence for deterministic behavior; future work must not fabricate clinical validation, patient outcomes, or testimonials.

## Product Principles

1. Calm comprehension before analytical completeness.
2. Progressive disclosure without hiding essential state.
3. Semantic honesty about models, observations, uncertainty, and interpretation.
4. Motor-accessible, forgiving interaction with multiple ways to reach important information.
5. Local-first privacy and deterministic, reviewable behavior.

## Accessibility & Inclusion

Important actions target approximately 52–56 CSS pixels and avoid precision dragging as the only interaction. The product must support keyboard and screen-reader use, enlarged text and reflow, orientation changes, reduced motion, increased contrast, reduced transparency, safe areas, dynamic viewport changes, and non-color cues. Hover-only information and color-only meaning are prohibited.

