# Plan: Refactor Extension Toggle to Preact

## Phase 1: Component Implementation
- [x] Task: Create `src/content/components/ExtensionToggle.tsx`.
    - [x] Port the SVG and class logic from `index.tsx`.
    - [x] Implement the toggle functionality using `Config.setIsEnabled`.
    - [x] Ensure `useConfig` hook is used for reactivity.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Component Implementation' (Protocol in workflow.md)

## Phase 2: Integration & Cleanup
- [x] Task: Update `src/content/index.tsx`.
    - [x] Replace `setupToggle` function call with a Preact `render` call.
    - [x] Remove the legacy `setupToggle` implementation.
    - [x] Handle injection point logic (inserting before the CC button).
- [x] Task: Verify Functional Parity.
    - [x] Confirm button appears in the correct location.
    - [x] Confirm clicking the button toggles the extension state.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Integration & Cleanup' (Protocol in workflow.md)
