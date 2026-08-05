# Accessibility

Sprint 14 (Performance & Accessibility) — WCAG 2.1 AA improvements shipped across the wizard.

## What Was Added

### Structure & Navigation
- **Skip link** (`src/components/SkipLink.tsx`) — "Skip to main content" is the first tab stop in the wizard; it targets `#main-content` and moves keyboard/screen-reader focus to the main region.
- **Focus management** — `<main id="main-content" tabIndex={-1}>` receives focus on every wizard step change, so keyboard users land predictably on the new step. Focus is intentionally suppressed from the visual ring on `main` (it only ever gets programmatic focus).

### Keyboard Navigation
- **Settings tabs** — the Background/Layout/Effects/Text pagination is now a proper ARIA `tablist`/`tab` pattern: `aria-selected`, `aria-controls`/`aria-labelledby`, roving `tabIndex`, and **Arrow Left/Right + Home/End** navigation.
- **History drawer** — `role="dialog"` with `aria-modal`: on open, focus moves into the drawer; `Tab`/`Shift+Tab` are trapped; **Escape** closes; focus returns to the "History" trigger on close.
- All existing controls already reachable by Tab/Enter; the full wizard is navigable keyboard-only (verified headlessly).

### Screen Reader Announcements
- **Live regions** (`src/components/LiveRegion.tsx`, `role="status"`/`role="alert"`) announce wizard step changes and export/download state ("Preparing your wallpaper download", "Download started").
- The preview container exposes `aria-busy` while rendering; the canvas has an `aria-label`; the "Generating…" spinner is accompanied by live text.
- Error messages already use `role="alert"`; fetch button + download + reshuffle buttons have descriptive `aria-label`s.

### ARIA Audit
- `aria-haspopup="dialog"` on the History trigger; `aria-pressed` on export-quality buttons; template picker already had `aria-pressed` + `aria-label`; effect/color pickers already labeled.
- Empty history thumbnails render a decorative placeholder (`aria-hidden`) instead of an empty image.

### Focus Visibility
- Global `*:focus-visible` outline (2px Spotify green + offset) covers all interactive elements; input/select focus rings were already present.

### Motion & Contrast
- **`prefers-reduced-motion`** — a global CSS guard collapses all animation/transition durations to ~0ms (keyframes and `animate-*` utilities are respected) and the history drawer's slide-in is skipped via `useReducedMotion()` in JS.
- **Contrast** — helper text on light surfaces bumped from `zinc-400` (~2.5:1) to `zinc-500` (~4.7:1) to meet AA (4.5:1) for normal text.

## New Hooks (unit-tested)

- `src/hooks/useReducedMotion.ts` — live `prefers-reduced-motion` state (init from `matchMedia`, subscribes to changes, SSR-safe).
- `src/hooks/useKeyboardNav.ts` — stable document-level key listener gated by an `active` flag, dispatching to per-key handlers.

## Verification

- Keyboard-only walkthrough of the full wizard (skip link → URL → step 2 → tablist arrows → generate → step 4) headlessly in Chromium.
- Escape-to-close + focus restore on the history drawer.
- `reducedMotion: "reduce"` emulation: media query matches, drawer animation class omitted.
- Lazy thumbnails load with `decoding="async"` and no JS errors.
- 10 new unit tests for the two hooks (jsdom); 411 total passing; lint + build clean.

## Out of Scope (from plan)

- Automated screen-reader testing and full AAA compliance.
- Voice control support.
