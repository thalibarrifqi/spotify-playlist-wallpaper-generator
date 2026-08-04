"use client";

import { THEMES } from "@/lib/wallpaper/themes";
import { RESOLUTIONS } from "@/lib/wallpaper/types";
import type { ResolutionKey } from "@/lib/wallpaper/types";
import type { ThemeKey } from "@/lib/wallpaper/themes";
import type { AlbumImage, GradientConfig } from "@/lib/wallpaper/types";

interface SettingsPanelProps {
  theme: ThemeKey;
  setTheme: (theme: ThemeKey) => void;
  resolution: ResolutionKey;
  setResolution: (resolution: ResolutionKey) => void;
  useCustom: boolean;
  setUseCustom: (use: boolean) => void;
  customWidth: string;
  setCustomWidth: (w: string) => void;
  customHeight: string;
  setCustomHeight: (h: string) => void;
  spacing: number;
  setSpacing: (s: number) => void;
  borderRadius: number;
  setBorderRadius: (r: number) => void;
  showTitle: boolean;
  setShowTitle: (show: boolean) => void;
  useGradient: boolean;
  setUseGradient: (use: boolean) => void;
  gradient: GradientConfig;
  setGradient: (g: GradientConfig) => void;
  useBlur: boolean;
  setUseBlur: (use: boolean) => void;
  blurIntensity: number;
  setBlurIntensity: (i: number) => void;
  blurImageIndex: number;
  setBlurImageIndex: (i: number) => void;
  artworkScale: number;
  setArtworkScale: (s: number) => void;
  images: AlbumImage[];
  onGenerate: () => void;
}

