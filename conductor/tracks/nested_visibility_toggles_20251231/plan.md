# Plan: Granular Visibility Controls (Nested Toggles)

## Phase 1: Configuration and State Persistence [checkpoint: f61f7ae]
- [x] Task: Update `Config` type and storage keys in `src/content/config.ts` to include granular visibility flags.
- [x] Task: Update `useConfig` hook to provide the new visibility settings.
- [x] Task: Conductor - User Manual Verification 'Configuration and State Persistence' (Protocol in workflow.md)

## Phase 2: UI - Settings Dropdown Refactor [checkpoint: be03064]
- [x] Task: Implement tri-state logic for "Master" toggles in `src/content/components/SettingsDropdown.tsx`.
- [x] Task: Implement nested/indented toggle rows for Overlay and Sidebar visibility.
- [x] Task: Add styling for nested toggles in `src/content/styles.css`.
- [x] Task: Conductor - User Manual Verification 'UI - Settings Dropdown Refactor' (Protocol in workflow.md)

## Phase 3: Integration - Component Visibility
- [ ] Task: Update `src/content/components/OverlayApp.tsx` to respect `isInsightsVisibleInOverlay` and `isTranslationVisibleInOverlay`.
- [ ] Task: Update `src/content/components/SidebarItem.tsx` to respect `isInsightsVisibleInSidebar` and `isTranslationVisibleInSidebar`.
- [ ] Task: Verify that site-wide master toggles still override granular visibility when turned OFF.
- [ ] Task: Conductor - User Manual Verification 'Integration - Component Visibility' (Protocol in workflow.md)
