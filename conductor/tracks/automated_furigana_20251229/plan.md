# Plan: Automated Furigana Generation (Kuromoji.js)

## Phase 1: Library Integration & Setup
- [ ] Task: Install `kuromoji` dependency and download dictionaries.
    - [ ] Run `npm install kuromoji`.
    - [ ] Download the IPADIC dictionary and place it in `public/dict/` (or similar directory).
- [ ] Task: Configure Vite to bundle the dictionary.
    - [ ] Ensure `public/` directory assets are correctly copied to `dist/`.
- [ ] Task: Initialize Kuromoji in Background Service Worker.
    - [ ] Create `src/background/segmenter.ts` to manage the tokenizer instance.
    - [ ] Implement startup initialization in `src/background/index.ts`.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Library Integration & Setup' (Protocol in workflow.md)

## Phase 2: Morphological Analysis Logic
- [ ] Task: Implement Tokenization & Mapping Logic in `src/background/segmenter.ts`.
    - [ ] Implement `tokenize(text: string)` using kuromoji.
    - [ ] Implement Katakana-to-Hiragana conversion utility.
    - [ ] Implement logic to transform raw kuromoji tokens into the `AISegment[][]` structure.
    - [ ] Handle edge cases (punctuation, mixed scripts, existing kana).
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Morphological Analysis Logic' (Protocol in workflow.md)

## Phase 3: Integration & Data Flow
- [ ] Task: Update Background Capture Flow.
    - [ ] Modify `src/background/index.ts` to pass captured subtitles through the `Segmenter`.
    - [ ] Enrich the `LLE_SUBTITLES_CAPTURED` message payload with the analyzed `segmentedData`.
- [ ] Task: Update Content Script Store.
    - [ ] Update `SubtitleStore.addSegments` or the listener in `src/content/index.ts` to correctly handle the incoming `segmentedData`.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Integration & Data Flow' (Protocol in workflow.md)

## Phase 4: Verification & Polish
- [ ] Task: Verify Automatic Furigana in UI.
    - [ ] Open a Japanese video and confirm Furigana appears in Overlay and Sidebar.
- [ ] Task: Performance Optimization.
    - [ ] Ensure the background script remains responsive during large subtitle track processing.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Verification & Polish' (Protocol in workflow.md)
