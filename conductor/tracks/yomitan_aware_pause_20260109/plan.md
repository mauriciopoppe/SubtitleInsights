# Plan: Yomitan Popup Aware Pause on Hover

Integrate Yomitan detection into `usePauseOnHover` to prevent premature playback resumption when interacting with dictionary popups.

## Phase 1: Implementation & Hook Refactoring [checkpoint: a0220e9]
- [x] Task: Create a utility function `isMouseOverYomitan(e: MouseEvent)` in `src/content/hooks/usePauseOnHover.ts` (or a separate util) that implements the shadow root detection logic.
- [x] Task: Update `usePauseOnHover` to add a global `window` mousemove listener when the video is paused via hover.
- [x] Task: Refactor the `handleMouseLeave` logic to check `isMouseOverYomitan` before resuming playback.
- [x] Task: Add defensive checks (try-catch) for `chrome.dom.openOrClosedShadowRoot`.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Implementation & Hook Refactoring' (Protocol in workflow.md)

## Phase 2: Verification & Polish [checkpoint: b7b303b]
- [x] Task: Verify that the video stays paused when moving from the subtitle overlay to a Yomitan popup.
- [x] Task: Verify that the video resumes correctly when the mouse leaves both areas.
- [x] Task: Ensure the global mousemove listener is correctly cleaned up to avoid memory leaks.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Verification & Polish' (Protocol in workflow.md)
