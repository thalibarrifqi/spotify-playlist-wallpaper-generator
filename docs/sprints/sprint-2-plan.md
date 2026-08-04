# Sprint 2 - Wallpaper Generation

## Goal

Generate a downloadable wallpaper image from album artwork using HTML Canvas.

## Background

Sprint 1 completed the data pipeline: the app can fetch and display album artwork thumbnails. The core value of the application is generating wallpapers, which is the next PRD milestone.

## Requirements

- [x] Canvas compositing of album artworks into a single image
- [x] Grid layout with square, centered cells that auto-select column count to fill the canvas (no stretched artwork)
- [x] Resolution options: Mobile (1080x1920) and Desktop (1920x1080)
- [x] UI controls to select resolution before generating
- [x] Download button that exports the canvas as PNG
- [x] Black background behind artworks

## Acceptance Criteria

- [x] Clicking "Download Wallpaper" produces a PNG file
- [x] The downloaded image matches the selected resolution (1080x1920 or 1920x1080)
- [x] Grid layout arranges artworks in square cells with no distortion
- [x] The grid auto-selects column count so it spans a full canvas dimension (e.g., Desktop 50 artworks → 10 columns filling the width)
- [x] All available artworks (up to 50) appear in the wallpaper
- [x] Black background fills the canvas and any empty grid space

## Out of Scope

- [ ] Random layout (removed: incompatible with full-coverage square-cell requirement)
- [ ] Gradient/blur backgrounds
- [ ] Playlist title overlay
- [ ] Multiple themes
- [ ] Custom spacing or border radius

## Risks

| Risk | Mitigation |
|------|------------|
| CORS issues loading Spotify images to canvas | Use server-side proxy or `crossOrigin` attribute |
| Canvas memory limits with 50 images | Use reasonable image sizes (300x300) |
| Large download file size | Export as JPEG with quality option if PNG is too large |

## Questions for AI

- What is the best approach for loading external images into Canvas (CORS)?
- Should the canvas rendering happen client-side or server-side?
- How to handle images that fail to load?

## Deliverables

- [x] `src/lib/wallpaper/grid-layout.ts` — Grid layout calculation (square cells, optimal columns)
- [x] `src/lib/wallpaper/render.ts` — Canvas rendering logic
- [x] `src/components/WallpaperPreview.tsx` — Canvas preview component
- [x] Resolution selector control in `src/app/page.tsx`
- [x] Download button in `src/app/page.tsx`

## Definition of Done

- [x] Acceptance criteria completed
- [x] Lint passes
- [x] AI self-review completed
- [ ] Human review completed
- [x] Documentation updated (README.md, sprint review)
