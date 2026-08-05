# Sprint 14 Review — Performance & Accessibility

**Date:** 2026-08-05
**Status:** ✅ Complete

---

## Goal

Optimize performance and reach WCAG 2.1 AA compliance. Sprints 12/13 were previously dropped for redistributing copyrighted album artwork; this sprint stays within the remaining feature set.

---

## What Was Built

### Performance

**Phase 1 — Baseline profiling.** Instrumented the renderer and 3× export (Playwright + CDP trace, 1080×1920 → 3240×5760, mock 12-image playlist):
- Preview redraw on a single slider change: **246 ms**
- 3× export wall time: **1588 ms**, with **2 long tasks (sum 1168 ms, max 1082 ms)** — a clear main-thread blocker
- Heap stable across repeated exports (~12.8 MB)

**Phase 3 triggered** (threshold >100 ms) → the export moved into a Web Worker.

**Phase 3 — Worker export.**
- `src/lib/wallpaper/canvas-core.ts`: the renderer was extracted to be DOM-free — `drawWallpaperCore(canvas, images, config, env)` against a `CanvasLike` + `RenderEnvironment`.
- `src/lib/wallpaper/render.ts`: main-thread environment (`HTMLImageElement`, `document.createElement`, `document.fonts`) keeps the existing `drawWallpaper` API for the live preview.
- `src/workers/canvas.worker.ts` + `src/lib/wallpaper/worker.ts`: `OffscreenCanvas` + `createImageBitmap` (fetch → blob → bitmap) render, `convertToBlob`, singleton client worker with a pending-request map. Falls back to the main thread if unsupported (no `OffscreenCanvas`) or on worker error. Self-hosted Google-font titles stay on the main thread (fonts live in the document, not the worker).
- **Result: 0 long tasks during 3× export** (was ~1.1 s of blocking); wall time 1588 → 1525 ms; exported PNG pixel-verified as correct.

**Phase 2 — cheap wins.** 80 ms debounced preview draws (slider drags coalesce to one redraw); `LazyImage` component (IntersectionObserver + `loading="lazy"` + `decoding="async"`) for the step-2 artwork grid.

### Accessibility

- `SkipLink` (skip to `#main-content`) + focus moves to `<main>` on every wizard step change
- Settings pagination upgraded to an ARIA tabs pattern (`role="tablist"`/`tab`, `aria-selected`, roving `tabIndex`, Arrow/Home/End navigation)
- History drawer: `role="dialog"` + `aria-modal`, focus moves in on open, Tab focus trap, **Escape** to close, focus restored to the trigger
- `LiveRegion` announcements for wizard step changes and export/download state; `aria-busy` on the preview while rendering; `aria-haspopup`/`aria-pressed` on the relevant controls
- `prefers-reduced-motion`: global CSS guard collapses animations + the drawer slide-in is skipped via `useReducedMotion()` (JS)
- Contrast: small helper text on light surfaces raised `zinc-400` → `zinc-500` (~2.5:1 → ~4.7:1) for AA
- Fixed a latent bug: `animate-slide-in` was referenced but never defined — added the `slideIn` keyframe/utility
- Fixed the pre-existing HistoryItem `<img>` lint warning (now `next/image` with a placeholder for empty thumbnails)

---

## Architecture

- `src/lib/wallpaper/canvas-core.ts` — DOM-free renderer core (`CanvasLike`, `RenderEnvironment`, `drawWallpaperCore`)
- `src/lib/wallpaper/render.ts` — main-thread env + re-exported `drawWallpaper`
- `src/lib/wallpaper/worker.ts` / `src/workers/canvas.worker.ts` — export worker client + `OffscreenCanvas` implementation
- `src/components/WallpaperPreview.tsx` — 80 ms preview debounce; worker-first 2x/3x download with main-thread + Google-font fallbacks; export-status live region; `aria-pressed` quality buttons
- `src/components/LazyImage.tsx` — IntersectionObserver image loading
- `src/components/SkipLink.tsx` / `LiveRegion.tsx` — navigation + announcements
- `src/hooks/useReducedMotion.ts` / `useKeyboardNav.ts` — new testable hooks
- `src/components/HistoryPanel.tsx` — dialog semantics, focus trap, Escape, reduced-motion-aware slide-in
- `src/components/HistoryItem.tsx` — `next/image` thumbnail + empty placeholder
- `src/components/SettingsPanel.tsx` — ARIA tabs + arrow-key navigation
- `src/app/page.tsx` — skip link, `main-content` focus target, step announcements, `LazyImage` grid
- `src/app/globals.css` — `slideIn` animation + `prefers-reduced-motion` guard
- `__tests__/hooks.test.tsx` — 10 jsdom tests for `useReducedMotion` + `useKeyboardNav`
- Dev dependency: `jsdom` (for hook tests)

---

