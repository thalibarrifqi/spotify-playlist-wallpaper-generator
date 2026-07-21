import { getAccessToken, TokenError } from "./token";

export class PlaylistError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlaylistError";
  }
}

export interface AlbumImage {
  url: string;
  width: number;
  height: number;
}

export interface PlaylistData {
  name: string;
  description: string;
  images: AlbumImage[];
}

const PLAYLIST_API_URL = "https://api.spotify.com/v1/playlists";
const MAX_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 1000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(
  url: string,
  token: string,
  attempt = 1
): Promise<Response> {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 429) {
    if (attempt > MAX_RETRIES) {
      throw new PlaylistError(
        "Spotify API rate limit exceeded. Please try again later."
      );
    }

    const retryAfter = response.headers.get("Retry-After");
    const retryDelay = retryAfter
      ? parseInt(retryAfter, 10) * 1000
      : BASE_RETRY_DELAY_MS * Math.pow(2, attempt - 1);

    await delay(retryDelay);
    return fetchWithRetry(url, token, attempt + 1);
  }

  return response;
}

export async function getPlaylist(playlistId: string): Promise<PlaylistData> {
  let token: string;
  try {
    token = await getAccessToken();
  } catch (error) {
    if (error instanceof TokenError) {
      throw new PlaylistError(error.message);
    }
    throw new PlaylistError("Failed to authenticate with Spotify");
  }

  const response = await fetchWithRetry(
    `${PLAYLIST_API_URL}/${playlistId}`,
    token
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new PlaylistError("Playlist not found");
    }
    if (response.status === 403) {
      throw new PlaylistError(
        "Unable to access this playlist. It may be private or restricted."
      );
    }
    throw new PlaylistError(
      `Spotify API error (${response.status}): ${response.statusText}`
    );
  }

  const data = await response.json();

  const images: AlbumImage[] = [];
  for (const track of data.tracks?.items ?? []) {
    const album = track.track?.album;
    if (album?.images?.length > 0) {
      const bestImage = album.images.reduce(
        (best: AlbumImage, current: AlbumImage) =>
          current.width > best.width ? current : best,
        album.images[0]
      );
      images.push(bestImage);
    }

    if (images.length >= 50) break;
  }

  return {
    name: data.name,
    description: data.description ?? "",
    images,
  };
}
