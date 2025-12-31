# Plan: Recreate Grammar Explainer on Video Change

## Phase 1: Lifecycle Refinement & Unit Testing
- [x] Task: Review and Improve `src/content/ai/explainer.ts` Lifecycle.
    - [x] Implement `rootSession` and `workingSession` separation.
    - [x] Implement `resetSession()` using `clone()`.
    - [x] Ensure `destroy()` is safe and clears both sessions.
- [x] Task: Write Unit Tests for `GrammarExplainer`.
    - [x] Create `src/content/ai/explainer.test.ts`.
    - [x] Mock the Chrome Prompt API including the `clone()` method.
    - [x] Test that `resetSession()` creates a fresh clone and destroys the old one.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Lifecycle Refinement & Unit Testing' (Protocol in workflow.md)

## Phase 2: Integration & Triggering
- [x] Task: Update `src/content/index.tsx` Integration.
    - [x] Locate the `checkVideoChange` function.
    - [x] Call `grammarExplainer.resetSession()` when a video change is detected.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Integration & Triggering' (Protocol in workflow.md)
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Integration & Triggering' (Protocol in workflow.md)

## Phase 3: Verification & Polish
- [x] Task: Manual Browser Verification.
    - [x] Open YouTube and navigate between several Japanese videos.
    - [x] Verify that grammar explanations continue to work and do not "hang" after multiple videos.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Verification & Polish' (Protocol in workflow.md)
