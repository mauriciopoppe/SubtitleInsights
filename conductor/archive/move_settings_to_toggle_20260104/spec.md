# Specification: Move Sidebar Settings to Extension Toggle Popup

## 1. Overview

The goal of this track is to relocate the settings, controls, and status information currently housed within the Sidebar's header into a new, unified popup menu. This menu will be triggered by clicking the main extension toggle icon in the video player's control bar (on both YouTube and Stremio). The visual style and behavior will strictly mimic the native YouTube settings menu, including sub-menu navigation for complex settings.

## 2. Functional Requirements

### 2.1 Extension Toggle Behavior

- **Trigger:** Clicking the extension icon in the video control bar should toggle the visibility of a new "Settings Popup" menu.
- **Action:** Opening the menu. The toggle icon itself remains as the entry point.

### 2.2 Settings Popup Menu

- **UI Style:**
  - Mimic the native YouTube settings menu styling:
    - **Background:** `rgba(28, 28, 28, 0.9)` or similar with `backdrop-filter: blur(8px)`.
    - **Corners:** `12px` rounded.
    - **Typography:** Roboto, 14px for main items, 13px for status/meta.
  - **Anchoring:** Positioned above the toggle button.
  - **Interaction:** Close on click-outside.

- **Navigation (Sub-menus):**
  - The menu should support a "Main View" and "Sub-menu Views".
  - **Main View Content:**
    1. **Status Indicator Row:** Non-clickable status info.
    2. **Overlay Settings (Link):** Clicking navigates to the Overlay sub-menu. Displays summary state (e.g. "Enabled").
    3. **Sidebar Settings (Link):** Clicking navigates to the Sidebar sub-menu. Displays summary state.
    4. **Pause on Hover (Toggle):** Inline toggle (mimics YouTube "Autoplay" style).
    5. **Upload Subtitles (Action):** Triggers file picker.
    6. **Detailed Settings (Link):** Opens options page.
  - **Sub-menu View (Overlay/Sidebar):**
    - **Header:** A "Back" item with an arrow icon and the sub-menu title.
    - **Items:** The specific fine-grained toggles (Original, Translation, Insights).

### 2.3 Sidebar Changes

- **Removal:**
  - Remove the existing "Settings" (gear icon) and its associated dropdown.
  - Remove the status indicator (AI Ready, etc.) from the sidebar header.
- **Retention:**
  - Keep the "Upload Subtitles" button in the sidebar header.
  - Keep the "Sync" button in the sidebar header.

### 2.4 Platform Support

- **YouTube:** Mimic native `ytp-popup` behavior and style.
- **Stremio:** Implement the popup using a consistent dark theme that matches the player aesthetic under the `.si-platform-stremio` namespace.

## 3. Non-Functional Requirements

- **Consistency:** Ensure the state (enabled/disabled) is perfectly synced.
- **Animation:** Use simple CSS transitions for sub-menu switching if possible.
- **Namespacing:** All Stremio-specific style overrides must be under a `.si-platform-stremio` namespace.

## 4. Out of Scope

- Redesigning the "Detailed Settings" page itself.
- Changes to the core SubtitleStore logic.