## Files Changed

| File | Change |
|------|--------|
| `src/lib/wallpaper/canvas-core.ts` | New: DOM-free renderer core |
| `src/lib/wallpaper/render.ts` | Rewritten as main-thread env wrapper |
| `src/lib/wallpaper/worker.ts` | New: worker client (lazy singleton, pending map, fallback surface) |
| `src/workers/canvas.worker.ts` | New: OffscreenCanvas export worker |
| `src/components/WallpaperPreview.tsx` | Debounce, worker download, live region, ARIA |
| `src/components/LazyImage.tsx` | New: lazy artwork images |
| `src/components/SkipLink.tsx` | New: skip navigation |
| `src/components/LiveRegion.tsx` | New: screen reader announcements |
| `src/hooks/useReducedMotion.ts` | New: motion-preference hook |
| `src/hooks/useKeyboardNav.ts` | New: keyboard handler hook |
| `src/components/HistoryPanel.tsx` | Dialog semantics, focus trap, Escape, reduced-motion |
| `src/components/HistoryItem.tsx` | `next/image` + placeholder, contrast |
| `src/components/SettingsPanel.tsx` | ARIA tabs + arrow keys, contrast |
| `src/app/page.tsx` | Skip link, focus management, live region, LazyImage |
| `src/app/globals.css` | `slideIn` keyframe + reduced-motion guard |
| `__tests__/hooks.test.tsx` | New: hook tests (10 cases) |
| `package.json` | Added `jsdom` devDependency |
| `docs/performance.md` | New: baseline + Phase 3 decision |
| `docs/accessibility.md` | New: accessibility documentation |
| `README.md` | Documented performance + accessibility |
| `docs/project-status.md` | Sprint 14 marked complete |

---

## Verification

- **411 tests** pass via vitest (up from 401, incl. 10 new hook tests)
- Lint passes — **0 errors, 0 warnings** (HistoryItem `<img>` warning eliminated)
- TypeScript + production build pass
- Headless browser (Playwright) verification:
  1. Keyboard-only walkthrough: skip link → URL fetch → step 2 → tablist ArrowRight → Generate → step 4
  2. History drawer: focus moves in, **Escape closes**, focus restored to trigger
  3. `reducedMotion: "reduce"` emulation: media query matches; drawer animation disabled
  4. Lazy thumbnails render with `decoding="async"`, no JS errors
  5. 3× export still downloads a valid PNG (`a11y-test-3x.png`) with no JS errors
  6. Worker PNG pixel-verified (3240×5760, colors match preview)
  7. Long tasks during 3× export: **0** (was 2 / sum 1168 ms)

---

## Acceptance Criteria

| AC | Status |
|----|--------|
| Phase 1 baseline recorded; Phase 3 decision documented with data | ✅ `docs/performance.md` |
| Slider adjustments don't cause perceptible jank | ✅ 80 ms debounce |
| Large playlists load smoothly (lazy thumbnails) | ✅ IntersectionObserver `LazyImage` |
| All elements have ARIA labels | ✅ audit + `aria-label`/`aria-pressed`/`aria-haspopup` |
| Keyboard navigation works throughout the wizard | ✅ browser flow step 1 |
| Focus is visible on all interactive elements | ✅ global `:focus-visible` + existing rings |
| Reduced motion is respected | ✅ CSS + JS (`useReducedMotion`) |
| Lighthouse score > 90 | ⏳ not run (no local Lighthouse; see note) |
| All existing tests pass | ✅ 411 passing |
| New tests added for accessibility hooks | ✅ 10 tests |
| No new lint errors; HistoryItem `<img>` warning fixed | ✅ 0 errors, 0 warnings |

> **Lighthouse note:** a Lighthouse >90 run needs a production build + reachable API, neither of which is fully available in this sandbox (real Spotify API unreachable; mocked via route interception). The targeted a11y/perf items Lighthouse checks (skip link, heading structure, focus visibility, contrast, reduced motion, no console errors, image hints) were each verified directly in the browser. The acceptance item is recorded as pending rather than claimed.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Web Worker complexity | Profile-gated; export-only scope; main-thread + Google-font fallbacks retained |
| Performance regression | Phase 1 baseline recorded; post-worker re-measurement shows long-task sum 1168 → 0 ms |
| A11y regressions from focus changes | Incremental; headless keyboard-only walkthrough + reduced-motion emulation |
| jsdom dev dependency | Scoped to test environment only; no runtime impact |
| Hook tests needing DOM | `@vitest-environment jsdom` per-file; no global config change |

---

## Definition of Done

- [x] Acceptance criteria completed (Lighthouse noted above)
- [x] Lint passes (0 errors, 0 warnings)
- [x] AI self-review completed
- [x] Human review completed
- [x] Documentation updated (README.md, project-status.md, performance.md, accessibility.md, this review)
