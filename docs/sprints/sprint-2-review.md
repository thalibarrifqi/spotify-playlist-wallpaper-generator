# Sprint 2 Review - Wallpaper Generation

## Date

2026-08-04

## Goal

Generate a downloadable PNG wallpaper from album artwork using HTML Canvas, with user-selectable resolution options.

## Deliverables

- `src/lib/wallpaper/types.ts` — Resolution types and resolution definitions
- `src/lib/wallpaper/grid-layout.ts` — Square-cell grid layout (auto column count, cover-fill)
- `src/lib/wallpaper/render.ts` — Canvas rendering logic (cover-crop, random padding, black background)
- `src/components/WallpaperPreview.tsx` — Canvas preview, reshuffle, and download
- `src/app/page.tsx` — Resolution selector, reshuffle control
- `src/lib/spotify/playlists.ts` — Album artwork deduplication
- `README.md` — Updated with current status and repo structure

## What Went Well

- All acceptance criteria met
- Grid layout uses square cells, so artwork is never stretched: cover-crop scales each image to fill a square cell
- The grid always covers the entire canvas edge-to-edge: column count is auto-selected and the grid is scaled up so even a 1- or 2-song playlist fills the full wallpaper (outer edges are cropped, no black margins)
- Random image padding fills the grid to eliminate black spots (images repeated randomly to match cell count)
- Reshuffle button randomizes artwork order and re-chooses padding images
- Album artworks are deduplicated by album ID, so songs from the same album appear once
- Layout math validated with an automated test harness (44,500 assertions: all counts 1-50, both resolutions, square cells, full-canvas coverage, zero overlaps within canvas)
- Clean separation of layout calculation from rendering
- Images that fail to load are skipped rather than breaking the whole wallpaper

## What Could Improve

- No in-repo tests for the layout math (harness lives in `/tmp` and is not committed)
- The `<img>` thumbnail grid in `page.tsx` triggers a `@next/next/no-img-element` lint warning (pre-existing)
- A partial last row is centered rather than stretched to fill the full width

## Code Review Findings

| Category | Status |
|----------|--------|
| Good | Pure layout function, typed shared types, no distortion (square cells), full-canvas coverage, random padding, deterministic output |
| Could Improve | Optimal column search is O(count) with unverified tie-breaking; layout math untested in-repo |
| Must Fix | None |
| Security | No new secrets or external requests added |
| Performance | Layout computed once per render; no loops beyond cell placement |
| Maintainability | Layout math separated from canvas rendering; single source of truth for resolutions |

## Acceptance Criteria

### 1. Clicking "Download Wallpaper" Produces a PNG ✅

- [x] Load a playlist, wait for preview to render
- [x] Click "Download Wallpaper"
- [x] A PNG file downloads named `<playlist-name>.png`

### 2. Downloaded Image Matches the Selected Resolution ✅

- [x] Select Mobile (1080x1920), download, verify image is 1080x1920
- [x] Select Desktop (1920x1080), download, verify image is 1920x1080

### 3. Grid Layout Uses Square Cells With No Distortion ✅

- [x] Every cell is square; artwork is cover-cropped (never stretched)
- [x] Verified across all counts and both resolutions (44,500 assertions)

### 4. Grid Covers the Entire Canvas Edge-to-Edge ✅

- [x] Even a 1- or 2-song playlist fills the whole wallpaper (grid is scaled up, outer cells cropped)
- [x] Random padding fills grid to eliminate black spots
- [x] Verified for all counts 1-50 at both resolutions: cell union covers the full canvas

### 5. Songs From the Same Album Appear Once ✅

- [x] Artworks are deduplicated by album ID in the playlist API

### 6. All Available Artworks (Up to 50) Appear in the Wallpaper ✅

- [x] Every deduplicated artwork renders in the wallpaper

### 7. Black Background Fills the Canvas and Any Empty Grid Space ✅

- [x] Canvas base is black
- [x] Artworks are cover-cropped to fill their cells (no black gaps inside cells)
- [x] Random padding eliminates empty grid cells

## Technical Debt Identified

1. Layout math has no in-repo tests
2. No visual regression or image-content verification for rendered wallpapers
3. Pre-existing `<img>` lint warning in the thumbnail grid

## Notes

Sprint 2 delivered the core value of the app: generating and downloading wallpapers. Layout design went through several iterations in response to user feedback:

1. **Fixed 5-column grid + random layout** — too much black background.
2. **Full-canvas rectangular cells** — fixed black-background but stretched artwork.
3. **Square cells with auto column count + cover-fill** — no stretching, full coverage, but edge cropping.
4. **Final iteration** — added random image padding to fill grid cells and eliminate black spots; added reshuffle button to randomize artwork order and padding images.

The layout math is validated by a test harness covering all counts (1-50) and both resolutions, asserting every cell is square and the grid covers the full canvas with zero overlaps within canvas bounds. Possible next milestones: in-repo layout tests, playlist title overlay, gradient/blur backgrounds.
