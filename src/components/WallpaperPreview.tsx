"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { drawWallpaper } from "@/lib/wallpaper/render";
import { RESOLUTIONS } from "@/lib/wallpaper/types";
import type { AlbumImage, ResolutionKey } from "@/lib/wallpaper/types";

interface WallpaperPreviewProps {
  images: AlbumImage[];
  playlistName: string;
  resolution: ResolutionKey;
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
}: WallpaperPreviewProps) {
  const [status, setStatus] = useState<{ key: string; error: string } | null>(
    null
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { width, height } = RESOLUTIONS[resolution];
  const renderKey = `${width}x${height}`;
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
  }, [images, width, height, renderKey]);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
  }, [playlistName, renderKey]);

  return (
    <div className="space-y-4">
      {rendering && (
        <div className="py-10 text-center text-zinc-400">
          Generating wallpaper...
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full max-h-[70vh] object-contain rounded-lg border border-zinc-700 bg-black"
      />

      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          disabled={rendering}
          className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Download Wallpaper
        </button>
      </div>
    </div>
  );
}
