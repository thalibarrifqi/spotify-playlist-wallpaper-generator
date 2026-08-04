# Sprint 2 Review - Wallpaper Generation

## Date

2026-08-04

## Goal

Generate a downloadable PNG wallpaper from album artwork using HTML Canvas, with user-selectable layout and resolution options.

## Deliverables

- `src/lib/wallpaper/types.ts` — Layout/resolution types and resolution definitions
- `src/lib/wallpaper/grid-layout.ts` — 5-column grid layout calculation
- `src/lib/wallpaper/random-layout.ts` — Random layout calculation (shuffled-slot collage, non-overlapping)
- `src/lib/wallpaper/render.ts` — Canvas rendering logic (cover-crop, black background, rotation)
- `src/components/WallpaperPreview.tsx` — Canvas preview, download, and reshuffle
- `src/app/page.tsx` — Layout and resolution selector controls
- `README.md` — Updated with current status and repo structure

## What Went Well

- All 7 acceptance criteria met
- Grid layout tiles the full canvas (100% coverage) with rectangular cover-cropped cells
- Random layout is a full-canvas collage (92-96% coverage): cells tile the canvas, a subset rotate to the largest square that fits their slot, so non-overlap is guaranteed by construction for every count (1-50), resolution, and seed
- Layout math validated with an automated test harness (grid + random, all counts/seeds) outside the repo
- Clean separation of layout calculation from rendering
- Deterministic layouts: same seed always produces the same arrangement, so reshuffle is reproducible (seed+1)
- Images that fail to load are skipped rather than breaking the whole wallpaper

## What Could Improve

- No in-repo tests for the layout math (harness lives in `/tmp` and is not committed)
- Rotation is limited to 25° on a fraction of artworks: full 90° rotation is mathematically incompatible with a fully-covered canvas (rotated artworks always leave gaps), and the user chose full coverage
- The `<img>` thumbnail grid in `page.tsx` triggers a `@next/next/no-img-element` lint warning (pre-existing)
- Grid cells can have extreme aspect ratios for small playlists (e.g., 5 artworks on Desktop become 5 full-height vertical panels)

## Code Review Findings

| Category | Status |
|----------|--------|
| Good | Pure layout functions, typed shared types, deterministic PRNG, non-overlap guaranteed by construction |
| Could Improve | Rotation/count heuristics undocumented; deterministic rotated-cell selection is arbitrary |
| Must Fix | None |
| Security | No new secrets or external requests added |
| Performance | Layouts computed once per render; no rejection-sampling loops |
| Maintainability | Layout math separated from canvas rendering; single source of truth for resolutions |

## Acceptance Criteria

### 1. Clicking "Download Wallpaper" Produces a PNG ✅

- [x] Load a playlist, wait for preview to render
- [x] Click "Download Wallpaper"
- [x] A PNG file downloads named `<playlist-name>.png`

### 2. Downloaded Image Matches the Selected Resolution ✅

- [x] Select Mobile (1080x1920), download, verify image is 1080x1920
- [x] Select Desktop (1920x1080), download, verify image is 1920x1080

### 3. Grid Layout Arranges Artworks in a 5-Column Grid Filling the Canvas ✅

- [x] Select Grid layout
- [x] Artworks align in 5 columns
- [x] Cells cover the full canvas (100% coverage) via rectangular cover-cropped cells

### 4. Random Layout Fills the Canvas as a Non-Overlapping Collage ✅

- [x] Select Random layout
- [x] Artworks appear shuffled with small rotations (up to 25°) on a subset of cells
- [x] The canvas is fully covered (92-96% coverage)
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
2. Random-layout rotation/count constants are heuristic and undocumented
3. No visual regression or image-content verification for rendered wallpapers
4. Pre-existing `<img>` lint warning in the thumbnail grid
5. Grid cells can have extreme aspect ratios for small playlists

## Notes

Sprint 2 delivered the core value of the app: generating and downloading wallpapers. The initial random layout used rejection sampling with free rotation up to 90°, but testing revealed two problems: desktop small-count cases could fragment the canvas into strips too narrow for any cell (fixed with a shrink-and-scan fallback), and — after user feedback — the layouts left too much black background (33% average coverage).

In the revision, both layouts were reworked to fill the canvas:
- **Grid** now tiles the full canvas with rectangular cover-cropped cells (100% coverage), fixing the Desktop layout that previously left large side margins.
- **Random** became a shuffled-slot collage: cells tile the canvas, and a fixed subset rotate to the largest square that fits their slot, so non-overlap is guaranteed by construction. Coverage rose from 28-33% to 92-96%.

Testing exercised every count (1-50), both resolutions, and 5 seeds with zero real overlaps. Possible next milestones: in-repo layout tests, playlist title overlay, gradient/blur backgrounds, and varied-size random mosaics.
