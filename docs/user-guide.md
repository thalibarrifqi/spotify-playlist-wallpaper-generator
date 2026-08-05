# User Guide

Turn any public Spotify playlist into a custom phone or desktop wallpaper.

## Getting started

1. Open the app.
2. Click **Get Started**.
3. Paste a Spotify playlist URL (e.g. `https://open.spotify.com/playlist/37i9dQZEVXbMDoHDwVN2tF`).
4. Press Enter or click **Fetch Playlist**.

The app loads the playlist name, description, and its album artwork.

> The playlist must be **public** — private playlists cannot be fetched.

## Step 2 — Artwork

A grid shows the deduplicated album artwork for the playlist (one image per album). Confirm it looks right, then click **Proceed to Customize**.

## Step 3 — Customize

Settings are grouped into four tabs:

| Tab | Controls |
|-----|----------|
| **Background** | Theme presets, solid/gradient/blur background, artwork zoom (0.5×–2×) |
| **Layout** | Template (Grid, Collage, Mosaic, Diagonal, Border, Film Strip), resolution (Mobile/Desktop/Custom), cell spacing, border radius, template options |
| **Effects** | Brightness/contrast/saturation, grayscale/sepia/invert, artistic blur, vignette, noise, and 5 presets |
| **Text** | Show the playlist title on the wallpaper, then pick font, size, position, color, outline, shadow, and background strip |

The live preview on the right updates as you change settings.

- **Reshuffle** randomizes the artwork order.
- **Reset all settings** returns everything to defaults.

Your settings **auto-save** in the browser and are restored on your next visit.

## Step 4 — Download

- Pick an **export quality**:
  - **1×** — screen quality
  - **2×** — high-res screens
  - **3×** — print quality (~300 DPI)
- Click **Download** to save the PNG.

2×/3× exports render in a Web Worker, so the page stays responsive while the file is prepared.

> **Tip:** custom resolutions affect the download size. A custom 3240×5760 at 3× becomes a 9720×17280 PNG.

## History

Every generated wallpaper is saved to your browser history (up to 20 entries, newest first).

1. Click **History** in the top bar.
2. Each entry shows a thumbnail, playlist name, and date.
   - **Restore** — re-fetches the playlist and applies the saved settings.
   - **Delete** — removes the entry.
   - **Export JSON** — downloads the full history as JSON.
   - **Clear history** — wipes all entries.

History lives in **your browser only** (localStorage); nothing is uploaded to a server.

## Accessibility

- The whole wizard works with the keyboard: **Tab** between controls, **Enter** to activate, **Arrow keys** inside the settings tabs, **Escape** to close the history drawer.
- A **skip to content** link is the first tab stop.
- If you prefer reduced motion, animations are disabled automatically.
