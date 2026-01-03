# Specification: Auto-Scroll Sidebar on Initial Render

## Overview

Currently, the sidebar transcript always starts at the top when a video loads, regardless of the video's starting playback time. This track implements an automatic, instantaneous scroll to center the active (or next upcoming) segment upon the first render of subtitle data. This ensures the user immediately sees the relevant context if they start a video at a specific timestamp.

## Functional Requirements

1.  **First-Render Detection:**
    - The `SidebarApp` must identify the first time it receives a non-empty `segments` array for a specific video.
2.  **Target Segment Calculation:**
    - Use the current `video.currentTime` to find the active segment.
    - **Fallback:** If no segment is active (e.g., during an intro), find the nearest upcoming segment.
3.  **Instant Scroll Logic:**
    - Perform a `scrollIntoView` operation on the target segment element.
    - **Behavior:** Set `behavior: 'auto'` for an instantaneous jump.
    - **Position:** Center the segment in the sidebar list (`block: 'center'`).
4.  **Integration:**
    - Ensure the logic runs correctly even if subtitles load slightly after the video starts playing.

## Non-Functional Requirements

- **Performance:** The calculation and scroll should happen immediately after the DOM nodes are rendered to prevent visible flickering or "double jumps."
- **User Experience:** The scroll must be instantaneous on the first load to make the interface feel robust and well-synced from the start.

## Acceptance Criteria

- When opening a YouTube video at a non-zero timestamp (e.g., `?t=60s`), the sidebar automatically displays the segment at the 1-minute mark centered.
- If the video starts during a gap in subtitles, the sidebar scrolls to the next upcoming segment.
- The initial scroll is instantaneous and does not use smooth animation.
- Subsequent segments do not trigger auto-scrolling (preserving manual user control).

## Out of Scope

- Smooth scrolling for the initial render.
- Continuous auto-scrolling during playback (unless the "Sync" button is manually clicked).
