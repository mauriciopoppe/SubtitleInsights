# Spec: Replace AI Furigana with Kuromoji-based Library

## Overview
Replace the current unreliable Chrome Prompt API-based Furigana generation with a deterministic library-based approach using `kuroshiro` and `kuromoji`. This will ensure high accuracy and consistent Hiragana readings for Japanese Kanji in the browser.

## Goals
- Implement Furigana generation using `kuroshiro` with the `kuromoji` analyzer.
- Ensure readings are always Hiragana and only applied to words containing Kanji.
- Maintain natural Japanese spacing (no artificial spaces).
- Validate the solution with a standalone Proof of Concept (PoC) before integration.

## Functional Requirements
- **PoC Phase:** Create a standalone directory (`poc/furigana`) with its own `package.json` to test `kuroshiro` + `kuromoji`.
- **Integration Phase:** Add libraries and dictionaries to the main codebase.
- **Service Refactor:** Replace `JapaneseFuriganaService` logic with the library-based implementation.
- **Normalization:** Ensure all output readings are in Hiragana.

## Non-Functional Requirements
- **Accuracy:** Readings must be highly accurate and consistent.
- **Browser Compatibility:** Must work within the browser environment (content script).

## Acceptance Criteria
- [ ] Standalone PoC demonstrates accurate Hiragana readings for sample Japanese sentences.
- [ ] Main extension displays correct Furigana without extra spaces.
- [ ] Readings are strictly Hiragana.
- [ ] Logic is deterministic and does not vary between runs.

## Out of Scope
- Supporting Katakana Furigana.
- New UI components.
