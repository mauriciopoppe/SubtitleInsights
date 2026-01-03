# Plan - Sidebar Transcript

## Phase 1: Sidebar Structure and Injection [checkpoint: 497351e]

- [x] Task: Create a `Sidebar` class or module in `src/content/sidebar.ts` to manage the sidebar DOM.
- [x] Task: Implement sidebar injection logic into `#secondary-inner` in `src/content/index.ts`.
- [x] Task: Add basic CSS for the sidebar container in `src/content/styles.css`.
- [x] Task: Implement visibility toggle for the sidebar based on `Config.isEnabled`.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Sidebar Structure and Injection' (Protocol in workflow.md)

## Phase 2: Transcript Rendering [checkpoint: 497351e]

- [x] Task: Implement a `render` method in the sidebar to generate the list of cards from `SubtitleStore` segments.
- [x] Task: Use `renderSegmentedText` and `snarkdown` within the sidebar cards to match the overlay's data richness.
- [x] Task: Update the sidebar whenever new segments are loaded (e.g., after a successful upload).
- [x] Task: Conductor - User Manual Verification 'Phase 2: Transcript Rendering' (Protocol in workflow.md)

## Phase 3: Active Segment Synchronization [checkpoint: 497351e]

- [x] Task: Add a method to the sidebar to update the "highlighted" state of segments.
- [x] Task: Hook into the existing `timeupdate` listener in `src/content/index.ts` to call the sidebar's highlight method.
- [x] Task: Add CSS for the `.lle-sidebar-item.active` state.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Active Segment Synchronization' (Protocol in workflow.md)

## Phase 4: Polish and Lifecycle Management [checkpoint: 497351e]

- [x] Task: Ensure the sidebar is cleared when the store is cleared (e.g., on YouTube navigation).
- [x] Task: Refine CSS to match YouTube's native look and feel (spacing, colors, scrollbar).
- [x] Task: Conductor - User Manual Verification 'Phase 4: Polish and Lifecycle Management' (Protocol in workflow.md)
