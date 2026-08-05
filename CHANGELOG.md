# Changelog

All notable changes are documented per sprint. Format follows [Keep a Changelog](https://keepachangelog.com/).

## [0.1.0] — 2026-08-05

The full app ships as one release; development was tracked in weekly sprints.

### Sprint 15 — Polish & Deployment
- Cross-browser + mobile + responsive QA (Chromium, Firefox; viewports 390–1920px) and edge-case coverage (invalid URL, empty playlist, API errors, network failure, 300-track playlists)
- SEO meta tags and Open Graph on the landing page
- Final performance benchmark recorded (`docs/performance.md`)
- New docs: user guide, API docs, contributing guide, changelog
- Touch-target sizing for mobile (color swatches, remove-color, drawer close button)
- **Fixed:** lint warnings from Sprint 14 remain at 0 errors / 0 warnings

### Sprint 14 — Performance & Accessibility
- Profile-gated Web Worker export: 2×/3× PNG rendering moved to `OffscreenCanvas` — **0 main-thread long tasks** during 3× export (was ~1.1 s of blocking)
- DOM-free renderer core shared by main thread and worker; main-thread + Google-font fallbacks retained
- Debounced preview redraws (80 ms); IntersectionObserver lazy thumbnails
- WCAG 2.1 AA: skip link, per-step focus management, ARIA tabs + arrow-key navigation, focus-trapped history dialog (Escape closes), screen-reader live regions, `prefers-reduced-motion`, AA contrast
- Fixed undefined `animate-slide-in` utility; HistoryItem `<img>` lint warning
- 10 new accessibility-hook tests (jsdom), 411 total

### Sprint 11 — Local Storage & History
- Settings auto-save to localStorage (debounced, schema-validated) + restore + reset
- Wallpaper history (up to 20 entries, thumbnails) with restore, delete, export JSON, clear

### Sprint 10 — Wallpaper Templates
- 6 layout templates: Grid, Collage, Mosaic, Diagonal, Border, Film Strip
- Visual template picker + per-template settings; template tests

### Sprint 9 — Image Effects
- Brightness/contrast/saturation, grayscale/sepia/invert, artistic blur, vignette, noise, 5 presets; DPI-scaled export

### Sprint 8 — Text Customization
- 8 fonts (self-hosted Google Fonts + system), weight, 6 positions, color/outline/shadow, background strip, size presets

### Sprint 7 — Landing Page + Polish
- Full-screen landing, wizard backgrounds, fade-in animations, responsive/mobile layout, sticky header, tap targets

### Sprint 6 — Advanced Backgrounds + Print Export
- Gradient (linear/radial, 3 colors) and blur backgrounds; 6 theme presets; 1×/2×/3× DPI export

### Sprint 5 — Wizard UI + Themes
- Multi-step wizard (URL → Artwork → Settings → Download); dark/light presets

### Sprint 4 — Configuration & Tech Debt
- Custom resolution, cell spacing, border radius, background color; error boundary; status-code constants

### Sprint 3 — Title Overlay & Tests
- Optional playlist title overlay; first in-repo layout tests

### Sprint 2 — Wallpaper Generation
- Canvas grid renderer (square cells, full-canvas coverage), PNG download, reshuffle, dedup, padding

### Sprint 1 — Spotify API Integration
- Spotify URL parsing, OAuth token cache + refresh, playlist fetch with rate-limit retry, BFF route handler, artwork grid preview

### Not shipped (dropped)
- **Sprint 12 (Social Sharing) and Sprint 13 (Gallery/Community)** — dropped for redistributing copyrighted album artwork.

## Roadmap notes
- See `docs/project-status.md` for the current task list and `docs/sprints/` for per-sprint plans/reviews.
