# Plan - Structured Subtitle Upload

## Phase 1: Storage and State Management [checkpoint: 10f3a0e]

- [x] Task: Update `SubtitleSegment` interface in `src/content/store.ts` to include new fields (natural/literal translations, components, etc.).
- [x] Task: Add a `isStructured` flag to `SubtitleStore` to track if data came from a file.
- [x] Task: Modify `processBatch` and `updatePlaybackTime` in `src/content/store.ts` to skip AI processing if `isStructured` is true.
- [x] Task: Implement `SubtitleStore.loadStructuredData(data: any[])` to clear existing segments and load the new JSON format.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Storage and State Management' (Protocol in workflow.md)

## Phase 2: UI Implementation

- [x] Task: Add an `<input type="file" id="lle-upload-input">` (hidden) and a corresponding upload button in `src/content/index.ts`.
- [x] Task: Style the upload button in `src/content/styles.css` to match the "LLE" toggle.
- [x] Task: Implement the file change listener to read the JSON file using `FileReader` and call `store.loadStructuredData`.
- [x] Task: Conductor - User Manual Verification 'Phase 2: UI Implementation' (Protocol in workflow.md)

## Phase 3: Rendering Updates

- [x] Task: Update `src/content/render.ts` (or `index.ts`) to handle the display of new structured fields (literal translation, contextual analysis, etc.).
- [x] Task: Update the overlay HTML structure in `createOverlay` to include containers for the new data points (gotchas, analysis).
- [x] Task: Conductor - User Manual Verification 'Phase 3: Rendering Updates' (Protocol in workflow.md)

## Phase 4: Polish and Cleanup

- [x] Task: Add error handling/notifications for invalid JSON format.
- [x] Task: Ensure the "LLE" toggle still works to show/hide the entire overlay even with structured data.
- [x] Task: Verify that navigation to a new video clears the uploaded data (as per current navigation logic).
- [x] Task: Conductor - User Manual Verification 'Phase 4: Polish and Cleanup' (Protocol in workflow.md)
