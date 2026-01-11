# Spec: Master Toggle Keyboard Shortcut

## Overview
Add a keyboard shortcut to globally toggle the extension (Enabled/Disabled), mirroring the master toggle switch in the extension popup. This shortcut will be unassigned by default to avoid conflicts.

## Functional Requirements
- Define a new command `toggle_extension` in `manifest.json`.
- The command must NOT have a default keybinding.
- Implement a listener in the background script (`src/background/index.ts`) to handle the command.
- When triggered, the background script should:
    1. Read the current `isEnabled` state from `chrome.storage`.
    2. Toggle the state (if true -> false, if false -> true).
    3. Update `chrome.storage` with the new state.
- The change should automatically propagate to content scripts via existing storage listeners.

## Non-Functional Requirements
- Ensure the shortcut name and description are clear in the Chrome Shortcuts settings page.

## Acceptance Criteria
- A "Toggle Extension" command appears in `chrome://extensions/shortcuts` for Subtitle Insights.
- Assigning a key to this command and pressing it successfully toggles the extension state.
- The state change is reflected in the extension popup and the UI (Overlay/Sidebar) on YouTube/Stremio.

## Out of Scope
- Toggling individual components (Overlay/Sidebar only) via this specific shortcut.
