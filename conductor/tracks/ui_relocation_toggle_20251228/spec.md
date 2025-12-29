# Specification - UI Control Relocation & Overlay Toggle

## Overview
This feature refines the user interface by moving specific controls to the Sidebar and adding more granular control over the on-video overlay. The goal is to declutter the YouTube player controls and provide a more focused experience for users who prefer using the sidebar for educational content.

## Functional Requirements

### 1. Control Relocation
- **Upload Button**: Move the "UP" (Upload Structured Subtitles) button from the YouTube player controls (next to the LLE toggle) to the Sidebar Header.
- **Overlay Toggle**: Add a new toggle button (e.g., "Overlay") to the Sidebar Header to specifically control the visibility of the on-video subtitles.

### 2. Visibility Hierarchy & Logic
- **Master Toggle (Player Controls)**: The existing "LLE" button remains the Master Toggle.
    - If Master is **OFF**: Both the Sidebar and the On-Video Overlay are hidden.
    - If Master is **ON**: The Sidebar is shown. The visibility of the On-Video Overlay then depends on the **Overlay Sub-Toggle**.
- **Overlay Sub-Toggle (Sidebar Header)**:
    - Only visible/functional when the Sidebar is active.
    - Controls whether the subtitles appear on top of the video.

### 3. Persistence
- Both the **Master Toggle** state and the **Overlay Sub-Toggle** state must be persisted (using `Config` / `chrome.storage.local`) so they remain consistent across page reloads and different videos.

## UI Requirements
- **Sidebar Header**: Update the `lle-sidebar-header` to accommodate:
    - Title: "LLE Transcript"
    - Controls Group: [Upload Button] [Overlay Toggle]
- **Player Controls**: Simplify the LLE container to only show the main "LLE" toggle button.

## Acceptance Criteria
- [ ] The "UP" button is successfully moved to the sidebar header and functions correctly.
- [ ] A new "Overlay" toggle exists in the sidebar header.
- [ ] Turning off the main "LLE" toggle hides both sidebar and overlay.
- [ ] Turning on the main "LLE" toggle shows the sidebar, but the overlay only shows if its sub-toggle is also ON.
- [ ] Refreshing the page preserves both the master and sub-toggle states.

## Out of Scope
- Adding keyboard shortcuts for these toggles.
- Changing the look and feel of the sidebar segments themselves.
