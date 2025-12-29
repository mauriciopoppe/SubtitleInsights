# Spec: Sidebar Scroll to Active Segment Button

## Overview
Add a "Jump to Active" button to the sidebar header that allows users to quickly sync their view with the currently playing or last played subtitle segment.

## Functional Requirements
- **Button Placement:** A new button in the sidebar header, aligned to the right.
- **Button Design:** A combination of a "target" or "sync" icon and text (e.g., "Jump to Active").
- **Core Logic:** 
    - When clicked, the sidebar should scroll to the segment currently being highlighted.
    - If no segment is currently active (e.g., silence in video), scroll to the most recently active segment.
- **Scroll Behavior:** Perform a fast smooth-scroll animation to center the target segment in the sidebar's view.

## Non-Functional Requirements
- **Performance:** Scrolling should be efficient and not cause layout thrashing.
- **UI Consistency:** Match the existing sidebar's color scheme and button styles.

## Acceptance Criteria
- Button is visible in the sidebar header.
- Clicking the button successfully scrolls the sidebar to the active/last-active segment.
- The scroll animation is smooth but fast.
- The feature works correctly even if the sidebar was manually scrolled away from the active segment.
