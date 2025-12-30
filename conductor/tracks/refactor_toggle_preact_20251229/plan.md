# Plan: Refactor Extension Toggle to Preact

## Phase 1: Component Implementation
- [ ] Task: Create `src/content/components/ExtensionToggle.tsx`.
    - [ ] Port the SVG and class logic from `index.tsx`.
    - [ ] Implement the toggle functionality using `Config.setIsEnabled`.
    - [ ] Ensure `useConfig` hook is used for reactivity.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Component Implementation' (Protocol in workflow.md)

## Phase 2: Integration & Cleanup
- [ ] Task: Update `src/content/index.tsx`.
    - [ ] Replace `setupToggle` function call with a Preact `render` call.
    - [ ] Remove the legacy `setupToggle` implementation.
    - [ ] Handle injection point logic (inserting before the CC button).
- [ ] Task: Verify Functional Parity.
    - [ ] Confirm button appears in the correct location.
    - [ ] Confirm clicking the button toggles the extension state.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Integration & Cleanup' (Protocol in workflow.md)
