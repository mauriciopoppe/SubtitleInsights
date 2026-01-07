# Selecting Subtitles

Subtitle Insights provides a flexible way to manage subtitles, ensuring the extension works whether using native captions or external files.

## Automatic Capture (YouTube)

When watching on **YouTube**, the extension automatically intercepts subtitle tracks as they are loaded by the player. If Closed Captions (CC) are enabled, the text is captured and processed immediately for translations and insights. If the subtitle track is changed through the native YouTube settings, the extension will automatically re-initialize and begin processing the new track.

::: raw

<video controls loop muted playsinline>
  <source src="./subtitles_automatic_capture.webm" type="video/webm">
  <source src="./subtitles_automatic_capture.mp4" type="video/mp4">
</video>

:::

## Manual Upload (YouTube & Stremio)

For videos without native captions or when using custom translation files, subtitles can be uploaded manually. This is the primary way to use the extension on **Stremio**, but it also works on YouTube.

1. Open the extension menu in the video control bar.
2. Select **Upload Subtitles**.
3. Choose an `.srt` file from the device.
4. The extension will then use the uploaded file as the source for all features.

## Adjusting Subtitle Timing

If subtitles are out of sync with the video—which often happens with manual uploads—the timing can be shifted globally.

### How to Synchronize

1. **Find a Reference:** Play the video and wait for a clear line of dialogue.
2. **Find the Segment:** In the sidebar, locate the segment that *should* be playing at that exact moment.
3. **Reveal the Sync Icon:** Hover over that sidebar item **near the right edge**. A "Sync" icon (refresh symbol) will appear instantly.
4. **Apply the Shift:** Click the icon and confirm the shift. The extension calculates the offset and moves **all subtitles** to match the current video time.

## FAQ

- **Which formats are supported?** Currently, only `.srt` files are supported for manual uploads.
- **How do I go back to native subtitles?** Simply disable the visibility of the Overlay and Sidebar in the extension menu to see the player's original subtitles without interference.
