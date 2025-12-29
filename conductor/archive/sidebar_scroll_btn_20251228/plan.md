# Plan: Sidebar Scroll to Active Segment Button

## Phase 1: Sidebar Header Enhancement [checkpoint: 0a115f0]
- [x] Task: Update Sidebar UI for Jump Button
    - [x] Modify `src/content/sidebar.ts` to add a new button container in the header.
    - [x] Implement the "Jump to Active" button with a "target" icon and text.
    - [x] Style the button in `src/content/styles.css` for right-alignment and consistency.

## Phase 2: Scroll Logic & State Management [checkpoint: 0a115f0]
- [x] Task: Track Active and Last-Active Segments
    - [x] Ensure `Sidebar` class maintains a reference to the currently highlighted or last-highlighted segment element.
- [x] Task: Implement Fast Smooth-Scroll Logic
    - [x] Add a click listener to the Jump button.
    - [x] Use `element.scrollIntoView({ behavior: 'smooth', block: 'center' })` (or a custom fast-scroll implementation if standard smooth is too slow).
    - [x] Ensure the scroll target defaults to the last-active segment if no segment is currently highlighted.

## Phase 3: Verification [checkpoint: 0a115f0]
- [x] Task: Manual Verification
    - [x] Open a YouTube video with the extension active.
    - [x] Manually scroll the sidebar away from the active segment.
    - [x] Click the "Jump to Active" button and verify it scrolls back smoothly and quickly.
    - [x] Verify behavior when the video is paused/in a silent section.
- [x] Task: Conductor - User Manual Verification 'Verification' (Protocol in workflow.md)
