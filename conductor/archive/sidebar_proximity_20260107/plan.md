# Plan: Sidebar Proximity Controls

## Phase 1: Preparation & Analysis

- [x] Task: Analyze current proximity implementation in `OverlayControls` and `SidebarSegment`.
- [x] Task: Identify shared logic or potential for a custom hook (e.g., `useProximity`).
- [x] Task: Conductor - User Manual Verification 'Preparation & Analysis' (Protocol in workflow.md)

## Phase 2: Refactor & Shared Logic

- [x] Task: Extract proximity detection logic into a reusable hook or utility if applicable.
- [x] Task: Write unit tests for the proximity detection logic.
- [x] Task: Conductor - User Manual Verification 'Refactor & Shared Logic' (Protocol in workflow.md)

## Phase 3: Sidebar Integration

- [x] Task: Update `SidebarSegment` (or relevant component) to use proximity detection instead of the 2-second hover delay.
- [x] Task: Implement the "Button Group" container for sidebar controls to support future expansion.
- [x] Task: Add CSS for smooth fade-in/out transitions matching the overlay style.
- [x] Task: Conductor - User Manual Verification 'Sidebar Integration' (Protocol in workflow.md)

## Phase 4: Functional Verification

- [x] Task: Verify that clicking the sync button still correctly aligns the subtitle segment.
- [x] Task: Ensure proximity detection is scoped to the right edge and doesn't interfere with other sidebar interactions.
- [x] Task: Run full test suite and linting.
- [x] Task: Conductor - User Manual Verification 'Functional Verification' (Protocol in workflow.md)
