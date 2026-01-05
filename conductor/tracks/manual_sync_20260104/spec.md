# Spec: Manual Subtitle Synchronization

## Overview
Provide users with a way to manually synchronize uploaded subtitles with the video playback. Users can listener for a specific audio cue, pause or note the video time, and then align a specific subtitle segment to that exact timestamp. The extension will then shift all segments by the calculated offset.

## Functional Requirements

### 1. Sync Trigger UI
- **Element:** A small sync/gear icon in the top-right corner of each `SidebarItem`.
- **Visibility:** The icon appears ONLY after the user has hovered over a specific segment for at least **2 seconds**.
- **Tooltip:** Show "Sync subtitles to current video time" on icon hover.

### 2. Synchronization Logic
- **Input:** 
    - `video.currentTime` (the target timestamp).
    - `selectedSegment.start` (the current start time of the hovered segment).
- **Calculation:** `offset = (video.currentTime * 1000) - selectedSegment.start`.
- **Action:** Apply the calculated `offset` to the `start` and `end` times of **ALL** segments currently in the `SubtitleStore`.
- **Scope:** This logic applies to both YouTube-captured subtitles and manually uploaded SRT files, although it's primarily targeted at fixing sync for uploaded files.

### 3. State Management
- **Persistence:** The offset is applied in-memory to the current session's segments.
- **Reset:** If the page is reloaded or a new video is loaded, the offset is lost (segments revert to original timestamps if re-fetched/re-uploaded).
- **Update Notification:** The UI (sidebar and overlay) must immediately reflect the shifted timestamps.

## Non-Functional Requirements
- **Smooth Interaction:** The 2-second hover delay should be implemented to prevent visual clutter during rapid scrolling.
- **Accuracy:** Timestamps should be handled in milliseconds to ensure precise alignment.

## Acceptance Criteria
- [ ] Hovering over a sidebar segment for 2s reveals a sync icon.
- [ ] Clicking the sync icon calculates the correct offset between the video and the segment.
- [ ] All segments in the transcript shift their timestamps according to the offset.
- [ ] The video overlay displays the correct (shifted) segment for the current video time.
- [ ] The feature works seamlessly with manually uploaded SRT files.

## Out of Scope
- Persisting offsets across reloads or between different users.
- Exporting the shifted subtitles as a new SRT file.
- Individual segment shifting (only global shift is supported).
