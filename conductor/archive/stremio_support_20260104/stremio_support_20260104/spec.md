# Spec: Stremio Support Integration

## Overview
Extend the Subtitle Insights extension to support the Stremio web player (https://web.stremio.com/). Since Stremio uses a full-screen or wide-player layout without a native sidebar, the extension will implement a custom layout-shifting mechanism to accommodate the transcript sidebar.

## Functional Requirements

### 1. Platform Detection & Initialization
- **Detection:** Use a hybrid approach. Match URLs starting with `https://web.stremio.com/` and initialize only when the video player DOM elements are detected.
- **Player Sync:** Identify and bind to the Stremio `<video>` element and its control bar.

### 2. Layout & Sidebar Management
- **Video Resizing:** When the sidebar is toggled ON, the video player container's width must decrease to create space (e.g., `calc(100% - 350px)`). 
- **Auto-Resize:** The player container should automatically adjust to preserve visibility and provide a seamless transition when the sidebar is opened or closed.
- **Toggle Button:** Inject a custom toggle button into the Stremio player's bottom control bar, styled to match native icons (e.g., near subtitle/volume controls).

### 3. Subtitle Extraction
- **Primary Source:** Manual Upload via the sidebar's upload button.
- **Requirement:** Users must upload an SRT file to populate the transcript and enable AI features.

### 4. Sidebar UI
- Use the existing `SidebarApp` and `SidebarList` components.
- Ensure the sidebar container is injected at the body level or as a sibling to the main player container, using absolute or flex positioning to avoid breaking Stremio's layout.

## Non-Functional Requirements
- **Styling:** The injected toggle button and sidebar must adhere to "Functional Brevity" and mimic Stremio's dark, minimalist aesthetic where possible.
- **Performance:** Ensure resizing logic doesn't cause significant jitter or lag in the video playback.

## Acceptance Criteria
- [ ] Extension activates on Stremio player pages.
- [ ] Sidebar can be toggled via a button in the Stremio control bar.
- [ ] Video player resizes correctly when the sidebar is open.
- [ ] Subtitles can be manually uploaded and correctly populate the store.
- [ ] Existing features (Translation, Insights, Pause on Hover) work as expected on Stremio.

## Out of Scope
- Support for the Stremio Desktop App (this is limited to the web version).
- Support for other video platforms in this specific track.
- Automatic subtitle extraction via TextTracks API (User requested manual upload only).
