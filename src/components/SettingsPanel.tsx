"use client";

import { useRef, useState } from "react";
import { THEMES } from "@/lib/wallpaper/themes";
import { RESOLUTIONS } from "@/lib/wallpaper/types";
import type { ResolutionKey } from "@/lib/wallpaper/types";
import type { ThemeKey } from "@/lib/wallpaper/themes";
import type {
  AlbumImage,
  GradientConfig,
  TemplateId,
  TextStyle,
  WallpaperEffects,
} from "@/lib/wallpaper/types";
import { defaultTemplateSettings, getTemplate } from "@/lib/wallpaper/templates";
import type { TemplateSettings } from "@/lib/wallpaper/templates";
import TextSettings from "./TextSettings";
import EffectsPanel from "./EffectsPanel";
import TemplateSelector from "./TemplateSelector";

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
  textStyle: TextStyle;
  setTextStyle: (style: TextStyle) => void;
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
  effects: WallpaperEffects;
  setEffects: (e: WallpaperEffects) => void;
  template: TemplateId;
  setTemplate: (t: TemplateId) => void;
  templateSettings: TemplateSettings;
  setTemplateSettings: (s: TemplateSettings) => void;
  images: AlbumImage[];
  onGenerate: () => void;
  onReset: () => void;
}

type SettingsTab = "background" | "layout" | "effects" | "text";

