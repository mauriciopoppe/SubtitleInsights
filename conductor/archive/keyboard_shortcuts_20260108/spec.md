# Specification: Keyboard Shortcuts for Segment Navigation

## Overview
This track implements three keyboard shortcuts to allow users to navigate between subtitle segments and replay the current segment without using the mouse. These shortcuts will be configurable via Chrome's native extension shortcut manager and will be synchronized with the extension's active state.

## Functional Requirements

### 1. Shortcut Definitions
- Three new commands will be added to the extension `manifest.json`:
  - `next-segment`: Seek to the start of the next subtitle segment.
  - `previous-segment`: Seek to the start of the previous subtitle segment.
  - `replay-segment`: Seek to the start of the current subtitle segment.
- **No default keys** will be assigned. Users must manually configure them in `chrome://extensions/shortcuts`.

### 2. Command Handling
- **Background Script:** Listen for `chrome.commands.onCommand` and dispatch a message to the active tab's content script.
- **Content Script:** 
  - Verify the extension is currently **enabled** before executing any shortcut logic.
  - Logic for "Next": Locate the next segment and seek to its start time. **Preserve current playback state** (if paused, remain paused; if playing, keep playing).
  - Logic for "Previous": Locate the previous segment and seek to its start time. **Preserve current playback state**.
  - Logic for "Replay": Seek to the start time of the current active segment and **Force Playback** (resume if paused).

### 3. Integration
- Reuse the seeking and playback logic already present in `VideoController`.
- Ensure compatibility with both YouTube and Stremio implementations.

## Non-Functional Requirements
- **Low Latency:** The round-trip from shortcut press to video seek should feel instantaneous.
- **State Awareness:** Shortcuts must fail silently or be ignored if the extension is disabled or no subtitles are loaded.

## Acceptance Criteria
- [x] `manifest.json` contains the 3 command definitions.
- [ ] Shortcuts do not work when the extension is toggled "OFF".
- [ ] Shortcuts work correctly on YouTube.
- [ ] Shortcuts work correctly on Stremio.
- [ ] Pressing "Next" while paused seeks to the next segment and stays paused.
- [ ] Pressing "Next" while playing seeks to the next segment and keeps playing.
- [ ] Pressing "Replay" while paused seeks to the start of current segment and starts playing.
- [ ] Documentation (`docs/`) is updated to explain how to configure these shortcuts.

## Out of Scope
- In-page custom UI for remapping keys.
- Global shortcuts that work when the browser is not focused.
