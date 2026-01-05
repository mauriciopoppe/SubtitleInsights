# Plan: Manual Subtitle Synchronization

## Goal
Implement a manual synchronization feature that allows users to shift all subtitle timestamps based on the current video time and a selected segment.

## Phases

### Phase 1: Store & Logic
- [ ] **Task: Store Extension**
    - Add an `applyOffset(offsetMs: number)` method to `SubtitleStore`.
    - Implement the shift logic (update all `start` and `end` times).
    - Ensure `notifyListeners()` is called after the shift.
- [ ] **Task: Logic Unit Tests**
    - Write unit tests in `src/content/store.test.ts` to verify `applyOffset` correctly shifts multiple segments and handles boundary cases (e.g., negative start times).
- [ ] **Task: Conductor - User Manual Verification 'Store & Logic' (Protocol in workflow.md)**

### Phase 2: UI Component Updates
- [ ] **Task: Hover Logic Hook**
    - Implement a custom hook or logic within `SidebarItem` to manage the 2-second hover timer.
- [ ] **Task: Sync Icon Injection**
    - Update `SidebarItem.tsx` to include the sync icon (SVG gear/sync).
    - Add CSS for positioning the icon in the top-right corner and handling its transition/visibility.
- [ ] **Task: Handle Sync Action**
    - Connect the icon's click event to the `applyOffset` logic.
    - Retrieve `video.currentTime` and calculate the offset.
- [ ] **Task: Conductor - User Manual Verification 'UI Component Updates' (Protocol in workflow.md)**

### Phase 3: Integration & Polish
- [ ] **Task: Visual Feedback**
    - Add a brief "Subtitles synchronized" notification (optional, maybe a `systemMessage` in store).
- [ ] **Task: Edge Case Handling**
    - Ensure the auto-scroll logic in `SidebarApp` still works correctly after timestamps are shifted.
- [ ] **Task: Conductor - User Manual Verification 'Integration & Polish' (Protocol in workflow.md)**
