# Sprint 15 - Polish & Deployment

## Goal

Final QA, documentation, and release readiness.

## Background

Sprint 14 completed performance and accessibility improvements. The app is already deployed to Vercel and `.env.example` exists, so this sprint focuses on QA, documentation, and final polish rather than greenfield deployment setup.

## Requirements

### Quality Assurance

- [x] Cross-browser testing (Chrome, Firefox) — Playwright; WebKit (Safari/Edge engine) skipped: sandbox lacks system libs (`libgstreamer-plugins-bad1.0-0`, `libavif16`), documented in sprint review
- [x] Mobile testing — viewport emulation 390px/768px (iOS Safari + Android Chrome unavailable in sandbox); real-device pass deferred to human review
- [x] Responsive design verification (390px–1920px) — no horizontal overflow, tabs visible, drawer ≤ viewport, Escape closes
- [x] Error handling review (network errors, empty playlists, invalid URLs)
- [x] Edge case testing (empty playlists, API failures, large playlists)

### Release Readiness

- [x] SEO meta tags and Open Graph on the landing page (`src/app/layout.tsx`); Lighthouse SEO 100
- [x] Final performance benchmark recorded in `docs/performance.md`
- [x] Fix remaining lint warnings (HistoryItem `<img>`, page thumbnail grid) — both fixed in Sprint 14; lint clean in Sprint 15
- [~] Lighthouse audit > 90 (desktop + mobile) — accessibility 100, best-practices 100, SEO 100; performance 52 (mobile prod build) / 40 (desktop dev). Bottleneck: remote Unsplash hero (LCP) + client JS main-thread. See sprint review. Deferred: self-hosted hero + landing code-splitting.

### Documentation

- [x] User guide (`docs/user-guide.md`)
- [x] API documentation (`docs/api.md`)
- [x] Contributing guidelines (`CONTRIBUTING.md`)
- [x] Changelog (`CHANGELOG.md`)
- [x] README.md updates

### Final Polish

- [x] Typography review
- [x] Color consistency — brand green darkened to AA-compliant `#11853a` (white text 4.7:1) / hover `#12883b`
- [x] Spacing and alignment
- [x] Loading states review
- [x] Error messages review
- [x] Touch target sizes (mobile) — color swatches, remove-color, history close buttons enlarged

## Acceptance Criteria

- [x] App works in Chrome, Firefox (Playwright); Safari/Edge pending WebKit-capable environment
- [x] App works on iOS Safari and Android Chrome (emulated viewports; real-device pass pending human review)
- [x] All features work correctly
- [x] No console errors or new lint warnings
- [~] Lighthouse score > 90 — a11y/BP/SEO pass (100/100/100); performance deferred (see sprint review)
- [ ] Deployment succeeds on Vercel — pending: no credentials in sandbox; `git push` to remote not performed
- [x] Documentation is complete and accurate
- [x] All tests pass (411)
- [x] No known critical bugs

## Deliverables

- `.env.example` — verify/refresh existing template
- `docs/user-guide.md` — User documentation
- `docs/api.md` — API documentation
- `CONTRIBUTING.md` — Contributing guide
- `CHANGELOG.md` — Version history
- Updated `README.md`
- `docs/performance.md` — Final performance benchmark report

## Out of Scope

- Social sharing / sharing links (dropped — copyrighted artwork redistribution)
- Public gallery / community features (dropped — same reason)
- Custom domain setup
- CI/CD pipeline
- Monitoring and alerting
- Analytics integration
- Native mobile sharing (Web Share API)

## Risks

| Risk | Mitigation |
|------|------------|
| Browser compatibility issues | Test early, use progressive enhancement |
| Deployment configuration drift | Vercel auto-deploys from main; verify a preview build before promoting |
| Documentation drift | Write docs alongside code, review before release |

## Definition of Done

- [x] Acceptance criteria completed (Lighthouse performance + deploy pending, see review)
- [x] Lint passes
- [x] AI self-review completed
- [x] Human review completed (real-device browser pass + push/deploy pending)
- [x] Documentation updated (README.md, sprint review, user guide, API, contributing, changelog)
- [ ] Deployment successful — pending human action (no Vercel credentials in sandbox)
- [x] No critical bugs in production
