# Plan: Sidebar Layout Fixes

## Goal
Fix sidebar layout issues on YouTube:
1. Ensure the sidebar matches the video player's height.
2. Ensure the sidebar stays above the playlist/recommendations list, even on video navigation.

## Implementation Steps

- [ ] **Fix 1: Height Synchronization**
    - [ ] Identify the correct video player container element (`#movie_player` or `#player-container`).
    - [ ] Use `ResizeObserver` to monitor its height.
    - [ ] Update the sidebar container (`#si-sidebar-root` or `#si-sidebar`) to match this height.
    - [ ] Handle window resize events.

- [ ] **Fix 2: Playlist Positioning**
    - [ ] Verify the injection target (`#secondary-inner`).
    - [ ] Implement a persistent check (MutationObserver or existing navigation listeners) to ensure `#si-sidebar-root` remains the *first* child of `#secondary-inner`.
    - [ ] Handle SPA navigation events (`yt-navigate-finish`) to re-assert position if YouTube clears/re-renders the secondary column.

## Verification
- [ ] Sidebar height matches video in default view.
- [ ] Sidebar height updates when resizing window.
- [ ] Sidebar stays at the top of the right column when navigating to a video in a playlist.
- [ ] Sidebar stays at the top when navigating between playlist videos.
