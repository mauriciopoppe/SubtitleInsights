# Plan: Dual-Speed AI Processing Queues

## Phase 1: Internal Naming Refactor [checkpoint: 8ee37e6]
- [x] Task: Rename all internal "grammar" references to "insights" in `src/content/ai/manager.ts`.
    - [x] `grammarBuffer` -> `insightsBuffer`
    - [x] `needsGrammar` -> `needsInsights`
- [x] Task: Update logic in `triggerPrefetch` and `processSegment` to reflect naming.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Internal Naming Refactor' (Protocol in workflow.md)

## Phase 2: Implementation of Serial Insights Gate
- [x] Task: Add `isInsightsProcessing` lock to `AIManager`.
- [x] Task: Refactor `processQueue` to separate Translation and Insights execution.
    - [x] Translations should remain in `Promise.all`.
    - [x] Insights should be processed one-by-one (serial execution).
- [x] Task: Implement queue clearing logic on video/time jumps.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Implementation of Serial Insights Gate' (Protocol in workflow.md)

## Phase 3: Verification & Integration Testing
- [x] Task: Add integration test for dual-queue behavior.
    - [x] Mock rapid video time updates.
    - [x] Verify that multiple translations fire in parallel.
    - [x] Verify that insights fire sequentially.
- [x] Task: Verify in browser that "Prompt API Busy" errors are resolved.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Verification & Integration Testing' (Protocol in workflow.md)