# Plan: Auto-Scroll Sidebar on Initial Render

## Phase 1: Logic & Hook Enhancement [checkpoint: 0f836d5]
- [x] Task: Update `SidebarApp.tsx` to handle initial auto-scroll.
    - [x] Create a `useEffect` that monitors the `segments` array.
    - [x] Implement a `hasInitiallyScrolled` ref to ensure the logic only runs once per video.
    - [x] Use `video.currentTime` to determine the target segment (active or next upcoming).
    - [x] Perform the instantaneous scroll using `scrollIntoView({ behavior: 'auto', block: 'center' })`.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Logic & Hook Enhancement' (Protocol in workflow.md)

## Phase 2: Refinement & Robustness [checkpoint: 91cd39a]
- [x] Task: Reset scroll state on video change.
    - [x] Ensure the `hasInitiallyScrolled` ref is reset whenever the video ID changes.
- [x] Task: Manual Verification in Browser.
    - [x] Open a video at 0:00. Verify no intrusive scrolling.
    - [x] Open a video at a mid-point (e.g., `?t=120`). Verify the sidebar centers the 2-minute segment instantly.
    - [x] Open a video during a subtitle gap. Verify it scrolls to the next upcoming segment.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Refinement & Robustness' (Protocol in workflow.md)
