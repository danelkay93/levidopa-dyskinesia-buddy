# Inclusive structure and content contract

Date: 3 August 2026  
Owners: Intent `include` + `articulate`  
Status: constraint set for visual exploration; copy remains subject to comprehension testing

## Design-for-access constraints

### Perceivable

- Base body text is at least 16px in the implemented product and survives 200% text enlargement without clipping, collision, or loss of actions.
- Text contrast targets WCAG 2.2 AA or better; controls and focus indicators target at least 3:1 against adjacent colors.
- Dose, selection, and modeled-period meaning use text plus position or shape. Color never carries meaning alone.
- The day orientation has a linear text equivalent containing every dose time and the current reference time.
- Tablet identity is reinforced by `1 tablet` or `half tablet`; the illustration is never the only representation.

### Operable

- Primary controls and dose rows target 48-56px; all controls meet at least 44px where space permits and never fall below the WCAG 2.2 minimum.
- Large targets come from padding and hit area, not giant surrounding cards or oversized display type.
- No swipe, drag, hover, long press, or multi-pointer gesture is required. Editing uses direct buttons and fields.
- Navigation reserves its own space, respects safe-area insets, and cannot cover content.
- Sheets receive focus, close with Escape, trap focus only while modal, and return focus to the trigger.

### Understandable

- The first viewport contains one dominant fact: the next dose.
- Every modeled interpretation is prefixed or labeled with its source: `Schedule model` or `Modeled from this schedule`.
- Copy never states or implies symptoms, treatment effect, adherence, measured drug level, or dosing advice.
- One task has one visible primary route. Schedule is not presented simultaneously as a peer destination and duplicate header control.
- Destructive or lossy actions are named by consequence; saving, cancellation, malformed-link recovery, and clipboard fallback remain explicit.

### Robust

- DOM and reading order match visual order: page title -> next dose -> day orientation -> model context -> later doses -> boundary.
- One `main` landmark, one page `h1`, sequential headings, native buttons and links, and named navigation landmarks.
- Dose rows announce time, amount, tablet fraction, next-dose status where applicable, and that activation opens details.
- The orientation control communicates selected/current state without relying on CSS position.
- Dynamic validation and share results use appropriate polite announcements; urgent errors remain specific and recoverable.

## Cognitive and motor posture

- Prefer recognition to recall: time, amount, tablet fraction, and later doses remain visible together.
- Keep each line literal and short. Avoid idioms, unexplained technical abbreviations, and design rationale in product copy.
- Preserve a stable spatial model: global navigation does not move between product areas, contextual actions stay near their object, and opening details does not reflow the underlying list.
- Use whitespace and alignment to group. Do not require a rounded boundary around every item.
- Avoid time pressure, auto-advancing content, animated model traces, or decorative motion. Respect reduced motion.

## Working copy deck

These strings are intentionally conservative. They are safe enough for visual comparison but are not a substitute for comprehension research with the primary audience.

| Purpose | Working copy | Notes |
|---|---|---|
| Page title | `My Day` | Preserve. |
| Contextual action | `Schedule` | Opens edit/share task. |
| Primary fact label | `Next dose` | Concrete and familiar. |
| Primary fact | `11:30` | Keep 24-hour time until locale requirements change. |
| Dose identity | `100 mg · half tablet` | Redundant text supports tablet illustration. |
| Time remaining | `in 2 hrs` | Generated from current reference time. |
| Orientation heading | `Today` | Time and dose anchors sit beneath. |
| Orientation action | `See today` | Opens broad period details. |
| Model source label | `Schedule model` | Always adjacent to interpretation. |
| Model statement | `Rising after the 07:30 dose` | Describes the deterministic schedule model, not the person. |
| Model boundary | `Modeled from this schedule—not symptoms or measured medication levels.` | Place near the statement or first disclosure, not only at page end. |
| Later section | `Later today` | Preserve. |
| Detail action | `Dose details` | Avoid abstract icon-only affordance. |
| Technical route | `Analyze` | Preserve. |

## Rejected copy

| Rejected | Why |
|---|---|
| `Medication is building` | Sounds like an observed patient or drug state. |
| `Medication is fading` | Same problem and may imply treatment failure. |
| `Higher and overlapping` | Ambiguous without naming modeled dose contributions. |
| `Right now` above a model interpretation | Gives an unmeasured model output the authority of a present observation. |
| `Large controls; no precision dragging` | Internal design rationale, not user help. |
| `Forecast` alone | Can imply prediction of symptoms or efficacy; use only with a clear model qualifier. |

## Required manual validation

- Five-second test: ask users what the first screen tells them and what it does not know.
- Read-aloud test: confirm the linear experience remains clear without the visual time orientation.
- Tremor/one-hand test on a physical iPhone: next dose, Schedule, See today, dose details, and global navigation.
- 200% text and landscape test: primary fact and model boundary remain visible without occlusion.
- VoiceOver test: headings, dose rows, current/selected states, sheets, editor, and share result.

