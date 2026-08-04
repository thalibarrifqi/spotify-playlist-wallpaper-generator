# Spotify Playlist Wallpaper Generator

## Vision

Generate beautiful wallpapers from Spotify playlists in seconds.

## Target User

Spotify users who want aesthetic wallpapers for their phones or desktops.

## MVP

- Paste Spotify Playlist URL
- Fetch playlist information
- Retrieve album artworks (max 50)
- Display artwork preview
- Generate wallpaper
- Download wallpaper

## Wallpaper Layout

- Square-cell grid that auto-selects column count and scales to cover the whole canvas (no stretched artwork, no black margins)
- Artwork is cover-cropped (never distorted)
- Album artworks are deduplicated by album, so songs from the same album appear once

## Target Resolution

### Mobile

- 1080x1920

### Desktop

- 1920x1080

## Constraints

- Maximum 50 artworks
- Fast generation
- No login
- No database

## Future Ideas

- Gradient background
- Blur background
- Playlist title
- Multiple themes
- Custom spacing
- Custom border radius