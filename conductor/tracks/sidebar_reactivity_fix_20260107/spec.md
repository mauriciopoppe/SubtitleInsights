# Specification: Restore Sidebar Reactivity for Asynchronous Data

## Overview
After recent optimizations to `VideoController` and `SidebarItem` (using signals for active state), users observed that sidebar items no longer update immediately when asynchronous data (like translations or AI insights) arrives.

This is likely because the store updates fields on existing segment objects in place, and while the store might notify listeners, the React/Preact diffing mechanism in `SidebarList` or `SidebarItem` might not detect a "change" if object references remain identical, or if the component is somehow shielded from updates. We need to ensure that when `translation` or `insights` properties of a segment change, the corresponding `SidebarItem` re-renders to display them.

## Investigation Findings (Hypothesis)
- `store.updateSegmentTranslation` mutates the segment.
- `useSubtitleStore` triggers a re-render of `SidebarApp`.
- `SidebarApp` passes the *same* `segments` array reference (or a new array with same segment object references) to `SidebarList`.
- `SidebarList` re-renders.
- `SidebarItem` receives the *same* segment object reference.
- If `SidebarItem` is strictly optimized or if Preact sees the same props, it might skip render.
- **Correction:** `SidebarItem` is NOT memoized, so it *should* re-render if the parent does. We need to confirm if `SidebarApp` is actually re-rendering upon translation updates.

## Functional Requirements
1.  **Reactivity:** When `store.updateSegmentTranslation` or `store.updateSegmentInsights` is called, the specific `SidebarItem` displaying that segment MUST re-render to show the new data.
2.  **Performance:** We should ideally avoid re-rendering the *entire* list if possible, but correctness comes first. If we must re-render the list, it must be performant.

## Plan
1.  **Verify Store Notifications:** Ensure `updateSegmentTranslation` calls `notifyListeners` (or `notifySegmentUpdate`).
2.  **Verify Hook:** Ensure `useSubtitleStore` subscribes to these notifications.
3.  **Fix Propagation:** If the update is happening but not rendering, we might need to force a prop change (e.g., passing a `version` or `updatedAt` timestamp to `SidebarList` -> `SidebarItem`, or cloning the segment in the store).

## Acceptance Criteria
- [ ] Manual verification: Load a video, ensure translations appear in the sidebar as they are generated, without needing to scroll or interact.
