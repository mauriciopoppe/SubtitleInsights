# Plan: Rebrand to "Subtitle Insights" and Prefix Migration

## Phase 1: Rebranding & Metadata
- [x] Task: Update extension name and description in `manifest.json`.
- [x] Task: Update product documentation in `conductor/product.md` and `conductor/product-guidelines.md`.
- [x] Task: Conductor - User Manual Verification 'Rebranding & Metadata' (Protocol in workflow.md)

## Phase 2: Internal Migration - Logic & State
- [ ] Task: Replace all `lle` prefixes with `si` in storage keys within `src/content/config.ts` and `src/content/profiles.ts`.
- [ ] Task: Update all console log prefixes from `[LLE]` to `[SI]` across the codebase.
- [ ] Task: Rename message types (e.g., `LLE_SUBTITLES_CAPTURED` -> `SI_SUBTITLES_CAPTURED`) in background and content scripts.
- [ ] Task: Update internal constant/variable names that explicitly use `lle`.
- [ ] Task: Conductor - User Manual Verification 'Internal Migration - Logic & State' (Protocol in workflow.md)

## Phase 3: Internal Migration - UI & Styling
- [ ] Task: Perform a global search and replace for `.lle-` class names to `.si-` in `src/content/styles.css` and all `.tsx` components.
- [ ] Task: Update DOM IDs (e.g., `#lle-overlay` -> `#si-overlay`) in CSS and components.
- [ ] Task: Update user-facing UI titles (e.g., "LLE Transcript" -> "Subtitle Insights").
- [ ] Task: Run `npm test -- run` to ensure no logic was broken by the rename.
- [ ] Task: Conductor - User Manual Verification 'Internal Migration - UI & Styling' (Protocol in workflow.md)
