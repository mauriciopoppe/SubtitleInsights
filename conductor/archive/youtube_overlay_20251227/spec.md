# Track Spec: Prototype the YouTube Overlay with Mock Data

## Overview

This track focuses on establishing the foundational UI for the language learning extension. We will build a Chrome extension that injects a custom subtitle overlay directly into the YouTube video player. This prototype will use mock data to verify the "dual subtitle" layout (Japanese original + English translation) and ensure the styling integrates seamlessly with YouTube's interface.

## Goals

- Scaffold a modern Chrome extension using Vite and TypeScript.
- Successfully inject a content script into YouTube watch pages.
- Locate the YouTube video player container and overlay a custom DOM element.
- Display mock dual-subtitles with appropriate styling.

## Requirements

- **Manifest V3:** Use the latest extension manifest standards.
- **Vite Build System:** Fast development cycles with Hot Module Replacement.
- **TypeScript:** Type-safe code for UI logic and DOM manipulation.
- **In-Page Injection:** Elements must be injected into the YouTube DOM, not a separate popup.

## UI Design (Mock)

- A semi-transparent black bar positioned at the bottom center of the video player.
- Two lines of text:
  - Top line (Natural English Translation): "I'm going to the store."
  - Bottom line (Original Japanese): "お店に行きます。"
- Font: Roboto (standard YouTube font).
- Responsiveness: The overlay should roughly follow the video player's size.

## Technical Approach

1. **Scaffolding:** Use `vite` with `@crxjs/vite-plugin` for a seamless extension development experience.
2. **Detection:** Use a robust selector to find the `.video-stream` or the player container (`#movie_player`).
3. **Injection:** Create a root element for the extension and append it to the player container.
4. **Mocking:** For this track, we will not fetch actual YouTube CC data; we will simply toggle a static overlay for visual verification.
