# Contributing

Thanks for helping with the Spotify Wallpaper Generator. This project ships in small, self-contained sprints; please follow the same pattern.

## Project layout

- **Next.js 16** app router (see `node_modules/next/dist/docs/` for the version-specific docs — this Next.js has breaking changes).
- **React 19**, **Tailwind CSS v4**, **TypeScript**.
- **vitest** for tests (pure-function tests in a node environment; hook tests use a per-file `@vitest-environment jsdom`).
- Playwright for headless-browser verification.

## Setup

```bash
npm install
cp .env.example .env.local   # add your Spotify App credentials
npm run dev                  # http://localhost:3000
```

The real Spotify API is unreachable in offline/CI sandboxes — mock it with a Playwright route interception:

```js
await page.route("**/api/playlist*", (route) =>
  route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(MOCK) })
);
```

## Checks

Run all three before opening a PR:

```bash
npm test       # unit tests (vitest)
npm run lint   # ESLint — must be 0 errors, 0 warnings
npm run build  # production build (type-check + Next.js build)
```

Headless verification for UI flows lives as one-off Playwright scripts (see `docs/performance.md` and `docs/accessibility.md` for the existing ones).

## Conventions

- **No code comments unless asked**; keep naming self-explanatory.
- Canvas rendering is split so it runs **DOM-free** (`src/lib/wallpaper/canvas-core.ts` is shared by the main thread and the export worker). Keep DOM access in the environments (`render.ts`) or the worker, not in the core.
- Push rendering/encoding work off the main thread where reasonable (see `src/lib/wallpaper/worker.ts`).
- Keep components accessible: labels on interactive elements, keyboard navigation, focus management, live regions for state changes, `prefers-reduced-motion` support, AA contrast.
- **Do not add features that redistribute copyrighted album artwork.** Social sharing and public galleries were deliberately dropped for this reason; user-local history/export is the boundary.

## Legal boundary

- Storing the user's generated wallpaper **in their own browser** (history/export) is fine.
- Sharing, publishing, or otherwise redistributing Spotify album artwork beyond the user's own device is **out of scope** and has been rejected in past sprints.

## Process

1. Update/extend the sprint plan in `docs/sprints/`.
2. Implement + test + verify headlessly.
3. Write the sprint review in `docs/sprints/`, update `docs/project-status.md` and `README.md`.
4. Commit with a `Sprint N: <Title>` message.

## Reporting issues

Open an issue with: the URL type used, browser + OS, and the exact steps. Include the console output if the error is visible in DevTools.
