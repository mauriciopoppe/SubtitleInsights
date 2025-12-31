# Plan: Pause on Hover Overlay

## Phase 1: Settings Toggle & State Management
- [x] Task: Implement "Pause on Hover" toggle in `SettingsDropdown.tsx`.
    - [ ] Add a new `lle-settings-dropdown-item` for the toggle.
    - [ ] Bind the toggle to a new configuration state in `src/content/config.ts` (e.g., `lle_is_pause_on_hover_enabled`).
    - [ ] Ensure the toggle state persists using `chrome.storage.local`.
    - [ ] Update `SidebarHeader.tsx` to pass the new toggle state and `onToggle` handler to `SettingsDropdown.tsx`.
- [x] Task: Create and inject `usePauseOnHover` hook.
    - [ ] Implement `src/content/hooks/usePauseOnHover.ts`.
    - [ ] This hook will manage the hover state over the overlay and control the video pausing.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Settings Toggle & State Management' (Protocol in workflow.md)

## Phase 2: Core Pause/Resume Logic
- [ ] Task: Implement video event listeners in `usePauseOnHover`.
    - [ ] Listen for `timeupdate` events on the video player.
    - [ ] Listen for `mousemove` and `mouseleave` events on the overlay element (`#lle-overlay`).
- [ ] Task: Integrate `usePauseOnHover` into `OverlayApp.tsx`.
    - [ ] Pass necessary props like video element, config state, and overlay ref.
- [ ] Task: Implement pause condition check.
    - [ ] Within the `timeupdate` listener, check if "Pause on Hover" is enabled, subtitles are active, mouse is over overlay, and segment is nearing its end (0.5s buffer).
    - [ ] Call `video.pause()` when conditions are met.
- [ ] Task: Implement resume condition check.
    - [ ] Call `video.play()` when mouse leaves overlay or if video is manually played by user.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Core Pause/Resume Logic' (Protocol in workflow.md)

## Phase 3: Integration & Testing
- [ ] Task: Verify subtitle status detection.
    - [ ] Ensure `usePauseOnHover` accurately determines if YouTube subtitles are enabled.
- [ ] Task: Integration test for full functionality.
    - [ ] Manually test toggling the feature on/off.
    - [ ] Verify precise pausing 0.5s before segment end.
    - [ ] Verify resume on mouse leave and manual play.
    - [ ] Verify feature only active when YouTube subtitles are enabled.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Integration & Testing' (Protocol in workflow.md)
