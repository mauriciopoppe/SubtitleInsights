# Plan: Centralized Video Controller and Signal-based UI Optimization

This plan introduces a centralized `VideoController` using `@preact/signals` to optimize UI updates and reduce redundant event listeners.

## Phase 1: Infrastructure & Core Logic
- [x] Task: Install `@preact/signals`
- [x] Task: Implement `VideoController` class with signals (`currentTimeMs`, `isPlaying`, `isSeeking`, `activeSegmentIndex`)
- [x] Task: Create unit tests for `VideoController` (mocking HTML5 Video element)
- [x] Task: Conductor - User Manual Verification 'Phase 1: Infrastructure & Core Logic' (Protocol in workflow.md) [checkpoint: be4de29]

## Phase 2: Integration & Global State
- [x] Task: Initialize `VideoController` singleton in `App.tsx`
- [x] Task: Connect `VideoController` to the active video element discovered by the content script
- [x] Task: Replace `App.tsx` local `timeupdate` logic with `VideoController` signal subscriptions
- [x] Task: Conductor - User Manual Verification 'Phase 2: Integration & Global State' (Protocol in workflow.md) [checkpoint: ddc486c]

## Phase 3: Sidebar Optimization
- [ ] Task: Refactor `SidebarItem` to use signals for the `active` state (avoiding parent re-render)
- [ ] Task: Refactor `SidebarList` to accept `VideoController` signals instead of `currentTimeMs` prop
- [ ] Task: Update `SidebarApp` to pass the `VideoController` to its children
- [ ] Task: Verify `SidebarList` does not re-render on video `timeupdate`
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Sidebar Optimization' (Protocol in workflow.md)

## Phase 4: Overlay & Hook Optimization
- [ ] Task: Refactor `OverlayApp` to use `VideoController` signals
- [ ] Task: Refactor `usePauseOnHover` to use `VideoController` signals
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Overlay & Hook Optimization' (Protocol in workflow.md)

## Phase 5: Verification & Cleanup
- [ ] Task: Manual verification on YouTube and other supported platforms
- [ ] Task: Remove any remaining redundant `timeupdate` listeners or old state management
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Verification & Cleanup' (Protocol in workflow.md)
