"use client";

import { THEMES } from "@/lib/wallpaper/themes";
import { RESOLUTIONS } from "@/lib/wallpaper/types";
import type { ResolutionKey } from "@/lib/wallpaper/types";
import type { ThemeKey } from "@/lib/wallpaper/themes";

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
  onGenerate,
}: SettingsPanelProps) {
  return (
    <div className="p-4 bg-white border border-zinc-300 rounded-lg space-y-4">
      <div>
        <label className="block text-xs text-zinc-600 mb-1">Theme</label>
        <div className="flex rounded-lg overflow-hidden border border-zinc-300">
          {(Object.keys(THEMES) as ThemeKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={
                theme === key
                  ? "flex-1 py-2 text-sm font-medium bg-blue-600 text-white"
                  : "flex-1 py-2 text-sm font-medium bg-white text-zinc-600 hover:bg-zinc-100"
              }
            >
              {THEMES[key].label}
            </button>
          ))}
        </div>
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
