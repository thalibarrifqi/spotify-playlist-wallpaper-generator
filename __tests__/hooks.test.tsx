// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import type { ReactNode } from "react";
import { useReducedMotion } from "../src/hooks/useReducedMotion";
import { useKeyboardNav } from "../src/hooks/useKeyboardNav";

type MatchMediaListener = (event: { matches: boolean }) => void;

function mockMatchMedia(initialMatches: boolean) {
  const listeners = new Set<MatchMediaListener>();
  const mql = {
    matches: initialMatches,
    addEventListener: vi.fn((_: string, cb: MatchMediaListener) => {
      listeners.add(cb);
    }),
    removeEventListener: vi.fn((_: string, cb: MatchMediaListener) => {
      listeners.delete(cb);
    }),
  };
  window.matchMedia = vi.fn().mockReturnValue(mql);
  return {
    mql,
    fire(matches: boolean) {
      mql.matches = matches;
      for (const cb of listeners) cb({ matches });
    },
  };
}

function renderHook(useHook: () => unknown) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const result: { current: unknown } = { current: undefined };

  function TestComponent() {
    result.current = useHook();
    return null as ReactNode;
  }

  act(() => {
    root.render(<TestComponent />);
  });

  return {
    result,
    rerender() {
      act(() => {
        root.render(<TestComponent />);
      });
    },
    unmount() {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

describe("useReducedMotion", () => {
  beforeEach(() => {
    window.matchMedia = undefined as unknown as typeof window.matchMedia;
  });

  it("returns false when matchMedia is unavailable", () => {
    const { result, unmount } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
    unmount();
  });

  it("returns false when the user does not prefer reduced motion", () => {
    mockMatchMedia(false);
    const { result, unmount } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
    unmount();
  });

  it("returns true when the user prefers reduced motion", () => {
    mockMatchMedia(true);
    const { result, unmount } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
    unmount();
  });

  it("updates live when the preference changes", () => {
    const mm = mockMatchMedia(false);
    const { result, rerender, unmount } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    act(() => mm.fire(true));
    rerender();
    expect(result.current).toBe(true);

    act(() => mm.fire(false));
    rerender();
    expect(result.current).toBe(false);
    unmount();
  });

  it("removes the change listener on unmount", () => {
    const mm = mockMatchMedia(false);
    const { unmount } = renderHook(() => useReducedMotion());
    expect(mm.mql.addEventListener).toHaveBeenCalled();
    unmount();
    expect(mm.mql.removeEventListener).toHaveBeenCalled();
  });
});

describe("useKeyboardNav", () => {
  it("calls the handler for a matching key", () => {
    const onEscape = vi.fn();
    const { unmount } = renderHook(() =>
      useKeyboardNav(true, { Escape: onEscape })
    );
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(onEscape).toHaveBeenCalledTimes(1);
    unmount();
  });

  it("ignores keys without a handler", () => {
    const onEscape = vi.fn();
    const { unmount } = renderHook(() =>
      useKeyboardNav(true, { Escape: onEscape })
    );
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    });
    expect(onEscape).not.toHaveBeenCalled();
    unmount();
  });

  it("does not listen while inactive", () => {
    const onEscape = vi.fn();
    const { unmount } = renderHook(() =>
      useKeyboardNav(false, { Escape: onEscape })
    );
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(onEscape).not.toHaveBeenCalled();
    unmount();
  });

  it("uses the latest handlers on re-render", () => {
    const first = vi.fn();
    const second = vi.fn();
    let handlers: Record<string, () => void> = { Escape: first };
    const { rerender, unmount } = renderHook(() => useKeyboardNav(true, handlers));
    handlers = { Escape: second };
    rerender();
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
    unmount();
  });

  it("removes the document listener on unmount", () => {
    const onEscape = vi.fn();
    const { unmount } = renderHook(() =>
      useKeyboardNav(true, { Escape: onEscape })
    );
    unmount();
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(onEscape).not.toHaveBeenCalled();
  });
});
