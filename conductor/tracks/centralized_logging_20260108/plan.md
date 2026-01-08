# Plan: Centralized Logging with 'debug' Library

Integration of the `debug` library to manage scoped logging across the extension, including a developer toggle in the settings.

## Phase 1: Setup & Utility
- [x] Task: Install `debug` and `@types/debug` dependencies
- [x] Task: Create `src/content/logger.ts` to export named logger instances for each namespace (`ai`, `content`, `bg`, `video`, `store`)
- [x] Task: Update `src/settings/App.tsx` to include a "Debug Mode" toggle that persists to `chrome.storage`
- [x] Task: Implement a synchronization mechanism to update `localStorage.debug` based on the `isEnabled` and `isDebugMode` flags
- [x] Task: Conductor - User Manual Verification 'Phase 1: Setup & Utility' (Protocol in workflow.md)

## Phase 2: Core Refactoring (TDD)
- [x] Task: Refactor `src/background/index.ts` to use `si:bg`
- [x] Task: Refactor `src/content/store.ts` to use `si:store`
- [x] Task: Refactor `src/content/VideoController.ts` to use `si:video`
- [x] Task: Refactor AI modules (`manager.ts`, `translator.ts`, `explainer.ts`) to use `si:ai`
- [x] Task: Refactor `src/content/index.tsx` and `render.ts` to use `si:content`
- [x] Task: Verify that all refactored logs appear/disappear correctly when the toggle is flipped
- [x] Task: Conductor - User Manual Verification 'Phase 2: Core Refactoring (TDD)' (Protocol in workflow.md)

## Phase 3: Final Verification & Documentation
- [ ] Task: Scan entire `src/` directory for any remaining `console.log` statements and replace or remove them
- [ ] Task: Verify logging behavior on both YouTube and Stremio
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Final Verification & Documentation' (Protocol in workflow.md)
