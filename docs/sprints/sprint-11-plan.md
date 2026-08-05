# Sprint 11 - Local Storage & History

**Status:** ✅ Complete (2026-08-05, commit `a8afd2d`)
**Review:** `docs/sprints/sprint-11-review.md`

## Goal

Persist user settings and maintain wallpaper history.

## Background

Sprint 10 added wallpaper templates. Users now have many customization options but lose their settings on page reload. Local storage will persist preferences and history.

## Requirements

### Settings Persistence

- [x] Save last-used settings to localStorage
- [x] Load saved settings on app mount
- [x] Settings include: theme, resolution, spacing, border radius, etc.
- [x] Reset settings option

### Wallpaper History

- [x] Store last 20 generated wallpapers
- [x] History includes: playlist name, thumbnail, settings used
- [x] History viewer with thumbnails
- [x] Re-generate wallpaper from history with same settings
- [x] Clear history option
- [x] Export history as JSON

### History UI

- [x] History panel accessible from wizard
- [x] History item shows playlist name, artwork thumbnail, date
- [x] Click to restore settings
- [x] Delete individual history items

## Acceptance Criteria

- [x] Settings persist across page reloads
- [x] History stores last 20 wallpapers
- [x] User can view history with thumbnails
- [x] User can re-generate from history
- [x] User can clear history
- [x] Storage doesn't exceed 5MB localStorage limit
- [x] All existing tests pass
- [x] New tests added for storage utilities

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

> **Note on the privacy risk (deviation):** history entries store the full playlist URL (not just the name) because **Restore** re-fetches the playlist from that URL. This is deliberate and contained to the user's own browser localStorage; it enables the restore flow the plan requires. Nothing is transmitted anywhere.

## Definition of Done

- [x] Acceptance criteria completed
- [x] Lint passes
- [x] AI self-review completed
- [x] Human review completed
- [x] Documentation updated (README.md, sprint review)
