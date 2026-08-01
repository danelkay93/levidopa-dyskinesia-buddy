# Phase 1 verification foundation

This branch adds a review harness around the current single-file prototype. It does not alter `index.html`, approve the current visual appearance, change model semantics, or introduce the redesign.

## Baseline policy

The workflow captures the current interface for comparison, but the captures are not a permanent visual baseline.

- Routine CI generates screenshots, metrics, browser-error logs, Playwright reports, and axe-core reports.
- Pixel comparison is deliberately opt-in through `VISUAL_COMPARE=1`.
- No golden screenshot is committed until an explicit design or regression-baseline decision is made.
- Axe results are captured without waiving the findings. `AXE_ENFORCE=1` can turn serious and critical violations into a blocking check after the initial debt is triaged.

## Viewport matrix

| ID | CSS viewport | Purpose |
| --- | ---: | --- |
| phone-320x568 | 320 × 568 | Minimum supported phone portrait |
| phone-375x667 | 375 × 667 | Small iPhone-class portrait |
| phone-390x844 | 390 × 844 | Primary modern phone portrait |
| phone-430x932 | 430 × 932 | Large phone portrait |
| phone-landscape-844x390 | 844 × 390 | Representative phone landscape |
| tablet-768x1024 | 768 × 1024 | Small tablet portrait |
| tablet-1024x1366 | 1024 × 1366 | Large tablet portrait |

Additional environment states include enlarged text, reduced motion, and forced-colors as an approximation of increased contrast. WebKit does not expose every iOS accessibility preference, so reduced transparency and platform-specific contrast behavior still require real-device testing.

## State matrix

| State | Fixture or action | What is captured now |
| --- | --- | --- |
| Current default | Four-dose default | Full current graph and editor summary at every required viewport |
| Selected dose | Instrumented chart click | Highlighted individual contribution and inspector text |
| Selected time | Instrumented chart click at 12:00 | Time-specific inspector state |
| Selected overlap | Close-spacing fixture and day-high selection | Overlap-heavy crest and explanation |
| Selected fast transition | Quickest-climb marker | Transition marker and explanation |
| Selected long low period | One-dose fixture and OFF-period selection | Long practical-zero/OFF-shaped state |
| Schedule editing | Open editor and change first time | Re-rendered graph and editor |
| Share | Stubbed Web Share API | Stable post-action state without opening a native share sheet |
| Malformed shared URL | Invalid `s` query | Current silent fallback to defaults, recorded as a product gap |
| Midnight wrapping | 05:30 / 11:30 / 17:30 / 23:30 | Current boundary behavior and missing/awkward dose placement evidence |
| One-dose schedule | Test-only fixture injection | Minimum schedule behavior even though production import rejects it |
| Dense schedule | Ten-dose fixture | Collision, chart, and editor stress case |
| Enlarged text | 24 px base plus 125% root scaling | Reflow and horizontal-overflow metrics |
| Reduced motion | `prefers-reduced-motion: reduce` | Animation-disabled rendering |
| Increased contrast approximation | forced-colors active | High-contrast rendering approximation |

The fixture injector runs only inside Playwright's intercepted document response. The production file remains unchanged. This allows the verification layer to exercise future requirements that the current four-dose URL and local-storage parser cannot represent.

## Reports and downloadable artifacts

Each pull-request workflow uploads:

1. `verification-captures-<run-id>`
   - PNG screenshots
   - viewport and target-size metrics
   - axe-core JSON
   - console, page-error, and failed-request logs
   - JUnit and Playwright JSON
   - traces, videos, and failure screenshots when applicable
2. `playwright-report-<run-id>`
   - Playwright HTML report

Artifacts are retained for 30 days.

## WebKit versus real Mobile Safari

Playwright WebKit is the fast regression layer, not a substitute for final iPhone and iPad verification.

It is useful for WebKit layout, JavaScript, focus, media-query, and screenshot regressions. It does not reproduce the complete Mobile Safari environment, including:

- iOS browser chrome, safe-area changes, and dynamic viewport resizing;
- physical touch accuracy, tremor, palm rejection, and long-session motor fatigue;
- VoiceOver rotor behavior, speech output, and gesture navigation;
- Dynamic Type and every iOS text-size interaction;
- native share-sheet behavior and clipboard permission prompts;
- device GPU/font rasterization and some canvas differences;
- orientation transitions, virtual keyboard behavior, and scroll elasticity;
- reduced transparency and increased-contrast behavior exactly as implemented by iOS;
- BrowserStack or physical-device network, memory, and thermal constraints.

A final release should therefore run on real Mobile Safari through BrowserStack or a physical device after the design and implementation gates are complete.
