# Overlay

The in-page overlay is the heart of the Subtitle Insights experience, providing real-time information without forcing you to look away from the video.

::: raw

<video controls loop muted playsinline>
  <source src="./overlay.webm" type="video/webm">
  <source src="./overlay.mp4" type="video/mp4">
</video>
<p align="center">Source: <a href="https://www.youtube.com/watch?v=Oeo-18ik6Hs">Comprehensible Japanese</a></p>

:::

## In-Page Overlay

The overlay displays the current subtitle segment, its AI-generated translation, and insights directly on top of the video player.

- **Customizable Visibility:** Every component of the overlay—the original text, the translation, and the insights—can be disabled individually through the extension's toggle settings. This allows for a completely tailored experience, whether you want a full analysis or just a simple translation.
- **Visual Feedback:** Shows the original language alongside AI-powered translations and insights.

## Proximity Controls

To keep the viewing experience clean, interactive controls only appear when the mouse is near the top-left area of the overlay. These tools are designed to streamline the learning process:

::: raw

<video controls loop muted playsinline>
  <source src="./overlay_controls.webm" type="video/webm">
  <source src="./overlay_controls.mp4" type="video/mp4">
</video>

:::

### Pause on Hover
When enabled, hovering over the overlay near the end of a subtitle segment will automatically pause the video.
- **Learning Impact:** This provides extra time to digest complex sentences or check the translation without the pressure of the video continuing to play.
- **Recommended Workflow:** A common and effective workflow is to listen to the dialogue first, attempt to read along with the original text, and then use the paused time to review the translation and insights if needed. Once ready, simply press the **Space bar** to resume playback and continue the video. Moving the mouse away can also be configured to resume playback automatically.

### Scroll to Segment
If the sidebar is visible, clicking this control will instantly scroll the transcript to the current active segment.
- **Learning Impact:** This is perfect for quickly referencing the current line within the context of the larger transcript without manual scrolling.

### Replay Segment
This control allows for the instant replaying of the current subtitle segment.
- **Learning Impact:** Repetition is key to listening comprehension. This feature makes it easy to hear a tricky phrase multiple times without fumbling with the video player's seek bar.

## Settings Popup (Native Aesthetic)

The extension's settings are managed through a unified popup that strictly mimics the native YouTube settings UI.

- **Hierarchical Menus:** Navigate through sub-menus for Overlay and Sidebar settings just like video quality or playback speed.
- **Live AI Status:** View the real-time status of AI models (Ready, Downloading, or Error) directly within the menu.

