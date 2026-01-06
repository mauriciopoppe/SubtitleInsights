# Plan: Subtitle Insights Documentation (VitePress)

Create a flat, professional documentation site for Subtitle Insights using VitePress, featuring a custom YouTube-inspired dark theme and comprehensive guides.

## Phases

### Phase 1: Project Setup & Configuration
- [x] **Task: Initialize VitePress**
    - Create the `docs/` directory.
    - Install VitePress and initialize a basic project.
- [x] **Task: Core Configuration**
    - Configure `docs/.vitepress/config.ts` with title, description, and the three-section sidebar structure.
- [x] **Task: Theme Customization**
    - Implement CSS overrides to achieve the YouTube dark palette (Background: `#0f0f0f`, Text: `#ffffff`, Accents: `#3ea6ff`).

### Phase 2: Introduction Content
- [x] **Task: "What is Subtitle Insights?" Page**
    - Create `docs/introduction/index.md` based on `product.md`.
- [x] **Task: "Getting Started" Page**
    - Create `docs/introduction/getting-started.md` covering Chrome flags, version requirements, and source installation.
- [x] **Task: "Comparisons" Page**
    - Create `docs/introduction/comparisons.md` highlighting local AI, privacy, and UX.

### Phase 3: Features Content
- [x] **Task: "Selecting Subtitles" Page**
    - Create `docs/features/selecting-subtitles.md` covering auto-capture and SRT upload.
- [x] **Task: "Overlay & UI" Page**
    - Create `docs/features/overlay.md` detailing the overlay and proximity controls.
- [x] **Task: "Sidebar & Sync" Page**
    - Create `docs/features/sidebar.md` explaining transcript view and sync.
- [x] **Task: "Manual Timing Offset" Page**
    - Create `docs/features/timing-offset.md` with instructions for the sync button.
- [x] **Task: "AI Capabilities" Page**
    - Create `docs/features/ai-capabilities.md` covering both translation and insights.
- [x] **Task: "Profiles & Settings" Page**
    - Create `docs/features/profiles.md`.

### Phase 4: Guides Content
- [x] **Task: "Watching on YouTube" Page**
    - Create `docs/guides/youtube.md`.
- [x] **Task: "Watching on Stremio Web" Page**
    - Create `docs/guides/stremio-web.md`.
- [x] **Task: "Mining words with Yomitan" Page**
    - Create `docs/guides/yomitan-mining.md`.

### Phase 5: Build & Final Review
- [x] **Task: Link & Build Verification**
    - Verify all internal navigation and run `npm run docs:build` to ensure no broken links.
- [x] **Task: Conductor - User Manual Verification 'Subtitle Insights Documentation' (Protocol in workflow.md)**