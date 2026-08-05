"use client";

import { FONT_WEIGHTS, WALLPAPER_FONTS, getFont } from "@/lib/wallpaper/fonts";
import {
  FONT_SIZE_PRESETS,
  SHADOW_COLOR_PRESETS,
  STROKE_COLOR_PRESETS,
  TEXT_COLOR_PRESETS,
} from "@/lib/wallpaper/text-layout";
import type { TextPosition, TextStyle } from "@/lib/wallpaper/types";

interface TextSettingsProps {
  textStyle: TextStyle;
  onChange: (textStyle: TextStyle) => void;
}

const POSITIONS: TextPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

const DOT_POSITION: Record<string, string> = {
  "left-top": "left-1.5 top-1.5",
  "center-top": "left-1/2 top-1.5 -translate-x-1/2",
  "right-top": "right-1.5 top-1.5",
  "left-bottom": "left-1.5 bottom-1.5",
  "center-bottom": "left-1/2 bottom-1.5 -translate-x-1/2",
  "right-bottom": "right-1.5 bottom-1.5",
};

const WEIGHT_LABELS: Record<number, string> = {
  400: "Regular",
  500: "Medium",
  700: "Bold",
};

function hexOrFallback(value: string, fallback: string): string {
  return /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
}

function fontFamilyStyle(cssVariable: string | undefined, family: string) {
  return cssVariable ? `var(${cssVariable}), ${family}` : family;
}

function ColorSwatches({
  colors,
  value,
  onSelect,
}: {
  colors: string[];
  value: string;
  onSelect: (color: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onSelect(color)}
          className={`w-7 h-7 rounded-full border transition-transform hover:scale-110 ${
            value === color
              ? "border-[#1db954] ring-2 ring-[#1db954]/40"
              : "border-zinc-200"
          }`}
          style={{ backgroundColor: color }}
          aria-label={`Color ${color}`}
        />
      ))}
      <input
        type="color"
        value={hexOrFallback(value, "#ffffff")}
        onChange={(e) => onSelect(e.target.value)}
        className="w-7 h-7 rounded-full border border-zinc-200 cursor-pointer bg-white p-0"
        aria-label="Custom color"
      />
    </div>
  );
}

function PositionPicker({
  value,
  onChange,
}: {
  value: TextPosition;
  onChange: (position: TextPosition) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {POSITIONS.map((position) => {
        const col = position.endsWith("left")
          ? "left"
          : position.endsWith("right")
            ? "right"
            : "center";
        const row = position.startsWith("top") ? "top" : "bottom";
        const dotClass = DOT_POSITION[`${col}-${row}`];
        return (
          <button
            key={position}
            onClick={() => onChange(position)}
            className={`relative h-12 rounded-lg border transition-colors ${
              value === position
                ? "border-[#1db954] bg-[#1db954]/10"
                : "border-zinc-200 bg-white hover:bg-zinc-100"
            }`}
            aria-label={`Position ${position}`}
            aria-pressed={value === position}
          >
            <span
              className={`absolute w-2 h-2 rounded-full ${
                value === position ? "bg-[#1db954]" : "bg-zinc-400"
              } ${dotClass}`}
            />
          </button>
        );
      })}
    </div>
  );
}

