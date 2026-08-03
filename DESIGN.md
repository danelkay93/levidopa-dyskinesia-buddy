---
name: Levodopa Day Map
description: A calm forecast journey with analytical depth on demand
colors:
  canvas: "#f6f7f4"
  surface: "#ffffff"
  surface-subtle: "#edf2ef"
  text-primary: "#102f36"
  text-secondary: "#4e6469"
  text-muted: "#617276"
  border-subtle: "#cbd6d2"
  accent: "#2f6b73"
  accent-strong: "#1d515b"
  accent-soft: "#ddecee"
  period-building: "#6f8f80"
  period-building-soft: "#e5efe9"
  period-overlap: "#557d89"
  period-overlap-soft: "#e3edf0"
  period-fading: "#8b7040"
  period-fading-soft: "#f2ebdd"
  period-low: "#a44b42"
  period-low-soft: "#f5e6e4"
  focus: "#006e75"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Geist, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.1
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Geist, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 720
    lineHeight: 1.12
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Geist, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.15
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Geist, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.48
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Geist, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 780
    lineHeight: 1.2
    letterSpacing: "0.055em"
  micro-11:
    fontSize: "11px"
  micro-12:
    fontSize: "12px"
  label-13:
    fontSize: "13px"
  support-14:
    fontSize: "14px"
  support-15:
    fontSize: "15px"
  compact-16:
    fontSize: "16px"
  body-17:
    fontSize: "17px"
  emphasis-18:
    fontSize: "18px"
  value-19:
    fontSize: "19px"
  value-20:
    fontSize: "20px"
  section-22:
    fontSize: "22px"
  sheet-24:
    fontSize: "24px"
  compact-display-27:
    fontSize: "27px"
  header-28:
    fontSize: "28px"
  headline-30:
    fontSize: "30px"
  display-32:
    fontSize: "32px"
  rem-075:
    fontSize: ".75rem"
  rem-08125:
    fontSize: ".8125rem"
  rem-0875:
    fontSize: ".875rem"
  rem-09375:
    fontSize: ".9375rem"
  rem-1:
    fontSize: "1rem"
  rem-10625:
    fontSize: "1.0625rem"
  rem-125:
    fontSize: "1.25rem"
  rem-1375:
    fontSize: "1.375rem"
  rem-16875:
    fontSize: "1.6875rem"
  rem-175:
    fontSize: "1.75rem"
  rem-1875:
    fontSize: "1.875rem"
rounded:
  hairline: "3px"
  rail: "5px"
  compact: "12px"
  field: "15px"
  control: "16px"
  row: "18px"
  station: "19px"
  segmented: "20px"
  prominent: "22px"
  panel: "24px"
  navigation: "26px"
  sheet: "28px"
  circle: "50%"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  section: "32px"
components:
  button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "52px"
  button-primary:
    backgroundColor: "{colors.accent-strong}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "52px"
  dose-station:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.station}"
    padding: "14px 44px 14px 18px"
  bottom-navigation:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.navigation}"
    height: "66px"
---

# Design System: Levodopa Day Map

## Overview

**Creative North Star: “The Calm Day Guide”**

The visual system is calm clinical modernism with human warmth. It reduces chrome and container noise, but never reduces contrast, label size, affordance, or semantic precision. The dominant phone structure is a vertical forecast journey; analytical density is reserved for Analyze.

Depth, translucency, and motion explain hierarchy or state continuity. They are not decorative themes, and medically meaningful content remains on stable, legible surfaces.

**Key characteristics:**

- forecast-like period summaries and a legible vertical day progression;
- warm off-white canvas, deep teal typography, and muted semantic period colors;
- large, rounded, forgiving controls with visible focus treatment;
- compact analytical graphics that always have accessible textual alternatives;
- responsive transformations rather than stretched mobile cards.

## Colors

The light palette combines deep teal-neutrals with restrained green, blue, amber, and red period roles. Dark-mode equivalents live in `src/styles/globals.css` and preserve the same semantic assignments.

### Primary

- **Deep Guide Teal** (`#1d515b`): primary actions, selected states, dose anchors, and the strongest navigation emphasis.
- **Soft Guide Teal** (`#ddecee`): selected or contextual surfaces that need emphasis without heavy contrast.

### Secondary

- **Building Sage** (`#6f8f80`) and **Overlap Blue** (`#557d89`): schedule-relative period roles.
- **Fading Amber** (`#8b7040`) and **Low Terracotta** (`#a44b42`): fading and low period roles, always paired with text or shape.

### Neutral

- **Warm Canvas** (`#f6f7f4`), **White Surface** (`#ffffff`), and **Subtle Surface** (`#edf2ef`): background hierarchy.
- **Deep Teal Ink** (`#102f36`), **Secondary Ink** (`#4e6469`), and **Muted Ink** (`#617276`): readable text hierarchy.
- **Quiet Border** (`#cbd6d2`): separators and control boundaries.

