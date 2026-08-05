# Sprint 9 - Image Effects

## Goal

Add post-processing filters to customize artwork appearance.

## Background

Sprint 8 added text customization. Users now need visual effects to further personalize their wallpapers and match their aesthetic preferences.

## Requirements

### Basic Filters

- [ ] Brightness slider (-100% to +100%)
- [ ] Contrast slider (-100% to +100%)
- [ ] Saturation slider (-100% to +100%)
- [ ] Real-time preview while adjusting sliders

### Effect Toggles

- [ ] Grayscale toggle
- [ ] Sepia tone toggle
- [ ] Invert toggle

### Advanced Effects

- [ ] Blur effect (artistic, 0-10px)
- [ ] Vignette effect (toggle + intensity)
- [ ] Noise/grain overlay (toggle + intensity)

### Presets

- [ ] Vibrant (boost saturation + contrast)
- [ ] Muted (reduce saturation)
- [ ] Vintage (sepia + vignette + reduced contrast)
- [ ] B&W (grayscale + high contrast)
- [ ] Neon (high saturation + brightness)

## Acceptance Criteria

- [ ] User can adjust brightness, contrast, saturation
- [ ] User can toggle grayscale, sepia, invert
- [ ] User can apply blur and vignette effects
- [ ] User can select from 5+ presets
- [ ] Effects apply in real-time during preview
- [ ] Effects are applied correctly to final wallpaper
- [ ] All existing tests pass
- [ ] New tests added for effects

## Deliverables

- `src/components/EffectsPanel.tsx` — Effects controls
- `src/lib/wallpaper/effects.ts` — Filter application logic
- `src/lib/wallpaper/presets.ts` — Effect presets
- Update `WallpaperPreview.tsx` for real-time preview
- Update `render.ts` for canvas filter API

## Out of Scope

- Color grading / LUT filters
- Selective color editing
- HDR effects
- AI-powered style transfer

## Risks

| Risk | Mitigation |
|------|------------|
| Canvas filter performance | Use requestAnimationFrame, debounce slider updates |
| Filter stacking order | Define consistent filter pipeline |
| Memory usage with many filters | Limit concurrent effects, test on low-end devices |

## Definition of Done

- [ ] Acceptance criteria completed
- [ ] Lint passes
- [ ] AI self-review completed
- [ ] Human review completed
- [ ] Documentation updated (README.md, sprint review)
