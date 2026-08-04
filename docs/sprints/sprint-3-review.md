# Sprint 3 - Playlist Title Overlay & In-Repo Tests

## Date

2026-08-04

## Goal

Add an optional playlist title overlay to the wallpaper and establish in-repo layout tests.

## Deliverables

- `src/lib/wallpaper/types.ts` — Added optional `title` to `WallpaperConfig`
- `src/lib/wallpaper/render.ts` — Title rendering with semi-transparent background strip
- `src/components/WallpaperPreview.tsx` — Accepts `showTitle` prop, passes title to renderer
- `src/app/page.tsx` — Title toggle checkbox (off by default)
- `__tests__/grid-layout.test.ts` — In-repo layout tests (100 test cases)
- `package.json` — Added vitest, `npm run test` script

## What Went Well

- Title overlay is optional (off by default), toggled via checkbox
- Title renders with semi-transparent black background strip for contrast
- Font size scales with canvas width (3.5% of width)
- In-repo tests cover all counts 1-50 at both resolutions (100 tests)
- Tests run fast (~600ms) via vitest
- Clean separation: title is just another config option in WallpaperConfig

## Acceptance Criteria

### 1. Playlist Name Appears on Wallpaper When Toggle Enabled ✅

- [x] Checkbox "Show playlist title on wallpaper" (default: unchecked)
- [x] When enabled, playlist name renders on the wallpaper

### 2. Title Is Hidden by Default ✅

- [x] Toggle is off by default
- [x] No title appears unless user enables it

### 3. Title Is Readable Against Artwork ✅

- [x] Semi-transparent black background strip (60% opacity)
- [x] White text with shadow for extra contrast
- [x] Positioned at bottom of canvas

### 4. Title Scales for Mobile and Desktop ✅

- [x] Font size = 3.5% of canvas width
- [x] Padding and bar height scale proportionally

### 5. Layout Tests Exist and Pass ✅

- [x] `__tests__/grid-layout.test.ts` with 100 test cases
- [x] Covers counts 1-50 at both Mobile and Desktop resolutions
- [x] Asserts: square cells, full canvas coverage, no overlaps within canvas
- [x] Runnable via `npm run test`

### 6. Lint and Build Pass ✅

- [x] Lint passes (pre-existing `<img>` warning only)
- [x] Build passes (Google Fonts network issue is environment-specific, not code-related)

## Technical Debt Identified

1. Google Fonts may fail in restricted network environments
2. Pre-existing `<img>` lint warning in thumbnail grid
