# Sprint 3 - Playlist Title Overlay & In-Repo Tests

## Goal

Add a playlist title overlay to the wallpaper and establish in-repo layout tests.

## Background

Sprint 2 delivered wallpaper generation with random padding and reshuffle. The next user-facing feature is displaying the playlist name on the wallpaper. The layout math also needs proper in-repo tests (currently validated by an external harness in `/tmp`).

## Requirements

### Playlist Title Overlay

- Display the playlist name on the wallpaper (optional, not shown by default)
- UI toggle/checkbox to enable title overlay
- Title should be readable against any artwork (text shadow or background strip)
- Title position: bottom-left or bottom-center
- Title should not obscure too much artwork
- Font size should scale with canvas resolution

### In-Repo Layout Tests

- Move layout math validation into the repo as a test file
- Test all counts 1-50 at both resolutions
- Assert: cells are square, grid covers canvas, no overlaps within canvas
- Should be runnable via `npm test` or similar

## Acceptance Criteria

- [ ] Playlist name appears on the wallpaper when toggle is enabled
- [ ] Title is hidden by default (toggle off)
- [ ] Title is readable against artwork (has contrast: shadow, outline, or background)
- [ ] Title scales appropriately for Mobile and Desktop resolutions
- [ ] Layout tests exist in the repo and pass
- [ ] Tests cover counts 1-50 at both resolutions
- [ ] Lint and build pass

## Deliverables

- `src/lib/wallpaper/render.ts` — Add title rendering to `drawWallpaper`
- `src/lib/wallpaper/types.ts` — Add title config options if needed
- `src/components/WallpaperPreview.tsx` — Pass playlist name to renderer
- `__tests__/grid-layout.test.ts` — Layout math tests

## Out of Scope

- Gradient/blur backgrounds (no longer needed with random padding)
- Multiple title positions (pick one good default)
- Custom fonts or colors

## Risks

| Risk | Mitigation |
|------|------------|
| Title overlaps important artwork | Use semi-transparent background strip |
| Font rendering varies across browsers | Use system font stack |
| Tests slow down CI | Keep tests fast (pure math, no network) |
