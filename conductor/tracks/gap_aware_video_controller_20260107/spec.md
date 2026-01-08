# Specification: Gap-Aware Video Controller and AI Optimization

## Overview
Currently, `App.tsx` subscribes to the high-frequency `videoController.currentTimeMs` signal (updating every ~250ms) primarily to notify `translationManager` of time updates. The `translationManager` then performs a linear scan to find the current or next segment to prefetch AI data.

This track aims to optimize this process by making `VideoController` "gap-aware." It will compute a stable `targetSegmentIndex` signal that points to the most relevant segment (the active one, or the immediate next one if in a gap). This allows `translationManager` to subscribe directly to this stable signal, eliminating high-frequency updates and redundant scans.

## Functional Requirements

### 1. Gap-Aware VideoController
- **New Signal:** Add `targetSegmentIndex` signal to `VideoController`.
- **Logic:**
    - If `activeSegmentIndex` >= 0, `targetSegmentIndex` = `activeSegmentIndex`.
    - If `activeSegmentIndex` == -1 (gap), `targetSegmentIndex` = the index of the *next* segment (found via optimized search/scan).
    - If no next segment (end of video), `targetSegmentIndex` = -1.
- **Optimization:** Ensure this computation happens efficiently within the existing loop or computed signal to avoid double-scanning.

### 2. Autonomous AIManager
- **Refactor:** Update `AIManager` (the `translationManager` instance) to no longer rely on `onTimeUpdate(time)`.
- **Initialization:** `AIManager` should accept the `VideoController` instance (or be wired to import it) and set up its own subscription to `targetSegmentIndex`.
- **Logic:**
    - When `targetSegmentIndex` changes, trigger the pre-fetching logic for translation and grammar insights.
    - Remove the linear scan logic from `AIManager` as the controller now provides the definitive index.

### 3. App Component Cleanup
- **Remove Subscription:** Remove the `useEffect` in `App.tsx` that subscribes to `currentTimeMs` and calls `translationManager`.
- **Result:** `App.tsx` becomes purely a layout/container component, decoupling it from the AI logic loop.

## Non-Functional Requirements
- **Performance:** `App.tsx` renders should effectively drop to near zero during playback (excluding sidebar/overlay layout changes).
- **Stability:** AI prefetching must continue to work seamlessly across gaps, jumps, and seeks.

## Acceptance Criteria
- [ ] `VideoController` exposes a correct `targetSegmentIndex` signal that updates only when the relevant segment changes.
- [ ] `App.tsx` has NO subscription to `currentTimeMs` for translation purposes.
- [ ] `translationManager` automatically triggers pre-fetching when `targetSegmentIndex` updates.
- [ ] AI Translations and Insights appear correctly as the video plays, even after seeking or crossing gaps.
