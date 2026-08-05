import type { WallpaperConfig } from "./types";

interface PendingRequest {
  resolve: (blob: Blob) => void;
  reject: (error: Error) => void;
}

interface WorkerMessage {
  id: number;
  blob?: Blob;
  error?: string;
}

let worker: Worker | null = null;
let nextId = 1;
const pending = new Map<number, PendingRequest>();

export function supportsOffscreenWorker(): boolean {
  return (
    typeof Worker !== "undefined" && typeof OffscreenCanvas !== "undefined"
  );
}

function getWorker(): Worker {
  if (worker) return worker;

  worker = new Worker(
    new URL("../../workers/canvas.worker.ts", import.meta.url)
  );

  worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
    const { id, blob, error } = event.data;
    const entry = pending.get(id);
    if (!entry) return;
    pending.delete(id);
    if (error) {
      entry.reject(new Error(error));
    } else if (blob) {
      entry.resolve(blob);
    } else {
      entry.reject(new Error("Worker returned no result"));
    }
  };

  worker.onerror = (event) => {
    const error = new Error(event.message || "Wallpaper worker failed");
    for (const [, entry] of pending) {
      entry.reject(error);
    }
    pending.clear();
    worker = null;
  };

  return worker;
}

/**
 * Renders a wallpaper to a PNG blob in a Web Worker using OffscreenCanvas,
 * keeping the main thread responsive during 2x/3x exports. Rejects on any
 * worker error so callers can fall back to the main-thread renderer.
 */
export function exportWallpaperInWorker(
  config: WallpaperConfig,
  urls: string[]
): Promise<Blob> {
  const w = getWorker();
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    w.postMessage({
      id,
      urls,
      width: config.width,
      height: config.height,
      config,
    });
  });
}
