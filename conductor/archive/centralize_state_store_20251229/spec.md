# Specification: Centralize State in Store

## Context
During the Preact migration, temporary globals (`window.__LLE_SIDEBAR__`, `window.__LLE_OVERLAY__`) were introduced to bridge the gap between the legacy imperative `index.tsx` logic and the new declarative components. This approach is brittle and pollutes the global scope.

## Goal
Centralize all UI-related states that are managed by `index.tsx` or background processes into the `SubtitleStore`. This makes the `SubtitleStore` the single source of truth for both data (subtitles) and UI status.

## Requirements

### Store Updates
Add the following fields to `SubtitleStore`:
1.  `aiStatus`: `{ status: 'downloading' | 'ready' | 'error' | 'none'; message?: string }`
2.  `warning`: `string | undefined`
3.  `systemMessage`: `string | null`
4.  `isUploadActive`: `boolean`
5.  `uploadFilename`: `string | undefined`

### Hook Updates
Update `useSubtitleStore` to return an object containing both `segments` and the new UI state fields.

### Component Updates
1.  `SidebarApp.tsx`:
    *   Remove local states for `aiStatus`, `warning`, `isUploadActive`, `uploadFilename`.
    *   Remove the `useEffect` that sets `window.__LLE_SIDEBAR__`.
    *   Read these values from `useSubtitleStore`.
2.  `OverlayApp.tsx`:
    *   Remove local state for `systemMessage`.
    *   Remove the `useEffect` that sets `window.__LLE_OVERLAY__`.
    *   Read `systemMessage` from `useSubtitleStore`.

### Entry Point Updates
`index.tsx`:
*   Replace calls to `getSidebar()?.setAIStatus(...)` with `store.setAIStatus(...)`.
*   Replace calls to `getOverlay()?.setSystemMessage(...)` with `store.setSystemMessage(...)`.
*   Remove helper functions `getSidebar` and `getOverlay`.

## Functional Parity
*   Status updates must reflect instantly in the UI.
*   The "Sync" logic and "Upload" logic should remain functional.
