# Specification - Structured Subtitle Upload

## Overview

This feature allows users to upload a pre-processed JSON file containing high-quality subtitle data (translations, furigana, breakdowns). When a file is uploaded, the extension will prioritize this "structured" data over the unreliable in-device Chrome Prompt API, ensuring a superior and consistent learning experience.

## Functional Requirements

### 1. Data Structure

The uploaded file must be a Markdown file (`.md`) where each subtitle segment is defined as a section starting with `## [Expression]`. Each section contains a bulleted list with the following keys:

- `**Timestamp Start**`: number (seconds)
- `**Timestamp End**`: number (seconds)
- `**Translation**`: string (natural translation)
- `**Literal Translation**`: string (word-for-word breakdown)
- `**Segmentation**`: space-separated string of tokens, where tokens can be `Word(Reading)`
- `**Contextual Analysis**`: string (nuance and context)
- `**Grammatical Gotchas**`: string (multiline markdown list of difficult grammar points)

### 2. UI - Upload Button

- Add an "Upload" icon or button to the YouTube player controls, positioned next to the "LLE" toggle.
- Clicking the button opens a standard file picker (accepting `.md`).

### 3. Processing & Sync Logic

- Once a file is uploaded, the extension should parse it and populate the `SubtitleStore`.
- **Exclusive Source:** If a structured file is active, the extension MUST disable the automatic AI translation/segmentation logic for that video.
- **Sync:** Display the data from the file based on the `start` and `end` timestamps matching the video's current playback time.

### 4. Persistence

- The uploaded data should persist for the duration of the current video session.
- (Optional/Future) Store data in `chrome.storage.local` indexed by Video ID.

## Non-Functional Requirements

- **Performance:** Parsing and switching to structured data should be instantaneous.
- **Reliability:** The UI should gracefully handle malformed JSON files.

## Acceptance Criteria

- [ ] Users can click an "Upload" button in the YouTube player.
- [ ] Selecting a valid JSON file populates the overlay with the provided data.
- [ ] The AI processing logs ("Processing lazy batch...") stop appearing when a file is active.
- [ ] Subtitles change correctly according to the `start`/`end` timestamps in the file.

## Out of Scope

- Editing the structured data within the extension.
- Cloud syncing of uploaded subtitle files.
