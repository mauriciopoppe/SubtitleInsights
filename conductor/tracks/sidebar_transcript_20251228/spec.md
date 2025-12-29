# Specification - Sidebar Transcript

## Overview
This feature adds a transcript-style sidebar to the YouTube video page. It displays all segments currently loaded in the `SubtitleStore` (primarily from uploaded structured Markdown files) in a vertical list. This provides a "bird's-eye view" of the entire video's educational content, complementing the on-video overlay.

## Functional Requirements

### 1. Sidebar Injection
- Target: Prepend a new container to `#secondary-inner` on the YouTube watch page.
- Visibility: The sidebar must follow the global LLE toggle state (hidden when the extension is disabled).

### 2. Transcript Content
- Render a vertical list of cards, one for each `SubtitleSegment` in the store.
- Each card must display:
    - **Original Text**: Japanese text with Furigana (using `<ruby>` tags).
    - **Natural Translation**: The fluid English translation.
    - **Literal Translation**: The word-for-word breakdown.
    - **Contextual Analysis**: Rendered using Markdown (snarkdown).
    - **Grammatical Gotchas**: Rendered using Markdown (snarkdown).

### 3. Active Segment Highlighting
- The sidebar segment that matches the current video playback time must be visually highlighted (e.g., a distinct border or background color).
- The highlight should update in sync with the on-video overlay.

### 4. Static Behavior
- The list is for viewing only; clicking a segment does NOT seek the video.

## Non-Functional Requirements
- **Styling**: The sidebar should blend with YouTube's UI (dark mode support, Roboto font, standard padding).
- **Performance**: Efficiently update the highlight without re-rendering the entire list on every `timeupdate`.

## Acceptance Criteria
- [ ] A sidebar appears at the top of the right-hand column when the extension is enabled and subtitles are loaded.
- [ ] All data points (translations, analysis, gotchas) are visible for each segment in the list.
- [ ] The segment corresponding to the video's current position is visually distinct.
- [ ] Toggling LLE to "disabled" hides the sidebar immediately.
- [ ] Navigating to a new video or clearing the store clears the sidebar content.

## Out of Scope
- Auto-scrolling the sidebar to keep the active segment in view.
- Seeking the video via clicking sidebar items.
- Support for generating sidebar content via the Prompt API (initially focused on uploaded structured data).
