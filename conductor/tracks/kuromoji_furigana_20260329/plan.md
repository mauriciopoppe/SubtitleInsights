# Plan: Replace AI Furigana with Kuromoji-based Library

## Phase 1: Proof of Concept (Standalone)
- [ ] Task: Create standalone PoC directory `poc/furigana` with its own `package.json`.
- [ ] Task: Install `kuroshiro` and `kuroshiro-analyzer-kuromoji` in the PoC.
- [ ] Task: Create a test script `poc/furigana/test.js` to verify Furigana generation.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Proof of Concept (Standalone)' (Protocol in workflow.md)

## Phase 2: Integration into Main Codebase
- [ ] Task: Install `kuroshiro` and `kuroshiro-analyzer-kuromoji` in the main project.
- [ ] Task: Configure Vite to copy the `kuromoji` dictionary files to the `public/` directory.
- [ ] Task: Implement a utility to initialize `kuroshiro` once.

## Phase 3: Refactor Furigana Service
- [ ] Task: Write unit tests for the new library-based `JapaneseFuriganaService`.
- [ ] Task: Replace the `window.ai.languageModel` logic in `src/content/ai/furigana.ts` with `kuroshiro`.
- [ ] Task: Implement logic to ensure only Kanji get readings and normalize output to Hiragana.
- [ ] Task: Verify that `AIManager` correctly calls the refactored service.

## Phase 4: Verification & Cleanup
- [ ] Task: Manually verify Furigana display on the YouTube video.
- [ ] Task: Remove any leftover AI-specific prompt code or logs.
- [ ] Task: Update `docs/architecture/index.md` to reflect the switch from AI to a library.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Verification & Cleanup' (Protocol in workflow.md)
- [ ] Task: Wait for explicit user confirmation: "The track is complete".
