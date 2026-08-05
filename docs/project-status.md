# Project Status

**Last updated:** 2026-08-06
**Commits:** 69593e9 → aa1ba1c (Sprint 15, pushed to origin/main)
**Deployed:** Vercel (auto-deploy on push)

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

### Sprint 3 — Title Overlay & In-Repo Tests ✅
- **Date:** 2026-08-04
- **Goal:** Optional playlist title overlay and in-repo layout tests
- **Status:** Complete — all acceptance criteria verified
- **Review:** `docs/sprints/sprint-3-review.md`
- **Verification:** 100 in-repo tests pass via vitest; lint passes

### Sprint 4 — Configuration & Tech Debt ✅
- **Date:** 2026-08-04
- **Goal:** Custom resolution, spacing, border radius, background color; tech debt cleanup
- **Status:** Complete — all acceptance criteria verified
- **Review:** `docs/sprints/sprint-4-review.md`
- **Verification:** 300 tests pass via vitest; lint passes; canvas aspect ratio matches resolution

### Sprint 5 — Wizard UI + Wallpaper Themes ✅
- **Date:** 2026-08-05
- **Goal:** Multi-step wizard UI and wallpaper theme presets
- **Status:** Complete — all acceptance criteria verified
- **Review:** `docs/sprints/sprint-5-review.md`
- **Verification:** 300 tests pass via vitest; lint passes

### Sprint 6 — Advanced Backgrounds + Print Export ✅
- **Date:** 2026-08-05
- **Goal:** Gradient/blur backgrounds, 6 theme presets, print quality export
- **Status:** Complete — all acceptance criteria verified
- **Review:** `docs/sprints/sprint-6-review.md`
- **Verification:** 300 tests pass via vitest; lint passes

### Sprint 7 — Landing Page + Visual Polish ✅
- **Date:** 2026-08-05
- **Goal:** Landing page, background images, animations, responsive layout
- **Status:** Complete — all acceptance criteria verified
- **Review:** `docs/sprints/sprint-7-review.md`
- **Verification:** 300 tests pass via vitest; lint passes

### Sprint 8 — Text Customization ✅
- **Date:** 2026-08-05
- **Goal:** Font selection, text positioning, and styling options for the title overlay
- **Status:** Complete — all acceptance criteria verified
- **Review:** `docs/sprints/sprint-8-review.md`
- **Verification:** 324 tests pass via vitest; lint passes; production build succeeds with self-hosted Google Fonts

### Sprint 9 — Image Effects ✅
- **Date:** 2026-08-05
- **Goal:** Post-processing filters to customize artwork appearance
- **Status:** Complete — all acceptance criteria verified
- **Review:** `docs/sprints/sprint-9-review.md`
- **Verification:** 350 tests pass via vitest; lint passes; production build succeeds

### Sprint 10 — Wallpaper Templates ✅
- **Date:** 2026-08-05
- **Goal:** Predefined layout templates beyond the basic grid
- **Status:** Complete — all acceptance criteria verified
- **Review:** `docs/sprints/sprint-10-review.md`
- **Verification:** 380 tests pass via vitest; lint passes; production build succeeds; all 6 templates render distinctly in headless browser

### Sprint 11 — Local Storage & History ✅
- **Date:** 2026-08-05
- **Goal:** Persist settings locally and keep a browser history of generated wallpapers
- **Status:** Complete — all acceptance criteria verified
- **Review:** `docs/sprints/sprint-11-review.md`
- **Verification:** 401 tests pass via vitest; lint passes; production build succeeds; headless-browser flow verified (persist→reload, generate→history→restore, export JSON, reset, mobile drawer)

### Sprint 12 — Social Sharing ❌ Dropped
- **Date:** 2026-08-05
- **Reason:** Sharing wallpapers publicly redistributes copyrighted Spotify album artwork (copyright/API ToU exposure). Plan deleted; no code was built.

