# Specification: Automated Language Detection for Subtitles

## Overview

This track implements automated language detection for captured subtitles using the experimental Chrome Language Detector API. The goal is to determine the subtitle language when YouTube metadata is missing or ambiguous, and use this information as a "Silent Gate" to enable/disable AI features (Translator and Explainer).

## Functional Requirements

1.  **Language Detection Service (`src/content/ai/detector.ts`):**
    - Implement a `LanguageDetectorService` wrapper for `window.LanguageDetector`.
    - Provide methods to check availability and initialize the detector.
    - Provide a `detectLanguage(text: string): Promise<string | null>` method that returns the BCP 47 language tag of the highest confidence result.
2.  **Ingestion Logic (`src/content/index.tsx` & `src/content/store.ts`):**
    - When subtitles are captured (`LLE_SUBTITLES_CAPTURED`):
      - If `message.language` is missing or generic:
        - Aggregate the text from the first few segments (e.g., first 5 segments).
        - Use `LanguageDetectorService` to identify the language.
        - Update `SubtitleStore` with the detected language.
3.  **Silent Gate Integration (`src/content/ai/manager.ts`):**
    - The `AIManager` must continue to respect `store.sourceLanguage`.
    - If the detected (or provided) language is not Japanese (`ja`), AI processing (translation/grammar) must be skipped.

## Non-Functional Requirements

- **Fallback Reliability:** The detector should only be used if the metadata provided by the platform is absent or unreliable.
- **Performance:** Language detection should be performed once per video (during initial ingestion) to minimize overhead.
- **Error Handling:** If the detector API is unavailable, the system should fail gracefully, either by defaulting to existing metadata or disabling AI features if metadata is also missing.

## Acceptance Criteria

- Subtitles captured without explicit language metadata are correctly identified by the Language Detector.
- AI features (Translator and Explainer) are automatically disabled for non-Japanese subtitle tracks.
- AI features remain active for Japanese tracks, even if metadata was initially missing but correctly detected.
- Verified that `window.LanguageDetector` is utilized correctly according to the provided types.

## Out of Scope

- Per-segment language detection for mixed-language tracks.
- Supporting AI features for languages other than Japanese in this phase.
