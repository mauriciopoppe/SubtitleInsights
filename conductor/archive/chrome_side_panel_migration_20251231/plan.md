# Plan: Chrome Side Panel Migration

## Status: Paused (Idea)

- [ ] Update `manifest.json` with `sidePanel` permissions.
- [ ] Create `src/sidebar/index.html` and `src/sidebar/index.tsx` entry points.
- [ ] Implement `chrome.storage.session` sync logic in `src/content/store.ts`.
- [ ] Refactor `SidebarApp.tsx` for extension page context.
- [ ] Implement messaging bridge for video control (seek, pause).
- [ ] Update background script to manage side panel lifecycle.
- [ ] Remove legacy content script sidebar injection logic.
