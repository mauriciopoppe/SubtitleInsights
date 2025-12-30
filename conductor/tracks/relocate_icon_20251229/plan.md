# Plan: Relocate Extension Icon (Right Controls)

## Phase 1: Icon Design & DOM Injection
- [~] Task: Create a new SVG icon for the extension button.
    - [ ] Design or source a simple SVG (e.g., "Translate" icon) that fits the YouTube player aesthetic.
- [x] Task: Update `setupToggle` in `src/content/index.ts`.
    - [x] Change the target container selector from `.ytp-left-controls` to `.ytp-right-controls`.
    - [x] Update the injection logic to insert *before* `.ytp-subtitles-button`.
    - [x] Update the button creation code to use the new SVG and native-like classes (`ytp-button`).
- [x] Task: Conductor - User Manual Verification 'Phase 1: Icon Design & DOM Injection' (Protocol in workflow.md)

## Phase 2: Styling & Polish
- [ ] Task: Update CSS for the new button.
    - [ ] Modify `src/content/styles.css` to remove old "pill" styles.
    - [ ] Add new styles to ensure the icon centers correctly and matches `.ytp-button` hover states.
    - [ ] Ensure the "enabled" state (active) is visually distinct (e.g., icon color change or underline, similar to how CC button shows active state).
- [ ] Task: Clean up old code.
    - [ ] Remove any unused CSS or JS related to the old left-control pill button.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Styling & Polish' (Protocol in workflow.md)
