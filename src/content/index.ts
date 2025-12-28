import "./styles.css";
import { store, SubtitleStore } from "./store";
import { aiClient } from "./ai";
import { renderSegmentedText } from "./render";
import { Config } from "./config";

console.log("[LLE] Content script injected.");

const waitForElement = (selector: string): Promise<HTMLElement> => {
  return new Promise((resolve) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element as HTMLElement);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element as HTMLElement);
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
};

interface OverlayElements {
  container: HTMLElement;
  translation: HTMLElement;
  original: HTMLElement;
  enableButton: HTMLButtonElement;
}

const createOverlay = (): OverlayElements => {
  const overlay = document.createElement("div");
  overlay.id = "lle-overlay";

  const translationText = document.createElement("div");
  translationText.className = "lle-translation";

  const originalText = document.createElement("div");
  originalText.className = "lle-original";

  const enableButton = document.createElement("button");
  enableButton.className = "lle-enable-btn";
  enableButton.innerText = "Enable AI Translation (Download Model)";
  enableButton.style.display = "none"; // Hidden by default

  overlay.appendChild(enableButton);
  overlay.appendChild(translationText);
  overlay.appendChild(originalText);

  return {
    container: overlay,
    translation: translationText,
    original: originalText,
    enableButton,
  };
};

const setupToggle = async () => {
  console.log("[LLE] Setting up toggle...");
  const leftControls = await waitForElement(".ytp-left-controls");
  console.log("[LLE] Found left controls:", leftControls);
  const timeDisplay = await waitForElement(".ytp-time-display");
  console.log("[LLE] Found time display:", timeDisplay);

  const container = document.createElement("div");
  container.className = "lle-toggle-container";

  const toggle = document.createElement("span");
  toggle.className = "lle-toggle-btn";
  toggle.innerText = "LLE";
  toggle.title = "Toggle Language Learning Extension";

  container.appendChild(toggle);

  const updateUI = (enabled: boolean) => {
    toggle.className = `lle-toggle-btn ${enabled ? "enabled" : "disabled"}`;
  };

  const isEnabled = await Config.getIsEnabled();
  updateUI(isEnabled);

  toggle.onclick = async () => {
    const currentState = await Config.getIsEnabled();
    const newState = !currentState;
    await Config.setIsEnabled(newState);
    updateUI(newState);
  };

  Config.addChangeListener((enabled) => {
    updateUI(enabled);
  });

  // Insert container after time display
  timeDisplay.after(container);
};

const init = async () => {
  console.log("[LLE] Waiting for video player...");
  const player = await waitForElement("#movie_player");
  const video = (await waitForElement("video")) as HTMLVideoElement;
  console.log("[LLE] Video player and element found.");

  await setupToggle();

  const overlay = createOverlay();
  player.appendChild(overlay.container);
  console.log("[LLE] Overlay injected.");

  let isEnabled = await Config.getIsEnabled();
  Config.addChangeListener((enabled) => {
    isEnabled = enabled;
    if (!isEnabled) {
      overlay.container.style.display = "none";
    }
  });

  // Check availability and setup enable button
  const availability = await aiClient.getAvailability();
  if (availability === "after-download") {
    overlay.enableButton.style.display = "block";
    overlay.translation.style.display = "none";
    overlay.original.style.display = "none";

    overlay.enableButton.onclick = async () => {
      overlay.enableButton.innerText = "Downloading Model...";
      overlay.enableButton.disabled = true;
      try {
        await aiClient.getSession("System Prompt Placeholder"); // Trigger download
        overlay.enableButton.style.display = "none";
        overlay.translation.style.display = "block";
        overlay.original.style.display = "block";
      } catch (e) {
        console.error("Failed to download model", e);
        overlay.enableButton.innerText = "Download Failed. Retry?";
        overlay.enableButton.disabled = false;
      }
    };
  }

  let lastSegmentText = "";

  // Sync Engine
  video.addEventListener("timeupdate", () => {
    if (!isEnabled) return;

    const currentTimeMs = video.currentTime * 1000;
    store.updatePlaybackTime(currentTimeMs); // Trigger lazy loading
    const activeSegment = store.getSegmentAt(currentTimeMs);

    // Only update if not waiting for download interaction
    if (activeSegment && overlay.enableButton.style.display === "none") {
      overlay.container.style.display = "flex"; // Show overlay
      if (activeSegment.text !== lastSegmentText) {
        overlay.original.innerHTML = "";

        if (activeSegment.segmentedData) {
          overlay.original.innerHTML = renderSegmentedText(
            activeSegment.segmentedData,
          );
        } else {
          // Fallback while processing or if failed
          const words = activeSegment.text.split("");
          words.forEach((char) => {
            const span = document.createElement("span");
            span.className = "lle-word";
            span.innerText = char;
            overlay.original.appendChild(span);
          });
        }
        lastSegmentText = activeSegment.text;
      } else if (
        activeSegment.segmentedData &&
        overlay.original.innerHTML.indexOf("ruby") === -1
      ) {
        // Re-render if segmentation arrived after initial render
        overlay.original.innerHTML = renderSegmentedText(
          activeSegment.segmentedData,
        );
      }

      if (aiClient.isDownloading) {
        overlay.translation.innerText = "AI Model downloading... please wait";
      } else {
        overlay.translation.innerText =
          activeSegment.translation || "Translating...";
      }
    } else if (
      !activeSegment &&
      overlay.enableButton.style.display === "none"
    ) {
      overlay.container.style.display = "none"; // Hide overlay
      overlay.original.innerText = "";
      overlay.translation.innerText = "";
      lastSegmentText = "";
    } else if (activeSegment && overlay.enableButton.style.display !== "none") {
      // Show overlay container even if button is visible, so button can be clicked
      overlay.container.style.display = "flex";
    }
  });

  aiClient.testPromptAPI();

  window.addEventListener("message", (event) => {
    if (event.source !== window) return;

    if (event.data.type === "LLE_SUBTITLES_CAPTURED") {
      console.log("[LLE] Received subtitles:", event.data.payload);
      const segments = SubtitleStore.parseYouTubeJSON(event.data.payload);
      store.addSegments(segments);
    }
  });
};

init();

