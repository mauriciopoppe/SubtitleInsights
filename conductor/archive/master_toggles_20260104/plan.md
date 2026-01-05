# Plan: Master Toggles for Overlay and Sidebar

## Phase 1: Configuration & Core Logic
- [x] **Task: Update Configuration Schema**
    - Add `isSidebarEnabled` to `AppConfig` interface in `src/content/config.ts`.
    - Map it to storage key `si_is_sidebar_enabled`.
    - Set default value to `false`.
- [x] **Task: Implement Sidebar Visibility Logic**
    - Update `src/content/components/App.tsx` to conditionally hide/show the sidebar container based on `config.isSidebarEnabled`.
    - Ensure Stremio resizing logic respects the enabled state.
- [x] **Task: Implement Overlay Visibility Logic**
    - Confirm/ensure `App.tsx` correctly handles `isOverlayEnabled` to hide the overlay.
- [x] Task: Conductor - User Manual Verification 'Configuration & Core Logic' (Protocol in workflow.md)

## Phase 2: Settings Popup UI Updates
- [x] **Task: Enhance `SettingsItem` Component**
    - Update `SettingsItem` in `src/content/components/SettingsPopup.tsx` to accept a `disabled` prop.
    - Add `.disabled` styles to `src/content/styles.css` (e.g., opacity 0.5, `pointer-events: none`).
- [x] **Task: Update Sub-menus in `SettingsPopup`**
    - Add "Show Overlay" toggle to Overlay view.
    - Add "Show Sidebar" toggle to Sidebar view.
    - Apply `disabled` state to sub-items based on master toggle values.
- [x] Task: Conductor - User Manual Verification 'Settings Popup UI Updates' (Protocol in workflow.md)

## Phase 3: Final Verification
- [x] **Task: Cross-platform Verification**
    - Verify behavior on YouTube and Stremio.
- [x] Task: Conductor - User Manual Verification 'Final Verification' (Protocol in workflow.md)
