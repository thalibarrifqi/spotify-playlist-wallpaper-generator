# Sprint 15 - Polish & Deployment

## Goal

Final QA, documentation, and release readiness.

## Background

Sprint 14 completed performance and accessibility improvements. The app is already deployed to Vercel and `.env.example` exists, so this sprint focuses on QA, documentation, and final polish rather than greenfield deployment setup.

## Requirements

### Quality Assurance

- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile testing (iOS Safari, Android Chrome)
- [ ] Responsive design verification (390px–1920px)
- [ ] Error handling review (network errors, empty playlists, invalid URLs)
- [ ] Edge case testing (empty playlists, API failures, large playlists)

### Release Readiness

- [ ] SEO meta tags and Open Graph on the landing page
- [ ] Final performance benchmark recorded in `docs/performance.md`
- [ ] Fix remaining lint warnings (HistoryItem `<img>`, page thumbnail grid)
- [ ] Lighthouse audit > 90 (desktop + mobile)

### Documentation

- [ ] User guide (`docs/user-guide.md`)
- [ ] API documentation (`docs/api.md`)
- [ ] Contributing guidelines (`CONTRIBUTING.md`)
- [ ] Changelog (`CHANGELOG.md`)
- [ ] README.md updates

### Final Polish

- [ ] Typography review
- [ ] Color consistency
- [ ] Spacing and alignment
- [ ] Loading states review
- [ ] Error messages review
- [ ] Touch target sizes (mobile)

## Acceptance Criteria

- [ ] App works in Chrome, Firefox, Safari, Edge
- [ ] App works on iOS Safari and Android Chrome
- [ ] All features work correctly
- [ ] No console errors or new lint warnings
- [ ] Lighthouse score > 90
- [ ] Deployment succeeds on Vercel
- [ ] Documentation is complete and accurate
- [ ] All tests pass
- [ ] No known critical bugs

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

- [ ] Acceptance criteria completed
- [ ] Lint passes
- [ ] AI self-review completed
- [ ] Human review completed
- [ ] Documentation updated (README.md, sprint review)
- [ ] Deployment successful
- [ ] No critical bugs in production
