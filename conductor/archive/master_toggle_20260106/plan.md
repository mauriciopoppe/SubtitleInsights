# Plan: Master Extension Toggle in Popup

## Phase 1: UI Implementation [checkpoint: 318f760]
- [x] **Task: Update Settings Popup Component**
    - [x] Create a test for `SettingsPopup` verifying the "Master Toggle" exists and is the first item.
    - [x] Add the "Master Enable" toggle to `src/content/components/SettingsPopup.tsx`.
    - [x] Bind the toggle to `config.isEnabled`.
- [x] **Task: Implement Disabled State Logic**
    - [x] Update `SettingsPopup` to conditionally apply a `disabled` prop to all other items when `config.isEnabled` is false.
    - [x] Add CSS for `.si-item-disabled` (if not fully covered) to ensure items look disabled and have `pointer-events: none`.
- [x] **Task: Visual Feedback for Toolbar Icon**
    - [x] Update `ExtensionToggle.tsx` (or its styles) to apply a "grayed out" filter/opacity when `config.isEnabled` is false.
    - [x] Verify the icon looks distinct (active vs. inactive) in the YouTube player toolbar.
- [x] **Task: Conductor - User Manual Verification 'Phase 1: UI Implementation' (Protocol in workflow.md)**

## Phase 2: Logic & Process Halted [checkpoint: 8d3f40c]
- [x] **Task: Halt Subtitle Processing**
    - [x] Create a test ensuring AI processing does not fire when `isEnabled` is false.
    - [x] Update `src/content/ai/manager.ts` (or relevant managers) to check `Config.get().isEnabled` before initiating translations or insights.
- [x] **Task: Verify DOM Cleanup**
    - [x] Verify `App.tsx` already handles hiding the Sidebar/Overlay when disabled.
    - [x] Ensure any other injected elements (except the toggle button itself) are hidden/removed.
- [x] **Task: Conductor - User Manual Verification 'Phase 2: Logic & Process Halted' (Protocol in workflow.md)**
