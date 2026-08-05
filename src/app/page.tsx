"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LandingPage from "@/components/LandingPage";
import WallpaperPreview from "@/components/WallpaperPreview";
import SettingsPanel from "@/components/SettingsPanel";
import HistoryPanel from "@/components/HistoryPanel";
import { THEMES } from "@/lib/wallpaper/themes";
import { DEFAULT_TEXT_STYLE } from "@/lib/wallpaper/text-layout";
import { DEFAULT_EFFECTS } from "@/lib/wallpaper/effects";
import { RESOLUTIONS } from "@/lib/wallpaper/types";
import type { AlbumImage, GradientConfig, ResolutionKey, TemplateId, TextStyle, WallpaperEffects } from "@/lib/wallpaper/types";
import type { ThemeKey } from "@/lib/wallpaper/themes";
import { defaultTemplateSettings } from "@/lib/wallpaper/templates";
import type { TemplateSettings } from "@/lib/wallpaper/templates";
import { DEFAULT_SETTINGS, clearSettings, loadSettings, saveSettings } from "@/lib/storage";
import type { WallpaperSettings } from "@/lib/storage";
import { useHistory } from "@/hooks/useHistory";
import type { HistoryEntry } from "@/lib/history";

interface PlaylistResponse {
  name: string;
  description: string;
  images: AlbumImage[];
  error?: string;
  code?: string;
  isFreeAccount?: boolean;
}

const STEP_BACKGROUNDS = {
  fetch: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&q=80",
  artwork: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1920&q=80",
  settings: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=1920&q=80",
  download: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920&q=80",
};

