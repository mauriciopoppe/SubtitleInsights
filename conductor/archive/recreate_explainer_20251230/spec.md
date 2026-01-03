# Specification: Recreate Grammar Explainer on Video Change

## Overview

Currently, the Grammar Explainer maintains a single AI session throughout the extension's lifecycle. Over time, the LLM context can become polluted, leading to degraded performance or complete loss of responsiveness. This track implements a mechanism to explicitly destroy the current session and create a fresh one whenever the user navigates to a new video.

## Functional Requirements

1.  **Explainer Service Update (`src/content/ai/explainer.ts`):**
    - **Root Session:** Maintain a persistent `rootSession` initialized with the system prompt.
    - **Working Session:** Use a `workingSession` which is a `clone()` of the `rootSession`.
    - **Reset Logic:** Implement a `resetSession()` method that:
      1. Destroys the current `workingSession`.
      2. Creates a new `workingSession` by calling `rootSession.clone()`.
    - **Destroy Logic:** Implement a `destroy()` method that closes both sessions.
2.  **Integration (`src/content/index.tsx`):**
    - Update the `checkVideoChange` function to call `grammarExplainer.resetSession()`.
    - Ensure the initial call to `initialize()` sets up the root session and the first working clone.
3.  **UI Feedback:**
    - The AI status in the sidebar should briefly reflect the re-initialization state if there is a significant delay.

## Non-Functional Requirements

- **Resource Management:** Explicitly closing sessions to avoid memory leaks or "ghost" sessions in the browser's AI runtime.
- **Performance:** Re-initialization should be fast enough that it doesn't delay grammar explanations for the first few segments of a new video.

## Acceptance Criteria

- The Grammar Explainer is successfully reset every time the YouTube video ID changes.
- The AI remains responsive and accurate even after multiple video transitions.
- Verified that `session.destroy()` or `session.close()` (as per Chrome Prompt API) is being called.

## Out of Scope

- Refactoring the `TranslatorService` session management.
- Implementing persistent context memory across video changes.
