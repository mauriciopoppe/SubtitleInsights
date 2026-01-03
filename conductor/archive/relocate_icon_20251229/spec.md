# Spec: Relocate Extension Icon (Right Controls)

## Overview

Move the extension's main toggle button from the left controls to the right controls area of the YouTube player, specifically positioning it to the left of the Closed Captions (CC) button. The button will be restyled to match the native YouTube player buttons (SVG icon, hover states) for a seamless integration.

## Functional Requirements

- **Target Location:** Inject the toggle button into the `.ytp-right-controls` container.
- **Positioning:** Insert the button _before_ the `.ytp-subtitles-button` (CC button) if it exists, or append to the container if not.
- **Visual Style:**
  - Replace the current "LLE" text button with an SVG icon (e.g., a "Translate" or "Learning" icon).
  - Match the dimensions, padding, and hover effects of native YouTube player buttons (`.ytp-button`).
- **Interaction:**
  - Click toggles the extension's enabled state (same as current behavior).
  - Tooltip should appear on hover (using the standard `title` attribute or emulating native style if `title` is sufficient for MVP).

## Non-Functional Requirements

- **Consistency:** The button should look like it belongs to the YouTube player interface.
- **Robustness:** The injection logic must handle SPA navigation and player re-renders (using existing `waitForElement` / observer patterns).

## Acceptance Criteria

- The "LLE" text button is removed from the left controls.
- A new icon button appears in the right controls, to the left of the CC button.
- Clicking the button toggles the overlay/sidebar visibility (standard enable/disable logic).
- The button style matches adjacent YouTube buttons (e.g., Settings, CC).
