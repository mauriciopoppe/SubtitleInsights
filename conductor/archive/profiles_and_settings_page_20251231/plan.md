# Plan: Language Profiles & Settings Page

## Phase 1: Core Infrastructure & Migration [checkpoint: d4d0bd9]

- [x] Task: Define `Profile` interface and `ProfileManager` class in `src/content/profiles.ts`.
  - [x] Implement CRUD operations (get, list, add, update, delete, setActive).
  - [x] Implement migration logic: Check if profiles exist; if not, create default "Japanese" profile.
- [x] Task: Refactor `Config` to use `ProfileManager`.
  - [x] Add `getActiveProfile()` to `Config`.
  - [x] Update `GrammarExplainer` to fetch system prompt from the active profile.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Core Infrastructure' (Protocol in workflow.md)

## Phase 2: Settings Page UI

- [x] Task: Configure Vite to build a new entry point `src/settings/index.html`.
  - [x] Update `vite.config.ts`.
  - [x] Update `manifest.json` to register `options_page`.
- [x] Task: Scaffold Settings App structure (Preact).
  - [x] `src/settings/App.tsx`, `ProfileList.tsx`, `ProfileEditor.tsx`.
- [x] Task: Implement Profile Management UI.
  - [x] View list of profiles.
  - [x] Add/Delete buttons.
  - [x] Form to edit Source/Target lang and System Prompt.
  - [x] "Set Active" button.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Settings Page UI' (Protocol in workflow.md)

## Phase 3: Integration

- [x] Task: Add "Settings" link to the Sidebar extension UI.
  - [x] Add a gear/settings icon button that calls `chrome.runtime.openOptionsPage()`.
- [x] Task: Verify end-to-end flow.
  - [x] Change profile -> Check if AI Explainer uses new prompt.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Integration' (Protocol in workflow.md)
