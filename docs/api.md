# API Documentation

The app exposes a single backend route that acts as a BFF (Backend-for-Frontend) for the Spotify Web API. It hides the OAuth token cache and rate-limit retry logic from the browser.

## `GET /api/playlist`

Fetches a Spotify playlist by URL.

### Query parameters

| Param | Type   | Required | Description |
|-------|--------|----------|-------------|
| `url` | string | yes      | A full Spotify playlist URL, e.g. `https://open.spotify.com/playlist/<id>` |

### Success — `200 OK`

```json
{
  "name": "Chill Hits",
  "description": "Kick back to the best new and recent chill hits.",
  "images": [
    {
      "url": "https://i.scdn.co/image/ab67706f00000003...",
      "width": 640,
      "height": 640,
      "albumName": "Album Title"
    }
  ]
}
```

- `images` is deduplicated — one entry per album (the playlist tracks' `album` name).
- `width`/`height` are the Spotify-reported dimensions; `albumName` is set by the BFF.

### Errors

| Status | Body | When |
|--------|------|------|
| `400` | `{ "error": "Missing 'url' query parameter" }` | No `url` param |
| `400` | `{ "error": "..." }` | Invalid/malformed playlist URL |
| `404` | `{ "error": "... not found ..." }` | Playlist does not exist or is private |
| `429` | `{ "error": "...", "code": "RATE_LIMIT_EXCEEDED", "isFreeAccount": bool }` | Spotify rate limit hit (free-account hint for messaging) |
| `502` | `{ "error": "..." }` | Upstream Spotify error |
| `500` | `{ "error": "Internal server error" }` | Unexpected failure |

### Example

```
GET /api/playlist?url=https%3A%2F%2Fopen.spotify.com%2Fplaylist%2F37i9dQZEVXbMDoHDwVN2tF
```

## Environment variables

The route needs Spotify App credentials (Client Credentials flow):

```bash
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
```

See `.env.example`. Tokens are cached and auto-refreshed; the browser never sees the secret.

## Internal library API

### `parsePlaylistUrl(url)` — `src/lib/spotify/parse-playlist-url.ts`

Parses `https://open.spotify.com/playlist/<id>` and returns the playlist id. Throws `PlaylistUrlError` for invalid URLs.

### `getPlaylist(id)` — `src/lib/spotify/playlists.ts`

Fetches a playlist by id with built-in rate-limit retry. Throws `RateLimitError` (with `isFreeAccount`) or `PlaylistError`.

### `drawWallpaper(images, canvas, config)` — `src/lib/wallpaper/render.ts`

Main-thread renderer used by the live preview (and as a fallback for export). See `src/lib/wallpaper/types.ts` for `WallpaperConfig`.

### `exportWallpaperInWorker(config, urls)` — `src/lib/wallpaper/worker.ts`

Renders and encodes a high-DPI PNG in a Web Worker (`OffscreenCanvas`). Rejects on failure so callers can fall back to the main thread. Guarded by `supportsOffscreenWorker()`.
