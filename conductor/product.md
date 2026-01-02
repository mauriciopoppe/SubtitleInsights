# Product: Subtitle Insights

## Core Value Proposition

"Subtitle Insights" transforms any video with subtitles into an interactive language learning experience. By leveraging local, privacy-first AI models directly within Chrome, it provides real-time translations and grammatical insights for subtitle segments without sending data to external servers. It supports **multiple languages**, making it a versatile tool for learners.

## Key Features

1.  **In-Page Overlay**
    *   Displays the current subtitle segment directly over the video player.
    *   **Pause on Hover:** Automatically pauses the video when the user hovers over the overlay near the end of a segment, allowing time to read and process the information.
    *   **Interactive Controls:**
        *   **Replay Segment:** Instantly replay the current segment to listen again.
        *   **Scroll Sync:** Button to sync the sidebar view to the current active segment.
        *   **Pause Toggle:** Easily enable/disable the pause-on-hover feature.
    *   **Proximity Visibility:** Controls appear only when the mouse is near the top-left area to avoid distracting from the content or blocking interactions (e.g., with Yomitan).

2.  **Smart Sidebar**
    *   Displays the full transcript of the video.
    *   Highlights the active segment in real-time.
    *   **Sync Button:** Instantly scrolls the sidebar to the currently playing segment.

3.  **Local AI Translation**
    *   **Single High-Quality Translation:** Provides a context-aware translation for each segment using Chrome's built-in AI Translation API.
    *   **Privacy-First:** All processing happens locally on the device.
    *   **Look-ahead Processing:** Pre-fetches translations for the next **10 segments** to ensure seamless playback.

4.  **AI Insights (Grammar Explanation)**
    *   analyzes complex sentences to provide grammatical breakdowns and cultural context.
    *   Powered by Chrome's built-in Prompt API (Gemini Nano).
    *   **Look-ahead Processing:** Pre-fetches insights for the next **5 segments**.

## User Experience

*   **Seamless Integration:** The extension injects a clean, unobtrusive overlay into the video player (e.g., YouTube).
*   **Language Agnostic:** Works with any language supported by the underlying AI models.
*   **Performance:** Optimized for low latency using local models.
*   **Accessibility:** Supports keyboard shortcuts and visual cues.

## Technical Foundation

*   **Chrome Built-in AI:**
    *   [Translation API](https://github.com/WICG/translation-api) for segment translation.
    *   [Prompt API](https://github.com/explainers-by-googlers/prompt-api) for grammatical insights.
*   **Framework:** Preact for a lightweight, performant UI.
*   **Architecture:**
    *   `SubtitleStore`: Centralized state management for segments and playback status.
    *   `AIManager`: Orchestrates AI tasks with buffering (10 segments for translation, 5 for insights).
    *   `OverlayApp`: Handles the visual presentation and user interactions on top of the video.

## Future Direction

*   Expand support for more video platforms.
*   Allow users to customize AI prompts for different learning styles.

