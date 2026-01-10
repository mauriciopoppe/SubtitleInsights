# Spec: Overlay Font Size Adjustment

## Overview
Implement keyboard shortcuts to dynamically adjust the font size of the subtitle overlay, mimicking YouTube's native subtitle font size controls.

## Functional Requirements
- Bind `-` and `_` keys to decrease the overlay font size.
- Bind `=` and `+` keys to increase the overlay font size.
- Discrete Values: 18px, 24px, 32px, 44px.
- Changes must apply immediately to the overlay text.
- The font size setting must persist across sessions via `chrome.storage`.
- **Overlay Max Width:** Set the maximum width of the overlay container to 50% of the video/window width.

## Acceptance Criteria
- Pressing `-` or `_` cycles down through [44, 32, 24, 18].
- Pressing `+` or `=` cycles up through [18, 24, 32, 44].
- The new font size is immediately reflected in the active overlay.
- Refreshing the page preserves the adjusted font size.
- The overlay container width does not exceed 50% of its parent container.

## Out of Scope
- Visual toast notifications or UI indicators for the font size value.
- Font size adjustment for the sidebar.
