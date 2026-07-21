export class PlaylistUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlaylistUrlError";
  }
}

export function parsePlaylistUrl(url: string): string {
  const trimmed = url.trim();

  if (!trimmed) {
    throw new PlaylistUrlError("URL is empty");
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new PlaylistUrlError("Invalid URL format");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new PlaylistUrlError("URL must use http or https protocol");
  }

  if (parsed.hostname !== "open.spotify.com") {
    throw new PlaylistUrlError("URL must be from open.spotify.com");
  }

  const pathParts = parsed.pathname.split("/").filter(Boolean);

  if (pathParts.length < 2 || pathParts[0] !== "playlist") {
    throw new PlaylistUrlError(
      "URL must contain a playlist path (e.g., /playlist/{id})"
    );
  }

  const playlistId = pathParts[1];

  if (!playlistId || !/^[a-zA-Z0-9]+$/.test(playlistId)) {
    throw new PlaylistUrlError("Invalid playlist ID format");
  }

  if (playlistId.length < 10 || playlistId.length > 30) {
    throw new PlaylistUrlError("Playlist ID has unexpected length");
  }

  return playlistId;
}
