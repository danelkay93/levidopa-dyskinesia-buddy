# Journey and information architecture: recovery target

Date: 3 August 2026  
Owners: Intent `journey` -> `organize`  
Status: structural direction for visual exploration; not approved UI

## Boundary

This pass changes how the existing information is sequenced and found. It does not change the schedule schema, model, derived periods, dose heuristics, privacy boundary, sharing behavior, or audience split.

The primary journey is optimized for an older person with Parkinson's who may be tired, anxious, distracted, or using one hand. The secondary journey preserves analytical access for a caregiver, researcher, or clinician.

## Primary journey

| Moment | User question | Required answer | Interaction |
|---|---|---|---|
| Open My Day | What do I need to know first? | Next dose: `11:30`, `100 mg`, `half tablet`, `in 2 hrs` | None required |
| Orient | Where am I in the day? | Current time relative to the four scheduled doses | Scan a compact day orientation |
| Interpret | What does the schedule model suggest here? | `Schedule model: rising after the 07:30 dose` plus the model boundary | Open `About this` only for more detail |
| Look ahead | What comes later? | `15:00` and `19:00`, with amounts and short modeled cues | Select a dose for stable details |
| Inspect the day | Where are the broad modeled changes? | A concise period view tied to times and doses | Open `See today` |
| Edit or share | Is this schedule correct, or should I send it? | Schedule list with clear Edit and Share actions | Open `Schedule` from My Day |
| Analyze | I need technical detail | Total curve, contribution view, accessible list, model notes | Switch to `Analyze` |

## Flow decisions

1. **Next dose is the entry state.** No interpretation or graph appears before the concrete medication event.
2. **Orientation precedes explanation.** The user sees time and dose anchors before model language.
3. **The model is an accompaniment.** Its wording is visibly attached to `Schedule model`; it never becomes the page identity or a patient-state headline.
4. **Dose details remain stable.** Selecting a dose opens an opaque sheet; it does not navigate away or make the journey jump.
5. **The full-day view is progressive disclosure.** `See today` opens a concise time-based view, not a second dashboard.
6. **Editing and sharing are one contextual task.** Both live under Schedule; they do not compete with My Day and Analyze as equal monitoring modes.
7. **Analyze is deliberately separate.** Technical curves never migrate into the first My Day viewport.

## Navigation model

Use a small global shell with two destinations:

| Global destination | Job | Default audience |
|---|---|---|
| `My Day` | Next dose, day orientation, later doses, broad modeled context | Primary |
| `Analyze` | Technical model inspection and dose contributions | Secondary |

`Schedule` is a contextual action from My Day and a secondary action from Analyze. It opens a dedicated task screen with an explicit return path. `Share` belongs inside Schedule. This removes the current duplicate model in which Schedule is both a header action and a permanent destination.

On phones, the two global destinations may use a bottom bar only if the shell reserves its full height plus safe area; it must never float over content. A top segmented control is a valid visual alternative if it remains predictable under text enlargement. On tablet and desktop, use a compact rail or header—not an empty full-height navigation slab.

## Information hierarchy

### My Day

1. Page identity and Schedule action
2. Next dose and time remaining
3. Compact day orientation with current-time marker and dose anchors
4. Short, bounded schedule-model statement
5. Later doses
6. Concise model boundary and route to Analyze

### Schedule

1. Page identity and return path
2. Ordered dose list, readable as a whole
3. One expanded edit region at a time
4. Add dose
5. Save or cancel
6. Share/export after the schedule is valid

### Analyze

1. Page identity and current selection
2. Total / Dose contribution choice
3. Graph
4. Accessible dose list or model values
5. Model notes and limitations

## Label decisions

| Use | Avoid | Reason |
|---|---|---|
| `My Day` | `Dashboard`, `Overview` | Names the user's task rather than a container. |
| `Analyze` | `Insights` | Signals technical detail without implying new clinical interpretation. |
| `Schedule` | a second permanent tab | It is an editable object/task, not a monitoring mode. |
| `See today` | `Overview` alone | Predicts the time-based destination. |
| `Schedule model` | `Right now` as an interpretation heading | Keeps the source and uncertainty attached to the statement. |
| `Dose details` | icon-only forecast disclosure | Announces destination and reduces recall. |

## States the visual directions must share

- Default synthetic schedule: `07:30 — 200 mg — 1 tablet`, `11:30 — 100 mg — half tablet`, `15:00 — 100 mg — half tablet`, `19:00 — 100 mg — half tablet`.
- Reference time: `09:30`; next dose in `2 hrs`.
- Visible modeled context: rising after the `07:30` dose.
- My Day default state at 390 x 844 CSS pixels.
- A visible, non-occluding route to My Day and Analyze.
- A visible Schedule action.

## Risks to validate

- Whether two global destinations are more predictable than a top-level Schedule destination for returning users.
- Whether `Schedule model` is understood without implying symptoms or measured medication level.
- Whether the compact day orientation is readable under tremor, enlarged text, and VoiceOver.
- Whether the Schedule action remains findable without permanent-tab duplication.

