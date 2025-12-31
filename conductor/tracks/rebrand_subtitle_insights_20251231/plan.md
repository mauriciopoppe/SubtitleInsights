# Plan: Rebrand to "Subtitle Insights" and Prefix Migration

## Phase 1: Rebranding & Metadata [checkpoint: f263c62]
- [x] Task: Update extension name and description in `manifest.json`.
- [x] Task: Update product documentation in `conductor/product.md` and `conductor/product-guidelines.md`.
- [x] Task: Conductor - User Manual Verification 'Rebranding & Metadata' (Protocol in workflow.md)

## Phase 2: Internal Migration - Logic & State
- [x] Task: Replace all `lle` prefixes with `si` in storage keys within `src/content/config.ts` and `src/content/profiles.ts`.
- [x] Task: Update all console log prefixes from `[LLE]` to `[SI]` across the codebase.
- [x] Task: Rename message types (e.g., `LLE_SUBTITLES_CAPTURED` -> `SI_SUBTITLES_CAPTURED`) in background and content scripts.
- [x] Task: Update internal constant/variable names that explicitly use `lle`.
- [x] Task: Conductor - User Manual Verification 'Internal Migration - Logic & State' (Protocol in workflow.md)

## Phase 3: Internal Migration - UI & Styling
- [ ] Task: Perform a global search and replace for `.lle-` class names to `.si-` in `src/content/styles.css` and all `.tsx` components.
- [ ] Task: Update DOM IDs (e.g., `#lle-overlay` -> `#si-overlay`) in CSS and components.
- [ ] Task: Update user-facing UI titles (e.g., "LLE Transcript" -> "Subtitle Insights").
- [ ] Task: Run `npm test -- run` to ensure no logic was broken by the rename.
- [ ] Task: Conductor - User Manual Verification 'Internal Migration - UI & Styling' (Protocol in workflow.md)
