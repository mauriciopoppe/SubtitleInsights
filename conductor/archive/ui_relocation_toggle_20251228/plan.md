# Plan - UI Control Relocation & Overlay Toggle

## Phase 1: State Management Updates [checkpoint: d564bbf]
- [x] Task: Update `src/content/config.ts` to include `isOverlayEnabled` in the configuration and storage.
- [x] Task: Add getter/setter and change listener support for `isOverlayEnabled` in `Config` class.
- [x] Task: Conductor - User Manual Verification 'Phase 1: State Management Updates' (Protocol in workflow.md)

## Phase 2: Sidebar Header Enhancements [checkpoint: d564bbf]
- [x] Task: Update `src/content/sidebar.ts` to include the Upload button and the Overlay Toggle in the `lle-sidebar-header`.
- [x] Task: Implement the "Overlay" toggle logic in the `Sidebar` class, firing the `Config` update.
- [x] Task: Update the `Sidebar` constructor to accept callbacks or references needed for the Upload button functionality (or manage it via events).
- [x] Task: Conductor - User Manual Verification 'Phase 2: Sidebar Header Enhancements' (Protocol in workflow.md)

## Phase 3: Player Controls & Logic Refactoring [checkpoint: d564bbf]
- [x] Task: Modify `setupToggle` in `src/content/index.ts` to remove the Upload button from the YouTube player controls.
- [x] Task: Connect the relocated Upload button in the Sidebar to the existing file input logic in `index.ts`.
- [x] Task: Update the `timeupdate` listener in `src/content/index.ts` to check both `isEnabled` (Master) and `isOverlayEnabled` (Sub-toggle) before showing the on-video overlay.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Player Controls & Logic Refactoring' (Protocol in workflow.md)

## Phase 4: Styling & Polish [checkpoint: d564bbf]
- [x] Task: Update `src/content/styles.css` to layout the new Sidebar Header controls (flexbox, spacing, active states).
- [x] Task: Ensure the "Overlay" toggle has a visual "enabled/disabled" state similar to the main LLE toggle.
- [x] Task: Conductor - User Manual Verification 'Phase 4: Styling & Polish' (Protocol in workflow.md)