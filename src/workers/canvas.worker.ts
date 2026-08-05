import { drawWallpaperCore } from "@/lib/wallpaper/canvas-core";
import type { CanvasLike } from "@/lib/wallpaper/canvas-core";
import type { AlbumImage, WallpaperConfig } from "@/lib/wallpaper/types";

interface ExportMessage {
  id: number;
  urls: string[];
  width: number;
  height: number;
  config: WallpaperConfig;
}

interface ExportResult {
  id: number;
  blob?: Blob;
  error?: string;
}

const scope = self as unknown as {
  postMessage(message: ExportResult, transfer?: Transferable[]): void;
};

self.onmessage = (event: MessageEvent<ExportMessage>) => {
  const { id, urls, width, height, config } = event.data;

  const toAlbumImage = (url: string, index: number): AlbumImage => ({
    url,
    width: 0,
    height: 0,
    albumName: `Track ${index + 1}`,
  });

  const env = {
    loadImage: loadBitmap,
    createCanvas: (w: number, h: number) =>
      new OffscreenCanvas(w, h) as unknown as CanvasLike,
  };

  const offscreen = new OffscreenCanvas(width, height);
  const canvas = offscreen as unknown as CanvasLike;

  drawWallpaperCore(canvas, urls.map(toAlbumImage), config, env)
    .then(() => offscreen.convertToBlob({ type: "image/png" }))
    .then((blob) => {
      scope.postMessage({ id, blob });
    })
    .catch((error: unknown) => {
      scope.postMessage({
        id,
        error: error instanceof Error ? error.message : "Worker render failed",
      });
    });
};

async function loadBitmap(src: string): Promise<ImageBitmap> {
  const response = await fetch(src, { mode: "cors" });
  if (!response.ok) {
    throw new Error(`Failed to load image: ${src}`);
  }
  const blob = await response.blob();
  return createImageBitmap(blob);
}
