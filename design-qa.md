# Forecast Journey design QA

## Scope

Reviewed the React implementation against the approved Forecast Journey design at 320, 390, and 768 CSS pixels and across selected dose, selected period, Analyze, editing, sharing, malformed import, midnight wrap, dense schedule, long-low schedule, enlarged text, reduced motion, dark mode, forced colors, and phone landscape.

## Visual QA

- The first viewport has one dominant idea: current modeled schedule state.
- The next dose is complete, visibly incoming, and more prominent than later doses.
- The compact overview retains one thick magnitude line, separate period fields, a current marker, and dose anchors.
- Later doses remain readable without becoming dashboard cards.
- Icons and tablet illustrations use rounded, optically substantial geometry.
- The palette is restrained and medically meaningful information never sits behind glass.
- Tablet layout transforms into a rail, capped journey, and selected-detail pane rather than simply stretching the phone UI.
- Analyze remains visually and semantically separate from My Day.

## Interaction QA

The verified full story is:

My Day → full-day overview → selected derived period → Analyze → selected technical curve → Schedule → amount edit → My Day → Schedule → share/export disclosure.

Also verified duplicate-time validation, remove/undo, malformed-link recovery, local persistence, legacy schedule migration, keyboard focus, and accessible list alternatives to chart targeting.

## Accessibility QA

- Important controls are at least 52 CSS pixels; all other interactive controls are at least 44 CSS pixels.
- No page-level horizontal overflow occurs in the required matrix.
- Axe reports no WCAG A/AA violations in default, Analyze, editing, selected, or dense states.
- Text and shape accompany semantic color.
- Reduced motion removes sheet translation and opacity transitions.
- Reduced-transparency handling uses opaque navigation/sheet surfaces.
- Enlarged text reflows vertically without clipping.
- Modal focus and dismissal use React Aria semantics.

## Model and trust QA

- The deterministic PK/effect-site layer remains separate and tested.
- The 8% practical-zero transform is preserved.
- Building, overlap, steady, fading, and low are documented display heuristics, not clinical thresholds.
- No symptom observation, dyskinesia prediction, dosing recommendation, remote logging, analytics, backend, or cloud patient storage was introduced.

## Known release checks

Playwright WebKit is not a substitute for physical iPhone or BrowserStack verification of Safari chrome, exact safe-area transitions, VoiceOver rotor behavior, Dynamic Type, native share UI, virtual-keyboard behavior, scroll elasticity, and physical motor usability.

passed
