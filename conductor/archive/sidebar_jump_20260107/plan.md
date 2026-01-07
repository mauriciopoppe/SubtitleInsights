# Plan: Sidebar Seek-to-Start Button

## Phase 1: Implementation

- [x] Task: Add "Jump to segment" button to `SidebarItem.tsx` within the `si-sidebar-item-controls` container.
- [x] Task: Implement `handleJumpClick` function to seek to `segment.start` and call `video.play()`.
- [x] Task: Ensure the button is positioned to the left of the "Sync" button.
- [x] Task: Conductor - User Manual Verification 'Implementation' (Protocol in workflow.md)

## Phase 2: Verification & Quality

- [x] Task: Update `sidebar_integration.test.tsx` (or add a new test) to verify the presence and functionality of the new jump button.
- [x] Task: Run `npm run type-check` and `npm run lint`.
- [x] Task: Conductor - User Manual Verification 'Verification & Quality' (Protocol in workflow.md)
