# Plan: Settings Dropdown and UI Renaming (Insights)

## Phase 1: Component Infrastructure & Dropdown Logic
- [x] Task: Create `SettingsDropdown.tsx` component.
    - [x] Implement the dropdown shell with Preact.
    - [x] Add "click outside to close" logic using a global event listener.
- [x] Task: Update `SidebarHeader.tsx` to include the Settings trigger.
    - [x] Add a gear icon (SVG) to the controls row.
    - [x] Implement state to toggle the dropdown.
    - [x] Verify basic toggle and click-outside behavior.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Component Infrastructure & Dropdown Logic' (Protocol in workflow.md)

## Phase 2: Content Migration & UI Renaming
- [x] Task: Move Toggles into the Dropdown.
    - [x] Relocate "Overlay" and "AI" (to be renamed) toggles from the main header into the `SettingsDropdown`.
    - [x] Ensure functional parity (props/callbacks correctly passed).
- [x] Task: Rename "AI" to "Insights" in the UI.
    - [x] Update labels, tooltips, and success/error messages in components.
    - [x] Update documentation where appropriate (product.md).
- [x] Task: Conductor - User Manual Verification 'Phase 2: Content Migration & UI Renaming' (Protocol in workflow.md)

## Phase 3: Styling & Integration Refinement
- [x] Task: Finalize CSS for the Dropdown.
    - [x] Ensure the dropdown matches the YouTube theme (dark background, rounded corners).
    - [x] Add hover states and transitions.
- [x] Task: Run automated tests.
    - [x] Execute `npm test -- run` to ensure no UI regressions.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Styling & Integration Refinement' (Protocol in workflow.md)
