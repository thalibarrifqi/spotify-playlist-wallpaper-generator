# Sprint 8 - Text Customization

## Goal

Add font selection, text positioning, and styling options for the playlist title overlay.

## Background

Sprint 7 completed the landing page and visual polish. The current title overlay is basic (white text, semi-transparent background). Users need more control over typography to create personalized wallpapers.

## Requirements

### Font Selection

- [ ] Font picker with system fonts and Google Fonts
- [ ] Available fonts: Inter, Roboto, Playfair Display, Montserrat, Poppins
- [ ] Font preview in selector
- [ ] Font weight selection (Regular, Medium, Bold)

### Text Positioning

- [ ] Position selector: top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
- [ ] Visual position picker (grid of 6 positions)
- [ ] Padding/margin control for text placement

### Text Styling

- [ ] Text color picker with presets
- [ ] Text stroke/outline for better readability
- [ ] Stroke width slider (0-5px)
- [ ] Text shadow (blur, color)
- [ ] Background strip behind text (toggle)
- [ ] Background opacity slider

### Font Sizing

- [ ] Font size slider (independent of canvas resolution)
- [ ] Size presets: Small, Medium, Large, Extra Large
- [ ] Preview font size in real-time

## Acceptance Criteria

- [ ] User can select from 5+ fonts
- [ ] User can position title in 6 locations
- [ ] User can customize text color and stroke
- [ ] Text is readable against any artwork
- [ ] Font size scales appropriately for mobile and desktop
- [ ] All existing tests pass
- [ ] New tests added for text rendering

## Deliverables

- `src/components/TextSettings.tsx` — Text customization panel
- `src/lib/wallpaper/fonts.ts` — Font definitions
- `src/lib/wallpaper/render.ts` — Update title rendering with new options
- `src/lib/wallpaper/types.ts` — Add TextStyle interface
- Update `SettingsPanel.tsx` to include text settings

## Out of Scope

- Custom font upload
- Text along a path/curve
- Animated text effects
- Multiple text elements

## Risks

| Risk | Mitigation |
|------|------------|
| Google Fonts loading delay | Use font-display: swap, preload critical fonts |
| Font rendering varies across browsers | Test on Chrome, Firefox, Safari |
| Stroke rendering artifacts | Use shadow for outline instead of stroke |

## Definition of Done

- [ ] Acceptance criteria completed
- [ ] Lint passes
- [ ] AI self-review completed
- [ ] Human review completed
- [ ] Documentation updated (README.md, sprint review)
