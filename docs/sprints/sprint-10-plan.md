# Sprint 10 - Wallpaper Templates

## Goal

Add predefined layout templates beyond the basic grid.

## Background

Sprint 9 added image effects. Users now have visual customization but limited layout options. Templates will provide creative presets for different wallpaper styles.

## Requirements

### Template Selector

- [ ] Template picker UI with visual thumbnails
- [ ] Preview template layout before applying
- [ ] Remember last used template

### Templates

- [ ] Grid (current default) — Square cells, equal size
- [ ] Collage — Varied cell sizes, overlapping allowed
- [ ] Mosaic — Asymmetric layout with different cell sizes
- [ ] Diagonal — Cells rotated at angles
- [ ] Border — Artwork forms border, center blank
- [ ] Film Strip — Horizontal/vertical strip of artworks

### Template Settings

- [ ] Each template has unique settings (e.g., rotation angle for Diagonal)
- [ ] Template-specific sliders appear when selected
- [ ] Reset template settings option

## Acceptance Criteria

- [ ] User can select from 6 templates
- [ ] Template preview shows layout before applying
- [ ] Grid template works as before (backward compatible)
- [ ] Each template renders correctly at both resolutions
- [ ] Templates work with all background modes (solid, gradient, blur)
- [ ] All existing tests pass
- [ ] New tests added for each template

## Deliverables

- `src/components/TemplateSelector.tsx` — Template picker
- `src/lib/wallpaper/templates/index.ts` — Template registry
- `src/lib/wallpaper/templates/grid.ts` — Grid template (refactor existing)
- `src/lib/wallpaper/templates/collage.ts` — Collage template
- `src/lib/wallpaper/templates/mosaic.ts` — Mosaic template
- `src/lib/wallpaper/templates/diagonal.ts` — Diagonal template
- `src/lib/wallpaper/templates/border.ts` — Border template
- `src/lib/wallpaper/templates/filmstrip.ts` — Film strip template
- Update `render.ts` for template dispatch

## Out of Scope

- Custom template builder
- Template sharing
- Animation templates
- 3D perspective templates

## Risks

| Risk | Mitigation |
|------|------------|
| Template complexity | Start with simple implementations, iterate |
| Performance with complex layouts | Profile each template, optimize hot paths |
| Template compatibility with effects | Test each template with all effect combinations |

## Definition of Done

- [ ] Acceptance criteria completed
- [ ] Lint passes
- [ ] AI self-review completed
- [ ] Human review completed
- [ ] Documentation updated (README.md, sprint review)
