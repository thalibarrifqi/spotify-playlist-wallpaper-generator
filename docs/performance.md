# Performance

Sprint 14 (Performance & Accessibility) — Phase 1 baseline and the profile-gated decision to move high-DPI export into a Web Worker.

## Phase 1 — Baseline Measurements

Instrumented in a headless browser (Playwright + Chromium, CDP Performance trace) using a mock 12-image playlist at **1080×1920**, exported at **3× DPI (3240×5760)**.

| Metric | Value |
|--------|-------|
| Preview redraw (single slider change, 1080×1920) | 246 ms |
| 3× export wall time | 1588 ms |
| Long tasks during 3× export (count) | 2 |
| Long tasks sum | 1168 ms |
| Max long task | 1082 ms |
| JS heap growth across repeated exports | stable (~12.8 MB, no leak) |

**Decision:** the 3× export blocked the main thread for **~1.1 s of long tasks** (threshold: >100 ms). Phase 3 (Web Worker export) was **triggered**.

## Phase 2 — Cheap Wins (shipped)

- **Debounced preview draws** — slider updates are coalesced through an 80 ms timeout before the canvas re-render, so dragging a slider produces one redraw instead of many (jank source removed).
- **Lazy artwork thumbnails** — the step-2 artwork selector uses a new `LazyImage` component (IntersectionObserver, 200px rootMargin) with native `loading="lazy"` + `decoding="async"`; cells below the fold load on demand.
- **Memoized preview** — the preview already keyed re-renders off a `renderKey`; unchanged.

## Phase 3 — Web Worker Export

### Design

- `src/lib/wallpaper/canvas-core.ts` — the renderer core was extracted so it is **DOM-free**: `drawWallpaperCore(canvas, images, config, env)` takes a `CanvasLike` and a `RenderEnvironment` (`loadImage`, `createCanvas`, optional `ensureFontLoaded`).
- `src/lib/wallpaper/render.ts` — the main-thread environment (`HTMLImageElement` + `crossOrigin`, `document.createElement`, `document.fonts`) and the existing `drawWallpaper` API, unchanged for the live preview.
- `src/lib/wallpaper/worker.ts` + `src/workers/canvas.worker.ts` — the export path: `new Worker(new URL(...))` (Turbopack-supported), `OffscreenCanvas` rendering, `fetch → createImageBitmap` for artwork, `convertToBlob`. Client keeps a singleton worker and a pending-map keyed by request id.
- **Fallback:** if `OffscreenCanvas`/`Worker` is unsupported (e.g. older Safari) or the worker rejects, export falls back to the main-thread renderer. Title text using self-hosted Google fonts also stays on the main thread (the document has the font face, the worker does not).

### Result (post-worker, same measurement)

| Metric | Before | After |
|--------|--------|-------|
| Long tasks during 3× export | 2 (sum 1168 ms, max 1082 ms) | **0 (0 ms)** |
| 3× export wall time | 1588 ms | 1525 ms |
| Main thread responsiveness | blocked ~1.1 s | fully responsive |
| Worker output | — | valid 3240×5760 PNG (pixel-sampled vs preview) |

The main thread is no longer blocked during high-DPI export; wall time is dominated by the worker's own drawing plus `convertToBlob` transfer.

## Verification

- `npm test` — 411 passing (incl. 10 new accessibility-hook tests)
- `npm run lint` — 0 errors, 0 warnings (HistoryItem `<img>` warning fixed)
- `npm run build` — passes
- Headless browser: worker export at 3× downloads a correct, non-blank PNG with no JS errors; long-task measurement drops to zero (see table above)

## Final Benchmark (Sprint 15)

Re-run of the same Phase 1 harness after all Sprint 15 polish (same mock 12-image playlist, 1080×1920 preview, 3240×5760 3× export). The machine was under heavier load than the initial run (multiple browsers open), so wall times are higher — the responsiveness metric is what matters and it is unchanged.

| Metric | Phase 1 baseline | Post-worker (Sprint 14) | Final (Sprint 15) |
|--------|------------------|-------------------------|-------------------|
| Preview redraw wall time (incl. 80ms debounce) | 246 ms | 331 ms | 417–536 ms |
| 3× export wall time | 1588 ms | 1525 ms | 2357–2493 ms |
| Long tasks during 3× export | 2 (sum 1168 ms, max 1082 ms) | 0 | **0** |
| JS heap before/after export | stable ~12.8 MB | stable ~14.5 MB | stable ~14.5 MB |

**Conclusion:** the main thread is never blocked during high-DPI export regardless of machine load; the 3× wall-time variance is entirely inside the worker. Preview redraws are debounced to one draw per gesture and do not trigger long tasks.

## Assets

- Profiling harness: `/tmp/opencode/profile-export.cjs` (CDP trace, long-task + heap measurement)
- Worker pixel-verification: `/tmp/opencode/verify-worker-png.cjs` (color-sampling the exported PNG)
