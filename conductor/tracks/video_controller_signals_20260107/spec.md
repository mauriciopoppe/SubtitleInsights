# Specification: Centralized Video Controller and Signal-based UI Optimization

## Overview
Currently, multiple components (`SidebarApp`, `OverlayApp`, `App`, `usePauseOnHover`) independently listen to the video's `timeupdate` event. This redundancy causes unnecessary CPU cycles and triggers full re-renders of the `SidebarList` (containing potentially hundreds of segments) every ~250ms just to update a single "active" CSS class.

This track will introduce a centralized `VideoController` using `@preact/signals` to provide fine-grained, reactive updates to the UI, ensuring that only the components or elements that *actually* change (like the active segment highlight) will re-render.

## Functional Requirements

### 1. Centralized Video Controller
- Create a `VideoController` class initialized in the main `App` component.
- **State (Signals):**
    - `currentTimeMs`: Current video time in milliseconds.
    - `isPlaying`: Boolean status of video playback.
    - `isSeeking`: Boolean status indicating if the user is scrubbing.
    - `activeSegmentIndex`: The index of the current segment in the `SubtitleStore`.
- **Logic:**
    - Attach listeners to `timeupdate`, `play`, `pause`, `seeking`, and `seeked` on the target video element.
    - Perform a linear scan (or optimized search) to update `activeSegmentIndex` only when the time crosses a segment boundary.
    - Sync the `activeSegmentIndex` with `SubtitleStore` segments.

### 2. Signal-based Optimization
- **SidebarList:** Refactor to render `SidebarItem` components that internally subscribe to the `activeSegmentIndex` signal. The list itself should only re-render if the `segments` array changes.
- **OverlayApp:** Replace local `currentTimeMs` state with a subscription to the `VideoController` signals.
- **Translation Logic:** Update `App.tsx` to use the controller's state instead of a direct `timeupdate` listener.

### 3. Dependencies
- Add `@preact/signals` to the project to support reactive state management.

## Non-Functional Requirements
- **Performance:** Eliminate the O(N) re-render of the Sidebar for every time update.
- **Sync:** Ensure Sidebar highlight, Overlay text, and AI processing are perfectly synchronized.

## Acceptance Criteria
- [ ] `SidebarList` does NOT re-render on video `timeupdate` (verified via console logs/dev tools).
- [ ] The "active" segment in the sidebar updates its CSS class correctly as the video plays.
- [ ] The `Overlay` correctly displays the segment corresponding to the `activeSegmentIndex` signal.
- [ ] `VideoController` is the only component listening to the HTML5 Video `timeupdate` event.
- [ ] Manual seeking correctly updates all signals and UI components.
