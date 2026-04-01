# Plan: Replace AI Furigana with Kuromoji-based Library

## Phase 1: Proof of Concept (Standalone)
- [x] Task: Create standalone PoC directory `poc/furigana` with its own `package.json`.
- [x] Task: Install `kuroshiro` and `kuroshiro-analyzer-kuromoji` in the PoC.
- [x] Task: Create a test script `poc/furigana/test.js` to verify Furigana generation.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Proof of Concept (Standalone)' (Protocol in workflow.md)

## Phase 2: Integration into Main Codebase
- [x] Task: Install `kuroshiro` and `kuroshiro-analyzer-kuromoji` in the main project.
- [x] Task: Configure Vite to copy the `kuromoji` dictionary files to the `public/` directory.
- [x] Task: Implement a utility to initialize `kuroshiro` once.

## Phase 3: Refactor Furigana Service
- [x] Task: Write unit tests for the new library-based `JapaneseFuriganaService`.
- [x] Task: Replace the `window.ai.languageModel` logic in `src/content/ai/furigana.ts` with `kuroshiro`.
- [x] Task: Implement logic to ensure only Kanji get readings and normalize output to Hiragana.
- [x] Task: Verify that `AIManager` correctly calls the refactored service.

## Phase 4: Verification & Cleanup
- [x] Task: Manually verify Furigana display on the YouTube video.
- [x] Task: Remove any leftover AI-specific prompt code or logs.
- [x] Task: Update `docs/architecture/index.md` to reflect the switch from AI to a library.
- [x] Task: Conductor - User Manual Verification 'Phase 4: Verification & Cleanup' (Protocol in workflow.md)
- [x] Task: Wait for explicit user confirmation: "The track is complete".

## Phase: Review Fixes
- [x] Task: Apply review suggestions c74adca
