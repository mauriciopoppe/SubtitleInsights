# Plan: Implement Brand Visual Identity in Extension CSS

## Phase 1: Foundations & Sidebar
- [ ] Task: Define brand CSS variables in `src/content/styles.css` under `:root`.
- [ ] Task: Update `#si-sidebar` background to be transparent.
- [ ] Task: Update `.si-sidebar-item.active` to use `--si-color-brand-blue` for the `border-left`.

## Phase 2: Overlay & Controls
- [ ] Task: Update `.si-overlay-toggle-pause.active` to use `--si-color-brand-blue`.
- [ ] Task: Review and update neutral/hover states across the overlay and sidebar to ensure a consistent grayscale look.

## Phase 3: Final Audit & Quality
- [ ] Task: Audit the Settings Popup to ensure toggles and navigation remain grayscale/neutral as requested.
- [ ] Task: Verify the YouTube player toggle underline remains red (`#f00`).
- [ ] Task: Run full project checks: `npm test -- run` and `npm run lint`.
- [ ] Task: Conductor - User Manual Verification 'Brand Implementation' (Protocol in workflow.md)
