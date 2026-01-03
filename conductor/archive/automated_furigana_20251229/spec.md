# Spec: Automated Furigana Generation (Kuromoji.js)

## Overview

Automate the generation of Furigana (Hiragana readings for Kanji) for captured Japanese subtitles. This feature replaces manual annotation with an on-the-fly morphological analysis using `kuromoji.js`. The analysis will occur in the Background Service Worker to minimize impact on the YouTube player's performance.

## Functional Requirements

- **Dictionary Management:**
  - The `kuromoji.js` dictionary (~15MB) must be bundled with the extension.
  - **Pre-load on Startup:** The background script must initiate the dictionary loading process immediately upon initialization.
- **Subtitle Analysis:**
  - When Japanese subtitles are captured (`api/timedtext`), the Background script passes the raw text through the `kuromoji` tokenizer.
  - The tokenizer outputs `surface_form` (original text) and `reading` (Katakana reading).
  - The system must convert Katakana readings to Hiragana for display.
  - The system must reconstruct the sentence into the `AISegment[][]` structure expected by the frontend:
    - Segments (words) separated by spaces.
    - Kanji words annotated with their reading.
    - Kana-only words or punctuation left as-is.
- **Data Transmission:**
  - The `LLE_SUBTITLES_CAPTURED` message payload sent to the content script must now include the structured/segmented data with readings, not just raw text.
- **UI Rendering:**
  - Existing `Overlay` and `Sidebar` components will use the new data structure to automatically render `<ruby>` tags.

## Non-Functional Requirements

- **Performance:** Dictionary loading and text analysis must run in the Background Service Worker to avoid blocking the main thread (video playback).
- **Memory Efficiency:** The dictionary should only reside in the Background Service Worker's memory.

## Acceptance Criteria

- Loading a Japanese video automatically displays readings above Kanji in the Overlay without user intervention.
- The Sidebar transcript displays the same readings.
- No manual markdown upload is required to see Furigana.
- The dictionary loads automatically when the extension starts.