**The Semantic Color Rule.** Period colors carry stable schedule-relative meanings and never substitute for labels, icons, patterns, or explanatory copy.

## Typography

**Display and Body Font:** the platform system sans stack, with SF Pro Text and Geist fallbacks.

**Character:** familiar, low-friction, and numerically clear. Large time values use tabular numerals; compact uppercase labels are reserved for short eyebrows, never body instructions.

### Hierarchy

- **Display** (700, 32px, 1.1): view headings.
- **Headline** (720, 30px, 1.12): current-state and next-dose emphasis.
- **Title** (700, 22px, 1.15): journey and section headings.
- **Body** (400, 17px, 1.48): explanations and task copy.
- **Label** (780, 13px, 0.055em, uppercase): brief category labels only.

Supporting values from 11–20px are reserved for chart labels, navigation, secondary metadata, readouts, and editor controls. Responsive refinements use equivalent rem values recorded in the machine-readable token set; none of these smaller sizes replace the 17px body default.

**The Plain-Language Rule.** Technical terminology and numerical precision belong in Analyze or an explicit disclosure; My Day leads with understandable descriptions.

## Layout

Phone views use 20px side padding, a content measure capped near 580px, and a fixed bottom navigation that accounts for safe-area insets. The journey uses a 38px rail gutter and 12px separation between dose stations. At 768px the navigation becomes a left rail and a selected-detail pane appears beside the capped journey. Phone landscape uses a left navigation rail and a side sheet. The minimum supported width is 320px.

Dynamic viewport units and `env(safe-area-inset-*)` are explicit implementation requirements. Enlarged text reflows vertically; layouts do not preserve visual symmetry by clipping content.

## Elevation & Depth

The system is flat and tonal by default. Borders and background shifts establish most hierarchy. Shadows are limited to floating navigation, sheets, and the tablet detail pane; blur is removed when reduced transparency is requested.

- **Floating navigation:** `0 8px 24px rgb(16 47 54 / .13)`.
- **Context sheet:** `0 18px 42px rgb(16 47 54 / .18)`.
- **Tablet detail pane:** `0 10px 28px rgb(16 47 54 / .08)`.

**The Stable Medical Surface Rule.** Medication values, chart labels, warnings, and medically meaningful colors never rely on glass or background blur for readability.

## Shapes

Rounded rectangles are confident and forgiving rather than bubbly: 16px controls, 18–22px rows and dose stations, 24–28px panels, navigation, and sheets. Important circular icon controls remain 52px. Borders are normally 1px and strengthen under increased-contrast preferences; visible focus uses a 3px focus ring with 3px offset.

## Components

### Buttons

- **Shape:** 16px radius, 52px minimum height and width for important actions.
- **Primary:** Deep Guide Teal fill with Warm Canvas text.
- **Focus / Pressed:** 3px focus ring; restrained scale feedback that disappears under reduced motion.
- **Quiet:** transparent background, semantic control retained.

### Cards / Containers

- **Dose stations:** white surface, quiet border, 19px radius, and a visibly stronger 22px treatment for the next dose.
- **Current-state panel:** 24px radius with a restrained semantic tonal blend.
- **Analytical chart:** stable white surface, 22px radius, border, no decorative glass.

### Inputs / Fields

- **Time input:** subtle surface, quiet border, 15px radius, 54px minimum height, 20px tabular numerals.
- **Steppers and tablet choices:** direct 52px controls and a selected state expressed by both border and background.
- **Errors:** plain-language explanation and terracotta treatment, never color alone.

### Navigation

Phone navigation is a three-item floating bar with 52px items and a solid selected state. At tablet and short-landscape breakpoints it becomes a left rail. The background becomes fully opaque under reduced-transparency preferences.

### Forecast Journey

The vertical rail, dose nodes, tablet illustration, time, amount, and forecast copy form one semantic station. The next dose is more prominent without turning every event into an equal card. A compact overview offers direct access to the full day and has a non-chart reading path.

### Analyze Chart

Dose markers, contribution curves, cursor state, and period fields use the same semantic tokens as My Day. The chart permits vertical page panning and provides accessible dose lists and readouts rather than depending on precision targeting.

## Do's and Don'ts

- **Do** make current state and the next dose immediately legible.
- **Do** use text, shape, and focus treatment alongside color.
- **Do** transform navigation, detail, and sheets at responsive breakpoints.
- **Do** reserve Motion for state continuity, selection feedback, and sheet transitions with reduced-motion equivalents.
- **Don't** turn the journey into a generic bento dashboard or proliferate equal-weight cards.
- **Don't** use tiny labels, faint contrast, hover-only disclosure, or precision dragging as the only route.
- **Don't** place medically meaningful content behind decorative glass, gradients, or animation.
- **Don't** allow visual work to change model semantics, clinical claims, or privacy boundaries.
