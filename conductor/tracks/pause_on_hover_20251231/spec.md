# Specification: Pause on Hover Overlay

## Overview
This feature introduces a new toggle in the settings that allows users to automatically pause the YouTube video when their mouse hovers over the overlay displaying detailed subtitle information. The video will pause just before the current segment ends, providing ample time to read the content. Playback will resume when the mouse moves off the overlay or if the user manually clicks the play button on the YouTube player.

## Functional Requirements
1.  **Settings Toggle:**
    *   A new toggle, "Pause on Hover", will be added to the existing "Settings" dropdown menu within the sidebar header.
    *   The toggle's state will persist across sessions.
2.  **Pause Logic:**
    *   When the "Pause on Hover" toggle is enabled and the user's mouse pointer is over the overlay displaying subtitle details:
        *   The video should automatically pause approximately 0.5 seconds before the current subtitle segment ends.
        *   This pausing mechanism should only be active if subtitles are currently enabled on the YouTube player.
3.  **Resume Logic:**
    *   The video should resume playing automatically if:
        *   The user moves their mouse pointer off the overlay content.
        *   The user manually clicks the "Play" button on the YouTube video player.
4.  **Overlay Content:**
    *   The overlay content (translations, analysis, etc.) must remain visible and interactive while paused.

## Non-Functional Requirements
1.  **Performance:** The pausing and resuming mechanism should be responsive and not introduce noticeable latency in video playback or UI interactions.
2.  **User Experience:** The feature should seamlessly integrate with the existing YouTube player controls and extension UI.

<h2>Acceptance Criteria</h2>
<ol>
<li>The "Pause on Hover" toggle appears in the sidebar's settings dropdown and its state is saved.</li>
<li>With the toggle enabled, when the mouse hovers over the overlay, the video pauses 0.5 seconds before the segment ends.</li>
<li>The video resumes when the mouse leaves the overlay area or when the YouTube play button is clicked.</li>
<li>The feature does not interfere with normal video playback when disabled or when the mouse is not over the overlay.</li>
<li>The feature is only active when YouTube subtitles are enabled.</li>
</ol>

## Out of Scope
*   Customizing the pause duration (e.g., pausing X seconds before the end of the segment). The fixed 0.5s is sufficient for this feature.
*   More complex interactions for resuming playback (e.g., pressing a specific key).
