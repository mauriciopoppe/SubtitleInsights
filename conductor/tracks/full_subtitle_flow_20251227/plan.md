# Track Plan: Implement Full Subtitle Translation Flow

This plan outlines the implementation of the core subtitle interception, AI translation, and synchronization logic.

## Phase 1: Subtitle Interception & Data Management [checkpoint: 26f72ab]
- [x] **Task: Implement Request Interceptor**
    - Use `chrome.declarativeNetRequest` or a monkey-patch on `fetch`/`XMLHttpRequest` to capture `/api/timedtext` URLs.
    - Implement a background script or content script utility to fetch and parse the captured XML/JSON subtitle format.
- [x] **Task: Create Subtitle Store**
    - Implement a central data structure to store timed segments: `[{ start, end, text, translation? }]`.
- [x] **Task: Conductor - User Manual Verification 'Phase 1: Subtitle Interception' (Protocol in workflow.md)**

## Phase 2: Chrome Prompt API Integration [checkpoint: 1df1fa6]
- [x] **Task: Setup Prompt API Client**
    - Implement checks for `window.ai` or `window.model` availability.
    - Create a wrapper class to manage sessions and system prompts (Natural vs Literal).
- [x] **Task: Implement Batch Translator**
    - Create a logic to take the next N segments from the Subtitle Store and process them through the API.
    - Handle rate limits or sequential processing to avoid model crashes.
- [x] **Task: Conductor - User Manual Verification 'Phase 2: Prompt API Integration' (Protocol in workflow.md)**

## Phase 3: Synchronization & UI Updates [checkpoint: b50a16e]
- [x] **Task: Implement Sync Engine**
    - Listen to `timeupdate` events on the `<video>` element.
    - Efficiently lookup the active segment from the store based on `video.currentTime`.
- [x] **Task: Dynamic Overlay Updates**
    - Update the `lle-overlay` text content when the active segment changes.
    - Ensure smooth transitions and clear font rendering.
- [x] **Task: Word Hover Tooltip (Basic)**
    - Implement hover detection on subtitle words.
    - Trigger a "quick" Prompt API call for definitions and display in a simple tooltip.
- [x] **Task: Conductor - User Manual Verification 'Phase 3: Synchronization & UI Updates' (Protocol in workflow.md)**