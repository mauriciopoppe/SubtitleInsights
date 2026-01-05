# Plan: Stremio Support Integration

## Goal
Extend Subtitle Insights to support the Stremio web player (web.stremio.com), including a toggleable sidebar that resizes the video player. Subtitle support will be handled exclusively via the existing manual upload functionality.

## Phases

### Phase 1: Foundation & Platform Detection [checkpoint: 50c56cc]
- [x] **Task: Manifest Update**
    - Add `https://web.stremio.com/*` to `content_scripts` matches in `manifest.json`.
- [x] **Task: Refactor Content Script Entry**
    - Refactor `src/content/index.tsx` to support platform-specific initialization logic (YouTube vs Stremio).
    - Implement a `detectPlatform()` utility.
- [x] **Task: Stremio Initialization Logic**
    - Implement `initStremio()` to wait for the video element and control bar on Stremio.
- [x] **Task: Conductor - User Manual Verification 'Foundation & Platform Detection' (Protocol in workflow.md)**

### Phase 2: UI Injection & Layout [checkpoint: 4b3d0c7]
- [x] **Task: Layout Styling (CSS)**
    - Add Stremio-specific CSS rules in `src/content/styles.css` for sidebar injection and player resizing.
- [x] **Task: Toggle Button Injection**
    - Identify the selector for Stremio's player control bar.
    - Inject a `StremioToggle` (or adapt `ExtensionToggle`) into the controls.
- [x] **Task: Sidebar Container Implementation**
    - Implement the logic to inject `#si-sidebar-root` and `#si-overlay-root` into the Stremio DOM.
    - Implement the CSS `calc()` logic to resize the player when the sidebar is enabled.
- [x] **Task: Conductor - User Manual Verification 'UI Injection & Layout' (Protocol in workflow.md)**

### Phase 3: Feature Parity & Polish [checkpoint: 9412825]
- [x] **Task: Verify Manual Upload Support**
    - Verify that the "Upload Subtitles" button correctly populates the store and displays segments in the sidebar on Stremio.
- [x] **Task: Verify AI Features**
    - Confirm Translation and Insights work correctly on manually uploaded segments.
- [x] **Task: Verify Pause on Hover**
    - Ensure the `usePauseOnHover` hook works with the Stremio player.
- [x] **Task: UI Polish**
    - Adjust colors and icons to better match Stremio's dark theme.
- [x] **Task: Conductor - User Manual Verification 'Feature Parity & Polish' (Protocol in workflow.md)**