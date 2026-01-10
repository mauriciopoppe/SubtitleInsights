# Specification: Yomitan Popup Aware Pause on Hover

## Overview
This track enhances the "Pause on Hover" feature to be aware of Yomitan's definition popups. Currently, if a user hovers over the subtitle overlay to pause the video and then moves their mouse to a Yomitan definition popup to look up a word, the video might resume playback because the mouse has left the overlay. This feature ensures the video remains paused while the user is interacting with the Yomitan popup.

## Functional Requirements

### 1. Yomitan Detection Logic
- Implement a utility function to locate the Yomitan popup iframe.
- Logic:
  1. Find the shadow host: `div[style*="all: initial"]`.
  2. Access the shadow root: `chrome.dom.openOrClosedShadowRoot(host)` (wrapped in `try-catch`).
  3. Locate the iframe: `.yomitan-popup`.

### 2. Interaction Tracking
- Extend `usePauseOnHover` to track mouse movement globally while the video is paused via hover.
- If the mouse is within the bounding box of the Yomitan popup iframe, it should be treated as "still hovering" the overlay content.

### 3. Playback Control
- **Condition for Resume:** Only resume playback if the mouse is NOT over the overlay AND NOT over the Yomitan popup.
- **Condition for Pause:** Standard pause logic remains the same (hovering near the end of a segment).

## Non-Functional Requirements
- **Performance:** Ensure the global `mousemove` listener is efficient and only active when necessary.
- **Robustness:** Gracefully handle cases where the Yomitan host is not found or the `chrome.dom` API is restricted.

## Acceptance Criteria
- [ ] Video pauses when hovering over the overlay near the end of a segment.
- [ ] Video **remains paused** when moving the mouse from the overlay directly to a Yomitan definition popup.
- [ ] Video **resumes** when the mouse leaves both the overlay and the Yomitan popup.
- [ ] Logic fails gracefully (normal behavior) if Yomitan is not installed or detected.

## Out of Scope
- Supporting other dictionary extensions besides Yomitan.
- Modifying Yomitan's internal styles or behavior.
