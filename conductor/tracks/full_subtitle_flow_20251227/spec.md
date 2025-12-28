# Track Spec: Implement Full Subtitle Translation Flow

## Overview
This track implements the end-to-end functionality of the extension: intercepting YouTube subtitle requests, processing them through the Chrome Prompt API for dual-language display, and synchronizing the overlay with the video playback.

## Functional Requirements
- **Subtitle Interception:** Implement a method to capture YouTube's native `/api/timedtext` requests or parse the resulting data.
- **Chrome Prompt API Integration:** 
    - Verify API availability.
    - Implement a translation service that sends Japanese segments to the local model.
    - Support "Literal" vs. "Natural" translation modes via prompt instructions.
- **Batch Processing:** Implement a sliding window batcher to translate upcoming subtitle segments (e.g., next 10 lines) ahead of time.
- **Dynamic Overlay Updates:** Update the `lle-overlay` created in the previous track with real-time synchronized Japanese/English text based on video `currentTime`.
- **Kanji Hover (Initial):** Basic implementation of the Prompt API to provide a definition when a word in the overlay is hovered.

## Non-Functional Requirements
- **Latency:** Translation processing must not lag significantly behind video playback.
- **Efficiency:** Minimize redundant API calls by caching translated segments for the current video session.

## Acceptance Criteria
- Extension successfully captures subtitles from a Japanese YouTube video.
- The dual-subtitle overlay displays accurate translations synced within ±200ms of the native video subtitles.
- Hovering over a word triggers a secondary Prompt API call that displays a tooltip with linguistic context.

## Out of Scope
- User settings UI (hardcode Japanese -> English for now).
- Complex multi-segment grammar analysis.
- Persisting translations across different video sessions (server-side).
