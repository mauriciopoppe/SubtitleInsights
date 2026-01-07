# Plan: Brand Asset Integration & Extension Theming

## Phase 1: Core Extension Assets

- [ ] Task: Update `manifest.json` to use `docs/public/logo.svg` for the extension icons.
- [ ] Task: Update `ExtensionToggle.tsx` to use the new logo SVG and apply the grayscale filter when disabled.
- [ ] Task: Verify the toolbar icon's visual appearance in both enabled and disabled states.

## Phase 2: Settings Page Theming

- [ ] Task: Update `src/settings/App.tsx` and associated styles to center the logo and include the motto.
- [ ] Task: Apply the brand palette (Blue for buttons/headers, Yellow for warnings) to the settings page.
- [ ] Task: Implement the "Waveform" motif as a visual separator in the settings page CSS.

## Phase 3: Documentation Refinement

- [ ] Task: Add the brand motto to the `docs/index.md` hero section or header.
- [ ] Task: Add a visual waveform separator to `docs/index.md`.
- [ ] Task: Run full project checks: `npm test -- run` and `npm run lint`.
- [ ] Task: Conductor - User Manual Verification 'Brand Asset Integration' (Protocol in workflow.md)
