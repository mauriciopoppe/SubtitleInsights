# Plan: Fix Sidebar Rendering when Disabled

Fix the rendering condition in `SidebarApp.tsx` to ensure it returns `null` when `isSidebarEnabled` is false, preventing content from leaking into the UI when disabled.

## Phase 1: Implementation & Verification [checkpoint: ]
- [x] Task: Create or update a test for `SidebarApp` to verify it returns `null` when `isEnabled` is true but `isSidebarEnabled` is false.
- [x] Task: Modify `src/content/components/SidebarApp.tsx` to include the `isSidebarEnabled` check in its rendering logic.
- [x] Task: Audit `src/content/components/App.tsx` visibility logic to ensure no conflicting styles are applied to the container on initial mount.
- [x] Task: Verify that toggling the sidebar via the popup menu immediately updates the visibility correctly on both YouTube and Stremio.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Implementation & Verification' (Protocol in workflow.md)
