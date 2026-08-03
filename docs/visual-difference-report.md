# Forecast Journey visual-difference report

## References

The implementation was reviewed against the approved Forecast Journey vectors at 320, 390, and 768 CSS pixels, plus the approved selected-dose, Analyze, editing, and sharing states.

## Fidelity ledger

| Area | Approved intent | Rendered result | Disposition |
| --- | --- | --- | --- |
| First-view hierarchy | Right Now, compact overview, incoming next dose, then later doses | Same order and emphasis | Match |
| Phone margins and geometry | 16px at 320; 20px at 390; soft substantial radii | Same responsive gutter system and 18–24px radii | Match |
| Current summary | One large modeled-state statement with a restrained glyph | Same; copy shortened to “Rising after 07:30.” to reduce repetition | Intentional copy refinement |
| Compact overview | Thick modeled-shape line, period fields, Now marker, dose anchors | Same encoding, including dose-time anchors and non-color period fields | Match |
| Next dose | Complete, prominent incoming station | Slightly taller than the concept so 52px targets, enlarged text, and forecast copy remain legible | Intentional accessibility deviation |
| Later doses | Quieter complete stations with forecast glyphs | Same; final long-gap dose explicitly says “Fading afterward” | Match |
| Bottom navigation | Three calm primary destinations | Same; Phosphor icons use bold/filled weights for more presence | Match |
| Selection sheet | Stable explanation, model boundary, Analyze action | Same; rendered sheet is opaque rather than translucent so medication content never shows through it | Intentional safety/readability deviation |
| Analyze | Separate technical curve and dose-contribution selection | Same, with an accessible list alternative below the curve | Match |
| Editing | Large time/amount/tablet controls, no precision-only interaction | Same, with validated HH:MM fields, duplicate-time blocking, remove/undo, and 52px controls | Match plus functional completion |
| Tablet | Navigation rail, capped journey, persistent selected-detail pane | Same structural transformation; no empty detail pane before selection | Intentional simplification |
| Enlarged text | Reflow without horizontal scrolling or clipping | Reflows vertically; next dose remains complete and all targets remain operable | Match |

## Above-the-fold copy diff

Approved and rendered screens preserve the same hierarchy and labels: `My Day`, `Right now`, `Medication is building`, `Next dose`, dose time and amount, forecast cue, and `Later today`.

Intentional differences:

- `Modeled level rising after 07:30.` became `Rising after 07:30.` because the global and contextual model boundaries already identify the content as modeled.
- The approved static reference showed `in 1 hr 50 min`; the deterministic test state uses 09:30, so the rendered value is correctly `in 2 hrs`.
- The tablet action is `Schedule` rather than `Edit schedule`, matching the approved three-destination navigation decision.

No unapproved badges, metrics, dashboard cards, hero kickers, decorative gradients, or clinical claims were introduced.

## Material mismatches found and fixed

- Next-dose text was initially squeezed by its forecast column.
- 320px initially pushed the next dose under navigation.
- Later-dose metadata wrapped too aggressively.
- The tablet default initially showed an unnecessary empty detail panel.
- Analyze initially repeated its page title and captured lazy-loading placeholders.
- Phone sheets initially allowed underlying medication values to show through.
- Desktop WebKit exposed seconds in native time fields.
- Compact overview initially omitted dose anchors.
- Reduced-motion axe scans initially caught partial-opacity sheet frames.

All were corrected before review.

## Intentional remaining deviations

The implementation does not attempt a literal pixel-for-pixel recreation of the exploratory SVGs. It preserves their approved hierarchy, semantics, palette, geometry, interaction model, and responsive transformations while resolving real browser behavior, 52px target requirements, and text reflow. The current screenshots are review evidence; they should become approved visual baselines only after user approval.
