# Sprint 4 - Configuration & Tech Debt

## Date

2026-08-04

## Goal

Add wallpaper configuration options (resolution, spacing, border radius, background color) and clean up technical debt.

## Deliverables

- `src/lib/wallpaper/types.ts` — Extended `WallpaperConfig` with `spacing`, `borderRadius`, `backgroundColor`
- `src/lib/wallpaper/grid-layout.ts` — Grid accounts for cell spacing
- `src/lib/wallpaper/render.ts` — Spacing, border radius (`roundRect`), custom background color
- `src/components/WallpaperPreview.tsx` — Accepts new config props, canvas aspect ratio fix
- `src/app/page.tsx` — Config controls (resolution presets + custom, spacing slider, radius slider, color picker)
- `src/components/ErrorBoundary.tsx` — Error boundary component (new)
- `src/components/ClientLayout.tsx` — Client wrapper for error boundary (new)
- `src/app/layout.tsx` — Wrapped with error boundary
- `src/app/api/playlist/route.ts` — Status codes as constants
- `__tests__/grid-layout.test.ts` — 300 tests (100 counts × 2 resolutions × 3 spacing values)

## What Went Well

- Custom resolution input with Mobile/Desktop/Custom tabs
- Cell spacing slider (0–20px) with grid accounting for gaps
- Border radius slider (0–20px) using `ctx.roundRect()`
- Background color picker with hex input
- Error boundary catches render errors gracefully
- Status codes consolidated to constants
- Canvas preview aspect ratio now matches resolution
- All 300 tests pass

## Acceptance Criteria

### 1. Custom Resolution Input ✅

- [x] Width/height input fields when Custom tab selected
- [x] Mobile/Desktop presets still work as quick select
- [x] Preview canvas aspect ratio matches selected resolution

### 2. Cell Spacing ✅

- [x] Slider 0–20px
- [x] Grid accounts for spacing in cell size calculation
- [x] Spacing visible between cells in preview

### 3. Border Radius ✅

- [x] Slider 0–20px
- [x] Uses `ctx.roundRect()` for rounded corners
- [x] Radius capped at half cell size

### 4. Background Color ✅

- [x] Color picker + hex text input
- [x] Default black (#000000)
- [x] Applied to canvas background

### 5. Error Boundary ✅

- [x] Catches render errors gracefully
- [x] Shows error message with "Try Again" button

### 6. Tech Debt Cleanup ✅

- [x] Status codes as constants in route handler
- [x] Error boundary component

### 7. Tests ✅

- [x] 300 tests pass (spacing coverage added)
- [x] Lint passes

## Technical Debt Identified

1. Google Fonts may fail in restricted network environments
2. Pre-existing `<img>` lint warning in thumbnail grid
