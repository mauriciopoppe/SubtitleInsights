# Specification: Sidebar Seek-to-Start Button

## Overview

To improve navigation within the sidebar transcript, a new "Jump to segment" button will be added to the proximity controls of each sidebar segment. This allows users to quickly seek the video to the beginning of any specific subtitle segment.

## Functional Requirements

- **New Control Button:** Add a "Jump to segment" button to the `.si-sidebar-item-controls` group that appears on proximity.
- **Visuals:**
  - **Icon:** A standard Play icon (triangle).
  - **Tooltip:** "Jump to segment".
  - **Position:** Placed to the left of the existing "Sync" button.
- **Seek Action:** Clicking the button must instantly seek the video to the `start` timestamp of the corresponding segment.
- **Autoplay:** Clicking the button must ensure the video starts playing (call `.play()`) if it was currently paused.
- **Click Propagation:** Ensure clicking the button does not trigger other parent element interactions (e.g., stopping propagation).

## Non-Functional Requirements

- **Consistency:** The button's style, hover effects, and transitions must match the existing "Sync" button and the overlay proximity controls.
- **Performance:** Adding the button and its click handler should have negligible impact on sidebar rendering performance.

## Acceptance Criteria

- [ ] A new Play icon button is visible in the sidebar segment proximity controls (left of the sync button).
- [ ] Hovering over the button shows the tooltip "Jump to segment".
- [ ] Clicking the button seeks the video to the segment's start time.
- [ ] Clicking the button starts video playback if it was paused.
- [ ] The existing "Sync" button remains functional and correctly positioned.

## Out of Scope

- Adding this button to the overlay controls (it already has a replay segment feature).
- Changing the synchronization logic.
