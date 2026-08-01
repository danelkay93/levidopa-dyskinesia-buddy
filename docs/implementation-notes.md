# Forecast Journey implementation notes

This branch starts from the Phase 1 verification foundation and replaces the provisional one-file prototype with a React 19, TypeScript, Vite 8 application.

## Model status

The deterministic model constants, five-minute sampling, isolated 200 mg controlled-release reference, effect-site smoothing, and 8% practical-zero transform are preserved. Model mechanics are extracted into `src/model/pk.ts` and covered by unit tests. The new plain-language periods remain explicitly documented display heuristics and are not clinical thresholds.

## Architecture

- `src/domain`: schedule types and validation
- `src/model`: deterministic PK/effect-site model
- `src/interpretation`: derived schedule periods and copy
- `src/geometry`: chart geometry helpers
- `src/features/my-day`: Forecast Journey primary experience
- `src/features/analyze`: technical exposure curve and dose contributions
- `src/features/schedule` and `src/features/share`: editing and database-free sharing
- `src/fixtures`: synthetic public fixtures

## Design authority

The approved Forecast Journey design package remains the visual and interaction authority. The shadcn-style UI primitives use React Aria Components but are restyled entirely through project-owned semantic tokens.

## Browser verification

The cloud Browser plugin was not available in this implementation session. Playwright WebKit is therefore the rapid rendered-regression layer. Real Mobile Safari remains a release check for safe-area behavior, dynamic browser chrome, VoiceOver, native sharing, virtual-keyboard behavior, and physical motor usability.
