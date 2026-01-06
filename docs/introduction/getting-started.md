# Getting Started

Subtitle Insights relies on experimental Chrome built-in AI APIs. Follow these steps to set up your environment and install the extension.

## Prerequisites

- **Chrome Version:** You must use **Chrome 138** or higher.
- **Hardware:** For specific hardware requirements and supported devices, please refer to the [official Chrome Prompt API documentation](https://developer.chrome.com/docs/ai/prompt-api).

## 1. Enable Chrome Flags

You must enable several experimental flags to allow local AI processing:

1. Open `chrome://flags` in your browser.
2. Search for and **Enable** the following flags:
   - `#optimization-guide-on-device-model` (Set to `Enabled BypassPrefocals`)
   - `#prompt-api-for-gemini-nano` (Set to `Enabled`)
   - `#translation-api` (Set to `Enabled`)
3. Relaunch Chrome.

## 2. Install the Extension

Since Subtitle Insights is in active development, you must install it in developer mode:

1. Download or clone the repository from GitHub.
2. Build the extension:
   ```bash
   npm install
   npm run build
   ```
3. Open `chrome://extensions`.
4. Enable **Developer mode** (top right toggle).
5. Click **Load unpacked** and select the `dist/` directory from the project folder.

## 3. Configuration & Verification

1. **Configure your Profile:** Navigate to any YouTube video and click the Subtitle Insights icon in the video control bar. Open **Detailed Settings** to configure your profile. By default, a Japanese-to-English prompt is provided. **Refresh the YouTube page** after creating or selecting a profile to apply the changes.
2. **AI Ready:** Check the extension menu to confirm the AI status. "AI Ready" indicates the models are loaded and functional.
3. **Downloading Models:** If you see "Downloading Models," Chrome is currently fetching the necessary AI components. This may take several minutes.
4. **Enable Captions:** Make sure Closed Captions (CC) are enabled in the video player. Subtitle Insights scans these captions to provide the overlay, translations, and insights.

[Screenshot Placeholder: Extension Status Menu]
