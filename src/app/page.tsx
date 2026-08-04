"use client";

import { useCallback, useState } from "react";
import WallpaperPreview from "@/components/WallpaperPreview";
import SettingsPanel from "@/components/SettingsPanel";
import { THEMES } from "@/lib/wallpaper/themes";
import { RESOLUTIONS } from "@/lib/wallpaper/types";
import type { AlbumImage, GradientConfig, ResolutionKey } from "@/lib/wallpaper/types";
import type { ThemeKey } from "@/lib/wallpaper/themes";

interface PlaylistResponse {
  name: string;
  description: string;
  images: AlbumImage[];
  error?: string;
  code?: string;
  isFreeAccount?: boolean;
}

export default function Home() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState<PlaylistResponse | null>(null);
  const [theme, setTheme] = useState<ThemeKey>("dark");
  const [resolution, setResolution] = useState<ResolutionKey>("mobile");
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [shuffledImages, setShuffledImages] = useState<AlbumImage[]>([]);
  const [showTitle, setShowTitle] = useState(false);
  const [spacing, setSpacing] = useState(0);
  const [borderRadius, setBorderRadius] = useState(0);
  const [useGradient, setUseGradient] = useState(false);
  const [gradient, setGradient] = useState<GradientConfig>({
    type: "linear",
    angle: 135,
    colors: ["#667eea", "#764ba2"],
  });
  const [useBlur, setUseBlur] = useState(false);
  const [blurIntensity, setBlurIntensity] = useState(20);
  const [blurImageIndex, setBlurImageIndex] = useState(0);

  const effectiveResolution: ResolutionKey = useCustom ? "desktop" : resolution;
  const themeConfig = THEMES[theme];

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

  const handleFetchPlaylist = async () => {
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
      setStep(2);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToSettings = () => {
    setStep(3);
  };

  const handleGenerateWallpaper = () => {
    setStep(4);
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setPlaylist(null);
    setError("");
  };

  const handleBackToStep2 = () => {
    setStep(2);
  };

  const handleBackToStep3 = () => {
    setStep(3);
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

        {step === 1 && (
          <div className="space-y-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFetchPlaylist()}
              placeholder="Paste your Spotify playlist URL here"
              className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handleFetchPlaylist}
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Fetch Playlist"}
            </button>
          </div>
        )}

        {step === 2 && playlist && (
          <div className="space-y-4">
            <button
              onClick={handleBackToStep1}
              className="text-sm text-zinc-500 hover:text-zinc-700"
            >
              ← Back to URL
            </button>

            <div className="p-4 bg-white border border-zinc-300 rounded-lg">
              <h2 className="text-xl font-bold text-zinc-900">{playlist.name}</h2>
              {playlist.description && (
                <p className="text-zinc-500 text-sm mt-1">{playlist.description}</p>
              )}
              <p className="text-zinc-400 text-xs mt-1">{playlist.images.length} tracks</p>
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

            <button
              onClick={handleGoToSettings}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Proceed to Wallpaper
            </button>
          </div>
        )}

        {step === 3 && playlist && (
          <div className="space-y-4">
            <button
              onClick={handleBackToStep2}
              className="text-sm text-zinc-500 hover:text-zinc-700"
            >
              ← Back to Artwork
            </button>

            <SettingsPanel
              theme={theme}
              setTheme={setTheme}
              resolution={resolution}
              setResolution={setResolution}
              useCustom={useCustom}
              setUseCustom={setUseCustom}
              customWidth={customWidth}
              setCustomWidth={setCustomWidth}
              customHeight={customHeight}
              setCustomHeight={setCustomHeight}
              spacing={spacing}
              setSpacing={setSpacing}
              borderRadius={borderRadius}
              setBorderRadius={setBorderRadius}
              showTitle={showTitle}
              setShowTitle={setShowTitle}
              useGradient={useGradient}
              setUseGradient={setUseGradient}
              gradient={gradient}
              setGradient={setGradient}
              useBlur={useBlur}
              setUseBlur={setUseBlur}
              blurIntensity={blurIntensity}
              setBlurIntensity={setBlurIntensity}
              blurImageIndex={blurImageIndex}
              setBlurImageIndex={setBlurImageIndex}
              images={shuffledImages}
              onGenerate={handleGenerateWallpaper}
            />

            {playlist.images.length > 0 && (
              <WallpaperPreview
                images={shuffledImages}
                playlistName={playlist.name}
                resolution={effectiveResolution}
                customWidth={useCustom ? canvasWidth : undefined}
                customHeight={useCustom ? canvasHeight : undefined}
                showTitle={showTitle}
                spacing={spacing}
                borderRadius={borderRadius}
                backgroundColor={useGradient ? gradient.colors[0] : (useBlur ? "#000000" : themeConfig.backgroundColor)}
                titleBarColor={themeConfig.titleBarColor}
                titleTextColor={themeConfig.titleTextColor}
                gradient={useGradient ? gradient : undefined}
                blur={useBlur}
                blurIntensity={blurIntensity}
                blurImageIndex={blurImageIndex}
                showReshuffle={true}
                showDownload={false}
                onReshuffle={handleReshuffle}
              />
            )}

            {useCustom && (
              <p className="text-xs text-zinc-500 text-center">
                Preview shows at {RESOLUTIONS[effectiveResolution].width}×{RESOLUTIONS[effectiveResolution].height}. Download will use {canvasWidth}×{canvasHeight}.
              </p>
            )}
          </div>
        )}

        {step === 4 && playlist && (
          <div className="space-y-4">
            <button
              onClick={handleBackToStep3}
              className="text-sm text-zinc-500 hover:text-zinc-700"
            >
              ← Back to Settings
            </button>

            <div className="p-4 bg-white border border-zinc-300 rounded-lg">
              <h2 className="text-xl font-bold text-zinc-900">{playlist.name}</h2>
              <p className="text-zinc-400 text-xs mt-1">{playlist.images.length} tracks</p>
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
              backgroundColor={useGradient ? gradient.colors[0] : (useBlur ? "#000000" : themeConfig.backgroundColor)}
              titleBarColor={themeConfig.titleBarColor}
              titleTextColor={themeConfig.titleTextColor}
              gradient={useGradient ? gradient : undefined}
              blur={useBlur}
              blurIntensity={blurIntensity}
              blurImageIndex={blurImageIndex}
              showReshuffle={false}
              showDownload={true}
              onReshuffle={handleReshuffle}
            />

            {useCustom && (
              <p className="text-xs text-zinc-500 text-center">
                Preview shows at {RESOLUTIONS[effectiveResolution].width}×{RESOLUTIONS[effectiveResolution].height}. Download will use {canvasWidth}×{canvasHeight}.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
