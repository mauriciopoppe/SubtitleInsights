# Specification: Master Toggles for Overlay and Sidebar

## 1. Overview
Introduce explicit "Master Toggles" within the settings popup to allow users to completely enable or disable the Overlay and Sidebar render areas independently.

## 2. Functional Requirements

### 2.1 Configuration Changes
- **New Key:** Add `isSidebarEnabled` to `AppConfig` in `src/content/config.ts`.
- **Default Value:** `false`.
- **Existing Key:** Use `isOverlayEnabled` for the Overlay master toggle (default remains `true`).

### 2.2 Settings Popup UI
- **Sub-menu Integration:**
  - **Overlay Sub-menu:** Add "Show Overlay" toggle as the first item below the back button.
  - **Sidebar Sub-menu:** Add "Show Sidebar" toggle as the first item below the back button.
- **Interactivity (Dependency):**
  - If a master toggle is OFF, all other options in that sub-menu must be visually grayed out (lower opacity) and non-clickable (`pointer-events: none`).

### 2.3 Rendering Logic
- **Overlay:** Hide `#si-overlay-root` (and suspend processing) when `isOverlayEnabled` is `false`.
- **Sidebar:** Hide `#si-sidebar-root` when `isSidebarEnabled` is `false`.
- **Stremio Support:** Disabling the sidebar must revert the video player width to 100%.

## 3. Non-Functional Requirements
- **Visual Feedback:** Use consistent "disabled" styling for menu items.
- **Immediate State Sync:** State changes must reflect instantly in the UI.

## 4. Out of Scope
- Global extension disable (handled by `isEnabled`).
