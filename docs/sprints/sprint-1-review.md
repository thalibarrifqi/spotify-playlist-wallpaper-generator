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

### 1. Valid Public Playlist URL → Artwork Thumbnails ✅

- [x] Paste a known public playlist URL (e.g., `https://open.spotify.com/playlist/7ER372B5dxUQ28JcyoZkWV`)
- [x] Click "Generate Wallpaper"
- [x] Playlist name displays above the artwork grid
- [x] Album artwork thumbnails render in a 5-column grid
- [x] Up to 50 artworks are displayed (verify count on a large playlist)

### 2. Access Token Never Exposed in Browser ✅

- [x] Open browser DevTools → Network tab
- [x] Submit a valid playlist URL
- [x] Confirm only one outgoing request: `GET /api/playlist?url=...`
- [x] Confirm NO request to `accounts.spotify.com` or `api.spotify.com` appears
- [x] Confirm no `access_token` value is visible in the Response tab

### 3. Token Reused Across Requests ✅

- [x] Submit a valid playlist URL, note the response
- [x] Immediately submit a different valid playlist URL
- [x] Both requests succeed without token errors
- [x] In server logs, no second `POST /api/token` between the two requests

### 4. Invalid URL → Clear Error Message ✅

Test each input and verify a clear error appears:

- [x] Empty string → "Missing 'url' query parameter"
- [x] Plain text `not-a-url` → "Invalid URL format"
- [x] Non-playlist path `https://open.spotify.com/album/abc123` → "URL must contain a playlist path"
- [x] Wrong hostname `https://example.com/playlist/abc123` → "URL must be from open.spotify.com"
- [x] Missing ID `https://open.spotify.com/playlist/` → "URL must contain a playlist path"

### 5. Non-existent or Private Playlist → Clear Error Message ✅

- [x] Submit a valid-format URL with bogus ID (e.g., `/playlist/000000000000000000000`) → "Playlist not found"
- [x] Error message: "Playlist not found"
- [x] Submit a URL to a private or collaborative playlist → "Unable to access this playlist. It may be private or restricted."
- [x] Error message: "Unable to access this playlist. It may be private or restricted."

### 6. Loading State Visible During API Call ✅

- [x] Click "Generate Wallpaper" with a valid URL
- [x] Button text changes to "Loading..." immediately
- [x] Button is visually disabled (dimmed, no pointer cursor)
- [x] Button returns to "Generate Wallpaper" after response (success or error)

### 7. Error Recovery ✅

- [x] Trigger an error (e.g., invalid URL or bad playlist ID)
- [x] Verify error message displays
- [x] Correct the input and submit again
- [x] Previous error clears, new request completes normally

## Technical Debt Identified

1. String-based status code mapping (`error.message.includes(...)`)
2. No concurrency protection on simultaneous token refresh
3. Duplicate client/server URL validation
4. No error boundary component
5. No tests

## Notes

Sprint 1 established the data pipeline. The app can now fetch and display playlist artwork. The next logical step is wallpaper generation using HTML Canvas.
