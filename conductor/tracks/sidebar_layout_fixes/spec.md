# Spec: Sidebar Layout Fixes

## Context
Currently, the sidebar has a fixed `max-height` (500px) which doesn't align with the video player, leaving gaps or scrolling unnecessarily. Additionally, when viewing a playlist, YouTube renders the playlist component in the secondary column, pushing our injected sidebar down or removing it during navigation updates.

## Requirements

### 1. Dynamic Height
- **Source:** The height of the sidebar must mirror the height of the primary video player container (`#movie_player` or equivalent).
- **Responsiveness:** It must update immediately upon window resize or theater mode toggle.
- **Constraint:** The sidebar content (`.si-sidebar-list`) should scroll internally if content exceeds this height.

### 2. Positioning
- **Location:** The sidebar must always be the **first** element in the `#secondary-inner` column (right side).
- **Persistence:** It must maintain this position across SPA navigations (YouTube uses `yt-navigate-finish`).
- **Conflict Resolution:** If YouTube inserts a playlist or chat container at the top, our sidebar must re-insert itself *before* it.

## Technical Approach

- **Height:** Use `ResizeObserver` on the video player element to set `style.height` on `#si-sidebar`.
- **Position:** Use `MutationObserver` on `#secondary-inner` to detect child list changes. If `#si-sidebar-root` is detached or moved, move it back to `prepend`.
