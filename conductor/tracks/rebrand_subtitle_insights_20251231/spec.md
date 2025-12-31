# Specification: Rebrand to "Subtitle Insights" and Prefix Migration

## Overview
This track involves rebranding the extension from "Language Learning Extension" to **"Subtitle Insights"** and performing a comprehensive internal refactor to replace the `lle` prefix with `si` (or `si-` for CSS classes) across the entire codebase.

## Functional Requirements
1.  **Public Rebranding**:
    *   Update `manifest.json` name and description.
    *   Update `conductor/product.md` and `conductor/product-guidelines.md`.
    *   Update all user-facing UI strings (e.g., "LLE Transcript" -> "Subtitle Insights").
2.  **Internal Prefix Migration (`lle` -> `si`)**:
    *   **CSS Classes**: Rename all `.lle-*` classes to `.si-*` (e.g., `.lle-overlay` -> `.si-overlay`).
    *   **Storage Keys**: Rename all `lle_*` keys to `si_*` (e.g., `lle_is_enabled` -> `si_is_enabled`).
    *   **Log Prefixes**: Update console log tags from `[LLE]` to `[SI]`.
    *   **DOM IDs**: Rename IDs like `#lle-sidebar` to `#si-sidebar`.
    *   **Message Types**: Update message types like `LLE_SUBTITLES_CAPTURED` to `SI_SUBTITLES_CAPTURED`.
3.  **Fresh Start Storage**:
    *   No data migration logic is required. Existing settings under `lle_` keys will be ignored in favor of new `si_` defaults.

## Non-Functional Requirements
*   **Consistency**: Every instance of the old prefix must be replaced to avoid "prefix pollution."
*   **Zero Regression**: The extension must maintain all existing functionality after the rename.

## Acceptance Criteria
- [ ] Extension name appears as "Subtitle Insights" in Chrome Extensions menu.
- [ ] The sidebar header displays "Subtitle Insights".
- [ ] Inspecting the DOM shows classes like `si-overlay` and `si-sidebar-item`.
- [ ] Chrome local storage contains keys starting with `si_`.
- [ ] Console logs are prefixed with `[SI]`.
- [ ] Extension functionality (toggle, overlay, insights, translation) remains fully operational.
