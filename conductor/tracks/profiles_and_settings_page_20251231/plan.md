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
- [ ] Task: Configure Vite to build a new entry point `src/settings/index.html`.
    - [ ] Update `vite.config.ts`.
    - [ ] Update `manifest.json` to register `options_page`.
- [ ] Task: Scaffold Settings App structure (Preact).
    - [ ] `src/settings/App.tsx`, `Sidebar.tsx`, `ProfileList.tsx`, `ProfileEditor.tsx`.
- [ ] Task: Implement Profile Management UI.
    - [ ] View list of profiles.
    - [ ] Add/Delete buttons.
    - [ ] Form to edit Source/Target lang and System Prompt.
    - [ ] "Set Active" button.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Settings Page UI' (Protocol in workflow.md)

## Phase 3: Integration
- [ ] Task: Add "Settings" link to the Sidebar extension UI.
    - [ ] Add a gear/settings icon button that calls `chrome.runtime.openOptionsPage()`.
- [ ] Task: Verify end-to-end flow.
    - [ ] Change profile -> Check if AI Explainer uses new prompt.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Integration' (Protocol in workflow.md)
