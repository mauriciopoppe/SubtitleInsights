# Spec: AI Subtitle Analysis & Translation Overlay

## Overview
Implement an automated subtitle analysis feature that uses the Chrome built-in Translation API (`window.Translation` or `self.Translation`) to provide natural English translations for Japanese YouTube videos. These translations will be displayed in both the on-video overlay and the sidebar transcript to assist language learners.

## Functional Requirements
- **AI Translation:** Use the `self.Translation.create({ sourceLanguage: 'ja', targetLanguage: 'en' })` API to translate Japanese subtitle segments into English.
- **Availability Check:** Before creating a translator, verify availability using `self.Translation.availability({ sourceLanguage: 'ja', targetLanguage: 'en' })`.
- **Model Download Handling:**
    - If status is `after-download`, initiate the download by calling `create()`.
    - Display a "Downloading AI models..." message in the Overlay.
    - Display a download status icon/notification in the Sidebar Header.
    - Once downloaded, proceed with translation automatically.
- **Hybrid Pre-fetching:** Implement a buffer logic that translates the current segment and up to **20 upcoming segments** in advance to ensure smooth, low-latency playback.
- **UI Placement (Overlay):** The AI-generated translation must appear in the `Overlay` component, specifically positioned *above* the original Japanese text.
- **UI Placement (Sidebar):** The AI-generated translation must also be populated in the `Sidebar` transcript, updating the corresponding segment cards.
- **Auto-Activation:** The translation process should trigger automatically when a Japanese subtitle track is captured (via the existing `LLE_SUBTITLES_CAPTURED` message) if no structured Markdown file has been manually uploaded.
- **Error Handling:** Gracefully handle API unavailability or translation failures by falling back to displaying only the original text.

## Non-Functional Requirements
- **Performance:** Avoid blocking the main thread.
- **Privacy:** Leverage the local nature of the Chrome AI APIs.
- **API Availability:** Assume the user is on a Chrome version that supports the `Translation` API.

## Acceptance Criteria
- When a Japanese video is played, English translations appear above the Japanese subtitles in the overlay.
- The translations are also visible in the sidebar transcript cards.
- If models need downloading, a visible status is shown in both Overlay and Sidebar.
- The overlay syncs correctly with the video time.
- The system correctly "pre-fetches" up to 20 upcoming segments.
- If a manual Markdown file is uploaded, the AI translation is superseded by the file content.
