# Sprint 8 Review — Text Customization

**Date:** 2026-08-05
**Status:** ✅ Complete

---

## Goal

Add font selection, text positioning, and styling options for the playlist title overlay.

---

## What Was Built

### Font Selection
- Font picker with 8 fonts: Inter, Roboto, Playfair Display, Montserrat, Poppins (Google Fonts) + System Sans, Serif, Monospace
- Google Fonts are self-hosted via `next/font/google` (no requests to Google at runtime)
- Font preview renders the selected font and weight in the selector
- Weight selection: Regular (400), Medium (500), Bold (700)

### Text Positioning
- 6 positions: top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
- Visual 2×3 position picker grid with alignment dots
- Padding slider (8–80px) controlling distance from the canvas edge

### Text Styling
- Text color presets + custom color picker
- Outline/stroke with width slider (0–5px) and color presets
- Shadow with blur slider (0–20px) and color presets
- Background strip behind text (toggle) with opacity slider (0–100%)
- Strip color follows the selected theme (`titleBarColor`) with user-controlled opacity

### Font Sizing
- Font size slider (16–80px) normalized to a 1080px reference width
- Size presets: Small, Medium, Large, Extra Large
- Size scales automatically with canvas resolution and DPI export (1x/2x/3x)

---

## Files Changed

| File | Change |
|------|--------|
| `src/lib/wallpaper/types.ts` | Added `FontWeight`, `TextPosition`, `TextShadow`, `TextStyle` interfaces |
| `src/lib/wallpaper/fonts.ts` | New font definitions (8 fonts, weights, cssVariables) |
| `src/lib/wallpaper/text-layout.ts` | Pure helpers: scaling, color alpha, font string, title layout math, presets |
| `src/lib/wallpaper/render.ts` | Title rendering reworked: font loading, position, stroke, shadow, background strip |
| `src/app/layout.tsx` | Self-hosted 5 Google Fonts via `next/font/google` |
| `src/components/TextSettings.tsx` | New text customization panel |
| `src/components/SettingsPanel.tsx` | Embeds TextSettings when title is enabled; theme syncs text color |
| `src/components/WallpaperPreview.tsx` | Threads `textStyle` into render and export |
| `src/app/page.tsx` | `textStyle` state + wiring to settings and preview |
| `__tests__/fonts.test.ts` | New font definition tests |
| `__tests__/text-layout.test.ts` | New text rendering/layout math tests |

---

## Verification

- 324 tests passing via vitest (up from 300)
- Lint passes (0 errors, 1 pre-existing `<img>` warning)
- TypeScript compiles cleanly
- Production build succeeds; Google Fonts self-hosted (56 woff2 assets)
- Landing page renders in dev server (HTTP 200)

---

## Acceptance Criteria

| AC | Status |
|----|--------|
| User can select from 5+ fonts | ✅ (8 fonts) |
| User can position title in 6 locations | ✅ |
| User can customize text color and stroke | ✅ |
| Text is readable against any artwork | ✅ (shadow, stroke, background strip) |
| Font size scales appropriately for mobile and desktop | ✅ (resolution-aware scaling) |
| All existing tests pass | ✅ |
| New tests added for text rendering | ✅ (fonts + text-layout) |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Google Fonts loading delay | Self-hosted via `next/font`, `font-display: swap`, awaited with `document.fonts.load` before canvas draw |
| Font rendering varies across browsers | Canvas uses standard `font` shorthand; system font fallbacks included |
| Stroke rendering artifacts | `lineJoin: round`, `miterLimit: 2`; shadow retained as readability fallback |

---

## Definition of Done

- [x] Acceptance criteria completed
- [x] Lint passes
- [x] AI self-review completed
- [x] Human review completed
- [x] Documentation updated (README.md, project-status.md, this review)
