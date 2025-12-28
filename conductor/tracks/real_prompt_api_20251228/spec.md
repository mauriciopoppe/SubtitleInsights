# Track Spec: Integrate Real Chrome Prompt API

## Overview
This track replaces the current mock translation implementation with the real Chrome Prompt API (`window.ai.languageModel`). It focuses on robust availability checking, handling the model download lifecycle, and ensuring the user is informed when the AI model is being prepared.

## Functional Requirements
- **Real API Integration:** Update `AIClient` to use `window.ai.languageModel.create()` for translation sessions.
- **Availability & Download Handling:**
    - Call `window.ai.languageModel.capabilities()` to determine the model's status (`readily`, `after-download`, or `no`).
    - If the status is `after-download`, initiate the session creation which triggers the download.
    - Update the `SubtitleStore` or `AIClient` state to track if the model is currently downloading.
- **UI Feedback:**
    - While the model is downloading, the `lle-overlay` should display "AI Model downloading... please wait" in the translation slot.
- **Development Mode Fallback:**
    - Retain the mock translation logic as a secondary fallback or a configurable "dev mode" toggle to ensure development remains unblocked on non-compatible environments.
- **API Signature Adherence:** Target the latest Chrome Prompt API signature (`window.ai.languageModel`).

## Non-Functional Requirements
- **Resilience:** Handle session failures or API errors gracefully without crashing the content script.
- **Perceived Performance:** Continue to show original subtitles immediately, even if the AI translation is delayed due to model preparation.

## Acceptance Criteria
- The extension successfully detects and uses the local Chrome Prompt API for translations.
- Users see a "Downloading" message in the overlay if the model is not yet ready.
- The system correctly falls back to mock data only if specifically configured or if the API is entirely missing.

## Out of Scope
- Detailed progress bars for model downloads.
- Permanent cross-tab session storage (keep sessions per-video for now).
