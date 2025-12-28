# Plan: Furigana and Word Segmentation

Implement Furigana and word segmentation for Japanese subtitles using the Chrome Prompt API, utilizing `<ruby>` tags for rendering and physical spaces for segmentation.

## Phase 1: AI Prompt Engineering & Data Structure [checkpoint: 8eaff15]
- [x] Task: Define the system prompt for the Chrome Prompt API to ensure stable JSON output containing words and readings.
- [x] Task: Create a utility function `parseAISubtitleResponse` to safely parse and validate the AI's JSON output.
- [x] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)

## Phase 2: UI Component Rendering
- [x] Task: Create a rendering function `renderSegmentedText` that takes the AI data and returns an HTML string/fragment using `<ruby>` and spaces.
- [x] Task: Add basic CSS styles to `src/content/styles.css` to ensure `<ruby>` tags and spaces are legible within the YouTube overlay.
- [x] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)

## Phase 3: Integration with Subtitle Pipeline
- [ ] Task: Modify the existing subtitle processing logic (likely in `src/content/index.ts` or `ai.ts`) to intercept raw text and pass it through the Prompt API.
- [ ] Task: Update the overlay update logic to use the new `renderSegmentedText` output instead of raw text.
- [ ] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)
