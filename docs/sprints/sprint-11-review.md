# Sprint 11 Review — Local Storage & History

**Date:** 2026-08-05
**Status:** ✅ Complete

---

## Goal

Persist wallpaper settings locally in the browser and keep a history of generated wallpapers so users can restore them later.

---

## What Was Built

### Settings Persistence
- All wallpaper settings (theme, resolution, spacing, radius, gradient, blur, scale, effects, template, template settings, text style) auto-save to `localStorage` under `spotify-wallpaper-settings`, debounced by 300ms
- On app mount, saved settings are validated and applied; users land with their last configuration
- New **Reset all settings** button returns everything to defaults and clears the stored key

### Schema Validation
- `mergeSettings` sanitizes saved data before applying it: unknown keys dropped, wrong types fall back to defaults, `fontWeight` clamped to the 400/500/700 whitelist, `template` validated against the registry via `isTemplateId`, gradient colors filtered to strings, template settings keep numeric values only
- Corrupt JSON or a throwing `localStorage` never breaks the app (try/catch + fallbacks throughout)

### History
- Every generated wallpaper is saved to browser history under `spotify-wallpaper-history`, capped at 20 entries, newest first
- Each entry stores: playlist name, playlist URL, a 320px JPEG thumbnail, the full settings bundle, and a timestamp
- **History** button in the wizard top bar opens a right-side drawer (also mobile-friendly) with:
  - Thumbnail, playlist name, and formatted date per entry
  - **Restore** — re-fetches the playlist by its stored URL, applies the saved settings, and lands on the Customize step
  - **Delete** — removes a single entry
  - **Export JSON** — downloads the full history
  - **Clear history** — wipes all entries

---

## Architecture

- `src/lib/storage.ts` — storage keys, `WallpaperSettings` + `DEFAULT_SETTINGS`, `createStorage` (SSR-safe wrapper with read/write/remove), `mergeSettings` (schema validation), `loadSettings`/`saveSettings`/`clearSettings`
- `src/lib/history.ts` — `HistoryEntry`, `HISTORY_LIMIT`, `addHistoryEntry`/`removeHistoryEntry`/`clearHistory`, `exportHistoryJson`/`downloadHistoryJson`
- `src/hooks/useHistory.ts` — history state synced to localStorage (functional updates, so cap/order logic lives in pure helpers and is unit-testable)
- `src/hooks/useLocalStorage.ts` — generic localStorage-backed state hook (used by `useHistory`)
- `src/components/HistoryPanel.tsx` / `HistoryItem.tsx` — drawer UI and per-entry row
- `src/components/WallpaperPreview.tsx` — new `onRendered` callback + `makeThumbnail` (max 320px, JPEG 0.85) fires after every successful draw
- `src/app/page.tsx` — mount-time settings load, debounced save effect, `handleResetAll`, history add on generate, `handleRestoreHistory` (fetch → apply → step 3), History drawer wiring, `onRendered` on both previews
- `src/components/TemplateSelector.tsx` — removed its standalone template localStorage (template persistence now part of the settings bundle)

### Persistence notes
- Settings load is deferred (`setTimeout(0)`) so it runs after the first paint — this keeps SSR/hydration safe (no server/client mismatch) while satisfying the new React effect lint rules
- The save effect is keyed on a `useMemo`-derived settings bundle, so it only fires when a setting actually changes

---

## Files Changed

| File | Change |
|------|--------|
| `src/lib/storage.ts` | New: settings type, defaults, safe storage wrapper, schema-validated merge |
| `src/lib/history.ts` | New: history entry helpers, cap-20, JSON export/download |
| `src/hooks/useHistory.ts` | New: history state synced to localStorage |
| `src/hooks/useLocalStorage.ts` | New: generic localStorage state hook |
| `src/components/HistoryPanel.tsx` | New: history drawer |
| `src/components/HistoryItem.tsx` | New: history entry row (thumbnail, restore, delete) |
| `src/components/WallpaperPreview.tsx` | Added `onRendered` callback + `makeThumbnail` thumbnail capture |
| `src/components/SettingsPanel.tsx` | Added `onReset` prop + Reset all settings button |
| `src/components/TemplateSelector.tsx` | Removed standalone template localStorage |
| `src/app/page.tsx` | Settings load/save/reset, history add/restore, History drawer wiring |
| `__tests__/storage.test.ts` | New: mergeSettings validation, storage read/write/failure, roundtrip (14 tests) |
| `__tests__/history.test.ts` | New: add cap-20, remove, clear, export (7 tests) |
| `README.md` | Documented persistence + history, updated structure |
| `docs/project-status.md` | Sprint 11 marked complete |

---

## Verification

- 401 tests passing via vitest (up from 380)
- Lint passes (0 errors, 2 pre-existing `<img>` warnings)
- TypeScript compiles cleanly; production build succeeds
- Headless browser (Playwright) flow verified end-to-end:
  1. Change theme to Light + template to Collage → reload → navigate back → both settings restored
  2. Generate → history drawer shows an entry with thumbnail → Restore → re-fetches playlist, re-applies settings, lands on Customize with Collage selected
  3. Second generate → 2 entries → Export JSON downloads `wallpaper-history.json` with settings + URL for both entries
  4. Reset all settings → defaults restored (template grid, theme dark) in both UI and localStorage
  5. Mobile viewport (390px): History button visible, drawer opens, empty state shows
- No JS errors in any of the above flows

---

## Acceptance Criteria

| AC | Status |
|----|--------|
| Settings persist across reloads | ✅ (browser flow step 1) |
| Settings restore on next visit without manual re-entry | ✅ (mount-time load) |
| Reset returns all settings to defaults | ✅ (browser flow step 4) |
| Generated wallpapers appear in a history list | ✅ (browser flow step 2) |
| History entries store the playlist URL for restore | ✅ (entry.url stored + used by restore) |
| Restore re-fetches the playlist and applies saved settings | ✅ (browser flow step 2) |
| History is capped and removable (delete/clear) | ✅ (HISTORY_LIMIT 20, unit-tested) |
| History can be exported as JSON | ✅ (browser flow step 3) |
| All existing tests pass | ✅ |
| New tests added for storage + history | ✅ (21 tests, 401 total) |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Corrupt/unknown localStorage data | `mergeSettings` validates every field and drops bad values |
| `localStorage` unavailable (private mode, SSR) | `createStorage` try/catches and falls back to no-op |
| Hydration mismatch from reading localStorage on mount | Settings load deferred to `setTimeout(0)` after first paint |
| Large history payloads | Cap at 20 entries; thumbnails stored as 320px JPEG |
| Settings loss during reload | Debounced save effect keyed on a memoized settings bundle |
| Restore with an unavailable playlist | Error path lands back on the URL step with a message |

---

## Definition of Done

- [x] Acceptance criteria completed
- [x] Lint passes
- [x] AI self-review completed
- [x] Human review completed
- [x] Documentation updated (README.md, project-status.md, this review)