export default function SettingsPanel({
  theme,
  setTheme,
  resolution,
  setResolution,
  useCustom,
  setUseCustom,
  customWidth,
  setCustomWidth,
  customHeight,
  setCustomHeight,
  spacing,
  setSpacing,
  borderRadius,
  setBorderRadius,
  showTitle,
  setShowTitle,
  useGradient,
  setUseGradient,
  gradient,
  setGradient,
  useBlur,
  setUseBlur,
  blurIntensity,
  setBlurIntensity,
  blurImageIndex,
  setBlurImageIndex,
  artworkScale,
  setArtworkScale,
  images,
  onGenerate,
}: SettingsPanelProps) {
  const handleThemeChange = (key: ThemeKey) => {
    setTheme(key);
    const t = THEMES[key];
    if (t.gradient) {
      setUseGradient(true);
      setGradient(t.gradient);
    } else {
      setUseGradient(false);
    }
  };

  return (
    <div className="p-4 bg-white border border-zinc-300 rounded-lg space-y-4">
      <div>
        <label className="block text-xs text-zinc-600 mb-1">Theme</label>
        <div className="flex flex-wrap gap-1">
          {(Object.keys(THEMES) as ThemeKey[]).map((key) => (
            <button
              key={key}
              onClick={() => handleThemeChange(key)}
              className={
                theme === key
                  ? "px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded"
                  : "px-3 py-1.5 text-xs font-medium bg-white text-zinc-600 border border-zinc-300 rounded hover:bg-zinc-100"
              }
            >
              {THEMES[key].label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs text-zinc-600 mb-1">Background</label>
        <div className="flex rounded-lg overflow-hidden border border-zinc-300">
          <button
            onClick={() => { setUseGradient(false); setUseBlur(false); }}
            className={!useGradient && !useBlur ? "flex-1 py-2 text-sm font-medium bg-blue-600 text-white" : "flex-1 py-2 text-sm font-medium bg-white text-zinc-600 hover:bg-zinc-100"}
          >
            Solid
          </button>
          <button
            onClick={() => { setUseGradient(true); setUseBlur(false); }}
            className={useGradient && !useBlur ? "flex-1 py-2 text-sm font-medium bg-blue-600 text-white" : "flex-1 py-2 text-sm font-medium bg-white text-zinc-600 hover:bg-zinc-100"}
          >
            Gradient
          </button>
          <button
            onClick={() => { setUseBlur(true); setUseGradient(false); }}
            className={useBlur ? "flex-1 py-2 text-sm font-medium bg-blue-600 text-white" : "flex-1 py-2 text-sm font-medium bg-white text-zinc-600 hover:bg-zinc-100"}
          >
            Blur
          </button>
        </div>
      </div>

      {useGradient && (
        <div className="space-y-2 p-3 bg-zinc-50 rounded-lg">
          <div className="flex rounded-lg overflow-hidden border border-zinc-300">
            <button
              onClick={() => setGradient({ ...gradient, type: "linear" })}
              className={gradient.type === "linear" ? "flex-1 py-1.5 text-xs font-medium bg-blue-600 text-white" : "flex-1 py-1.5 text-xs font-medium bg-white text-zinc-600"}
            >
              Linear
            </button>
            <button
              onClick={() => setGradient({ ...gradient, type: "radial" })}
              className={gradient.type === "radial" ? "flex-1 py-1.5 text-xs font-medium bg-blue-600 text-white" : "flex-1 py-1.5 text-xs font-medium bg-white text-zinc-600"}
            >
              Radial
            </button>
          </div>

          {gradient.type === "linear" && (
            <div>
              <label className="block text-xs text-zinc-600 mb-1">
                Angle: {gradient.angle}°
              </label>
              <input
                type="range"
                min={0}
                max={360}
                value={gradient.angle}
                onChange={(e) => setGradient({ ...gradient, angle: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs text-zinc-600">Colors</label>
            {gradient.colors.map((color, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    const colors = [...gradient.colors];
                    colors[i] = e.target.value;
                    setGradient({ ...gradient, colors });
                  }}
                  className="w-8 h-8 rounded border border-zinc-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => {
                    const colors = [...gradient.colors];
                    colors[i] = e.target.value;
                    setGradient({ ...gradient, colors });
                  }}
                  className="flex-1 px-2 py-1 bg-white border border-zinc-300 rounded text-zinc-900 text-xs font-mono"
                />
                {gradient.colors.length > 2 && (
                  <button
                    onClick={() => {
                      const colors = gradient.colors.filter((_, j) => j !== i);
                      setGradient({ ...gradient, colors });
                    }}
                    className="text-red-500 text-xs hover:text-red-700"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {gradient.colors.length < 3 && (
              <button
                onClick={() => setGradient({ ...gradient, colors: [...gradient.colors, "#ffffff"] })}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                + Add color
              </button>
            )}
          </div>
        </div>
      )}

      {useBlur && images.length > 0 && (
        <div className="space-y-2 p-3 bg-zinc-50 rounded-lg">
          <div>
            <label className="block text-xs text-zinc-600 mb-1">Source Artwork</label>
            <select
              value={blurImageIndex}
              onChange={(e) => setBlurImageIndex(Number(e.target.value))}
              className="w-full px-2 py-1.5 bg-white border border-zinc-300 rounded text-zinc-900 text-sm"
            >
              {images.map((img, i) => (
                <option key={i} value={i}>
                  {img.albumName || `Artwork ${i + 1}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-600 mb-1">
              Blur Intensity: {blurIntensity}px
            </label>
            <input
              type="range"
              min={10}
              max={50}
              value={blurIntensity}
              onChange={(e) => setBlurIntensity(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs text-zinc-600 mb-1">
          Artwork Scale: {artworkScale.toFixed(1)}x
        </label>
        <input
          type="range"
          min={0.5}
          max={2}
          step={0.1}
          value={artworkScale}
          onChange={(e) => setArtworkScale(Number(e.target.value))}
          className="w-full"
        />
        <p className="text-xs text-zinc-500 mt-0.5">Zoom in/out on album artwork</p>
      </div>

      <div>
        <label className="block text-xs text-zinc-600 mb-1">Resolution</label>
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

      <button
        onClick={onGenerate}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
      >
        Generate Wallpaper
      </button>
    </div>
  );
}
