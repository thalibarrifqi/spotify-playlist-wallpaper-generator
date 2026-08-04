# Project Status

**Last updated:** 2026-08-04
**Commits:** 69593e9 → 6179924 (14 commits on main)

---

## Roadmap

Paste Playlist ✅
    ↓
Fetch Artwork ✅
    ↓
Display Preview ✅
    ↓
Generate Wallpaper ✅
    ↓
Download Image ✅

Legend: ✅ Complete | ⏳ Planned | 🔧 In Progress

---

## Sprint History

### Sprint 1 — Spotify API Integration ✅
- **Date:** 2026-07-21
- **Goal:** Fetch public Spotify playlist data and display album artwork
- **Status:** Complete — all 7 acceptance criteria verified
- **Review:** `docs/sprints/sprint-1-review.md`
- **Verification:** All AC tested via CLI (2026-08-04)

### Sprint 2 — Wallpaper Generation ✅
- **Date:** 2026-08-04
- **Goal:** Generate downloadable wallpaper using HTML Canvas
- **Status:** Complete — all 7 acceptance criteria verified
- **Review:** `docs/sprints/sprint-2-review.md`
- **Verification:** Layout math tested via harness (44,500 assertions: counts 1-50, both resolutions, square cells, full-canvas coverage, zero overlaps within canvas); lint and build pass

---

## Completed

- [x] Project scaffolding (Next.js 16, TypeScript, Tailwind CSS v4)
- [x] Spotify URL parsing with validation
- [x] OAuth token cache with auto-refresh
- [x] Playlist fetch with rate-limit retry
- [x] BFF route handler with error responses
- [x] Frontend with loading state and artwork grid
- [x] Environment variable setup (`.env.example`)
- [x] README with setup instructions
- [x] Documentation (PRD, implementation plan)
- [x] Wallpaper generation (square-cell grid covering the full canvas, no stretched artwork)
- [x] Resolution options (Mobile 1080x1920, Desktop 1920x1080)
- [x] PNG wallpaper download
- [x] Album artwork deduplication (one per album)
- [x] Random image padding to fill grid and eliminate black spots
- [x] Reshuffle button (randomizes artwork order and padding images)
- [x] Light UI theme (black gaps visible during preview)

---

## Current Task

None — Sprint 2 complete.

---

## Next Task

Sprint 3: Playlist title overlay, gradient/blur backgrounds, and in-repo layout tests.

---

## Technical Debt

1. String-based status code mapping in route handler
2. No concurrency protection on token refresh
3. Duplicate client/server URL validation
4. No error boundary component
5. No tests
6. Layout math has no in-repo tests (harness lives outside the repo)

---

## Blockers

- None
