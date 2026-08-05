# Sprint 14 - Performance & Accessibility

## Goal

Optimize performance and ensure WCAG 2.1 AA compliance.

## Background

Sprints 11 (local storage/history) shipped and the roadmap was revised: Sprints 12 (social sharing) and 13 (public gallery) were dropped because they would redistribute copyrighted album artwork. This sprint addresses performance and accessibility for the remaining feature set.

The canvas renderer (`src/lib/wallpaper/render.ts`) is intentionally DOM-coupled (`new Image()`, `document.fonts`, `ctx.filter`, `drawImage`). The Web Worker item below is therefore **profile-gated**: it only proceeds if measurements prove the main thread is blocked.

## Requirements

### Phase 1 — Profile (mandatory, defines Phase 3)

- [x] Instrument render + export: measure `drawWallpaper` time and 3x-DPI `toDataURL` time
- [x] Capture main-thread blocking and long tasks during a 3x export (Chrome DevTools Performance trace)
- [x] Measure memory growth across repeated exports
- [x] Record a baseline in `docs/performance.md` and decide Phase 3 against a threshold (e.g., >100ms main-thread block on 3x export) — 1.1s of long tasks → Phase 3 triggered

### Phase 2 — Cheap wins (independent of Phase 3)

- [x] Debounced/requestAnimationFrame-coalesced slider updates during preview
- [x] IntersectionObserver lazy-loading for the artwork selector thumbnails
- [x] Image `decoding="async"` + decode hints on artwork images
- [x] Memoize/avoid re-rendering the preview when unrelated state changes (already partially done via `renderKey`)

### Phase 3 — Web Worker (ONLY if Phase 1 shows a blocker)

- [x] Move export rendering to a Web Worker using `OffscreenCanvas` + `createImageBitmap`
- [x] Keep a main-thread fallback path where OffscreenCanvas/`ctx.filter` are unsupported (e.g., Safari)
- [x] Scope to export-only first; do not rewrite the live preview pipeline
- [x] Re-run Phase 1 measurements and confirm the improvement — long tasks 1168ms → 0ms

### Accessibility (WCAG 2.1 AA)

- [x] ARIA labels for all interactive elements
- [x] Keyboard navigation (Tab, Enter, Escape, Arrow keys)
- [x] Focus management in wizard flow (move focus on step change, restore on return)
- [x] Visible focus indicators on all interactive elements
- [x] Skip navigation link
- [x] Screen reader announcements for state changes (live regions for status/step changes)
- [x] Color contrast ratios meet AA standards
- [x] `prefers-reduced-motion` support (CSS + JS)

### Testing

- [ ] Lighthouse audit score > 90 (desktop + mobile) — noted in review: not run in sandbox (see review note)
- [x] Keyboard-only navigation works through the full wizard
- [x] Reduced-motion preference respected (no forced animation)
- [x] New unit tests for `useKeyboardNav` and `useReducedMotion` hooks

## Acceptance Criteria

- [x] Phase 1 baseline recorded; Phase 3 decision documented with data
- [x] Slider adjustments don't cause perceptible jank
- [x] Large playlists load smoothly (lazy thumbnails)
- [x] All elements have ARIA labels
- [x] Keyboard navigation works throughout the wizard
- [x] Focus is visible on all interactive elements
- [x] Reduced motion is respected
- [ ] Lighthouse score > 90 (not run in sandbox; see review)
- [x] All existing tests pass
- [x] New tests added for accessibility hooks
- [x] No new lint errors; fix the HistoryItem `<img>` lint warning

## Deliverables

- `docs/performance.md` — Baseline measurements + Phase 3 decision
- `src/hooks/useKeyboardNav.ts` — Keyboard navigation hook
- `src/hooks/useReducedMotion.ts` — Motion preference hook
- `src/components/SkipLink.tsx` — Skip navigation
- `src/components/LiveRegion.tsx` — Screen reader announcements
- `src/workers/canvas.worker.ts` — Canvas Web Worker (only if Phase 3 triggered)
- Update components for ARIA compliance
- CSS `prefers-reduced-motion` support
- `docs/accessibility.md` — Accessibility documentation

## Out of Scope

- Social sharing / sharing links (dropped — copyrighted artwork redistribution)
- Public gallery / community features (dropped — same reason)
- Screen reader testing automation
- Full WCAG AAA compliance
- Voice control support

## Risks

| Risk | Mitigation |
|------|------------|
| Web Worker complexity | Profile-gated; start with export-only OffscreenCanvas, keep DOM fallback |
| Performance regression | Baseline in Phase 1, re-measure after any Phase 3 work |
| Accessibility breaking changes | Test incrementally, automated checks + keyboard-only walkthrough |
| Feature creep into removed features | Out-of-scope list is explicit |

## Definition of Done

- [ ] Acceptance criteria completed
- [ ] Lint passes
- [ ] AI self-review completed
- [ ] Human review completed
- [ ] Documentation updated (README.md, sprint review)
