# Plan: Keyboard Shortcuts for Segment Navigation

Implementation of `chrome.commands` to navigate between subtitle segments, integrated with the `VideoController` and gated by the extension's enabled state.

## Phase 1: Infrastructure & Background Relay
- [x] Task: Add `commands` definitions to `manifest.json` (next-segment, previous-segment, replay-segment)
- [x] Task: Implement `chrome.commands.onCommand` listener in `src/background/index.ts` to relay messages to the active tab
- [x] Task: Conductor - User Manual Verification 'Phase 1: Infrastructure & Background Relay' (Protocol in workflow.md)

## Phase 2: Content Script Logic (TDD)
- [x] Task: Add navigation methods to `VideoController.ts` (e.g., `seekToNext()`, `seekToPrev()`, `replay()`)
- [x] Task: Write unit tests in `src/content/VideoController.test.ts` for the new navigation logic (state preservation vs. forced play)
- [x] Task: Implement the navigation logic in `VideoController.ts` to satisfy the tests
- [x] Task: Setup message listener in `src/content/index.tsx` to call `VideoController` methods
- [x] Task: Verify shortcuts are ignored when `isEnabled` is false (using `useConfig` or store state)
- [x] Task: Conductor - User Manual Verification 'Phase 2: Content Script Logic (TDD)' (Protocol in workflow.md)

## Phase 3: Documentation & Polish
- [x] Task: Update `docs/user-manual/index.md` or a relevant guide to include instructions on configuring shortcuts
- [x] Task: Verify behavior on both YouTube and Stremio
- [x] Task: Conductor - User Manual Verification 'Phase 3: Documentation & Polish' (Protocol in workflow.md)