### Sprint 13 — Gallery / Community ❌ Dropped
- **Date:** 2026-08-05
- **Reason:** Same copyrighted-artwork redistribution concern as Sprint 12 (public display). Plan deleted; no code was built.

### Sprint 14 — Performance & Accessibility ✅
- **Date:** 2026-08-05
- **Goal:** Optimize performance (profile → Web Worker export) and reach WCAG 2.1 AA
- **Status:** Complete — see review (Lighthouse >90 noted as pending, see review note)
- **Review:** `docs/sprints/sprint-14-review.md`
- **Docs:** `docs/performance.md`, `docs/accessibility.md`
- **Verification:** 411 tests pass via vitest (incl. 10 new hook tests); lint 0 errors / 0 warnings; production build succeeds; headless browser: keyboard-only wizard, reduced-motion emulation, lazy thumbnails, history drawer focus/Escape, 3x worker export; long tasks during 3x export 1168ms → 0ms

### Sprint 15 — Polish & Deployment ✅
- **Date:** 2026-08-05
- **Goal:** Final QA, SEO/OG meta, docs, polish, Lighthouse, release readiness
- **Status:** Complete — code + docs committed and pushed to origin/main; auto-deployed to Vercel
- **Review:** `docs/sprints/sprint-15-review.md`
- **Docs:** `docs/user-guide.md`, `docs/api.md`, `CONTRIBUTING.md`, `CHANGELOG.md`
- **Verification:** 411 tests pass via vitest; lint 0 errors / 0 warnings; production build succeeds; Playwright QA 13 checks pass (Chromium + Firefox full wizard, 4 viewports, 7 edge cases; WebKit skipped — missing system libs); Lighthouse a11y 100, best-practices 100, SEO 100 (performance 52 mobile prod — see review); Landing hero now `next/image` with preload + AA-compliant green `#11853a`

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
- [x] Resolution options (Mobile 1080x1920, Desktop 1920x1080, Custom)
- [x] PNG wallpaper download
- [x] Album artwork deduplication (one per album)
- [x] Random image padding to fill grid and eliminate black spots
- [x] Reshuffle button (randomizes artwork order and padding images)
- [x] Light UI theme (black gaps visible during preview)
- [x] Optional playlist title overlay (off by default, toggle in UI)
- [x] In-repo layout tests (300 tests, vitest)
- [x] Custom resolution input (width/height fields)
- [x] Cell spacing control (0–20px slider)
- [x] Border radius control (0–20px slider)
- [x] Background color picker
- [x] Error boundary component
- [x] Status code constants in route handler
- [x] Canvas preview aspect ratio matches resolution
- [x] 4-step wizard UI (URL → Artwork → Settings → Download)
- [x] Dark/Light theme presets
- [x] Gradient background support (linear/radial, up to 3 colors)
- [x] Blur background with artwork selector
- [x] 6 theme presets (Dark, Light, Neon, Pastel, Minimal, Midnight)
- [x] Print quality export (1x, 2x, 3x DPI)
- [x] Album name in blur selector
- [x] Artwork scale control (0.5x–2x)
- [x] Full-screen landing page with Unsplash background
- [x] Music-themed backgrounds for wizard steps
- [x] Fade-in animations
- [x] Custom Spotify green accent
- [x] Responsive layout (side-by-side on desktop)
- [x] Deployed to Vercel
- [x] Font picker (8 fonts, Google Fonts self-hosted + system fonts)
- [x] Font weight selection (Regular, Medium, Bold)
- [x] 6 title positions with visual picker
- [x] Text padding/margin control
- [x] Text color picker with presets
- [x] Text stroke/outline with width slider
- [x] Text shadow (blur + color)
- [x] Background strip behind text (toggle + opacity slider)
- [x] Font size slider with Small/Medium/Large/Extra Large presets
- [x] Brightness, contrast, and saturation sliders (-100% to +100%)
- [x] Grayscale, sepia, and invert toggles
- [x] Artistic blur effect (0–10px)
- [x] Vignette effect (toggle + intensity)
- [x] Noise/grain overlay (toggle + intensity)
- [x] 5 effect presets (Vibrant, Muted, Vintage, B&W, Neon)
- [x] Real-time effect preview and DPI-scaled effect export
- [x] Sticky header on wizard steps
- [x] Mobile settings pagination (Background/Layout/Effects/Text tabs)
- [x] Landing page mobile layout (tap-friendly Get Started, feature cards)
- [x] `touch-action: manipulation` on buttons/links
- [x] Mobile download fix (DOM link + deferred revoke)
- [x] Template registry (6 templates: Grid, Collage, Mosaic, Diagonal, Border, Film Strip)
- [x] Template picker with visual thumbnails
- [x] Template-specific settings (rotation, thickness, variation, overlap, orientation)
- [x] Rotation-aware cell rendering for the Diagonal template
- [x] Template tests (30 cases, 380 total)
- [x] Settings auto-save to localStorage (debounced 300ms) with schema validation
- [x] Settings restore on next visit (mount-time load)
- [x] Reset all settings button
- [x] Wallpaper history in browser localStorage (up to 20 entries, newest first)
- [x] History drawer with thumbnails, restore, export JSON, and clear
- [x] Restore flow: re-fetch playlist by URL → apply saved settings → land on Customize
- [x] Storage + history tests (21 cases, 401 total)
- [x] High-DPI (2x/3x) export in a Web Worker (OffscreenCanvas) — 0 main-thread long tasks during 3x export
- [x] Main-thread export fallback + Google-font title path (fonts live in the document)
- [x] Debounced preview redraws (80ms) during slider adjustments
- [x] Lazy-loaded artwork thumbnails (IntersectionObserver, `loading="lazy"`, `decoding="async"`)
- [x] DOM-free renderer core (`canvas-core.ts`) shared by main thread and worker
- [x] Skip-to-content link + focus management on wizard step changes
- [x] ARIA tabs with arrow-key navigation in the settings panel
- [x] History dialog: focus trap, Escape to close, focus restore
- [x] Screen reader live regions (step changes, export/download status)
- [x] `prefers-reduced-motion` support (CSS + JS)
- [x] Color contrast AA pass on helper text (zinc-400 → zinc-500)
- [x] Fixed undefined `animate-slide-in` utility; added slideIn keyframe
- [x] HistoryItem thumbnail lint warning fixed (`next/image` + placeholder)
- [x] Accessibility hook tests (10 cases, 411 total)
- [x] `docs/performance.md` + `docs/accessibility.md`
- [x] SEO/Open Graph metadata (title template, description, keywords, robots, OG, Twitter card)
- [x] AA-compliant action green (white text on `#11853a` 4.7:1; hover `#12883b`)
- [x] Landing hero via `next/image` (preload, responsive srcset, darker overlay) — LCP/contrast polish
- [x] Touch targets enlarged (color swatches, remove-color, history close)
- [x] `docs/user-guide.md`, `docs/api.md`, `CONTRIBUTING.md`, `CHANGELOG.md`
- [x] README Documentation + license/legal note sections
- [x] Final performance benchmark (0 long tasks, heap stable) in `docs/performance.md`
- [x] Lighthouse: accessibility 100, best-practices 100, SEO 100; performance 52 (mobile, prod build) — deferred, see review

---

## Current Task

Sprint 15 complete — code + docs committed and pushed to origin/main, auto-deployed to Vercel. Project shipped.

## Next Task

(Optional follow-ups, intentionally deferred — not blockers: Lighthouse performance >90, real-device cross-browser pass.)

---

## Technical Debt

1. Google Fonts may fail in restricted network environments
2. Lighthouse performance <90 (sandbox + remote hero image) — intentionally deferred; a11y/BP/SEO at 100
3. jsdom added as a devDependency for hook tests
4. Real-device browser pass (iOS/Android, WebKit/Safari/Edge) not run — intentionally deferred; Chromium + Firefox QA pass

---

## Blockers

- None
