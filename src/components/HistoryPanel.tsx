"use client";

import { useEffect, useRef } from "react";
import type { HistoryEntry } from "@/lib/history";
import HistoryItem from "./HistoryItem";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface HistoryPanelProps {
  open: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onRestore: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onExport: () => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function HistoryPanel({
  open,
  onClose,
  history,
  onRestore,
  onDelete,
  onClear,
  onExport,
}: HistoryPanelProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const timer = window.setTimeout(() => {
      dialogRef.current?.focus();
    }, 0);
    return () => {
      window.clearTimeout(timer);
      restoreFocusRef.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;
    const focusables = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Wallpaper history"
      onKeyDown={handleKeyDown}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col outline-none ${
          prefersReducedMotion ? "" : "animate-slide-in"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200">
          <h2 className="text-lg font-bold text-zinc-900">History</h2>
          <button
            onClick={onClose}
            aria-label="Close history"
            className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-500 text-sm">
                No wallpapers yet. Generate one and it will appear here.
              </p>
            </div>
          ) : (
            history.map((entry) => (
              <HistoryItem
                key={entry.id}
                entry={entry}
                onRestore={onRestore}
                onDelete={onDelete}
              />
            ))
          )}
        </div>

        {history.length > 0 && (
          <div className="flex gap-3 p-4 border-t border-zinc-200">
            <button
              onClick={onExport}
              className="flex-1 py-2 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-medium rounded-lg transition-colors"
            >
              Export JSON
            </button>
            <button
              onClick={onClear}
              className="flex-1 py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors"
            >
              Clear history
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
