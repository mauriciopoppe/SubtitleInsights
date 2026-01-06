# Specification: Master Extension Toggle in Popup

## Overview
Introduce a global "Master Toggle" at the top of the extension's settings popup. This toggle will control the overall enabled/disabled state of Subtitle Insights (`si_is_enabled`). When disabled, the extension should cease all UI rendering and background processing to minimize resource consumption and privacy footprint.

## Functional Requirements
1.  **Master Toggle UI**:
    - Add a "Master Enable" toggle as the first item in the `SettingsPopup` main menu.
    - This toggle binds directly to the `isEnabled` property in `src/content/config.ts`.
2.  **Visual Feedback (Disabled State)**:
    - When the Master Toggle is **OFF**:
        - All other menu items and sub-menus in the `SettingsPopup` must be visually grayed out (opacity reduction).
        - These items must be non-interactive (`pointer-events: none`).
        - The extension icon in the video player toolbar (YouTube/Stremio) must be visually "grayed out" or have reduced opacity.
    - When the Master Toggle is **ON**:
        - All items return to their normal interactive state.
        - The toolbar icon returns to its full visibility/active color.
3.  **Halt Processing**:
    - When `isEnabled` is **false**:
        - No AI prompts (Translation or Prompt API) should be executed.
        - Subtitle interception and parsing may continue if it reduces complexity, but no further downstream processing (translation/analysis) should occur.
        - DOM updates for the Sidebar and Overlay must be completely stopped.

## Technical Implementation Details
- **State Management**: Leverage the existing `Config.update({ isEnabled: ... })` pattern.
- **UI Logic**: 
    - Update `SettingsPopup.tsx` to conditionally apply a `disabled` state to all `SettingsItem` components if `config.isEnabled` is false (except for the Master Toggle itself).
    - Update `ExtensionToggle.tsx` to reflect the `isEnabled` state via CSS filters or opacity.
- **Processing Logic**: Ensure that the main AI managers or event listeners respect the `isEnabled` state before initiating any AI-related tasks.

## Acceptance Criteria
- [ ] A "Master Toggle" appears at the top of the settings popup.
- [ ] Turning the toggle OFF grays out all other options in the popup.
- [ ] The video player toolbar icon appears grayed out when the extension is disabled.
- [ ] When OFF, the Sidebar and Overlay are not rendered in the DOM.
- [ ] When OFF, no network or local AI processing occurs.
- [ ] The state persists correctly across page reloads.

## Out of Scope
- Granular per-site master toggles (this remains global).
- Refactoring the entire storage sync logic.
