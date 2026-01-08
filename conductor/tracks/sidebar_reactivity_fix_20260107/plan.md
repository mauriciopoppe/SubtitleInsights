# Plan: Restore Sidebar Reactivity for Asynchronous Data

This plan addresses the missing reactivity in the sidebar when AI data arrives.

## Phase 1: Investigation & Fix
- [x] Task: Investigate `src/content/store.ts` to confirm `updateSegmentTranslation` notifies listeners.
- [x] Task: Investigate `src/content/hooks/useSubtitleStore.ts` to confirm it subscribes to relevant updates.
- [x] Task: Implement a fix. Potential strategies:
    - **Strategy A (Implemented):** Ensure `SubtitleStore` creates a shallow copy of `segments` AND clones the updated `segment` object to trigger prop equality checks.
    - **Strategy B:** Pass a `version` or `lastUpdate` prop to `SidebarList` and `SidebarItem`.
    - **Strategy C:** (If needed) Use a signal for segment data itself (more complex).
    - *Decision:* Strategy A (with object cloning) was implemented.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Investigation & Fix' (Protocol in workflow.md) [checkpoint: 8ce3c97]
