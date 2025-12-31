# Plan: Automated Language Detection for Subtitles

## Phase 1: Detector Service Implementation & Unit Testing
- [ ] Task: Implement `LanguageDetectorService` in `src/content/ai/detector.ts`.
    - [ ] Create basic wrapper for `window.LanguageDetector`.
    - [ ] Implement `checkAvailability`, `initialize`, and `detectLanguage` methods.
- [ ] Task: Write Unit Tests for `LanguageDetectorService`.
    - [ ] Create `src/content/ai/detector.test.ts`.
    - [ ] Mock `window.LanguageDetector` including `detect()` returning multiple results.
    - [ ] Test availability checks and high-confidence language extraction.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Detector Service Implementation & Unit Testing' (Protocol in workflow.md)

## Phase 2: Store & Ingestion Integration
- [ ] Task: Update `SubtitleStore` to support language detection trigger.
    - [ ] Add `detectLanguageFromSegments()` method to aggregate text and call the detector.
- [ ] Task: Update `src/content/index.tsx` Ingestion Logic.
    - [ ] Modify `LLE_SUBTITLES_CAPTURED` listener to trigger detection if `message.language` is absent.
    - [ ] Ensure detected language is saved to the store.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Store & Ingestion Integration' (Protocol in workflow.md)

## Phase 3: Silent Gate & Final Verification
- [ ] Task: Verify Silent Gate in `AIManager`.
    - [ ] Ensure `AIManager.onTimeUpdate` correctly halts if `store.sourceLanguage` is not Japanese.
- [ ] Task: Final Integration Test.
    - [ ] Create/Update an integration test to simulate capture of an unknown language track and verify the store updates with the detected tag.
- [ ] Task: Manual Browser Verification.
    - [ ] Load a video with Japanese subtitles (but no metadata) and verify AI features activate.
    - [ ] Load a video with English subtitles and verify AI features remain silent.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Silent Gate & Final Verification' (Protocol in workflow.md)
