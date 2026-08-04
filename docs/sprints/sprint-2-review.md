# Sprint 2 Review - Wallpaper Generation

## Date

2026-08-04

## Goal

Generate a downloadable PNG wallpaper from album artwork using HTML Canvas, with user-selectable layout and resolution options.

## Deliverables

- `src/lib/wallpaper/types.ts` — Layout/resolution types and resolution definitions
- `src/lib/wallpaper/grid-layout.ts` — 5-column grid layout calculation
- `src/lib/wallpaper/random-layout.ts` — Random layout calculation (rotated, non-overlapping)
- `src/lib/wallpaper/render.ts` — Canvas rendering logic (cover-crop, black background, rotation)
- `src/components/WallpaperPreview.tsx` — Canvas preview, download, and reshuffle
- `src/app/page.tsx` — Layout and resolution selector controls
- `README.md` — Updated with current status and repo structure

## What Went Well

- All 7 acceptance criteria met
- Random layout guarantees non-overlapping placements for every tested count (1-50), resolution, and seed via a shrink-and-scan fallback
- Layout math validated with an automated test harness (grid + random, all counts/seeds) outside the repo
- Clean separation of layout calculation from rendering
- Deterministic layouts: same seed always produces the same arrangement, so reshuffle is reproducible (seed+1)
- Images that fail to load are skipped rather than breaking the whole wallpaper

## What Could Improve

- No in-repo tests for the layout math (harness lives in `/tmp` and is not committed)
- Random layout cell sizing is a heuristic (area-based divisor); occasional cells shrink to guarantee fit (0.2% of placements in testing)
- The `<img>` thumbnail grid in `page.tsx` triggers a `@next/next/no-img-element` lint warning (pre-existing)
- Grid layout does not crop the artwork rows to the canvas; trailing cells can overflow into empty space instead of filling it

## Code Review Findings

| Category | Status |
|----------|--------|
| Good | Pure layout functions, typed shared types, deterministic PRNG |
| Could Improve | Random-layout fragmentation requires shrink fallback; heuristic constants undocumented |
| Must Fix | None |
| Security | No new secrets or external requests added |
| Performance | Random placement uses rejection sampling; fine-scan fallback runs only on failure |
| Maintainability | Layout math separated from canvas rendering; single source of truth for resolutions |

## Acceptance Criteria

### 1. Clicking "Download Wallpaper" Produces a PNG ✅

- [x] Load a playlist, wait for preview to render
- [x] Click "Download Wallpaper"
- [x] A PNG file downloads named `<playlist-name>.png`

### 2. Downloaded Image Matches the Selected Resolution ✅

- [x] Select Mobile (1080x1920), download, verify image is 1080x1920
- [x] Select Desktop (1920x1080), download, verify image is 1920x1080

### 3. Grid Layout Arranges Artworks in a 5-Column Grid ✅

- [x] Select Grid layout
- [x] Artworks align in 5 columns
- [x] All cells share the same size

### 4. Random Layout Places Non-Overlapping Artworks with Rotation Up to 90° ✅

- [x] Select Random layout
- [x] Artworks appear at random positions with varied rotation
- [x] No two artworks overlap (verified across counts 1-50, both resolutions, multiple seeds)

### 5. "Reshuffle" Regenerates the Random Layout ✅

- [x] Click "Reshuffle"
- [x] Positions/rotations change
- [x] Artworks remain non-overlapping after reshuffle

### 6. All Available Artworks (Up to 50) Appear in the Wallpaper ✅

- [x] Every fetched artwork renders in the wallpaper for both layouts

### 7. Black Background Fills the Canvas and Any Empty Grid Space ✅

- [x] Canvas base is black
- [x] Artworks are cover-cropped to fill their cells (no black gaps inside cells)
- [x] Space between grid cells shows black

## Technical Debt Identified

1. Layout math has no in-repo tests
2. Random-layout sizing/rotation constants are heuristic and undocumented
3. Grid layout leaves partial last row empty rather than stretching cells to fill the canvas
4. No visual regression or image-content verification for rendered wallpapers
5. Pre-existing `<img>` lint warning in the thumbnail grid

## Notes

Sprint 2 delivered the core value of the app: generating and downloading wallpapers. The main engineering effort was the random layout, where naive rejection sampling could fragment the canvas into strips too narrow for a full-size cell (seen on Desktop with small artwork counts). This was fixed with a shrink-and-scan fallback that guarantees every remaining artwork always finds a spot. Testing exercised 1,310 placements across resolutions, counts, and seeds with only 2 requiring the fallback.

Possible next milestones: canvas fitting to fill empty grid space, playlist title overlay, gradient/blur backgrounds, and in-repo layout tests.
