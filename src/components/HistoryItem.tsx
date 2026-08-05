"use client";

import Image from "next/image";
import type { HistoryEntry } from "@/lib/history";

interface HistoryItemProps {
  entry: HistoryEntry;
  onRestore: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryItem({
  entry,
  onRestore,
  onDelete,
}: HistoryItemProps) {
  return (
    <div className="flex gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-200 hover:border-zinc-300 transition-colors">
      {entry.thumbnail ? (
        <Image
          src={entry.thumbnail}
          alt={`${entry.playlistName} wallpaper thumbnail`}
          width={56}
          height={56}
          unoptimized
          className="w-14 h-14 object-cover rounded-md border border-zinc-200 shrink-0"
        />
      ) : (
        <div
          aria-hidden="true"
          className="w-14 h-14 rounded-md border border-zinc-200 shrink-0 bg-zinc-200 flex items-center justify-center text-zinc-500"
        >
          ♪
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-900 truncate">
          {entry.playlistName}
        </p>
        <p className="text-xs text-zinc-500">{formatDate(entry.createdAt)}</p>
        <div className="mt-1 flex gap-2">
          <button
            onClick={() => onRestore(entry)}
            className="text-xs text-[#11853a] hover:text-[#12883b] font-medium"
          >
            Restore
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="text-xs text-zinc-500 hover:text-red-500 font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
