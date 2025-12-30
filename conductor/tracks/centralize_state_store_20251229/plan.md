# Plan: Centralize State in Store

## Phase 1: Store Enhancement [checkpoint: afbe312]
- [x] Task: Update `SubtitleStore` class in `src/content/store.ts`.
    - [x] Add properties for `aiStatus`, `warning`, `systemMessage`, `isUploadActive`, `uploadFilename`.
    - [x] Implement setter methods for each (e.g., `setAIStatus`, `setSystemMessage`, `setUploadStatus`).
    - [x] Ensure setters call `notifyListeners()`.
- [x] Task: Verify Store logic with unit tests.
    - [x] Update `src/content/store.test.ts` to cover the new state fields and setters.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Store Enhancement' (Protocol in workflow.md)

## Phase 2: Hook & Component Refactor [checkpoint: f3e92d5]
- [x] Task: Update `useSubtitleStore` hook.
    - [x] Modify `src/content/hooks/useSubtitleStore.ts` to return an object with all store fields.
- [x] Task: Refactor `SidebarApp.tsx`.
    - [x] Remove local state and window bridge.
    - [x] Connect to store fields via updated hook.
- [x] Task: Refactor `OverlayApp.tsx`.
    - [x] Remove local state and window bridge.
    - [x] Connect to store fields via updated hook.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Hook & Component Refactor' (Protocol in workflow.md)

## Phase 3: Integration & Cleanup
- [ ] Task: Update `src/content/index.tsx`.
    - [ ] Remove `getSidebar` and `getOverlay` bridge helpers.
    - [ ] Update all AI and setup logic to call `store` methods directly.
- [ ] Task: Final Verification & Test.
    - [ ] Run `npm test -- run` to ensure integration tests still pass (may need minor updates to match new hook return signature).
    - [ ] Verify manual functionality in browser.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Integration & Cleanup' (Protocol in workflow.md)
