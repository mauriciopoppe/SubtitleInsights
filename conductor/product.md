# Initial Concept

I want to build a chrome extension that uses the Chrome Prompt API at https://developer.chrome.com/docs/ai/prompt-api. This is a toy project so experimentation and running as fast as possible is a must. No need to adhere to strict conventions. Just make it run as fast as possible.

# Product Guide - Language Learning Extension (YouTube)

## Core Concept
A Chrome extension designed for language learners who use YouTube as their primary source of immersion. It overlays advanced translation data on top of native YouTube subtitles, leveraging the local Chrome Prompt API for high-performance, privacy-respecting AI features.

## Target Audience
- Language learners (specifically Japanese to English initially).
- Users who want both literal and natural translations to understand grammar and nuance.
- Students of Kanji and Kana who benefit from Romaji and furigana-like aids.

## Key Features
- **Dual Subtitles:** Overlays secondary English subtitles on top of original Japanese ones.
- **Literal vs. Natural:** Displays both a word-for-word breakdown and a fluid natural translation.
- **Furigana & Segmentation:** Adds Hiragana readings above Kanji (using `<ruby>`) and segments sentences with visible spaces for easier reading.
- **Pre-fetch Translation:** Optimizes speed by fetching and translating subtitle tracks ahead of playback.
- **AI Automated Translation:** Automatically translates Japanese subtitle tracks into English using on-device AI models if no manual data is provided.
- **Player Integration:** Adds a seamless enable/disable toggle directly into the YouTube player controls.
- **Structured Subtitle Upload:** Move subtitles management to the sidebar for a cleaner interface.
- **Sidebar Transcript:** Provides a vertical list of all educational segments in the YouTube sidebar, highlighting the active segment in sync with the video.
- **Granular Visibility Controls:** A sub-toggle in the sidebar allows users to hide/show the on-video overlay independently of the sidebar content.
- **In-Page Overlay:** Injects directly into the YouTube player for a seamless, "Language Reactor"-style experience.

## User Experience
1. User navigates to a YouTube video in Japanese.
2. The extension activates, pre-fetching the subtitle track.
3. The Chrome Translation API processes the segments (up to 20 in advance).
4. An overlay appears on the player, showing the dual-translation.
5. (Optional) User uploads a structured Markdown file to upgrade the experience to expert-curated content.
