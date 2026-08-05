# Sprint 11 - Local Storage & History

## Goal

Persist user settings and maintain wallpaper history.

## Background

Sprint 10 added wallpaper templates. Users now have many customization options but lose their settings on page reload. Local storage will persist preferences and history.

## Requirements

### Settings Persistence

- [ ] Save last-used settings to localStorage
- [ ] Load saved settings on app mount
- [ ] Settings include: theme, resolution, spacing, border radius, etc.
- [ ] Reset settings option

### Wallpaper History

- [ ] Store last 20 generated wallpapers
- [ ] History includes: playlist name, thumbnail, settings used
- [ ] History viewer with thumbnails
- [ ] Re-generate wallpaper from history with same settings
- [ ] Clear history option
- [ ] Export history as JSON

### History UI

- [ ] History panel accessible from wizard
- [ ] History item shows playlist name, artwork thumbnail, date
- [ ] Click to restore settings
- [ ] Delete individual history items

## Acceptance Criteria

- [ ] Settings persist across page reloads
- [ ] History stores last 20 wallpapers
- [ ] User can view history with thumbnails
- [ ] User can re-generate from history
- [ ] User can clear history
- [ ] Storage doesn't exceed 5MB localStorage limit
- [ ] All existing tests pass
- [ ] New tests added for storage utilities

## Deliverables

- `src/lib/storage.ts` — localStorage utilities
- `src/components/HistoryPanel.tsx` — History viewer
- `src/components/HistoryItem.tsx` — History item card
- `src/hooks/useLocalStorage.ts` — Custom hook for persistence
- `src/hooks/useHistory.ts` — Custom hook for history management
- Update `page.tsx` for settings persistence
- Update `SettingsPanel.tsx` for history access

## Out of Scope

- Cloud sync / account-based storage
- History search/filter
- Share history with others
- Import from external sources

## Risks

| Risk | Mitigation |
|------|------------|
| localStorage quota exceeded | Compress images, limit history size |
| Data corruption | Add validation on load, fallback to defaults |
| Privacy concerns | Store only playlist names, not full URLs |

## Definition of Done

- [ ] Acceptance criteria completed
- [ ] Lint passes
- [ ] AI self-review completed
- [ ] Human review completed
- [ ] Documentation updated (README.md, sprint review)
