# Plan: Dual-Speed AI Processing Queues

## Phase 1: Internal Naming Refactor
- [ ] Task: Rename all internal "grammar" references to "insights" in `src/content/ai/manager.ts`.
    - [ ] `grammarBuffer` -> `insightsBuffer`
    - [ ] `needsGrammar` -> `needsInsights`
- [ ] Task: Update logic in `triggerPrefetch` and `processSegment` to reflect naming.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Internal Naming Refactor' (Protocol in workflow.md)

## Phase 2: Implementation of Serial Insights Gate
- [ ] Task: Add `isInsightsProcessing` lock to `AIManager`.
- [ ] Task: Refactor `processQueue` to separate Translation and Insights execution.
    - [ ] Translations should remain in `Promise.all`.
    - [ ] Insights should be processed one-by-one (serial execution).
- [ ] Task: Implement queue clearing logic on video/time jumps.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Implementation of Serial Insights Gate' (Protocol in workflow.md)

## Phase 3: Verification & Integration Testing
- [ ] Task: Add integration test for dual-queue behavior.
    - [ ] Mock rapid video time updates.
    - [ ] Verify that multiple translations fire in parallel.
    - [ ] Verify that insights fire sequentially.
- [ ] Task: Verify in browser that "Prompt API Busy" errors are resolved.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Verification & Integration Testing' (Protocol in workflow.md)
