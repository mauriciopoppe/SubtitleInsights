# Specification: Settings Dropdown and UI Renaming (Insights)

## Overview

To declutter the sidebar header, the "Overlay" and "AI" (to be renamed "Insights") controls will be moved into a new "Settings" dropdown menu. This menu will be triggered by a gear icon in the header and will support "click outside to close" behavior.

## Functional Requirements

### 1. Settings Trigger

- Add a gear (cog) icon button to the `SidebarHeader` controls.
- Clicking the gear toggles the visibility of the settings dropdown.

### 2. Settings Dropdown Component

- Create a declarative dropdown menu that appears below the settings button.
- **Items inside:**
  - **Overlay Toggle:** Includes the existing label and toggle logic.
  - **Insights Toggle:** (Renamed from "AI") Includes the existing icon, label, and toggle logic.
- **Behavior:**
  - Close on clicking the gear again (toggle).
  - Close on clicking anywhere outside the dropdown menu.

### 3. Renaming AI to Insights

- Update the "AI" label to "Insights" in the UI.
- Update tooltips/titles from "Toggle AI Grammar Explanation" to "Toggle AI Insights".
- _Note:_ Internal variable names (e.g., `aiEnabled`) remain unchanged for now to minimize risk, but user-facing text must change.

### 4. Header Decluttering

- Remove the individual "Overlay" and "AI" buttons from the main `SidebarHeader` control row.
- Keep "Sync" and "Upload" as primary actions in the header.

## Non-Functional Requirements

- **Visual Consistency:** Use YouTube-native styling for the dropdown (dark background, hover states, clear boundaries).
- **Click-Outside Logic:** Use a robust pattern (e.g., a global event listener) to ensure the dropdown closes when the user interacts with the video or sidebar.

## Acceptance Criteria

- The gear icon is visible in the sidebar header.
- Clicking the gear opens a menu containing "Overlay" and "Insights" toggles.
- The "AI" label is replaced by "Insights" everywhere in the UI.
- Clicking outside the menu closes it.
- The "Overlay" and "Insights" toggles still function correctly.

## Out of Scope

- Adding new settings (language selection, custom prompts) in this track.
