# Plan: Extension Icon Visibility Improvements

This plan refactors the YouTube toolbar extension icon to improve its visibility through SVG outlines and CSS-based state styling.

## Phase 1: SVG & CSS Refactoring
- [x] Task: Modify inline SVG in `ExtensionToggle.tsx` to add `stroke` and `stroke-width`
- [x] Task: Create `.si-icon-enabled` and `.si-icon-disabled` classes in `src/content/styles.css`
- [x] Task: Update `ExtensionToggle.tsx` to use these classes and remove inline styles
- [x] Task: Implement filled vs outlined state logic (Refinement)
- [x] Task: Conductor - User Manual Verification 'Phase 1: SVG & CSS Refactoring' (Protocol in workflow.md)

## Phase 2: Refinement & Verification
- [ ] Task: Manually verify visibility on both dark and light YouTube themes
- [ ] Task: Adjust `stroke-width` if necessary to match neighboring icons
- [ ] Task: Ensure the `.active` red underline still works correctly
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Refinement & Verification' (Protocol in workflow.md)
