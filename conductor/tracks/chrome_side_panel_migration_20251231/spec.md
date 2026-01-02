# Specification: Chrome Side Panel Migration

## Status: Idea (Future)
**Note: This track is currently an idea and should not be implemented yet.**

## Goal
Migrate the current custom-injected sidebar to the native Chrome `sidePanel` API to improve performance, provide a more native UX, and avoid CSS/layout conflicts with websites (like YouTube).

## Requirements
- Move the React-based sidebar from a content script injection into an extension page context.
- Sync state (subtitles, settings, active state) between the content script and the Side Panel.
- Handle interactions (like timestamp seeking) via messaging between the Side Panel and the content script.

## Technical Details

### 1. Manifest Changes
- Add `sidePanel` and `storage` (session) permissions.
- Configure `side_panel` with a default path: `src/sidebar/index.html`.

### 2. State Syncing
- Use `chrome.storage.session` to share subtitle data. The content script writes to it, and the Side Panel listens for changes.
- Alternatively, use `chrome.runtime` messaging for real-time updates when the panel is active.

### 3. Messaging Bridge
- The Side Panel will send commands (e.g., `SEEK_VIDEO`, `TOGGLE_PAUSE`) to the active tab's content script.
- The background script will manage opening/closing the panel via `chrome.sidePanel.setOptions`.

### 4. UI Refactoring
- `SidebarApp.tsx` and its components need to be decoupled from the content script context.
- Styles might need adjustment for the fixed-width nature of the Chrome Side Panel.

## Risks
- **Fixed Width:** The Chrome Side Panel cannot be resized programmatically and has limited width controls.
- **Latency:** Messaging might introduce slight delays compared to direct DOM manipulation.
- **Context Loss:** When the user switches tabs, the Side Panel needs to update its content to match the new active tab.
