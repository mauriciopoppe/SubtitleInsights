# Plan: Gap-Aware Video Controller and AI Optimization

This plan refactors the `VideoController` to compute a stable `targetSegmentIndex` and updates `AIManager` to subscribe to it directly, eliminating high-frequency updates in `App.tsx`.

## Phase 1: VideoController Enhancements
- [x] Task: Update `VideoController` to compute `targetSegmentIndex` (active index or next index)
- [x] Task: Optimize the calculation logic to avoid redundant scans
- [x] Task: Update unit tests for `VideoController` to verify `targetSegmentIndex` behavior
- [x] Task: Conductor - User Manual Verification 'Phase 1: VideoController Enhancements' (Protocol in workflow.md) [checkpoint: 5da202e]

## Phase 2: AIManager Refactoring
- [x] Task: Refactor `AIManager` to subscribe internally to `videoController.targetSegmentIndex`
- [x] Task: Remove `onTimeUpdate` method from `AIManager`
- [x] Task: Simplify pre-fetching logic to use the provided `targetSegmentIndex` without re-scanning
- [x] Task: Ensure jump detection (clearing queues) still works correctly using index shifts
- [x] Task: Conductor - User Manual Verification 'Phase 2: AIManager Refactoring' (Protocol in workflow.md) [checkpoint: 61d7592]

## Phase 3: Integration & Cleanup
- [ ] Task: Remove `currentTimeMs` subscription and `translationManager.onTimeUpdate` call from `App.tsx`
- [ ] Task: Update `OverlayApp` or other components if they can benefit from the stable `targetSegmentIndex`
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Integration & Cleanup' (Protocol in workflow.md)

## Phase 4: Final Verification
- [ ] Task: Manual verification on YouTube to ensure AI pre-fetching works across gaps and jumps
- [ ] Task: Verify performance improvement (fewer renders/calls during playback)
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Verification' (Protocol in workflow.md)
