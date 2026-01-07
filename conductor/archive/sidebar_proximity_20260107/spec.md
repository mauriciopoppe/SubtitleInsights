# Specification: Sidebar Proximity Controls

## Overview

Currently, the manual synchronization button in the sidebar transcript only appears after hovering over a segment for 2 seconds. To improve discoverability and align with the existing "Overlay Proximity Controls" pattern, this feature will transition the sidebar controls to use proximity-based visibility.

## Functional Requirements

- **Proximity Trigger:** Detect when the mouse cursor is near the right edge of a sidebar segment row.
- **Immediate Visibility:** The sync button must appear immediately (with a smooth fade-in) when the proximity condition is met, without waiting for a hover delay.
- **Replace Legacy Hover:** Remove the existing 2-second hover delay logic for showing sidebar segment controls.
- **Control Action:** Clicking the manual sync button must align the subtitle segment to the current video time (existing functionality).
- **Group Support:** The implementation should support a "button group" structure to allow for future additional controls in the sidebar, matching the architectural pattern used in the overlay.

## Non-Functional Requirements

- **Visual Consistency:** The fade-in animation and button styling must match the native-like aesthetic of the existing overlay controls.
- **Performance:** Proximity detection must be lightweight to ensure no lag during sidebar scrolling or rapid mouse movement.

## Acceptance Criteria

- [ ] Hovering near the right edge of any sidebar segment instantly triggers the appearance of the sync button.
- [ ] Moving the mouse away from the right edge causes the button to disappear.
- [ ] The button no longer requires a 2-second wait to be visible.
- [ ] Clicking the button successfully synchronizes the subtitle segment to the current playback time.

## Out of Scope

- Adding new functional buttons to the sidebar (this track focuses on the visibility mechanism only).
- Changing the layout of the sidebar segments themselves.
