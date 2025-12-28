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
- **AI-Powered Context:** Uses the Chrome Prompt API to provide definitions, grammar explanations, and Kanji breakdowns on hover.
- **Pre-fetch Translation:** Optimizes speed by fetching and translating subtitle tracks ahead of playback.
- **In-Page Overlay:** Injects directly into the YouTube player for a seamless, "Language Reactor"-style experience.

## User Experience
1. User navigates to a YouTube video in Japanese.
2. The extension activates, pre-fetching the subtitle track.
3. The Chrome Prompt API processes the segments.
4. An overlay appears on the player, showing the dual-translation.
5. User can hover over complex Kanji to get instant AI-generated linguistic context.
