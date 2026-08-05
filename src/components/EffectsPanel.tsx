"use client";

import { DEFAULT_EFFECTS, effectsEqual } from "@/lib/wallpaper/effects";
import { EFFECT_PRESETS } from "@/lib/wallpaper/presets";
import type { WallpaperEffects } from "@/lib/wallpaper/types";

interface EffectsPanelProps {
  effects: WallpaperEffects;
  onChange: (effects: WallpaperEffects) => void;
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-zinc-200">
      <input
        type="checkbox"
        id={`effect-${label.toLowerCase().replace(/\s+/g, "-")}`}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-zinc-300 text-[#1db954] focus:ring-[#1db954]"
      />
      <label
        htmlFor={`effect-${label.toLowerCase().replace(/\s+/g, "-")}`}
        className="text-sm text-zinc-700 cursor-pointer"
      >
        {label}
      </label>
    </div>
  );
}

export default function EffectsPanel({ effects, onChange }: EffectsPanelProps) {
  const update = (patch: Partial<WallpaperEffects>) =>
    onChange({ ...effects, ...patch });

  const formatPercent = (value: number) =>
    value >= 0 ? `+${value}%` : `${value}%`;

  return (
    <div className="space-y-4 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
      <h3 className="text-sm font-bold text-zinc-900">Image Effects</h3>

      {/* Presets */}
      <div>
        <label className="block text-xs font-medium text-zinc-600 mb-2">
          Presets
        </label>
        <div className="flex flex-wrap gap-1.5">
          {EFFECT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onChange(preset.effects)}
              className={
                effectsEqual(effects, preset.effects)
                  ? "px-3 py-1.5 text-xs font-medium bg-[#1db954] text-white rounded-lg transition-all duration-150"
                  : "px-3 py-1.5 text-xs font-medium bg-white text-zinc-600 border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors"
              }
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Brightness */}
      <div>
        <label className="block text-xs text-zinc-600 mb-1">
          Brightness: {formatPercent(effects.brightness)}
        </label>
        <input
          type="range"
          min={-100}
          max={100}
          value={effects.brightness}
          onChange={(e) => update({ brightness: Number(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Contrast */}
      <div>
        <label className="block text-xs text-zinc-600 mb-1">
          Contrast: {formatPercent(effects.contrast)}
        </label>
        <input
          type="range"
          min={-100}
          max={100}
          value={effects.contrast}
          onChange={(e) => update({ contrast: Number(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Saturation */}
      <div>
        <label className="block text-xs text-zinc-600 mb-1">
          Saturation: {formatPercent(effects.saturation)}
        </label>
        <input
          type="range"
          min={-100}
          max={100}
          value={effects.saturation}
          onChange={(e) => update({ saturation: Number(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Blur */}
      <div>
        <label className="block text-xs text-zinc-600 mb-1">
          Blur: {effects.blur}px
        </label>
        <input
          type="range"
          min={0}
          max={10}
          step={0.5}
          value={effects.blur}
          onChange={(e) => update({ blur: Number(e.target.value) })}
          className="w-full"
        />
        <p className="text-xs text-zinc-400 mt-1">Artistic dreamy blur</p>
      </div>

      {/* Color toggles */}
      <div className="space-y-2">
        <ToggleRow
          label="Grayscale"
          checked={effects.grayscale}
          onChange={(grayscale) => update({ grayscale })}
        />
        <ToggleRow
          label="Sepia"
          checked={effects.sepia}
          onChange={(sepia) => update({ sepia })}
        />
        <ToggleRow
          label="Invert colors"
          checked={effects.invert}
          onChange={(invert) => update({ invert })}
        />
      </div>

      {/* Vignette */}
      <div className="space-y-2">
        <ToggleRow
          label="Vignette"
          checked={effects.vignette}
          onChange={(vignette) => update({ vignette })}
        />
        {effects.vignette && (
          <div>
            <label className="block text-xs text-zinc-600 mb-1">
              Vignette Intensity: {effects.vignetteIntensity}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={effects.vignetteIntensity}
              onChange={(e) =>
                update({ vignetteIntensity: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Noise */}
      <div className="space-y-2">
        <ToggleRow
          label="Noise / grain"
          checked={effects.noise}
          onChange={(noise) => update({ noise })}
        />
        {effects.noise && (
          <div>
            <label className="block text-xs text-zinc-600 mb-1">
              Grain Intensity: {effects.noiseIntensity}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={effects.noiseIntensity}
              onChange={(e) =>
                update({ noiseIntensity: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Reset */}
      <button
        onClick={() => onChange(DEFAULT_EFFECTS)}
        className="w-full py-2 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-medium rounded-lg transition-colors"
      >
        Reset Effects
      </button>
    </div>
  );
}