export default function Home() {
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0);
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
  const [textStyle, setTextStyle] = useState<TextStyle>(DEFAULT_TEXT_STYLE);
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
  const [artworkScale, setArtworkScale] = useState(1);
  const [effects, setEffects] = useState<WallpaperEffects>(DEFAULT_EFFECTS);
  const [template, setTemplate] = useState<TemplateId>("grid");
  const [templateSettings, setTemplateSettings] = useState<TemplateSettings>({});
  const [historyOpen, setHistoryOpen] = useState(false);
  const latestThumbnailRef = useRef<string>("");
  const { history, add: addHistory, remove: removeHistory, clear: clearHistory, exportJson: exportHistoryJson } = useHistory();

  const applySettings = useCallback((s: WallpaperSettings) => {
    setTheme(s.theme);
    setResolution(s.resolution);
    setCustomWidth(s.customWidth);
    setCustomHeight(s.customHeight);
    setUseCustom(s.useCustom);
    setShowTitle(s.showTitle);
    setTextStyle(s.textStyle);
    setSpacing(s.spacing);
    setBorderRadius(s.borderRadius);
    setUseGradient(s.useGradient);
    setGradient(s.gradient);
    setUseBlur(s.useBlur);
    setBlurIntensity(s.blurIntensity);
    setBlurImageIndex(s.blurImageIndex);
    setArtworkScale(s.artworkScale);
    setEffects(s.effects);
    setTemplate(s.template);
    setTemplateSettings(s.templateSettings);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => applySettings(loadSettings()), 0);
    return () => clearTimeout(timer);
  }, [applySettings]);

  const settings = useMemo<WallpaperSettings>(
    () => ({
      theme,
      resolution,
      customWidth,
      customHeight,
      useCustom,
      showTitle,
      textStyle,
      spacing,
      borderRadius,
      useGradient,
      gradient,
      useBlur,
      blurIntensity,
      blurImageIndex,
      artworkScale,
      effects,
      template,
      templateSettings,
    }),
    [theme, resolution, customWidth, customHeight, useCustom, showTitle, textStyle, spacing, borderRadius, useGradient, gradient, useBlur, blurIntensity, blurImageIndex, artworkScale, effects, template, templateSettings]
  );

  useEffect(() => {
    const timer = setTimeout(() => saveSettings(settings), 300);
    return () => clearTimeout(timer);
  }, [settings]);

  const handleRendered = useCallback((dataUrl: string) => {
    latestThumbnailRef.current = dataUrl;
  }, []);

  const handleResetAll = () => {
    applySettings(DEFAULT_SETTINGS);
    clearSettings();
  };

  const effectiveResolution: ResolutionKey = useCustom ? "desktop" : resolution;
  const themeConfig = THEMES[theme];

  const handleTemplateChange = (id: TemplateId) => {
    setTemplate(id);
    setTemplateSettings(defaultTemplateSettings(id));
  };

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

  const handleGetStarted = () => {
    setStep(1);
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
    if (playlist) {
      addHistory({
        playlistName: playlist.name,
        url,
        thumbnail: latestThumbnailRef.current || "",
        settings,
      });
    }
    setStep(4);
  };

  const handleRestoreHistory = async (entry: HistoryEntry) => {
    setHistoryOpen(false);
    applySettings(entry.settings);
    setUrl(entry.url);
    setError("");
    setLoading(true);
    try {
      const response = await fetch(
        `/api/playlist?url=${encodeURIComponent(entry.url)}`
      );
      const data: PlaylistResponse = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to fetch playlist");
        setStep(1);
        return;
      }
      setPlaylist(data);
      setShuffledImages(data.images);
      setStep(3);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLanding = () => {
    setStep(0);
    setPlaylist(null);
    setError("");
    setUrl("");
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

  // Landing page
  if (step === 0) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  // Get background for current step
  const getBackground = () => {
    switch (step) {
      case 1: return STEP_BACKGROUNDS.fetch;
      case 2: return STEP_BACKGROUNDS.artwork;
      case 3: return STEP_BACKGROUNDS.settings;
      case 4: return STEP_BACKGROUNDS.download;
      default: return STEP_BACKGROUNDS.fetch;
    }
  };

  // Wizard steps
  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${getBackground()}')` }}
      />
      <div className="fixed inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-black/30 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button
              onClick={handleBackToLanding}
              className="text-sm text-white/70 hover:text-white transition-colors font-medium"
            >
              ← Home
            </button>
            <h1 className="text-sm sm:text-base font-semibold text-white">
              Spotify Wallpaper Generator
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setHistoryOpen(true)}
                className="text-sm text-white/70 hover:text-white transition-colors font-medium"
                aria-label="Open history"
              >
                History
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {step === 1 && (
            <div className="max-w-md mx-auto animate-fade-in">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 card-shadow-lg">
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">
                  Paste your playlist
                </h2>
                <p className="text-zinc-500 mb-6">
                  Enter a Spotify playlist URL to get started
                </p>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleFetchPlaylist()}
                    placeholder="https://open.spotify.com/playlist/..."
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#1db954] focus:border-transparent transition-smooth"
                    aria-label="Spotify playlist URL"
                  />
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}
                  <button
                    onClick={handleFetchPlaylist}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-[#1db954] hover:bg-[#1ed760] text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed btn-press"
                    aria-label={loading ? "Loading playlist..." : "Fetch playlist"}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin-slow w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Loading...
                      </span>
                    ) : (
                      "Fetch Playlist"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && playlist && (
            <div className="max-w-md mx-auto animate-fade-in">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 card-shadow-lg">
                <button
                  onClick={handleBackToStep1}
                  className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-4"
                >
                  ← Back
                </button>
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-zinc-900">{playlist.name}</h2>
                  {playlist.description && (
                    <p className="text-zinc-500 text-sm mt-1">{playlist.description}</p>
                  )}
                  <p className="text-zinc-400 text-xs mt-1">{playlist.images.length} album artworks</p>
                </div>

                {playlist.images.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-6">
                    {playlist.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={image.albumName || `Album artwork ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg transition-transform duration-200 hover:scale-105"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-8 bg-zinc-50 border border-zinc-200 rounded-lg text-center mb-6">
                    <p className="text-zinc-500">No album artwork found</p>
                  </div>
                )}

                <button
                  onClick={handleGoToSettings}
                  className="w-full py-3 px-4 bg-[#1db954] hover:bg-[#1ed760] text-white font-semibold rounded-lg transition-all duration-200 btn-press"
                >
                  Proceed to Customize
                </button>
              </div>
            </div>
          )}

          {step === 3 && playlist && (
            <div className="max-w-6xl mx-auto animate-fade-in">
              <button
                onClick={handleBackToStep2}
                className="text-sm text-white/70 hover:text-white transition-colors mb-4"
              >
                ← Back to Artwork
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Settings */}
                <div>
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
                    textStyle={textStyle}
                    setTextStyle={setTextStyle}
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
                    artworkScale={artworkScale}
                    setArtworkScale={setArtworkScale}
                    effects={effects}
                    setEffects={setEffects}
                    template={template}
                    setTemplate={handleTemplateChange}
                    templateSettings={templateSettings}
                    setTemplateSettings={setTemplateSettings}
                    images={shuffledImages}
                    onGenerate={handleGenerateWallpaper}
                    onReset={handleResetAll}
                  />
                </div>

                {/* Preview */}
                <div>
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
                      textStyle={textStyle}
                      gradient={useGradient ? gradient : undefined}
                      blur={useBlur}
                      blurIntensity={blurIntensity}
                      blurImageIndex={blurImageIndex}
                      artworkScale={artworkScale}
                      effects={effects}
                      template={template}
                      templateSettings={templateSettings}
                      showReshuffle={true}
                      showDownload={false}
                      onReshuffle={handleReshuffle}
                      onRendered={handleRendered}
                    />
                  )}
                </div>
              </div>

              {useCustom && (
                <p className="text-xs text-white/50 text-center mt-4">
                  Preview shows at {RESOLUTIONS[effectiveResolution].width}×{RESOLUTIONS[effectiveResolution].height}. Download will use {canvasWidth}×{canvasHeight}.
                </p>
              )}
            </div>
          )}

          {step === 4 && playlist && (
            <div className="max-w-2xl mx-auto animate-fade-in">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 card-shadow-lg">
                <button
                  onClick={handleBackToStep3}
                  className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-4"
                >
                  ← Back to Settings
                </button>

                <div className="mb-4">
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
                  textStyle={textStyle}
                  gradient={useGradient ? gradient : undefined}
                  blur={useBlur}
                  blurIntensity={blurIntensity}
                  blurImageIndex={blurImageIndex}
                  artworkScale={artworkScale}
                  effects={effects}
                  template={template}
                  templateSettings={templateSettings}
                  showReshuffle={false}
                  showDownload={true}
                  onReshuffle={handleReshuffle}
                  onRendered={handleRendered}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onRestore={handleRestoreHistory}
        onDelete={removeHistory}
        onClear={clearHistory}
        onExport={exportHistoryJson}
      />
    </div>
  );
}
