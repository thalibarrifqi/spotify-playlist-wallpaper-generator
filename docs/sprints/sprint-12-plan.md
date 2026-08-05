# Sprint 12 - Social Sharing

## Goal

Enable sharing wallpapers to social platforms.

## Background

Sprint 11 added local storage and history. Users can now save their work but need to share it with others. Social sharing will increase engagement and organic growth.

## Requirements

### Share Options

- [ ] Share to Twitter/X with pre-filled text
- [ ] Share to Instagram (download prompt with crop guide)
- [ ] Share to WhatsApp
- [ ] Copy link to clipboard (settings encoded in URL)
- [ ] Download as JPEG (smaller file size for sharing)

### Share UI

- [ ] Share modal with platform icons
- [ ] Share preview showing wallpaper thumbnail
- [ ] Custom share message input
- [ ] Copy link confirmation

### Export Formats

- [ ] PNG (current default, highest quality)
- [ ] JPEG (adjustable quality 50-100%)
- [ ] File size preview before download

## Acceptance Criteria

- [ ] User can share to Twitter, Instagram, WhatsApp
- [ ] User can copy link with settings encoded
- [ ] User can download as JPEG with quality control
- [ ] Share preview shows accurate thumbnail
- [ ] Copy link works correctly
- [ ] All existing tests pass
- [ ] New tests added for sharing utilities

## Deliverables

- `src/components/ShareModal.tsx` — Share options modal
- `src/components/ExportOptions.tsx` — Export format selection
- `src/lib/share.ts` — Share URL generation
- `src/lib/wallpaper/export.ts` — Multi-format export
- `src/lib/wallpaper/compress.ts` — JPEG compression
- Update download step for share options

## Out of Scope

- Native mobile sharing (Web Share API)
- Social media API integration
- Share analytics/tracking
- Embed code generation

## Risks

| Risk | Mitigation |
|------|------------|
| Image too large for sharing | Provide JPEG compression, quality options |
| Link too long for Twitter | Use URL shortening service or limit settings |
| Instagram crop issues | Provide crop guide overlay |

## Definition of Done

- [ ] Acceptance criteria completed
- [ ] Lint passes
- [ ] AI self-review completed
- [ ] Human review completed
- [ ] Documentation updated (README.md, sprint review)
