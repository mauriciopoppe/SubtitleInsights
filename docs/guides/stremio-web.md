# Watching on Stremio Web

Subtitle Insights supports `web.stremio.com`, allowing you to apply AI analysis to your favorite movies and shows.

::: raw

<video controls loop muted playsinline>
  <source src="./stremio.mp4" type="video/mp4">
</video>

:::

## Integration Details

- **Supported Domains:** Only `web.stremio.com` is supported. If you are using `app.strem.io`, you must change the URL in your browser's address bar to `web.stremio.com` for the extension to activate.
- **Sidebar Positioning:** On Stremio, the sidebar is fixed to the right side of the screen.
- **Player Resizing:** The video player automatically shrinks to accommodate the sidebar when it is active, ensuring nothing is hidden.
- **Overlay:** The overlay works identically to the YouTube version, appearing directly over the Stremio player.

## How to Use

1. Navigate to [web.stremio.com](https://web.stremio.com) and start a video.
2. Select a subtitle track from the native Stremio subtitle menu, or upload your own `.srt` file.
3. The Subtitle Insights toggle will appear in the Stremio control bar.
4. Click the toggle to enable the Sidebar or Overlay.

::: tip
If your uploaded subtitles are out of sync with the audio, you can use the [Adjusting Subtitle Timing](/user-manual/selecting-subtitles#adjusting-subtitle-timing) feature in the Sidebar to align them globally with a single click.
:::

## Known Limitations

- The extension will only inject into the `<video>` controls once, if you move to different pages inside `web.stremio.com` you might not see the extension controls. The workaround is to be in the video you want to watch and then refresh the page.