const TABS: { id: SettingsTab; label: string }[] = [
  { id: "background", label: "Background" },
  { id: "layout", label: "Layout" },
  { id: "effects", label: "Effects" },
  { id: "text", label: "Text" },
];

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
  textStyle,
  setTextStyle,
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
  effects,
  setEffects,
  template,
  setTemplate,
  templateSettings,
  setTemplateSettings,
  images,
  onGenerate,
  onReset,
}: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("background");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    const last = TABS.length - 1;
    const moveTo = (target: number) => {
      const btn = tabRefs.current[target];
      if (!btn) return;
      setActiveTab(TABS[target].id);
      btn.focus();
    };
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveTo(index === last ? 0 : index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveTo(index === 0 ? last : index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      moveTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      moveTo(last);
    }
  };

  const handleThemeChange = (key: ThemeKey) => {
    setTheme(key);
    const t = THEMES[key];
    if (t.gradient) {
      setUseGradient(true);
      setGradient(t.gradient);
    } else {
      setUseGradient(false);
    }
    setTextStyle({ ...textStyle, color: t.titleTextColor });
  };

  const themeSection = (
    <div>
      <label className="block text-xs font-medium text-zinc-600 mb-2">Theme</label>
      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(THEMES) as ThemeKey[]).map((key) => (
          <button
            key={key}
            onClick={() => handleThemeChange(key)}
            className={
              theme === key
                ? "px-3 py-1.5 text-xs font-medium bg-[#11853a] text-white rounded-lg transition-all duration-150"
                : "px-3 py-1.5 text-xs font-medium bg-zinc-100 text-zinc-600 rounded-lg hover:bg-zinc-200 transition-colors"
            }
          >
            {THEMES[key].label}
          </button>
        ))}
      </div>
    </div>
  );

  const backgroundSection = (
    <>
      <div>
        <label className="block text-xs font-medium text-zinc-600 mb-2">Background</label>
        <div className="flex rounded-lg overflow-hidden border border-zinc-200">
          {(["solid", "gradient", "blur"] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                setUseGradient(type === "gradient");
                setUseBlur(type === "blur");
              }}
              className={
                (type === "solid" && !useGradient && !useBlur) ||
                (type === "gradient" && useGradient && !useBlur) ||
                (type === "blur" && useBlur)
                  ? "flex-1 py-2 text-sm font-medium bg-[#11853a] text-white transition-colors"
                  : "flex-1 py-2 text-sm font-medium bg-white text-zinc-600 hover:bg-zinc-50 transition-colors"
              }
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {useGradient && (
        <div className="space-y-3 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
          <div className="flex rounded-lg overflow-hidden border border-zinc-200">
            <button
              onClick={() => setGradient({ ...gradient, type: "linear" })}
              className={gradient.type === "linear" ? "flex-1 py-1.5 text-xs font-medium bg-[#11853a] text-white" : "flex-1 py-1.5 text-xs font-medium bg-white text-zinc-600"}
            >
              Linear
            </button>
            <button
              onClick={() => setGradient({ ...gradient, type: "radial" })}
              className={gradient.type === "radial" ? "flex-1 py-1.5 text-xs font-medium bg-[#11853a] text-white" : "flex-1 py-1.5 text-xs font-medium bg-white text-zinc-600"}
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

          <div className="space-y-2">
            <label className="block text-xs font-medium text-zinc-600">Colors</label>
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
                  className="w-9 h-9 rounded-lg border border-zinc-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => {
                    const colors = [...gradient.colors];
                    colors[i] = e.target.value;
                    setGradient({ ...gradient, colors });
                  }}
                  className="flex-1 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-zinc-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#1db954]"
                />
                {gradient.colors.length > 2 && (
                  <button
                    onClick={() => {
                      const colors = gradient.colors.filter((_, j) => j !== i);
                      setGradient({ ...gradient, colors });
                    }}
                    className="w-9 h-9 flex items-center justify-center text-zinc-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    aria-label="Remove color"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {gradient.colors.length < 3 && (
              <button
                onClick={() => setGradient({ ...gradient, colors: [...gradient.colors, "#ffffff"] })}
                className="text-xs text-[#11853a] hover:text-[#12883b] font-medium"
              >
                + Add color
              </button>
            )}
          </div>
        </div>
      )}

      {useBlur && images.length > 0 && (
        <div className="space-y-3 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">Source Artwork</label>
            <select
              value={blurImageIndex}
              onChange={(e) => setBlurImageIndex(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1db954]"
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
    </>
  );

  const artworkScaleSection = (
    <div>
      <label className="block text-xs font-medium text-zinc-600 mb-2">
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
      <p className="text-xs text-zinc-500 mt-1">Zoom in/out on album artwork</p>
    </div>
  );

  const resolutionSection = (
    <>
      <div>
        <label className="block text-xs font-medium text-zinc-600 mb-2">Resolution</label>
        <div className="flex rounded-lg overflow-hidden border border-zinc-200">
          {Object.entries(RESOLUTIONS).map(([key, res]) => (
            <button
              key={key}
              onClick={() => {
                setResolution(key as ResolutionKey);
                setUseCustom(false);
              }}
              className={
                !useCustom && resolution === key
                  ? "flex-1 py-2 text-sm font-medium bg-[#11853a] text-white transition-colors"
                  : "flex-1 py-2 text-sm font-medium bg-white text-zinc-600 hover:bg-zinc-50 transition-colors"
              }
            >
              {res.label}
            </button>
          ))}
          <button
            onClick={() => setUseCustom(true)}
            className={
              useCustom
                ? "flex-1 py-2 text-sm font-medium bg-[#11853a] text-white transition-colors"
                : "flex-1 py-2 text-sm font-medium bg-white text-zinc-600 hover:bg-zinc-50 transition-colors"
            }
          >
            Custom
          </button>
        </div>
      </div>

      {useCustom && (
        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
          <input
            type="number"
            value={customWidth}
            onChange={(e) => setCustomWidth(e.target.value)}
            placeholder="Width"
            className="w-full min-w-0 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1db954]"
          />
          <span className="text-zinc-500">×</span>
          <input
            type="number"
            value={customHeight}
            onChange={(e) => setCustomHeight(e.target.value)}
            placeholder="Height"
            className="w-full min-w-0 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1db954]"
          />
        </div>
      )}
    </>
  );

  const spacingSection = (
    <div>
      <label className="block text-xs font-medium text-zinc-600 mb-2">
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
  );

  const borderRadiusSection = (
    <div>
      <label className="block text-xs font-medium text-zinc-600 mb-2">
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
  );

  const templateDef = getTemplate(template);

  const templateSection = (
    <>
      <div>
        <label className="block text-xs font-medium text-zinc-600 mb-2">
          Template
        </label>
        <TemplateSelector value={template} onChange={setTemplate} />
      </div>

      {templateDef.settings.length > 0 && (
        <div className="space-y-3 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
          {templateDef.settings.map((def) => {
            const val = templateSettings[def.key] ?? def.defaultValue;
            const isToggle = def.min === 0 && def.max === 1 && def.step === 1;
            return (
              <div key={def.key}>
                {isToggle ? (
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-zinc-600">
                      {def.label}
                    </label>
                    <button
                      onClick={() =>
                        setTemplateSettings({
                          ...templateSettings,
                          [def.key]: val > 0.5 ? 0 : 1,
                        })
                      }
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                        val > 0.5
                          ? "bg-[#11853a] text-white"
                          : "bg-zinc-200 text-zinc-600"
                      }`}
                    >
                      {val > 0.5 ? "On" : "Off"}
                    </button>
                  </div>
                ) : (
                  <>
                    <label className="block text-xs text-zinc-600 mb-1">
                      {def.label}: {val}
                      {def.unit ?? ""}
                    </label>
                    <input
                      type="range"
                      min={def.min}
                      max={def.max}
                      step={def.step}
                      value={val}
                      onChange={(e) =>
                        setTemplateSettings({
                          ...templateSettings,
                          [def.key]: Number(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </>
                )}
              </div>
            );
          })}
          <button
            onClick={() => setTemplateSettings(defaultTemplateSettings(template))}
            className="text-xs text-zinc-500 hover:text-zinc-900 font-medium"
          >
            Reset settings
          </button>
        </div>
      )}
    </>
  );

  const effectsSection = <EffectsPanel effects={effects} onChange={setEffects} />;

  const showTitleSection = (
    <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-200">
      <input
        type="checkbox"
        id="show-title"
        checked={showTitle}
        onChange={(e) => setShowTitle(e.target.checked)}
        className="w-4 h-4 rounded border-zinc-300 text-[#11853a] focus:ring-[#1db954]"
      />
      <label htmlFor="show-title" className="text-sm text-zinc-700 cursor-pointer">
        Show playlist title on wallpaper
      </label>
    </div>
  );

  const textSection = showTitle && (
    <TextSettings textStyle={textStyle} onChange={setTextStyle} />
  );

  const tabSections = (
    <div className="space-y-5">
      <div
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {activeTab === "background" && (
          <>
            {themeSection}
            {backgroundSection}
            {artworkScaleSection}
          </>
        )}
        {activeTab === "layout" && (
          <>
            {templateSection}
            {resolutionSection}
            {spacingSection}
            {borderRadiusSection}
          </>
        )}
        {activeTab === "effects" && effectsSection}
        {activeTab === "text" && (
          <>
            {showTitleSection}
            {textSection}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl p-5 card-shadow-lg space-y-5">
      <h2 className="text-lg font-bold text-zinc-900">Customize</h2>

      {/* Pagination tabs */}
      <div
        role="tablist"
        aria-label="Wallpaper settings"
        className="flex rounded-lg overflow-hidden border border-zinc-200"
      >
        {TABS.map((tab, index) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
            className={
              activeTab === tab.id
                ? "flex-1 py-2 text-xs sm:text-sm font-medium bg-[#11853a] text-white transition-colors"
                : "flex-1 py-2 text-xs sm:text-sm font-medium bg-white text-zinc-600 hover:bg-zinc-50 transition-colors"
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabSections}

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        className="w-full py-3 px-4 bg-[#11853a] hover:bg-[#12883b] text-white font-semibold rounded-lg transition-all duration-200 btn-press"
      >
        Generate Wallpaper
      </button>

      <button
        onClick={onReset}
        className="w-full text-xs text-zinc-500 hover:text-zinc-900 font-medium transition-colors"
      >
        Reset all settings
      </button>
    </div>
  );
}
