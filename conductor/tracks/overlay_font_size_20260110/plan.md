# Plan: Overlay Font Size Adjustment

Implementation of keyboard shortcuts (`-`/`_` and `=`/`+`) to adjust the overlay font size.

## Phase 1: Configuration & Storage [checkpoint: 657cd74]
- [x] Task: Update `AppConfig` interface in `src/content/config.ts` to include `overlayFontSize: number`.
- [x] Task: Update `Config.KEYS` and `Config.DEFAULTS` in `src/content/config.ts`.
- [x] Task: Add unit test in `src/content/store.test.ts` (or a new config test) to verify font size persistence.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Configuration & Storage' (Protocol in workflow.md)

## Phase 2: UI Implementation
- [x] Task: Modify `src/content/components/OverlayApp.tsx` to consume `overlayFontSize` from config.
- [x] Task: Update `src/content/components/OverlayApp.tsx` style to apply the dynamic font size.
- [x] Task: Implement `useEffect` in `OverlayApp.tsx` to listen for `keydown` events (`-`, `_`, `=`, `+`).
- [x] Task: Implement logic to update `Config` with new font size within the specified range (12px - 48px, step 2px).
- [x] Task: Update `src/content/styles.css` to set `#si-overlay` max-width to 50%.
- [x] Task: Write integration test in `src/content/overlay_integration.test.tsx` to verify font size changes on key presses.
- [x] Task: Conductor - User Manual Verification 'Phase 2: UI Implementation' (Protocol in workflow.md)

## Phase 3: Finalization [checkpoint: edd3bec]
- [x] Task: Update keyboard shortcut documentation in `docs/user-manual/keyboard-shortcuts.md`.
- [x] Task: Run `npm test -- run` to ensure all tests pass.
- [x] Task: Run `npm run lint` and `tsc --noEmit` to ensure code quality.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Finalization' (Protocol in workflow.md)
