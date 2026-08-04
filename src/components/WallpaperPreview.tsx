"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { drawWallpaper } from "@/lib/wallpaper/render";
import { RESOLUTIONS } from "@/lib/wallpaper/types";
import type { AlbumImage, GradientConfig, ResolutionKey } from "@/lib/wallpaper/types";

interface WallpaperPreviewProps {
  images: AlbumImage[];
  playlistName: string;
  resolution: ResolutionKey;
  customWidth?: number;
  customHeight?: number;
  showTitle: boolean;
  spacing: number;
  borderRadius: number;
  backgroundColor: string;
  titleBarColor?: string;
  titleTextColor?: string;
  gradient?: GradientConfig;
  blur?: boolean;
  blurIntensity?: number;
  blurImageIndex?: number;
  artworkScale?: number;
  showReshuffle?: boolean;
  showDownload?: boolean;
  onReshuffle: () => void;
}

function sanitizeFilename(name: string): string {
  return (
    name
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() || "wallpaper"
  );
}

export default function WallpaperPreview({
  images,
  playlistName,
  resolution,
  customWidth,
  customHeight,
  showTitle,
  spacing,
  borderRadius,
  backgroundColor,
  titleBarColor,
  titleTextColor,
  gradient,
  blur,
  blurIntensity,
  blurImageIndex,
  artworkScale = 1,
  showReshuffle = true,
  showDownload = true,
  onReshuffle,
}: WallpaperPreviewProps) {
  const [status, setStatus] = useState<{ key: string; error: string } | null>(
    null
  );
  const [dpiMultiplier, setDpiMultiplier] = useState<1 | 2 | 3>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { width: presetWidth, height: presetHeight } = RESOLUTIONS[resolution];
  const width = customWidth ?? presetWidth;
  const height = customHeight ?? presetHeight;
  const renderKey = `${width}x${height}${showTitle ? "-title" : ""}-s${spacing}-r${borderRadius}-bg${backgroundColor}-g${gradient?.type || "none"}-blur${blur || false}-scale${artworkScale}`;
  const current = status?.key === renderKey ? status : null;
  const rendering = current === null;
  const error = current?.error ?? "";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    const render = async () => {
      try {
        await drawWallpaper(images, canvas, {
          width,
          height,
          title: showTitle ? playlistName : undefined,
          spacing,
          borderRadius,
          backgroundColor,
          titleBarColor,
          titleTextColor,
          gradient,
          blur,
          blurIntensity,
          blurImageIndex,
          artworkScale,
        });
        if (cancelled) return;
        setStatus({ key: renderKey, error: "" });
      } catch (e) {
        if (cancelled) return;
        setStatus({
          key: renderKey,
          error:
            e instanceof Error
              ? e.message
              : "Failed to generate wallpaper",
        });
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [images, width, height, renderKey, showTitle, playlistName, spacing, borderRadius, backgroundColor, titleBarColor, titleTextColor, gradient, blur, blurIntensity, blurImageIndex, artworkScale]);

  const handleDownload = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (dpiMultiplier === 1) {
      canvas.toBlob((blob) => {
        if (!blob) {
          setStatus({ key: renderKey, error: "Failed to export image" });
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${sanitizeFilename(playlistName)}.png`;
        link.click();
        URL.revokeObjectURL(url);
      }, "image/png");
      return;
    }

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = width * dpiMultiplier;
    exportCanvas.height = height * dpiMultiplier;

    try {
      await drawWallpaper(images, exportCanvas, {
        width: width * dpiMultiplier,
        height: height * dpiMultiplier,
        title: showTitle ? playlistName : undefined,
        spacing: spacing * dpiMultiplier,
        borderRadius: borderRadius * dpiMultiplier,
        backgroundColor,
        titleBarColor,
        titleTextColor,
        gradient,
        blur,
        blurIntensity: blurIntensity ? blurIntensity * dpiMultiplier : undefined,
        blurImageIndex,
        artworkScale,
      });

      exportCanvas.toBlob((blob) => {
        if (!blob) {
          setStatus({ key: renderKey, error: "Failed to export image" });
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${sanitizeFilename(playlistName)}-${dpiMultiplier}x.png`;
        link.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    } catch {
      setStatus({ key: renderKey, error: "Failed to export high-res image" });
    }
  }, [playlistName, renderKey, width, height, dpiMultiplier, images, showTitle, spacing, borderRadius, backgroundColor, titleBarColor, titleTextColor, gradient, blur, blurIntensity, blurImageIndex, artworkScale]);

  return (
    <div className="bg-white rounded-xl p-5 card-shadow-lg space-y-4">
      <h2 className="text-lg font-bold text-zinc-900">Preview</h2>

      {/* Canvas */}
      <div className="relative">
        {rendering && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 rounded-lg z-10">
            <div className="text-center">
              <svg className="animate-spin-slow w-8 h-8 text-[#1db954] mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm text-zinc-500">Generating...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4" role="alert">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <canvas
          key={`${width}x${height}`}
          ref={canvasRef}
          width={width}
          height={height}
          className="w-full object-contain rounded-lg border border-zinc-200"
          style={{ backgroundColor, aspectRatio: `${width} / ${height}` }}
          aria-label={`Wallpaper preview for ${playlistName}`}
        />
      </div>

      {/* Export Quality */}
      {showDownload && (
        <div>
          <label className="block text-xs font-medium text-zinc-600 mb-2">Export Quality</label>
          <div className="flex rounded-lg overflow-hidden border border-zinc-200">
            {([1, 2, 3] as const).map((dpi) => (
              <button
                key={dpi}
                onClick={() => setDpiMultiplier(dpi)}
                className={
                  dpiMultiplier === dpi
                    ? "flex-1 py-2 text-sm font-medium bg-[#1db954] text-white transition-colors"
                    : "flex-1 py-2 text-sm font-medium bg-white text-zinc-600 hover:bg-zinc-50 transition-colors"
                }
              >
                {dpi}x
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {dpiMultiplier === 1 && "Screen quality"}
            {dpiMultiplier === 2 && "High-res screens"}
            {dpiMultiplier === 3 && "Print quality (300 DPI)"}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {showReshuffle && (
          <button
            onClick={onReshuffle}
            disabled={rendering}
            className="flex-1 py-3 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed btn-press"
            aria-label="Reshuffle artwork order"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reshuffle
            </span>
          </button>
        )}
        {showDownload && (
          <button
            onClick={handleDownload}
            disabled={rendering}
            className="flex-1 py-3 px-4 bg-[#1db954] hover:bg-[#1ed760] text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed btn-press"
            aria-label={`Download wallpaper${dpiMultiplier > 1 ? ` at ${dpiMultiplier}x quality` : ""}`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download {dpiMultiplier > 1 ? `(${dpiMultiplier}x)` : ""}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
