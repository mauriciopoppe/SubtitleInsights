# Plan: Move Sidebar Settings to Extension Toggle Popup

## Phase 1: Preparation & Component Refactoring
- [x] **Task:** Create `SettingsPopup` Component
    - Create a new component `src/content/components/SettingsPopup.tsx`.
    - Port the logic and layout from the existing `SettingsDropdown` (in sidebar) to this new component.
    - Add the **Status Indicator** logic (from `SidebarHeader`) into this new component (likely as the header row).
- [x] **Task:** Update `ExtensionToggle`
    - Modify `src/content/components/ExtensionToggle.tsx` to handle the "open popup" state.
    - Instead of toggling the extension ON/OFF directly, clicking the icon should now mount/unmount or show/hide the `SettingsPopup`.
    - Pass necessary props (refs, state) to anchor the popup correctly.
- [x] Task: Conductor - User Manual Verification 'Preparation & Component Refactoring' (Protocol in workflow.md)

## Phase 2: Authentic YouTube UI & Sub-menus
- [x] **Task:** Implement Sub-menu Navigation in `SettingsPopup`
    - Add navigation state (e.g., `view: 'main' | 'overlay' | 'sidebar'`) to `SettingsPopup`.
    - Implement a "Main View" with links to sub-menus.
    - Implement "Sub-menu Views" with a "Back" button header.
    - Ensure smooth transitions between views.
- [x] **Task:** Refined YouTube Styling
    - Update `src/content/styles.css` with exact YouTube styles:
        - `background-color: rgba(28, 28, 28, 0.9)` and `backdrop-filter: blur(8px)`.
        - Proper hover states, icons, and typography.
        - YouTube-style "Back" button icon and layout.
- [x] **Task:** Refactor `SidebarHeader`
    - Remove the "Settings" gear icon button and the `SettingsDropdown` component usage.
    - Remove the `StatusIcon` from the header.
    - Ensure the "Upload" and "Sync" buttons remain and the layout adjusts gracefully (e.g., spacing).
- [x] **Task:** Integration & State Sync
    - Connect `SettingsPopup` to the global `Config` and `SubtitleStore`.
    - Verify that toggling options in the new popup immediately effects the UI (Overlay/Sidebar).
- [x] Task: Conductor - User Manual Verification 'Authentic YouTube UI & Sub-menus' (Protocol in workflow.md)

## Phase 3: Stremio Support & Cleanup
- [x] **Task:** Stremio Styling Overrides
    - Add Stremio-specific overrides in `src/content/styles.css` wrapped in the `.si-platform-stremio` namespace.
    - Adjust positioning/z-index if needed for the Stremio player.
- [x] **Task:** Clean up Legacy Code
    - Delete `src/content/components/SettingsDropdown.tsx` if it is no longer used.
    - Remove unused CSS classes related to the old sidebar settings menu.
- [x] Task: Conductor - User Manual Verification 'Stremio Support & Cleanup' (Protocol in workflow.md)
