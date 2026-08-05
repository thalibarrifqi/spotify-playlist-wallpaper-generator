# Sprint 14 - Performance & Accessibility

## Goal

Optimize performance and ensure WCAG compliance.

## Background

Sprint 13 added the gallery. The app now has many features but may have performance issues with complex wallpapers and accessibility gaps. This sprint addresses both.

## Requirements

### Performance

- [ ] Web Worker for canvas rendering (prevent UI blocking)
- [ ] Lazy loading for playlist images
- [ ] Virtual scrolling for large playlists (50+ tracks)
- [ ] Debounced slider updates during preview
- [ ] Image compression before canvas rendering
- [ ] Performance monitoring (render time, memory usage)

### Accessibility (WCAG 2.1 AA)

- [ ] ARIA labels for all interactive elements
- [ ] Keyboard navigation (Tab, Enter, Escape, Arrow keys)
- [ ] Screen reader announcements for state changes
- [ ] Focus management in wizard flow
- [ ] Skip navigation link
- [ ] Color contrast ratios meet AA standards
- [ ] Reduced motion support (`prefers-reduced-motion`)

### Testing

- [ ] Lighthouse audit score > 90
- [ ] WAVE accessibility check passes
- [ ] Keyboard-only navigation works
- [ ] Screen reader testing (VoiceOver/NVDA)

## Acceptance Criteria

- [ ] Canvas rendering doesn't block UI
- [ ] Large playlists load smoothly
- [ ] All elements have ARIA labels
- [ ] Keyboard navigation works throughout
- [ ] Focus is visible on all interactive elements
- [ ] Reduced motion is respected
- [ ] Lighthouse score > 90
- [ ] All existing tests pass
- [ ] New tests added for accessibility

## Deliverables

- `src/workers/canvas.worker.ts` — Canvas Web Worker
- `src/hooks/useKeyboardNav.ts` — Keyboard navigation hook
- `src/hooks/useReducedMotion.ts` — Motion preference hook
- `src/components/SkipLink.tsx` — Skip navigation
- `src/components/LiveRegion.tsx` — Screen reader announcements
- Update all components for ARIA compliance
- CSS `prefers-reduced-motion` support
- `docs/accessibility.md` — Accessibility documentation

## Out of Scope

- Screen reader testing automation
- Full WCAG AAA compliance
- Voice control support
- High contrast mode

## Risks

| Risk | Mitigation |
|------|------------|
| Web Worker complexity | Start with simple offscreen canvas, iterate |
| Performance regression | Profile before/after, set benchmarks |
| Accessibility breaking changes | Test incrementally, use automated tools |

## Definition of Done

- [ ] Acceptance criteria completed
- [ ] Lint passes
- [ ] AI self-review completed
- [ ] Human review completed
- [ ] Documentation updated (README.md, sprint review)
