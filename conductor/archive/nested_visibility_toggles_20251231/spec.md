# Specification: Granular Visibility Controls (Nested Toggles)

## Overview

This feature introduces nested visibility controls for **AI Insights** and **Translations** within the Settings Dropdown. While the top-level toggles will continue to act as "Master Switches" for the features site-wide, new sub-toggles will allow users to independently control their visibility in the **Overlay** vs. the **Sidebar**.

## Functional Requirements

1.  **Nested Hierarchy**:
    - The "AI Insights" and "Translation" settings in the dropdown will now expand to show two sub-options:
      - "Visible in Overlay"
      - "Visible in Sidebar"
    - These sub-options must be visually indented to indicate hierarchy.
2.  **Tri-state Master Toggle**:
    - The parent toggle must reflect the state of its children:
      - **ON**: Both Overlay and Sidebar are visible.
      - **OFF**: Both Overlay and Sidebar are hidden.
      - **Indeterminate (Mixed)**: One is visible, the other is hidden.
    - Clicking the parent toggle when in a "Mixed" or "OFF" state should turn both children "ON". Clicking it when "ON" should turn both "OFF".
3.  **Independent Persistence**:
    - The visibility state for Overlay and Sidebar must be saved independently in the user's profile/config.
4.  **Component Integration**:
    - `OverlayApp` must respect the "Visible in Overlay" setting for both Insights and Translations.
    - `SidebarApp` (specifically `SidebarItem`) must respect the "Visible in Sidebar" setting for both Insights and Translations.

## User Interface (UX)

- **Settings Dropdown**: Toggles for "AI Insights" and "Translation" will be followed by indented "Visible in Overlay" and "Visible in Sidebar" toggles.
- **Indeterminate State**: The master toggle should use a standard UI pattern (e.g., a horizontal dash) when children have different values.

## Technical Considerations

- Update `Config` type/storage to include:
  - `isInsightsVisibleInOverlay`
  - `isInsightsVisibleInSidebar`
  - `isTranslationVisibleInOverlay`
  - `isTranslationVisibleInSidebar`
- Refactor `SettingsDropdown.tsx` to handle nested components and the tri-state logic.

## Acceptance Criteria

- [ ] Users can hide Insights in the Overlay while keeping them visible in the Sidebar.
- [ ] Users can hide Translations in the Sidebar while keeping them visible in the Overlay.
- [ ] Turning the master "AI Insights" toggle OFF hides insights everywhere.
- [ ] The master toggle correctly displays an indeterminate state when sub-toggles differ.
- [ ] Settings persist across page reloads.
