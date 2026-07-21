# Spotify Playlist Wallpaper Generator

Generate beautiful wallpapers from Spotify playlist album artworks.

This project is being built as a learning project to explore AI-assisted software development using OpenCode. The focus is not only on delivering a working application but also on learning an effective AI coding workflow.

---

## Goals

- Generate wallpapers from Spotify playlist album artworks.
- Support both mobile and desktop wallpaper sizes.
- Keep the application simple and fast.
- Learn AI-first software development with OpenCode.

---

## Current Status

Spotify API integration complete. The app can:

- Accept a Spotify playlist URL
- Fetch playlist data via the Spotify Web API (Client Credentials flow)
- Display album artwork thumbnails in a grid preview

Wallpaper generation, download, and layout options are not yet implemented.

---

## Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS v4
- Spotify Web API
- HTML Canvas (planned)

---

## Repository Structure

```
src/
  app/
    api/playlist/    BFF route handler for Spotify API
    page.tsx         Main page component
  lib/
    spotify/
      parse-playlist-url.ts   URL parsing utility
      playlists.ts            Playlist fetch helper with rate-limit retry
      token.ts                OAuth token cache
docs/
  prd.md                     Product Requirements Document
  implementation-plan.md     Sprint-level implementation plan
  engineering-principles.md  Development workflow and principles
  templates/                 Sprint, review, and ADR templates
prompts/
  Reusable prompts for OpenCode
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