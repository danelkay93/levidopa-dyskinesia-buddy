# Intent evaluation: incumbent Forecast Journey

Date: 3 August 2026  
Assessment owner: Intent `evaluate`  
Status: diagnostic; no presentation changes authorized

## Scope and evidence

This evaluation covers the deployed `main` experience and the repository state at commit `3650a96`. Evidence includes the current live DOM, the 320, 390, tablet, overview, Analyze, and Schedule captures from PR #2, their target and viewport metrics, the governing product brief, and the implemented React/CSS structure.

The quantitative ratings are expert estimates from a cognitive walkthrough, not measured usability-study results. Physical tremor, fatigue, VoiceOver, Mobile Safari chrome, and real-user comprehension remain untested.

## UX health score

**44/100 — major product-hierarchy and comprehension repair required.**

The engineering and accessible-control foundation is substantially stronger than the experience it presents. The primary user job still fails: at 390 CSS pixels, the 278px current-state panel and 70px header consume most of the first viewport before the 190px next-dose station; at 320px, fixed navigation visibly overlaps the journey. The interface foregrounds an ambiguous modeled state while the next dose—the most concrete, actionable fact—is delayed.

## Anti-pattern verdict

**Significant issues, but no evidence of deliberate manipulation.**

- **Visual misdirection (high impact, unintentional):** the largest object is an abstract model-state hero, not the primary next-dose fact.
- **Jargon overload / simulated clinical state (high impact):** “Medication is building,” “Medication is fading,” and “Higher and overlapping” sound like current patient states more strongly than schedule-relative model descriptions. The later caveat does not fully undo the headline.
- **Assumption of context (medium):** abstract glyphs and the miniature curve ask the primary user to infer meanings before the interface explains them.
- **Real Estate Tour (medium):** “Large controls; no precision dragging” exposes design rationale as product copy instead of helping the user edit a schedule.

## Priority issues

### P1 — The first viewport answers the wrong question first

**Evidence:** the 390px capture begins with a large `Medication is building` panel and miniature graph; the next dose begins below it. At 320px, only part of the next-dose station is available before the floating navigation.  
**Impact:** a fatigued or anxious user must interpret an abstract model summary before reaching the concrete medication event. This contradicts the product goal of grasping the day within seconds.  
**Route:** Journey for task sequence, Organize for information priority, Wireframe for first-viewport structure.

### P1 — Model language overstates what is known

**Evidence:** modeled exposure is repeatedly worded as medication currently “building” or “fading”; the overview uses `Higher and overlapping`. The caveat appears after the journey or inside secondary copy.  
**Impact:** the primary audience may read schedule-relative heuristics as an observed or clinically meaningful body state. This is a trust and medical-semantic risk even though no recommendation is made.  
**Route:** Articulate with Include; preserve the concise model boundary and move it into the interpretation itself rather than relying on a later disclaimer.

### P1 — Fixed navigation obscures content and duplicates Schedule

**Evidence:** captured 320, 390, Analyze, and editor states show the floating navigation over journey/editor content. `Schedule` is simultaneously a top-right action and a permanent navigation destination.  
**Impact:** content appears available but becomes difficult to read or activate near the bottom edge; the duplicate entry weakens orientation and creates competing models of the same action.  
**Route:** Journey and Organize, then Wireframe and Transpose.

### P1 — The overview sheet contradicts its claimed stable surface

**Evidence:** the 390px overview capture visibly ghosts the medication page and navigation through the sheet while presenting a long stack of large period rows.  
**Impact:** medically meaningful copy loses isolation and contrast; the sheet becomes another full-screen page without the orientation or scanning advantages of one.  
**Route:** Wireframe and Include; Impeccable critique owns material, opacity, and composition after structure is settled.

### P2 — Container and type inflation create an accessibility caricature

**Evidence:** nearly every event, tab, editor group, navigation item, and model summary is a large rounded container with heavy type. The 390px document is 1,078px tall despite only three visible upcoming doses; the editor compounds this into repeated full-card forms.  
**Impact:** large targets are valuable, but excessive scale and enclosure increase scrolling, reduce grouping clarity, and make every object compete at similar weight. Motor accessibility is not synonymous with giant typography and cards.  
**Route:** Wireframe first; Impeccable `distill`, `layout`, and `typeset` only after a direction is selected.

### P2 — Tablet/desktop adaptation is mostly unused canvas

