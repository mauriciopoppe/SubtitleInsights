# Plan: AI Grammar Explainer (Chrome Prompt API)

## Phase 1: API Setup & Configuration [checkpoint: f039849]
- [x] Task: Verify Chrome Prompt API availability and session management.
    - [x] Implement a wrapper for `window.LanguageModel` in `src/content/ai/explainer.ts`.
    - [x] Ensure basic session creation and prompt execution work.
- [x] Task: Add Configuration & UI Toggle.
    - [x] Add `isGrammarExplainerEnabled` and `targetJLPTLevel` to `src/content/config.ts`.
    - [x] Add a toggle button/icon in the `Sidebar` header to enable/disable automated grammar explanations.
- [x] Task: Conductor - User Manual Verification 'Phase 1: API Setup & Configuration' (Protocol in workflow.md)

## Phase 2: Analysis & Filtering Logic [checkpoint: 5578727]
- [x] Task: Implement Sentence Complexity Filtering.
    - [x] Create utility to check if a sentence should be analyzed (e.g., length > 5 or contains particles like は, が, を, に, etc.).
- [x] Task: Implement Prompting Logic.
    - [x] Define the system prompt for concise grammar summaries.
    - [x] Implement the `explainGrammar(text: string)` method with low temperature settings.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Analysis & Filtering Logic' (Protocol in workflow.md)

## Phase 3: Integration & Data Flow [checkpoint: 960315f]
- [x] Task: Update Subtitle Processing Pipeline.
    - [x] Hook into the `SubtitleStore` or `TranslationManager` to trigger grammar analysis for new segments.
    - [x] Ensure analysis only triggers if `isGrammarExplainerEnabled` is true.
- [x] Task: Implement Asynchronous Store Updates.
    - [x] Update `SubtitleStore` to allow updating the `contextual_analysis` field of existing segments.
    - [x] Ensure `Sidebar` and `Overlay` re-render correctly when this field is updated.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Integration & Data Flow' (Protocol in workflow.md)

## Phase 4: UI Polish & Verification
- [x] Task: Verify Sidebar and Overlay Rendering.
    - [x] Confirm that AI-generated summaries appear in both components as they become available.
    - [x] Check for graceful handling of loading states (if applicable).
- [x] Task: Verify Disable Logic.
    - [x] Confirm that turning off the toggle immediately stops all Prompt API activity.
- [x] Task: Conductor - User Manual Verification 'Phase 4: UI Polish & Verification' (Protocol in workflow.md)
