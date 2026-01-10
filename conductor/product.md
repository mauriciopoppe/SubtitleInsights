# Product: Subtitle Insights

## Core Value Proposition

"Subtitle Insights" transforms any video with subtitles into an interactive language learning experience. By leveraging local, privacy-first AI models directly within Chrome, it provides real-time translations and grammatical insights for subtitle segments without sending data to external servers. It supports **multiple languages**, making it a versatile tool for learners.

## Brand & Identity

**Motto:** "Subtitle data, clarified."

**Logo Concept:** The "Waveform Text" (Minimalist). Three horizontal lines of varying heights (representing subtitle lines) where the bottom line represents the insights.

### Color Palette

- **Brand Blue (`#3ea6ff`):** Cool and trustworthy.
  - _Usage:_ Action & Structure (Links, Primary Buttons, Navbar).
- **Accent Yellow (`#ffd600`):** Urgent, Intelligence & Focus.
  - _Usage:_ Highlights, Error warnings, Active segments, "Pro" features.
- **Background (`#0f0f0f`):** The "Canvas" (Main workspace, Sidebar).
- **Neutral (`#f8fafc`):** Paper White.
  - _Usage:_ Primary text to ensure readability (WCAG AAA compliance).

### Design Guidelines: Yellow on Dark

To maintain a high-end feel when using the bright accent yellow on the dark background:

1.  **Avoid Yellow Text:** Yellow text on dark backgrounds is hard to read and looks dated. Use yellow for icons, borders, and accents instead.
2.  **Contrast Ratio:** `#FFD600` on `#0F0F0F` has a contrast ratio of ~13:1 (WCAG AAA). It is very bright, so use it sparingly.
3.  **Sparing Usage:** Use yellow only for elements that require immediate attention or indicate active state.

## Key Features

1.  **Platform Support**
    - **YouTube:** Automatic subtitle capture and seamless player integration.
    - **Stremio:** Full support via manual subtitle upload and overlay injection.

2.  **In-Page Overlay**
    - Displays the current subtitle segment directly over the video player.
    - **Pause on Hover:** Automatically pauses the video when the user hovers over the overlay near the end of a segment, allowing time to read and process the information. It is aware of Yomitan popups, keeping the video paused while the user interacts with the dictionary.
    - **Overlay Controls (Proximity):** Controls appear only when the mouse is near the top-left area to avoid distraction.
      - **Replay Segment:** Instantly replay the current segment to listen again.
      - **Scroll Sync:** Button to sync the sidebar view to the current active segment.
      - **Pause on Hover Toggle:** Quickly enable/disable the pause-on-hover behavior.
      - **Appearance Control:** Dynamic font size adjustment via keyboard shortcuts (`-`/`+`) with discrete levels (18px, 24px, 32px, 44px) and intelligent layout constraints (max-width 80%).

3.  **Smart Sidebar**
    - Displays the full transcript of the video with real-time active segment highlighting.
    - **Sync Button:** Instantly scrolls the sidebar to the currently playing segment.
    - **Sidebar Controls (Proximity):** Hovering near the right edge of any segment reveals:
      - **Jump to Segment:** Instantly seeks the video to the start of that specific segment.
      - **Manual Synchronization:** Align a specific segment to the current video time, shifting all subtitles to fix sync issues.

4.  **Extension Popup & Settings**
    - **Native Aesthetic:** Designed to strictly mimic the native YouTube settings UI for a seamless feel.
    - **Master Toggles:** Global enable/disable switches for the Overlay and Sidebar.
    - **Live AI Status:** Visual indicators for AI model status (Downloading, Ready, Error).
    - **Detailed Settings:** Access to advanced configurations and **Language Profiles**.

5.  **Keyboard Shortcuts**
    - **Native Integration:** Uses `chrome.commands` for low-latency, browser-level interaction.
    - **Navigation:** Configurable shortcuts for Next Segment, Previous Segment, and Replay Segment.
    - **State Aware:** Shortcuts are automatically disabled when the extension is toggled OFF.
    - **Playback Control:** Intelligently preserves playing/paused state during navigation, while forcing playback for Replays.

6.  **Language Profiles**
    - Create and save custom profiles for different learning goals (e.g., "Japanese - Grammar Focus", "Spanish - Vocabulary").
    - Customize the **System Prompt** for the AI to get specific types of insights.
    - Switch between profiles instantly.

7.  **Local AI Translation**
    - **Single High-Quality Translation:** Context-aware translation using Chrome's built-in AI Translation API.
    - **Privacy-First:** All processing happens locally on the device.
    - **Look-ahead Processing:** Pre-fetches translations for the next **10 segments**.

8.  **AI Insights (Grammar Explanation)**
    - Analyzes complex sentences to provide grammatical breakdowns and cultural context.
    - Powered by Chrome's built-in Prompt API (Gemini Nano).
    - **Look-ahead Processing:** Pre-fetches insights for the next **5 segments**.

## User Experience

- **Seamless Integration:** The extension injects a clean, unobtrusive overlay into the video player (e.g., YouTube).
- **Language Agnostic:** Works with any language supported by the underlying AI models.
- **Performance:** Optimized for low latency using local models.
- **Accessibility:** Supports keyboard shortcuts and visual cues.

## Technical Foundation

- **Chrome Built-in AI:**
  - [Translation API](https://github.com/WICG/translation-api) for segment translation.
  - [Prompt API](https://github.com/explainers-by-googlers/prompt-api) for grammatical insights.
- **Framework:** Preact for a lightweight, performant UI.
- **Architecture:**
  - `VideoController`: A reactive controller using signals (`currentTimeMs`, `isPlaying`) to sync the application state with the native HTML5 video player, handling time updates and seek events efficiently.
  - `SubtitleStore`: Centralized state management for subtitle segments, translations, and AI processing status. Handles parsing (SRT, JSON) and notifies listeners of updates.
  - `ProfileManager`: Manages user settings and language profiles, persisting configuration (system prompts, source/target languages) to Chrome's local storage.
  - `AIManager`: Orchestrates AI tasks with buffering (10 segments for translation, 5 for insights).
  - `Centralized Logging`: Uses the `debug` library to provide scoped, controllable logs for developers, accessible via a "Debug Mode" toggle.
  - `OverlayApp`: Handles the visual presentation and user interactions on top of the video.

## Future Direction

- Expand support for more video platforms.
- Allow users to customize AI prompts for different learning styles.
