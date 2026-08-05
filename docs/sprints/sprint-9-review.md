# Sprint 9 Review — Image Effects

**Date:** 2026-08-05
**Status:** ✅ Complete

---

## Goal

Add post-processing filters to customize artwork appearance.

---

## What Was Built

### Basic Filters
- Brightness slider (-100% to +100%)
- Contrast slider (-100% to +100%)
- Saturation slider (-100% to +100%)
- All adjustments preview in real-time on the canvas while dragging

### Effect Toggles
- Grayscale, Sepia, and Invert toggles applied via the Canvas filter pipeline

### Advanced Effects
- Artistic blur (0–10px) applied to the whole composited wallpaper with edge overscan so blurred edges don't darken
- Vignette overlay (toggle + intensity slider) drawn as a radial gradient
- Noise/grain overlay (toggle + intensity slider) generated from a seeded random tile pattern

### Presets
- None, Vibrant (saturation + contrast), Muted (reduced saturation), Vintage (sepia + vignette + reduced contrast), B&W (grayscale + high contrast), Neon (brightness + saturation)
- Active preset is highlighted; manual slider adjustments override it

---

## Architecture

### Filter Pipeline
Rendering now uses a two-pass approach in `render.ts`:
1. Background + artwork grid render to an offscreen canvas (`renderBase`)
2. Offscreen canvas composited onto the main canvas with a single `ctx.filter` string built by `buildFilterString`

This keeps the filter pipeline consistent (no per-cell seams), applies filters once for performance, and keeps overlays (vignette, noise) and the title readable and crisp — the title is drawn after the filter pass.

### DPI Export
`scaleEffects` scales the pixel-based blur by the DPI multiplier; percentage-based values (brightness, contrast, saturation, vignette, noise) carry over unchanged to 1x/2x/3x exports.

---

## Files Changed

| File | Change |
|------|--------|
| `src/lib/wallpaper/types.ts` | Added `WallpaperEffects` interface and `effects` config field |
| `src/lib/wallpaper/effects.ts` | New: filter string builder, overlays (vignette/noise), scale/default/equality helpers |
| `src/lib/wallpaper/presets.ts` | New: 6 effect presets (None + 5) |
| `src/lib/wallpaper/render.ts` | Refactored to offscreen base + filter compositing; title drawn after effects |
| `src/components/EffectsPanel.tsx` | New effects controls panel |
| `src/components/SettingsPanel.tsx` | Embeds EffectsPanel |
| `src/components/WallpaperPreview.tsx` | Threads effects into render/export; renderKey includes effects; DPI blur scaling |
| `src/app/page.tsx` | `effects` state + wiring to settings and preview |
| `__tests__/effects.test.ts` | New filter/overlay helper tests |
| `__tests__/presets.test.ts` | New preset validation tests |
| `README.md` | Documented effects feature + updated structure |

---

## Verification

- 350 tests passing via vitest (up from 324)
- Lint passes (0 errors, 1 pre-existing `<img>` warning)
- TypeScript compiles cleanly
- Production build succeeds

---

## Acceptance Criteria

| AC | Status |
|----|--------|
| User can adjust brightness, contrast, saturation | ✅ |
| User can toggle grayscale, sepia, invert | ✅ |
| User can apply blur and vignette effects | ✅ (plus noise) |
| User can select from 5+ presets | ✅ (6 including None) |
| Effects apply in real-time during preview | ✅ (sliders re-render immediately) |
| Effects are applied correctly to final wallpaper | ✅ (same pipeline for preview + export) |
| All existing tests pass | ✅ |
| New tests added for effects | ✅ (effects + presets) |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Canvas filter performance | Single filter pass over composited canvas (not per-cell); overlays use tiled patterns |
| Blur edge darkening | Overscan margin scales base beyond canvas edges when blur > 0 |
| Filter stacking order | `buildFilterString` defines a consistent pipeline order (adjust → colorize → blur) |
| Old browsers without `ctx.filter` | Filter becomes a no-op; wallpaper still renders unfiltered |

---

## Definition of Done

- [x] Acceptance criteria completed
- [x] Lint passes
- [x] AI self-review completed
- [x] Human review completed
- [x] Documentation updated (README.md, project-status.md, this review)
