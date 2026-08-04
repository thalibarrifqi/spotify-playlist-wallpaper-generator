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
  const renderKey = `${width}x${height}${showTitle ? "-title" : ""}-s${spacing}-r${borderRadius}-bg${backgroundColor}-g${gradient?.type || "none"}-blur${blur || false}`;
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
  }, [images, width, height, renderKey, showTitle, playlistName, spacing, borderRadius, backgroundColor, titleBarColor, titleTextColor, gradient, blur, blurIntensity, blurImageIndex]);

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
  }, [playlistName, renderKey, width, height, dpiMultiplier, images, showTitle, spacing, borderRadius, backgroundColor, titleBarColor, titleTextColor, gradient, blur, blurIntensity, blurImageIndex]);

  return (
    <div className="space-y-4">
      {rendering && (
        <div className="py-10 text-center text-zinc-500">
          Generating wallpaper...
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <canvas
        key={`${width}x${height}`}
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full object-contain rounded-lg border border-zinc-400"
        style={{ backgroundColor, aspectRatio: `${width} / ${height}` }}
      />

      {showDownload && (
        <div>
          <label className="block text-xs text-zinc-600 mb-1">Export Quality</label>
          <div className="flex rounded-lg overflow-hidden border border-zinc-300">
            {([1, 2, 3] as const).map((dpi) => (
              <button
                key={dpi}
                onClick={() => setDpiMultiplier(dpi)}
                className={
                  dpiMultiplier === dpi
                    ? "flex-1 py-2 text-sm font-medium bg-blue-600 text-white"
                    : "flex-1 py-2 text-sm font-medium bg-white text-zinc-600 hover:bg-zinc-100"
                }
              >
                {dpi}x
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            {dpiMultiplier === 1 && "Screen quality"}
            {dpiMultiplier === 2 && "High-res screens"}
            {dpiMultiplier === 3 && "Print quality (300 DPI)"}
          </p>
        </div>
      )}

      <div className="flex gap-2">
        {showReshuffle && (
          <button
            onClick={onReshuffle}
            disabled={rendering}
            className="flex-1 py-3 px-4 bg-zinc-600 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reshuffle
          </button>
        )}
        {showDownload && (
          <button
            onClick={handleDownload}
            disabled={rendering}
            className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download {dpiMultiplier > 1 ? `(${dpiMultiplier}x)` : ""}
          </button>
        )}
      </div>
    </div>
  );
}
