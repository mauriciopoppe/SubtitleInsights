# Plan: AI Subtitle Analysis & Translation Overlay

## Phase 1: API Integration & Service Wrapper [checkpoint: f23e47e]
- [x] Task: Create `src/content/ai/translator.ts` to wrap the `window.Translation` API.
    - [x] Implement `checkAvailability()` method handling `available`, `after-download`, and `unavailable`.
    - [x] Implement `initialize()` method to create the translator instance.
    - [x] Implement `translate(text: string)` method.
- [x] Task: Integrate `Translator` service into `src/content/index.ts`.
    - [x] Call `checkAvailability()` on init.
    - [x] Handle `after-download` status by showing UI indicators (to be implemented in Phase 2/3).
- [x] Task: Conductor - User Manual Verification 'Phase 1: API Integration & Service Wrapper' (Protocol in workflow.md)

## Phase 2: UI Updates (Overlay & Sidebar) [checkpoint: cfaf0f8]
- [x] Task: Update `Overlay` class in `src/content/overlay.ts`.
    - [x] Add support for displaying a "System Message" (e.g., "Downloading AI models...").
    - [x] Ensure translation text is rendered *above* the original text.
- [x] Task: Update `Sidebar` class in `src/content/sidebar.ts`.
    - [x] Add a status icon area in the header for AI Model states (Downloading, Ready, Error).
    - [x] Add method `setAIStatus(status: 'downloading' | 'ready' | 'error', message?: string)`.
- [x] Task: Conductor - User Manual Verification 'Phase 2: UI Updates (Overlay & Sidebar)' (Protocol in workflow.md)

## Phase 3: Subtitle Capture & Translation Logic [checkpoint: 9bf68bc]
- [x] Task: Re-enable Subtitle Capture in `src/content/index.ts`.
    - [x] Uncomment the `chrome.runtime.onMessage.addListener` block.
    - [x] Verify that `LLE_SUBTITLES_CAPTURED` messages from the background script are correctly parsed by `SubtitleStore.parseYouTubeJSON` and added to the store.
- [x] Task: Implement Translation Manager.
    - [x] Upon capturing subtitles (and if no manual file is loaded), trigger the translation flow.
- [x] Task: Implement Pre-fetching Buffer.
    - [x] Create a buffer queue that maintains translations for the current + next 20 segments.
    - [x] On `timeupdate`, check if upcoming segments should be translated and trigger them.
    - [x] Update `SubtitleStore` with the translated text as it becomes available.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Subtitle Capture & Translation Logic' (Protocol in workflow.md)

## Phase 4: Integration & Polish
- [x] Task: Wire up `Sidebar` updates.
    - [x] Ensure `Sidebar.render()` reflects the new translations in real-time (or optimistically update specific rows).
- [x] Task: Verify Auto-Activation.
    - [x] Ensure it only runs for Japanese videos (check `sourceLanguage: 'ja'` in availability check).
- [x] Task: Handle Upload Override.
    - [x] Ensure uploading a Markdown file cancels/overwrites any AI translation state.
- [x] Task: Conductor - User Manual Verification 'Phase 4: Integration & Polish' (Protocol in workflow.md)
