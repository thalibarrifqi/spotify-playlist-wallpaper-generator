# Sprint 14 - Performance & Accessibility

## Goal

Optimize performance and ensure WCAG 2.1 AA compliance.

## Background

Sprints 11 (local storage/history) shipped and the roadmap was revised: Sprints 12 (social sharing) and 13 (public gallery) were dropped because they would redistribute copyrighted album artwork. This sprint addresses performance and accessibility for the remaining feature set.

The canvas renderer (`src/lib/wallpaper/render.ts`) is intentionally DOM-coupled (`new Image()`, `document.fonts`, `ctx.filter`, `drawImage`). The Web Worker item below is therefore **profile-gated**: it only proceeds if measurements prove the main thread is blocked.

## Requirements

### Phase 1 — Profile (mandatory, defines Phase 3)

- [ ] Instrument render + export: measure `drawWallpaper` time and 3x-DPI `toDataURL` time
- [ ] Capture main-thread blocking and long tasks during a 3x export (Chrome DevTools Performance trace)
- [ ] Measure memory growth across repeated exports
- [ ] Record a baseline in `docs/performance.md` and decide Phase 3 against a threshold (e.g., >100ms main-thread block on 3x export)

### Phase 2 — Cheap wins (independent of Phase 3)

- [ ] Debounced/requestAnimationFrame-coalesced slider updates during preview
- [ ] IntersectionObserver lazy-loading for the artwork selector thumbnails
- [ ] Image `decoding="async"` + decode hints on artwork images
- [ ] Memoize/avoid re-rendering the preview when unrelated state changes (already partially done via `renderKey`)

### Phase 3 — Web Worker (ONLY if Phase 1 shows a blocker)

- [ ] Move export rendering to a Web Worker using `OffscreenCanvas` + `createImageBitmap`
- [ ] Keep a main-thread fallback path where OffscreenCanvas/`ctx.filter` are unsupported (e.g., Safari)
- [ ] Scope to export-only first; do not rewrite the live preview pipeline
- [ ] Re-run Phase 1 measurements and confirm the improvement

### Accessibility (WCAG 2.1 AA)

- [ ] ARIA labels for all interactive elements
- [ ] Keyboard navigation (Tab, Enter, Escape, Arrow keys)
- [ ] Focus management in wizard flow (move focus on step change, restore on return)
- [ ] Visible focus indicators on all interactive elements
- [ ] Skip navigation link
- [ ] Screen reader announcements for state changes (live regions for status/step changes)
- [ ] Color contrast ratios meet AA standards
- [ ] `prefers-reduced-motion` support (CSS + JS)

### Testing

- [ ] Lighthouse audit score > 90 (desktop + mobile)
- [ ] Keyboard-only navigation works through the full wizard
- [ ] Reduced-motion preference respected (no forced animation)
- [ ] New unit tests for `useKeyboardNav` and `useReducedMotion` hooks

## Acceptance Criteria

- [ ] Phase 1 baseline recorded; Phase 3 decision documented with data
- [ ] Slider adjustments don't cause perceptible jank
- [ ] Large playlists load smoothly (lazy thumbnails)
- [ ] All elements have ARIA labels
- [ ] Keyboard navigation works throughout the wizard
- [ ] Focus is visible on all interactive elements
- [ ] Reduced motion is respected
- [ ] Lighthouse score > 90
- [ ] All existing tests pass
- [ ] New tests added for accessibility hooks
- [ ] No new lint errors; fix the HistoryItem `<img>` lint warning

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
