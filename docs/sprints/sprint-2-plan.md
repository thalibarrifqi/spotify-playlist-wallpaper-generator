# Sprint 2 - Wallpaper Generation

## Goal

Generate a downloadable wallpaper image from album artwork using HTML Canvas.

## Background

Sprint 1 completed the data pipeline: the app can fetch and display album artwork thumbnails. The core value of the application is generating wallpapers, which is the next PRD milestone.

## Requirements

- [ ] Canvas compositing of album artworks into a single image
- [ ] Grid layout (5 columns for mobile, matching the preview)
- [ ] Mobile resolution target: 1080x1920
- [ ] Download button that exports the canvas as PNG
- [ ] Black background behind artworks

## Acceptance Criteria

- [ ] Clicking "Download Wallpaper" produces a PNG file
- [ ] The downloaded image is 1080x1920 pixels
- [ ] Album artworks are arranged in a 5-column grid
- [ ] All available artworks (up to 50) appear in the wallpaper
- [ ] Black padding fills any empty space in the grid

## Out of Scope

- [ ] Random layout
- [ ] Desktop resolution (1920x1080)
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

- [ ] `src/lib/wallpaper/grid-layout.ts` — Grid layout calculation
- [ ] `src/lib/wallpaper/render.ts` — Canvas rendering logic
- [ ] `src/components/WallpaperPreview.tsx` — Canvas preview component
- [ ] Download button in `src/app/page.tsx`

## Definition of Done

- [ ] Acceptance criteria completed
- [ ] Lint passes
- [ ] AI self-review completed
- [ ] Human review completed
- [ ] Documentation updated (README.md, sprint review)
