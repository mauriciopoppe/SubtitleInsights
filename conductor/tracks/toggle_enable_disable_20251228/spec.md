# Spec: Extension Enable/Disable Toggle in YouTube Player

## Overview
Add a native-looking toggle button to the YouTube video player's control bar that allows users to enable or disable the Language Learning Extension.

## Functional Requirements
- **Toggle Injection:** Inject a "LLE" text button into the YouTube player's `.ytp-left-controls` container, specifically placed to the right of the `.ytp-time-display` element.
- **Button Styling:**
    - Text: "LLE"
    - Style: YouTube native font (Roboto), button-like padding, and `cursor: pointer`.
    - Active State: White color (matches other active controls).
    - Inactive State: Gray color (matches inactive or hover-off controls).
- **Toggle Logic:**
    - Clicking the button switches the state between `Enabled` and `Disabled`.
    - When `Disabled`:
        - Hide the `#lle-overlay` completely.
        - Stop processing new subtitle segments and AI calls.
    - When `Enabled`:
        - Show the `#lle-overlay`.
        - Resume subtitle processing.
- **Persistence:** Save the enabled/disabled state in `chrome.storage.local` so it persists across page reloads and different videos.

## Non-Functional Requirements
- **Performance:** Toggle insertion and state switching should be instantaneous without affecting player performance.
- **UI Integration:** The button must look like a natural part of the YouTube player UI.

## Acceptance Criteria
- [ ] A button labeled "LLE" is visible in the YouTube player controls.
- [ ] Clicking "LLE" toggles the extension's enabled state.
- [ ] The visual color of the "LLE" text changes based on the state.
- [ ] The extension overlay appears/disappears correctly when toggled.
- [ ] The enabled/disabled state is remembered after a page refresh.

## Out of Scope
- A separate popup or options page for this setting.
- Per-video toggle settings.
