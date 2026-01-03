# Spec: Furigana and Word Segmentation with Chrome Prompt API

## Overview

Enhance the learning experience by adding Furigana (readings) above Kanji and segmenting Japanese sentences into words with visible spaces. This will be powered by the Chrome Prompt API to provide context-aware readings and segmentation.

## Functional Requirements

- **AI-Powered Analysis:** Use the Chrome Prompt API to process raw Japanese subtitle text.
- **Structured AI Response:** Request JSON output from the AI in the format `Array<{word: string, reading?: string}>`.
- **Furigana Rendering:** Use HTML `<ruby>` tags to display readings directly above Kanji.
- **Word Segmentation:** Insert physical space characters between segments to help the user distinguish individual words.
- **Integration:** Process intercepted subtitle segments before they are rendered in the overlay.

## Non-Functional Requirements

- **Performance:** Ensure the prompt used is optimized for speed to minimize delay in subtitle display.
- **Reliability:** Fall back to the original text if the AI fails or returns invalid JSON.

## Acceptance Criteria

- [ ] Subtitles display with Furigana correctly positioned above Kanji using native `<ruby>` elements.
- [ ] Visible spaces exist between Japanese words in the rendered subtitle.
- [ ] The implementation utilizes the Chrome Prompt API and parses a JSON response.
- [ ] The system handles cases where the AI might return segments without readings (e.g., Kana-only words).

## Out of Scope

- Interactive hover definitions (definitions/grammar explanations).
- User configuration for space width or furigana toggle (this is a high-velocity prototype).
