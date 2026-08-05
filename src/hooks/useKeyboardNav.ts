"use client";

import { useEffect, useRef } from "react";

export type KeyHandler = (event: KeyboardEvent) => void;
export type KeyMap = Partial<Record<string, KeyHandler>>;

/**
 * Attaches a document-level keydown listener while `active` is true and
 * dispatches to the handler registered for the pressed key (e.g. "Escape",
 * "ArrowRight"). Handlers are stored in a ref so the listener stays stable
 * across re-renders.
 */
export function useKeyboardNav(active: boolean, handlers: KeyMap): void {
  const handlersRef = useRef<KeyMap>(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => {
      handlersRef.current[event.key]?.(event);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [active]);
}
