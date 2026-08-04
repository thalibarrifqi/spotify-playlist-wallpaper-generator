# Spotify Playlist Wallpaper Generator

Generate beautiful wallpapers from Spotify playlist album artworks.

---

## Goals

- Generate wallpapers from Spotify playlist album artworks.
- Support both mobile and desktop wallpaper sizes.
- Keep the application simple and fast.

---

## Current Status

Wallpaper generation is complete. The app can:

- Accept a Spotify playlist URL
- Fetch playlist data via the Spotify Web API (Client Credentials flow)
- Display album artwork thumbnails in a grid preview (deduplicated per album)
- Generate and download a PNG wallpaper with:
  - A square-cell grid that auto-selects column count and scales to cover the whole canvas (no stretched artwork, no black margins)
  - Random image padding to fill the grid and eliminate black spots
  - Mobile (1080x1920) or Desktop (1920x1080) resolution
  - Black background behind artworks
- Reshuffle button to randomize artwork order and padding images

---

## Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS v4
- Spotify Web API
- HTML Canvas

---

## Repository Structure

```
src/
  app/
    api/playlist/    BFF route handler for Spotify API
    page.tsx         Main page component
  components/
    WallpaperPreview.tsx  Canvas preview and download
  lib/
    spotify/
      parse-playlist-url.ts   URL parsing utility
      playlists.ts            Playlist fetch helper with rate-limit retry
      token.ts                OAuth token cache
    wallpaper/
      types.ts                Resolution types and resolutions
      grid-layout.ts          Square-cell grid layout calculation
      render.ts               Canvas rendering logic
docs/
  prd.md                     Product Requirements Document
  implementation-plan.md     Sprint-level implementation plan
  engineering-principles.md  Development workflow and principles
  project-status.md          Development log
  sprints/                   Sprint plans and reviews
```

---

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create `.env.local` from the example:
   ```
   cp .env.example .env.local
   ```
4. Add your Spotify app credentials to `.env.local` (get these from the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard))
5. Run the development server:
   ```
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000)

---

## Development Rules

- Build the project incrementally.
- One milestone at a time.
- Review AI-generated code before accepting changes.
- Keep components simple and reusable.
- Do not introduce unnecessary complexity.