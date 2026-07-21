# Implementation Plan

## Sprint Goal

Fetch public Spotify playlist data using a server-side Client Credentials flow and display album artwork in a preview grid.

## Scope

### In Scope

- Spotify Client Credentials flow (server-side only).
- Public playlist access via Spotify Web API.
- Server-side token cache in memory (no database, no persistence).
- BFF pattern: Next.js Route Handlers act as the backend, the React page is the frontend.
- Extract playlist ID from a pasted Spotify URL.
- Fetch playlist metadata and up to 50 track album artworks.
- Display artwork thumbnails in a grid preview.

### Out of Scope

- Private or collaborative playlists.
- User login or OAuth Authorization Code flow.
- Storing the access token outside server memory.
- Wallpaper generation.
- Wallpaper download.
- Wallpaper layout options (grid/random).
- Wallpaper resolution selection.
- Gradient/blur backgrounds, playlist title, themes, custom spacing, custom border radius.

## Architecture

```
Browser (React)
    |
    | fetch()
    v
Next.js Route Handler (/api/playlist)
    |
    | Spotify Web API (Client Credentials)
    v
Spotify API
```

The access token lives only inside the Route Handler module scope. The browser never sees it.

## Implementation Steps

### Step 1 — Spotify App Credentials

Store `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in a `.env.local` file. Never commit this file.

### Step 2 — Token Cache Module

Create `src/lib/spotify/token.ts`.

- On first call, POST to `https://accounts.spotify.com/api/token` with `grant_type=client_credentials`.
- Store the token and its expiry timestamp in module-level variables.
- On subsequent calls, return the cached token if it has not expired.
- When the token expires, fetch a new one automatically.

### Step 3 — Spotify API Helper

Create `src/lib/spotify/playlists.ts`.

- Export a function that takes a playlist ID.
- Uses the cached token to call `GET https://api.spotify.com/v1/playlists/{id}`.
- Returns playlist name, description, and an array of up to 50 album cover image URLs (one per track).

### Step 4 — URL Parsing Utility

Create `src/lib/spotify/parse-playlist-url.ts`.

- Extract the playlist ID from URLs matching `https://open.spotify.com/playlist/{id}`.
- Handle optional query parameters (e.g., `?si=...`).
- Return the playlist ID or throw a clear error.

### Step 5 — API Route

Create `src/app/api/playlist/route.ts` (Next.js Route Handler).

- Accepts a GET request with a `url` query parameter.
- Calls the URL parser to extract the playlist ID.
- Calls the playlist helper to fetch artwork data.
- Returns a JSON response: `{ name, images[] }` where each image is `{ url, width, height }`.
- Returns appropriate error responses for invalid URLs, missing playlists, or Spotify API failures.

### Step 6 — Frontend Integration

Update `src/app/page.tsx`.

- On "Generate Wallpaper" click, call `/api/playlist?url=<encoded-url>`.
- Replace the "Coming Soon" placeholder with an artwork preview grid.
- Show a loading state while the API call is in progress.
- Display error messages from the API response.
- Show playlist name above the artwork grid.

## Data Flow

1. User pastes a Spotify playlist URL into the input field.
2. User clicks "Generate Wallpaper".
3. Frontend sends `GET /api/playlist?url=<encoded-url>`.
4. Route Handler parses the URL, extracts the playlist ID.
5. Route Handler calls `getAccessToken()`, which returns a cached token or fetches a new one.
6. Route Handler calls the Spotify Playlists API with the token.
7. Route Handler extracts album artwork URLs (max 50) from the response.
8. Route Handler returns JSON to the frontend.
9. Frontend renders the artwork grid.

## Acceptance Criteria

- [x] A valid public playlist URL returns up to 50 album artwork thumbnails.
- [x] The access token is never exposed in the browser network tab (only API calls to the BFF are visible).
- [x] The token is reused across requests within the same server process until expiry.
- [x] An invalid URL shows a clear error message.
- [x] A non-existent or private playlist shows a clear error message.
- [x] Loading state is visible while the API call is in progress.

## Environment Variables

```
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
```
