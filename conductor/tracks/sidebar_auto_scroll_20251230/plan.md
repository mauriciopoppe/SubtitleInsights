# Plan: Auto-Scroll Sidebar on Initial Render

## Phase 1: Logic & Hook Enhancement
- [x] Task: Update `SidebarApp.tsx` to handle initial auto-scroll.
    - [x] Create a `useEffect` that monitors the `segments` array.
    - [x] Implement a `hasInitiallyScrolled` ref to ensure the logic only runs once per video.
    - [x] Use `video.currentTime` to determine the target segment (active or next upcoming).
    - [x] Perform the instantaneous scroll using `scrollIntoView({ behavior: 'auto', block: 'center' })`.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Logic & Hook Enhancement' (Protocol in workflow.md)

## Phase 2: Refinement & Robustness
- [ ] Task: Reset scroll state on video change.
    - [ ] Ensure the `hasInitiallyScrolled` ref is reset whenever the video ID changes.
- [ ] Task: Manual Verification in Browser.
    - [ ] Open a video at 0:00. Verify no intrusive scrolling.
    - [ ] Open a video at a mid-point (e.g., `?t=120`). Verify the sidebar centers the 2-minute segment instantly.
    - [ ] Open a video during a subtitle gap. Verify it scrolls to the next upcoming segment.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Refinement & Robustness' (Protocol in workflow.md)
