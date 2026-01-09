# Specification: Fix Sidebar Rendering when Disabled

## Overview
This track addresses a bug where the sidebar component renders its content even when the "Show Sidebar" toggle is disabled, provided the global extension toggle is on. This occurs because the component logic misses a check for the specific sidebar visibility flag.

## Functional Requirements

### 1. Rendering Logic
- `SidebarApp` must strictly respect the `isSidebarEnabled` configuration flag.
- If `config.isSidebarEnabled` is `false`, `SidebarApp` must render `null`, regardless of the global `isEnabled` state (though global disabled implies sidebar disabled implicitly).

### 2. Consistency
- Ensure that the sidebar container in `App.tsx` handles visibility updates consistently with the component's rendering state to avoid layout shifts or empty containers taking up space.

## Non-Functional Requirements
- **Zero Flicker:** The sidebar should not flash visible on page load if it is configured to be disabled.

## Acceptance Criteria
- [ ] `SidebarApp` returns `null` when `isSidebarEnabled` is false.
- [ ] Sidebar is not visible on page load when "Show Sidebar" is OFF.
- [ ] Sidebar is not visible when toggling "Show Sidebar" from ON to OFF.
- [ ] Sidebar reappears correctly when toggled back ON.

## Out of Scope
- Major refactoring of the `App.tsx` portal logic (unless strictly necessary to fix the bug).
