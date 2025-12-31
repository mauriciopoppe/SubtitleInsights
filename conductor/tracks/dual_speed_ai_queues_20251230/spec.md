# Specification: Dual-Speed AI Processing Queues

## Overview
The Chrome Prompt API (used for Insights) can only handle one request at a time, whereas the Translation API can handle multiple requests in parallel. Currently, the `AIManager` processes both tasks in a single parallel loop, which causes errors and "hangs" when multiple insights are requested simultaneously. This track refactors the manager to use a serial gate for Insights while maintaining parallel execution for Translations.

## Functional Requirements

### 1. Unified Naming (Refactor)
*   Rename all internal "grammar" references to "insights" (e.g., `grammarBuffer` -> `insightsBuffer`, `needsGrammar` -> `needsInsights`).

### 2. Parallel Translation Queue
*   Maintain the existing logic for triggering up to 10 translations in advance.
*   Fire all translation tasks in parallel as soon as they enter the buffer.

### 3. Serial Insights Lock
*   Implement a `isInsightsProcessing` boolean flag in `AIManager`.
*   Only allow one insight request to be active at a time.
*   If an insight task is pending and the lock is active, wait for the lock to be released before starting the next one.

### 4. Jump/Navigation Logic
*   Clear all `pendingIndices` and reset processing flags when a significant time jump or video change is detected.
*   Ensure that stale tasks from a previous playback position do not block the queues.

## Non-Functional Requirements
*   **Reliability:** Prevent `Grammar explanation failed` errors caused by simultaneous Prompt API calls.
*   **Performance:** Ensure that serializing insights doesn't slow down the availability of translations.

## Acceptance Criteria
*   Translations are still prefetched and displayed in parallel (up to 10).
*   Insights are prefetched one-by-one.
*   No "Prompt API Busy" errors in the console.
*   All internal code uses the "Insights" terminology.

## Out of Scope
*   Creating a generic `Queue` class (using an internal lock instead as per Q1).
*   Implementing retries for failed AI requests.