**Evidence:** the 1024px capture caps the same mobile column beside an empty field, while the persistent rail and duplicate top Schedule action remain.  
**Impact:** the design technically reflows but does not use larger contexts to improve comparison, orientation, or analytical access.  
**Route:** Transpose after phone hierarchy is settled.

## Heuristic severity scores

Scale: 0 = no issue; 4 = catastrophic.

| # | Heuristic | Severity | Key finding |
|---|---|---:|---|
| H1 | Visibility of system status | 1 | Selection and navigation states are visible, but the model state is more visible than the user's actionable state. |
| H2 | Match with the real world | 3 | Schedule-relative model output is phrased like current medication or patient state. |
| H3 | User control and freedom | 1 | Stable sheets and explicit close controls are positive; overlapping navigation reduces practical freedom near the viewport edge. |
| H4 | Consistency and standards | 2 | Schedule is both a header action and destination; the overview behaves like a page inside a sheet. |
| H5 | Error prevention | 1 | Editing validation, dose limits, malformed-link recovery, and undo are strong foundations. |
| H6 | Recognition rather than recall | 3 | Forecast glyphs and the micro-overview require interpretation; labels do not make their relation to the model immediately obvious. |
| H7 | Flexibility and efficiency | 1 | Analyze has a list alternative and controls are large, but expert/primary pathways are not efficiently prioritized. |
| H8 | Aesthetic and minimalist design | 4 | The interface is dominated by oversized type, rounded containers, duplicate actions, and excessive vertical demand. |
| H9 | Error recognition and recovery | 1 | Recovery behavior is comparatively mature and should be preserved. |
| H10 | Help and documentation | 2 | The model boundary exists, but it arrives too late to prevent overreading of the main headline. |

Total issue severity: **19/40**.

## Cognitive walkthrough

### Task A: identify the next dose and broad day shape

1. Open My Day — **hesitation:** the user sees a large modeled-state claim first.
2. Look for the next dose — **hesitation/failure at 320px:** the dose is lower and partly constrained by fixed navigation.
3. Interpret the day shape — **failure:** the micrograph, color fields, dose dots, and forecast glyph have no obvious shared mental model for a first-time user.

### Task B: understand the rest of the day

1. Tap the miniature overview — **hesitation:** the graph looks informative but does not clearly announce that it opens a period list.
2. Scan the overview sheet — **failure:** long, equally weighted rows and a translucent/ghosted background create a dense secondary page rather than a glanceable overview.
3. Select a period — **pass with reservations:** the stable disclosure pattern is sound, but the language remains stronger than the model warrants.

### Task C: edit and share a schedule

1. Find Schedule — **pass but inconsistent:** two visible routes exist for the same destination.
2. Edit a dose — **pass:** direct controls, validation, and 52px targets are appropriate.
3. Review several doses — **hesitation:** repeated large cards create substantial scrolling and weak cross-dose comparison.
4. Share/export — **pass:** the disclosure and local-first boundary are good foundations.

### Task D: inspect technical detail

1. Enter Analyze — **pass:** the audience separation is visible.
2. Inspect total or dose contribution — **pass:** tabs, graph, and accessible dose list offer multiple routes.
3. Relate Analyze back to My Day — **hesitation:** the product lacks a concise shared vocabulary that clearly maps a My Day statement to its technical evidence.

## Positive findings to protect

- My Day and Analyze are genuinely separated in code and navigation.
- The deterministic model, derived heuristics, and UI are modular rather than entangled.
- Important targets, focus treatment, keyboard semantics, reduced-motion behavior, and list alternatives are materially better than the prototype foundation.
- Editing validation, undo, malformed-link recovery, local persistence, and sharing disclosure are credible product work.
- The implementation uses synthetic fixtures and maintains the local-first privacy boundary.

## Routed action sequence

1. **Journey:** define the order for opening My Day, locating the next dose, understanding today, inspecting a period, and entering Analyze.
2. **Organize:** reduce My Day to one primary fact, one compact orientation device, and a progressive list of later events; resolve Schedule's navigation status.
3. **Include:** set cognitive, motor, screen-reader, text-enlargement, and semantic-honesty requirements before visual work.
4. **Wireframe:** create structurally different phone solutions using the same synthetic schedule and states.
5. **Impeccable:** critique the rendered incumbent separately, then shape three visual worlds from the approved structural brief.

No product-strategy loop-back is required. The governing audience, privacy boundary, and model limits remain sound; the failure is in hierarchy, structure, language, and visual execution.
