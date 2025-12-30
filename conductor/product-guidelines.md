# Product Guidelines - Language Learning Extension

## Visual Identity
- **Integrated Look:** UI elements must mimic the YouTube native style (Roboto font, semi-transparent black backgrounds, rounded corners). Custom player buttons should use SVG icons and match native spacing/hover states.
- **Subtitle Contrast:** Subtitles must remain legible over any video content. Use a subtle text shadow or high-transparency dark background bar.

## Content & Tone
- **Functional Brevity:** AI-generated explanations should be direct and concise. Avoid "Sure, I can help with that" or other conversational filler.
- **Structural Clarity:** When providing breakdowns, use clear delimiters (e.g., `[Word] - [Reading] - [Translation]`).
- **Educational Accuracy:** Prioritize correctness in literal translations even if it results in slightly awkward English, to help the user understand the underlying Japanese structure.

## Performance Principles (Prototyping)
- **Zero Latency Goal:** Prioritize perceived performance. If the Prompt API is slow, show a loading state for the specific word/segment rather than blocking the entire UI.
- **Lean Implementation:** Use lightweight frameworks like Preact for declarative UI while keeping the footprint minimal to ensure the video player remains performant.
