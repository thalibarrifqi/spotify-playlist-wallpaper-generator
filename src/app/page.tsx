"use client";

import { useState } from "react";

interface AlbumImage {
  url: string;
  width: number;
  height: number;
}

interface PlaylistResponse {
  name: string;
  description: string;
  images: AlbumImage[];
  error?: string;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState<PlaylistResponse | null>(null);

  const validateSpotifyUrl = (url: string): boolean => {
    const spotifyPlaylistRegex =
      /^https?:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]+/;
    return spotifyPlaylistRegex.test(url);
  };

  const handleGenerate = async () => {
    setError("");
    setPlaylist(null);

    if (!url.trim()) {
      setError("Please enter a Spotify playlist URL");
      return;
    }

    if (!validateSpotifyUrl(url)) {
      setError("Please enter a valid Spotify playlist URL");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/playlist?url=${encodeURIComponent(url)}`
      );
      const data: PlaylistResponse = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to fetch playlist");
        return;
      }

      setPlaylist(data);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Spotify Playlist Wallpaper Generator
          </h1>
          <p className="text-zinc-400">
            Generate beautiful wallpapers from your Spotify playlists
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your Spotify playlist URL here"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Generate Wallpaper"}
          </button>

          {playlist && (
            <div className="space-y-4">
              <div className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg">
                <h2 className="text-xl font-bold text-white">{playlist.name}</h2>
                {playlist.description && (
                  <p className="text-zinc-400 text-sm mt-1">
                    {playlist.description}
                  </p>
                )}
              </div>

              {playlist.images.length > 0 ? (
                <div className="grid grid-cols-5 gap-2">
                  {playlist.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={`Album artwork ${index + 1}`}
                      className="w-full aspect-square object-cover rounded"
                    />
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg text-center">
                  <p className="text-zinc-400">No album artwork found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
