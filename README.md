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
  - Mobile (1080x1920), Desktop (1920x1080), or Custom resolution
  - Adjustable cell spacing (0–20px)
  - Adjustable border radius (0–20px)
  - Custom background color picker
  - Black background behind artworks
  - Optional playlist title overlay (toggle on/off)
- Text customization for the title overlay:
  - 8 fonts (Inter, Roboto, Playfair Display, Montserrat, Poppins + system fonts), self-hosted via next/font
  - Font weight (Regular, Medium, Bold) and size presets (Small → Extra Large)
  - 6 title positions (top/bottom × left/center/right) with padding control
  - Text color, outline/stroke width, shadow blur and color
  - Optional background strip behind text with opacity slider
- Image effects for the artwork:
  - Brightness, contrast, and saturation sliders (-100% to +100%)
  - Grayscale, sepia, and invert toggles
  - Artistic blur (0–10px)
  - Vignette and noise/grain overlays with intensity controls
  - 5 presets: Vibrant, Muted, Vintage, B&W, Neon
  - Effects preview in real-time and apply to exported wallpapers at any DPI
- Layout templates for the artwork:
  - 6 templates: Grid, Collage, Mosaic, Diagonal, Border, Film Strip
  - Visual thumbnail picker with last-used template remembered
  - Template-specific settings (rotation angle, border thickness, variation, overlap, orientation)
  - Works with all background modes and effects at any resolution
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
    WallpaperPreview.tsx  Canvas preview, reshuffle, and download
    SettingsPanel.tsx     Wallpaper settings (theme, background, resolution, template)
    TextSettings.tsx      Title text customization panel
    EffectsPanel.tsx      Image effects controls
    TemplateSelector.tsx  Layout template picker with thumbnails
  lib/
    spotify/
      parse-playlist-url.ts   URL parsing utility
      playlists.ts            Playlist fetch helper with rate-limit retry
      token.ts                OAuth token cache
    wallpaper/
      types.ts                Resolution, text style, template, and effects types
      grid-layout.ts          Square-cell grid layout calculation
      render.ts               Canvas rendering + filter pipeline
      themes.ts               Wallpaper theme presets
      fonts.ts                Font definitions
      text-layout.ts          Text layout math and presets
      effects.ts              Filter logic, overlays, and helpers
      presets.ts              Image effect presets
      templates/
        index.ts              Template registry and helpers
        grid.ts               Grid template
        collage.ts            Collage template
        mosaic.ts             Mosaic template
        diagonal.ts           Diagonal template
        border.ts             Border template
        filmstrip.ts          Film strip template
__tests__/
  grid-layout.test.ts         Layout math tests (300 cases)
  fonts.test.ts               Font definition tests
  text-layout.test.ts         Text layout math tests
  effects.test.ts             Filter and overlay helper tests
  presets.test.ts             Effect preset tests
  templates.test.ts           Template layout tests
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