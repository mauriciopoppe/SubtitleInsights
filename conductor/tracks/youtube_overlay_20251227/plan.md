# Track Plan: Prototype the YouTube Overlay with Mock Data

This plan outlines the steps to create a foundational YouTube subtitle overlay prototype using mock data.

## Phase 1: Project Scaffolding [checkpoint: 330110b]
- [x] **Task: Initialize Vite Project**
    - Setup a new project with `vite` and `typescript`.
    - Install `@crxjs/vite-plugin` and configure `vite.config.ts`.
- [x] **Task: Define Manifest V3**
    - Create `manifest.json` with permissions for `youtube.com`.
    - Register a content script for `https://www.youtube.com/watch*`.
- [ ] **Task: Conductor - User Manual Verification 'Phase 1: Project Scaffolding' (Protocol in workflow.md)**

## Phase 2: Content Script & Detection [checkpoint: 5e31ac4]
- [x] **Task: Create Content Script Entrypoint**
    - Create `src/content/index.ts`.
    - Implement a basic logger to verify injection.
- [x] **Task: Video Player Detection Logic**
    - Implement a function to wait for and find the YouTube video player element (`#movie_player`).
- [ ] **Task: Conductor - User Manual Verification 'Phase 2: Content Script & Detection' (Protocol in workflow.md)**

## Phase 3: UI Overlay Implementation
- [x] **Task: Create Overlay Component**
    - Implement a TypeScript function to create and inject the subtitle overlay DOM.
    - Use absolute positioning to place it over the video player.
- [x] **Task: Style the Overlay**
    - Create `src/content/styles.css`.
    - Add styles for semi-transparent background, text alignment, and font (Roboto).
- [x] **Task: Render Mock Subtitles**
    - Populate the overlay with a hardcoded Japanese sentence and its English translation.
- [ ] **Task: Conductor - User Manual Verification 'Phase 3: UI Overlay Implementation' (Protocol in workflow.md)**
