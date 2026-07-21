# Sprint 1 Review - Spotify API Integration

## Date

2026-07-21

## Goal

Fetch public Spotify playlist data using a server-side Client Credentials flow and display album artwork in a preview grid.

## Deliverables

- `src/lib/spotify/parse-playlist-url.ts` — URL parsing utility
- `src/lib/spotify/token.ts` — OAuth token cache with auto-refresh
- `src/lib/spotify/playlists.ts` — Playlist fetch helper with rate-limit retry
- `src/app/api/playlist/route.ts` — BFF route handler
- `src/app/page.tsx` — Frontend with loading state, error handling, artwork grid
- `.env.example` — Environment variable template
- `README.md` — Updated with current status and setup instructions

## What Went Well

- All 6 acceptance criteria met
- Clean separation of concerns (BFF pattern)
- Rate-limit retry with exponential backoff implemented
- Token never exposed to browser
- Clear error messages for all failure modes

## What Could Improve

- No sprint record was created before starting (process gap)
- No tests written
- README was outdated until a separate cleanup commit

## Code Review Findings

| Category | Status |
|----------|--------|
| Good | Clean module structure, typed interfaces, defensive coding |
| Could Improve | String-based status code mapping in route handler |
| Must Fix | None |
| Security | Token stays server-side, no secrets committed |
| Performance | Token caching works, retry backoff implemented |
| Maintainability | Custom error classes, clear function responsibilities |

## Acceptance Criteria

- [x] Valid public playlist URL returns up to 50 album artwork thumbnails
- [x] Access token never exposed in browser network tab
- [x] Token reused across requests until expiry
- [x] Invalid URL shows clear error message
- [x] Non-existent or private playlist shows clear error message
- [x] Loading state visible while API call is in progress

## Technical Debt Identified

1. String-based status code mapping (`error.message.includes(...)`)
2. No concurrency protection on simultaneous token refresh
3. Duplicate client/server URL validation
4. No error boundary component
5. No tests

## Notes

Sprint 1 established the data pipeline. The app can now fetch and display playlist artwork. The next logical step is wallpaper generation using HTML Canvas.
