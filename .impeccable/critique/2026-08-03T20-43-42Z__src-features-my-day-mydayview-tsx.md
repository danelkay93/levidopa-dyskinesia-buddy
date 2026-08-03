---
target: incumbent Forecast Journey My Day
total_score: 23
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 4
timestamp: 2026-08-03T20-43-42Z
slug: src-features-my-day-mydayview-tsx
---
# Impeccable critique: incumbent Forecast Journey

> ⚠️ DEGRADED: single-context. The installed critique playbook normally requires two isolated subagents; team delegation was not authorized for this turn. The visual assessment was completed first, followed by the deterministic detector, to reduce anchoring.

Date: 3 August 2026  
Surface mode: Operate  
Target: deployed My Day, Analyze, overview, and Schedule surfaces

## Design health score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of system status | 2 | The visible model state dominates the actionable medication state. |
| 2 | Match system / real world | 1 | Model-derived phrases sound like observed medication or patient state. |
| 3 | User control and freedom | 3 | Stable disclosures and explicit navigation work, but fixed chrome covers content. |
| 4 | Consistency and standards | 2 | Schedule has two entry models; sheets behave like pages. |
| 5 | Error prevention | 4 | Validation, undo, schema limits, and malformed-link recovery are strong. |
| 6 | Recognition rather than recall | 1 | Forecast glyphs and the mini-curve are not self-evident. |
| 7 | Flexibility and efficiency | 3 | Analyze's accessible list and direct editor controls are useful. |
| 8 | Aesthetic and minimalist design | 1 | Giant cards, heavy type, repeated pills, and fixed chrome overwhelm the task. |
| 9 | Error recovery | 4 | The behavioral recovery foundation is credible and should survive redesign. |
| 10 | Help and documentation | 2 | Model limitations exist but arrive after stronger claims. |
| **Total** |  | **23/40** | **Functionally competent, visually unsuccessful** |

## Design specificity verdict

The vertical dose rail and custom whole/half tablet object are product-specific ideas worth protecting. Most other visible choices are category-interchangeable: oversized rounded panels, segmented controls, floating pill navigation, soft pastel state fields, abstract line glyphs, and enormous bold headings. The result resembles an AI-generated accessibility dashboard more than a calm guide authored for Parkinson's medication use.

The deterministic scan found one advisory in `src/styles/globals.css`: `border-radius: 14px` is outside the incumbent `DESIGN.md` radius scale. On merged `main`, the CLI incorrectly exits 2 for this advisory-only result—the exact defect repaired in draft PR #4. The finding is irrelevant to the redesign verdict and must not pressure a token change.

## Overall impression

The interface shouts slowly. It uses large scale, large radii, and large targets everywhere, so nothing feels quiet and almost nothing feels primary. The single biggest opportunity is to make time—not a modeled state card—the organizing material of My Day.

## What's working

- The dose rail gives the day a specific temporal spine.
- The Analyze curve belongs to its audience and has an accessible list alternative.
- The custom tablet identity and robust editing/sharing behavior create a credible product foundation.

## Priority issues

### P1 — False focal point

**Why it matters:** the first viewport makes an abstract model interpretation the hero and delays the user's concrete question.  
**Fix:** make the next dose the first unequivocal fact; reduce current model context to a short, bounded accompaniment.  
**Future Impeccable owner:** `shape`, then `layout` and `distill` after approval.

### P1 — Scale and container monotony

**Why it matters:** giant headings, giant cards, rounded controls, and pill navigation flatten hierarchy and force excessive scrolling.  
**Fix:** use fewer containers, a narrower type ramp, disciplined separators, and meaningful changes in density rather than boundary around every object.  
**Future Impeccable owner:** `distill`, `typeset`, `layout`.

### P1 — Product copy overclaims the model

**Why it matters:** `Medication is building/fading` reads more clinically than the model supports, particularly for a vulnerable primary user.  
**Fix:** make schedule-relative status part of the phrase itself and reserve stronger technical vocabulary for Analyze.  
**Future Impeccable owner:** `clarify`, after Intent/Articulate settles terminology.

### P1 — Chrome obstructs the experience

**Why it matters:** fixed bottom navigation visibly covers journey, Analyze, and editor content; tablet navigation becomes a tall empty rail.  
**Fix:** reserve layout space, reduce permanent destinations, and transform navigation by context instead of floating the same object everywhere.  
**Future Impeccable owner:** `layout` and `adapt`, after Journey/Organize decides destinations.

### P2 — Weak signature imagery

**Why it matters:** forecast glyphs are abstract curves in circles and do not improve recognition, warmth, or trust.  
**Fix:** use a more legible temporal/status vocabulary built from time, dose identity, and carefully selected maintained icons; do not invent new clinical symbols.  
**Future Impeccable owner:** `shape` and `delight`, bounded by Include and semantic review.

## Persona red flags

**Primary user with tremor and fatigue:** large targets help, but fixed chrome blocks content, the first fact is delayed, and repeated vertical travel turns a short schedule into a long motor task.

**First-time family caregiver:** the graph and glyphs imply analytical meaning without teaching their mapping; the caveat arrives after language that sounds more certain.

**Analytical caregiver/clinician:** Analyze is useful, but the oversized shell wastes phone and desktop space and does not clearly map technical selections back to My Day statements.

## Keep

Keep the temporal spine, tablet identity, accessible alternatives, model separation, validation, recovery, local-first privacy, and synthetic verification system. Replace the visual world and first-viewport hierarchy around them.

## Run notes

- Live deployed My Day, Analyze, and Schedule were walked in the cloud browser.
- Deterministic mobile and tablet captures from PR #2 were downloaded and inspected.
- The project-local detector ran after the visual assessment and produced one advisory-only radius note; its exit code reproduced the known main-branch bug fixed by draft PR #4.
- No overlay or live-edit session was used because the incumbent presentation is not approved for refinement.
- Questions skipped: the governing brief and explicit user rejection make the recovery direction straightforward; the next decision belongs after three rendered alternatives exist.
