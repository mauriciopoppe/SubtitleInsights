# Plan: Centralized Logging with 'debug' Library

Integration of the `debug` library to manage scoped logging across the extension, including a developer toggle in the settings.

## Phase 1: Setup & Utility [checkpoint: 8fb7820]
...
## Phase 2: Core Refactoring (TDD) [checkpoint: 8fb7820]
- [x] Task: Refactor `src/background/index.ts` to use `si:bg`
- [x] Task: Refactor `src/content/store.ts` to use `si:store`
- [x] Task: Refactor `src/content/VideoController.ts` to use `si:video`
- [x] Task: Refactor AI modules (`manager.ts`, `translator.ts`, `explainer.ts`) to use `si:ai`
- [x] Task: Refactor `src/content/index.tsx` and `render.ts` to use `si:content`
- [x] Task: Verify that all refactored logs appear/disappear correctly when the toggle is flipped
- [x] Task: Conductor - User Manual Verification 'Phase 2: Core Refactoring (TDD)' (Protocol in workflow.md)

## Phase 3: Final Verification & Documentation [checkpoint: 1af9997]
- [x] Task: Scan entire `src/` directory for any remaining `console.log` statements and replace or remove them
- [x] Task: Verify logging behavior on both YouTube and Stremio
- [x] Task: Conductor - User Manual Verification 'Phase 3: Final Verification & Documentation' (Protocol in workflow.md)