export default function TextSettings({ textStyle, onChange }: TextSettingsProps) {
  const update = (patch: Partial<TextStyle>) =>
    onChange({ ...textStyle, ...patch });

  const font = getFont(textStyle.fontFamilyId) ?? WALLPAPER_FONTS[0];

  return (
    <div className="space-y-4 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
      <h3 className="text-sm font-bold text-zinc-900">Text Style</h3>

      {/* Font */}
      <div>
        <label className="block text-xs font-medium text-zinc-600 mb-2">
          Font
        </label>
        <select
          value={textStyle.fontFamilyId}
          onChange={(e) => update({ fontFamilyId: e.target.value })}
          className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1db954]"
        >
          {WALLPAPER_FONTS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
        <div
          className="mt-2 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 text-base truncate"
          style={{
            fontFamily: fontFamilyStyle(font.cssVariable, font.family),
            fontWeight: textStyle.fontWeight,
          }}
          aria-hidden="true"
        >
          Playlist Title
        </div>
      </div>

      {/* Font weight */}
      <div>
        <label className="block text-xs font-medium text-zinc-600 mb-2">
          Weight
        </label>
        <div className="flex rounded-lg overflow-hidden border border-zinc-200">
          {FONT_WEIGHTS.map((weight) => (
            <button
              key={weight}
              onClick={() => update({ fontWeight: weight })}
              className={
                textStyle.fontWeight === weight
                  ? "flex-1 py-1.5 text-xs font-medium bg-[#1db954] text-white transition-colors"
                  : "flex-1 py-1.5 text-xs font-medium bg-white text-zinc-600 hover:bg-zinc-50 transition-colors"
              }
            >
              {WEIGHT_LABELS[weight]}
            </button>
          ))}
        </div>
      </div>

      {/* Font size */}
      <div>
        <label className="block text-xs font-medium text-zinc-600 mb-2">
          Size
        </label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {FONT_SIZE_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => update({ fontSize: preset.value })}
              className={
                textStyle.fontSize === preset.value
                  ? "px-3 py-1.5 text-xs font-medium bg-[#1db954] text-white rounded-lg transition-all duration-150"
                  : "px-3 py-1.5 text-xs font-medium bg-white text-zinc-600 border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors"
              }
            >
              {preset.label}
            </button>
          ))}
        </div>
        <label className="block text-xs text-zinc-600 mb-1">
          Font Size: {textStyle.fontSize}px
        </label>
        <input
          type="range"
          min={16}
          max={80}
          value={textStyle.fontSize}
          onChange={(e) => update({ fontSize: Number(e.target.value) })}
          className="w-full"
        />
        <p className="text-xs text-zinc-500 mt-1">
          Scales automatically to match the wallpaper resolution
        </p>
      </div>

      {/* Position */}
      <div>
        <label className="block text-xs font-medium text-zinc-600 mb-2">
          Position
        </label>
        <PositionPicker
          value={textStyle.position}
          onChange={(position) => update({ position })}
        />
        <div className="mt-2">
          <label className="block text-xs text-zinc-600 mb-1">
            Padding: {textStyle.padding}px
          </label>
          <input
            type="range"
            min={8}
            max={80}
            value={textStyle.padding}
            onChange={(e) => update({ padding: Number(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>

      {/* Text color */}
      <div>
        <label className="block text-xs font-medium text-zinc-600 mb-2">
          Text Color
        </label>
        <ColorSwatches
          colors={TEXT_COLOR_PRESETS}
          value={textStyle.color}
          onSelect={(color) => update({ color })}
        />
      </div>

      {/* Stroke */}
      <div>
        <label className="block text-xs text-zinc-600 mb-1">
          Outline Width: {textStyle.strokeWidth}px
        </label>
        <input
          type="range"
          min={0}
          max={5}
          step={0.5}
          value={textStyle.strokeWidth}
          onChange={(e) => update({ strokeWidth: Number(e.target.value) })}
          className="w-full"
        />
        {textStyle.strokeWidth > 0 && (
          <div className="mt-2">
            <label className="block text-xs font-medium text-zinc-600 mb-2">
              Outline Color
            </label>
            <ColorSwatches
              colors={STROKE_COLOR_PRESETS}
              value={textStyle.strokeColor}
              onSelect={(strokeColor) => update({ strokeColor })}
            />
          </div>
        )}
      </div>

      {/* Shadow */}
      <div>
        <label className="block text-xs text-zinc-600 mb-1">
          Shadow Blur: {textStyle.shadow.blur}px
        </label>
        <input
          type="range"
          min={0}
          max={20}
          value={textStyle.shadow.blur}
          onChange={(e) =>
            update({ shadow: { ...textStyle.shadow, blur: Number(e.target.value) } })
          }
          className="w-full"
        />
        <div className="mt-2">
          <label className="block text-xs font-medium text-zinc-600 mb-2">
            Shadow Color
          </label>
          <ColorSwatches
            colors={SHADOW_COLOR_PRESETS}
            value={textStyle.shadow.color}
            onSelect={(color) => update({ shadow: { ...textStyle.shadow, color } })}
          />
        </div>
      </div>

      {/* Background strip */}
      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-zinc-200">
        <input
          type="checkbox"
          id="text-background"
          checked={textStyle.showBackground}
          onChange={(e) => update({ showBackground: e.target.checked })}
          className="w-4 h-4 rounded border-zinc-300 text-[#1db954] focus:ring-[#1db954]"
        />
        <label htmlFor="text-background" className="text-sm text-zinc-700 cursor-pointer">
          Background strip behind text
        </label>
      </div>
      {textStyle.showBackground && (
        <div>
          <label className="block text-xs text-zinc-600 mb-1">
            Background Opacity: {textStyle.backgroundOpacity}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={textStyle.backgroundOpacity}
            onChange={(e) => update({ backgroundOpacity: Number(e.target.value) })}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}
