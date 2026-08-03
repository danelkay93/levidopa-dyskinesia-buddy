# Wireframe structure: My Day recovery

Date: 3 August 2026  
Owner: Intent `wireframe`  
Rung: full-page structural specification; styling deliberately unresolved  
Feedback target: hierarchy, density, and placement—not color or typography

## Screen inventory

| Screen/state | Primary job | Included in visual exploration |
|---|---|---|
| My Day — default phone | Identify the next dose and understand the broad day | Yes; all three directions |
| My Day — dose details | Inspect one dose without losing place | Structural requirements only |
| See today | Inspect broad modeled periods tied to times and doses | Structural requirements only |
| Schedule — list | Review the complete schedule and enter editing | Structural requirements only |
| Schedule — one dose editing | Change one dose with forgiving controls | Structural requirements only |
| Analyze | Inspect technical model detail | Existing surface retained as a constraint |

## Mobile My Day anatomy

The screen uses a single reading column. It is not a dashboard.

| Zone | Job | Structural requirement |
|---|---|---|
| A. Page bar | Orient and expose the contextual task | `My Day` plus one `Schedule` action; compact enough that it does not become the first content block. |
| B. Next dose | Answer the primary question | First dominant region. Time, amount, tablet fraction, and relative time read as one unit. Details affordance is explicit. |
| C. Day orientation | Show where now and scheduled doses sit | Compact 06:00-06:00 orientation with four dose anchors and a current marker; text equivalent is adjacent or available. |
| D. Model context | Explain one broad schedule-relative fact | `Schedule model` label, one sentence, close model boundary, optional `About this`. Never a hero. |
| E. Later doses | Support scanning and selection | Two compact rows at `15:00` and `19:00`; use alignment and dividers before cards. |
| F. Global shell | Move between My Day and Analyze | Two destinations, non-floating, safe-area aware, no overlap. |

## Five-second squint test

At a blurred or distant glance, the order must still be:

1. `11:30`
2. `Next dose` and `100 mg · half tablet`
3. the day orientation
4. later dose times
5. model interpretation

If the model statement, navigation, page title, or a decorative container wins this test, the structure fails.

## Mechanisms considered

### 1. Vertical itinerary

The next dose leads directly into a slim vertical time spine and later rows. This makes the medication day feel like an itinerary and preserves the strongest product-specific idea in the incumbent.

**Trade-off:** excellent chronological reading and enlargement behavior; the broad day shape is less immediate unless the orientation strip is carefully integrated.

### 2. Day-band orientation

The next dose sits above a horizontal day band divided into Morning, Afternoon, Evening, and Overnight. Dose anchors and `now` make the broad shape immediately visible before the later list.

**Trade-off:** strongest glanceable orientation; requires a disciplined text alternative and enough width at 320px.

### 3. Dose ledger

The next dose is the first row of a compact schedule ledger; the current modeled context appears as a restrained inset between the next and later doses.

**Trade-off:** strongest cross-dose comparison and editor continuity; risks feeling clinical or table-like unless the visual direction supplies warmth.

These mechanisms are intentionally distinct. The high-fidelity directions will each promote one; they are not palette variants.

## Dose details sheet

- Opaque surface with a clear `Dose details` title and close control.
- Keeps `11:30`, `100 mg`, and `half tablet` together.
- Describes only the schedule-model cue associated with this dose.
- Gives a single route to `Edit schedule`; editing does not occur inside the detail sheet.
- Maximum height leaves spatial context but never allows underlying copy to ghost through.

## See today

- Opens as an opaque full-height sheet or dedicated page; visual directions may choose the container.
- Leads with the time orientation, then a short list of broad periods.
- Period rows use start/end time and literal modeled language; they are not giant colored tiles.
- Selecting a period reveals one stable detail region rather than expanding the entire list.
- Close/back returns to the exact My Day scroll and selection state.

## Schedule structure

- Ordered schedule visible as a compact list before editing.
- One row expands at a time to show time, amount, whole/half tablet controls, and remove action.
- `Add dose` follows the list and respects the 12-dose limit.
- `Save schedule` is the only primary action while dirty; `Cancel` remains visible.
- Share/export appears after a valid saved schedule, with disclosure and fallback behavior preserved.
- The sentence `Large controls; no precision dragging` does not appear.

## Responsive transformation

| Context | Structure |
|---|---|
| 320-430px phone | Single column; bottom shell only if space is reserved; time orientation must reflow without horizontal scroll. |
| Phone landscape | Two compact bands: next dose + context, then orientation + later doses; avoid a tall fixed bar. |
| 768px tablet | Two-column composition: next dose/model context beside day orientation/later doses. |
| 1024px+ | Centered working canvas with a useful second column or compact rail; no phone column marooned in empty space. |

## Structural non-negotiables for all three directions

- Same synthetic schedule, reference time, model boundary, and global destinations.
- No graph in the first viewport.
- No more than one visually dominant container above the fold.
- No content behind translucent medical surfaces.
- No duplicated Schedule destination.
- No fixed element may cover content at 320px, 200% text, or safe-area insets.
- Visual style must support—not create—the hierarchy.

## Handoffs after visual selection

- `Articulate`: validate schedule-model terminology and detail-sheet copy.
- `Fortify`: empty, malformed, dense, sparse, pre-06:00, midnight, validation, share-failure, and offline states.
- `Transpose`: finalize phone landscape, tablet, and desktop composition from the selected phone direction.
- `Specify`: produce component/state/interaction requirements only after the user approves a rendered direction.

