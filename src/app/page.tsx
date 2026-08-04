"use client";

import { useCallback, useState } from "react";
import WallpaperPreview from "@/components/WallpaperPreview";
import { RESOLUTIONS } from "@/lib/wallpaper/types";
import type { AlbumImage, ResolutionKey } from "@/lib/wallpaper/types";

interface PlaylistResponse {
  name: string;
  description: string;
  images: AlbumImage[];
  error?: string;
  code?: string;
  isFreeAccount?: boolean;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState<PlaylistResponse | null>(null);
  const [resolution, setResolution] = useState<ResolutionKey>("mobile");
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [shuffledImages, setShuffledImages] = useState<AlbumImage[]>([]);
  const [showTitle, setShowTitle] = useState(false);
  const [spacing, setSpacing] = useState(0);
  const [borderRadius, setBorderRadius] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState("#000000");

  const effectiveResolution: ResolutionKey = useCustom ? "desktop" : resolution;

  const handleReshuffle = useCallback(() => {
    if (!playlist) return;
    const arr = [...playlist.images];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffledImages(arr);
  }, [playlist]);

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
        if (data.code === "RATE_LIMIT_EXCEEDED" && data.isFreeAccount) {
          setError(`${data.error}`);
        } else {
          setError(data.error || "Failed to fetch playlist");
        }
        return;
      }

      setPlaylist(data);
      setShuffledImages(data.images);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const canvasWidth = useCustom ? parseInt(customWidth) || 1920 : RESOLUTIONS[resolution].width;
  const canvasHeight = useCustom ? parseInt(customHeight) || 1080 : RESOLUTIONS[resolution].height;

  return (
    <div className="min-h-screen bg-zinc-200 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-900 mb-2">
            Spotify Playlist Wallpaper Generator
          </h1>
          <p className="text-zinc-600">
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
              className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <div className="p-4 bg-white border border-zinc-300 rounded-lg">
                <h2 className="text-xl font-bold text-zinc-900">{playlist.name}</h2>
                {playlist.description && (
                  <p className="text-zinc-500 text-sm mt-1">
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
                <div className="p-4 bg-white border border-zinc-300 rounded-lg text-center">
                  <p className="text-zinc-500">No album artwork found</p>
                </div>
              )}

              {playlist.images.length > 0 && (
                <>
                  <div className="p-4 bg-white border border-zinc-300 rounded-lg space-y-4">
                    <div>
                      <label className="block text-xs text-zinc-600 mb-1">
                        Resolution
                      </label>
                      <div className="flex rounded-lg overflow-hidden border border-zinc-300">
                        {Object.entries(RESOLUTIONS).map(([key, res]) => (
                          <button
                            key={key}
                            onClick={() => {
                              setResolution(key as ResolutionKey);
                              setUseCustom(false);
                            }}
                            className={
                              !useCustom && resolution === key
                                ? "flex-1 py-2 text-sm font-medium bg-blue-600 text-white"
                                : "flex-1 py-2 text-sm font-medium bg-white text-zinc-600 hover:bg-zinc-100"
                            }
                          >
                            {res.label}
                          </button>
                        ))}
                        <button
                          onClick={() => setUseCustom(true)}
                          className={
                            useCustom
                              ? "flex-1 py-2 text-sm font-medium bg-blue-600 text-white"
                              : "flex-1 py-2 text-sm font-medium bg-white text-zinc-600 hover:bg-zinc-100"
                          }
                        >
                          Custom
                        </button>
                      </div>
                    </div>

                    {useCustom && (
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          value={customWidth}
                          onChange={(e) => setCustomWidth(e.target.value)}
                          placeholder="Width"
                          className="flex-1 px-3 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-zinc-400">×</span>
                        <input
                          type="number"
                          value={customHeight}
                          onChange={(e) => setCustomHeight(e.target.value)}
                          placeholder="Height"
                          className="flex-1 px-3 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs text-zinc-600 mb-1">
                        Cell Spacing: {spacing}px
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={20}
                        value={spacing}
                        onChange={(e) => setSpacing(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-600 mb-1">
                        Border Radius: {borderRadius}px
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={20}
                        value={borderRadius}
                        onChange={(e) => setBorderRadius(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-600 mb-1">
                        Background Color
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-10 h-10 rounded border border-zinc-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="flex-1 px-3 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="show-title"
                        checked={showTitle}
                        onChange={(e) => setShowTitle(e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="show-title" className="text-sm text-zinc-600">
                        Show playlist title on wallpaper
                      </label>
                    </div>
                  </div>

                  <WallpaperPreview
                    images={shuffledImages}
                    playlistName={playlist.name}
                    resolution={effectiveResolution}
                    customWidth={useCustom ? canvasWidth : undefined}
                    customHeight={useCustom ? canvasHeight : undefined}
                    showTitle={showTitle}
                    spacing={spacing}
                    borderRadius={borderRadius}
                    backgroundColor={backgroundColor}
                    onReshuffle={handleReshuffle}
                  />

                  {useCustom && (
                    <p className="text-xs text-zinc-500 text-center">
                      Preview shows at {RESOLUTIONS[effectiveResolution].width}×{RESOLUTIONS[effectiveResolution].height}. Download will use {canvasWidth}×{canvasHeight}.
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
