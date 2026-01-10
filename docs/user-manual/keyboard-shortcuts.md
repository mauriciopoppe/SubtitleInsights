# Keyboard Shortcuts

Subtitle Insights supports native browser shortcuts for seamless navigation. To prevent conflicts with your browser or other extensions, these shortcuts are **not assigned by default** and must be configured manually.

## Available Shortcuts

| Command | Description | Playback Behavior |
| :--- | :--- | :--- |
| **Next Segment** | Jump to the beginning of the *next* subtitle segment. | **Preserves State:** If paused, stays paused. If playing, keeps playing. |
| **Previous Segment** | Jump to the beginning of the *previous* subtitle segment. | **Preserves State:** If paused, stays paused. If playing, keeps playing. |
| **Replay Segment** | Jump to the beginning of the *current* subtitle segment. | **Force Play:** Always resumes playback, even if currently paused. |

## How to Configure

Since these are native Chrome commands, they work globally within the tab when the extension is active.

1.  Open Chrome and navigate to `chrome://extensions/shortcuts` (copy and paste this into your address bar).
2.  Scroll down to find **Subtitle Insights**.
3.  Click the pencil icon next to the command you want to assign (e.g., "Move to next segment").
4.  Press your desired key combination (e.g., `Alt+Right`, `Ctrl+Shift+L`, etc.).

## Suggested Workflow

For an efficient learning experience, we suggest mappings that minimize hand movement and follow common playback patterns:

| Command | Suggested Mapping |
| :--- | :--- |
| **Previous Segment** | `Ctrl + J` |
| **Next Segment** | `Ctrl + L` |
| **Replay Segment** | `Ctrl + R` |

Using these mappings allows you to navigate the video flow almost entirely from your keyboard, using `J` and `L` for backward/forward navigation (mirroring standard YouTube behavior) while holding `Ctrl`.

::: tip
If a shortcut doesn't work, ensure it isn't already reserved by the browser or another extension. The input field will usually warn you of conflicts.
:::

## Disabling Shortcuts

To temporarily disable these shortcuts without removing the keybindings:
1.  Open the Subtitle Insights extension popup.
2.  Toggle **Extension Enabled** to **OFF**.

The shortcuts are automatically disabled whenever the extension is globally disabled.
