import "./styles.css";
import snarkdown from "snarkdown";
import { store, SubtitleStore, SubtitleSegment } from "./store";
import { renderSegmentedText } from "./render";
import { Config } from "./config";
import { Sidebar } from "./sidebar";

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
  literal: HTMLElement;
  analysis: HTMLElement;
  gotchas: HTMLElement;
}

const createOverlay = (): OverlayElements => {
  const overlay = document.createElement("div");
  overlay.id = "lle-overlay";

  const translationText = document.createElement("div");
  translationText.className = "lle-translation";

  const originalText = document.createElement("div");
  originalText.className = "lle-original";

  const literalText = document.createElement("div");
  literalText.className = "lle-literal";

  const analysisText = document.createElement("div");
  analysisText.className = "lle-analysis";

  const gotchasText = document.createElement("div");
  gotchasText.className = "lle-gotchas";

  overlay.appendChild(translationText);
  overlay.appendChild(originalText);
  overlay.appendChild(literalText);
  overlay.appendChild(analysisText);
  overlay.appendChild(gotchasText);

  return {
    container: overlay,
    translation: translationText,
    original: originalText,
    literal: literalText,
    analysis: analysisText,
    gotchas: gotchasText,
  };
};

const setupToggle = async (onFileLoaded?: (filename: string) => void) => {
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

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".md";
  fileInput.style.display = "none";
  fileInput.id = "lle-upload-input";

  container.appendChild(toggle);
  container.appendChild(fileInput);

  const updateUI = (enabled: boolean) => {
    toggle.className = `lle-toggle-btn ${enabled ? "enabled" : "disabled"}`;
  };

  const isEnabled = await Config.getIsEnabled();
  updateUI(isEnabled);

  fileInput.onchange = (e) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const segments = store.parseMarkdownStructuredData(content);

        if (segments && segments.length > 0) {
          store.loadStructuredData(segments);
          if (onFileLoaded) onFileLoaded(file.name);
          console.log(
            `[LLE] Successfully loaded ${segments.length} segments from ${file.name}`,
          );
        } else {
          console.warn("[LLE] No valid segments found in file:", file.name);
          alert(
            "No valid segments found in the Markdown file. Please check the format.",
          );
        }
      } catch (err) {
        console.error("[LLE] Failed to parse Markdown file", err);
        alert(
          "Failed to parse Markdown file. Make sure it follows the required format.",
        );
      }
    };
    reader.readAsText(file);
  };

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

  return { fileInput };
};

const init = async () => {
  console.log("[LLE] Waiting for video player...");
  const player = await waitForElement("#movie_player");
  const video = (await waitForElement("video")) as HTMLVideoElement;
  const secondaryInner = await waitForElement("#secondary-inner");
  console.log("[LLE] Video player, element and secondary column found.");

  const { fileInput } = await setupToggle((filename) => {
    if (sidebar) sidebar.setUploadActive(true, filename);
  });

  sidebar = new Sidebar(() => {
    fileInput.click();
  });

  const overlay = createOverlay();
  player.appendChild(overlay.container);
  secondaryInner.prepend(sidebar.getElement());
  console.log("[LLE] Overlay and Sidebar injected.");

  store.addChangeListener(() => {
    sidebar.render(store.getAllSegments());
  });

  let isEnabled = await Config.getIsEnabled();
  let isOverlayEnabled = await Config.getIsOverlayEnabled();

  sidebar.setVisible(isEnabled);

  Config.addChangeListener((enabled) => {
    isEnabled = enabled;
    sidebar.setVisible(isEnabled);
    if (!isEnabled) {
      overlay.container.style.display = "none";
    }
  });

  Config.addOverlayChangeListener((enabled) => {
    isOverlayEnabled = enabled;
    if (!isOverlayEnabled) {
      overlay.container.style.display = "none";
    }
  });

  let currentActiveSegment: SubtitleSegment | undefined = undefined;

  // Sync Engine
  video.addEventListener("timeupdate", () => {
    const currentTimeMs = video.currentTime * 1000;
    sidebar.highlight(currentTimeMs);

    if (!isEnabled || !isOverlayEnabled) {
      overlay.container.style.display = "none";
      return;
    }

    const activeSegment = store.getSegmentAt(currentTimeMs);

    // Case 1: No active segment
    if (!activeSegment) {
      if (currentActiveSegment !== undefined) {
        overlay.container.style.display = "none";
        overlay.original.innerHTML = "";
        overlay.translation.innerText = "";
        overlay.literal.innerText = "";
        overlay.analysis.innerText = "";
        overlay.gotchas.innerText = "";
        currentActiveSegment = undefined;
      }
      return;
    }

    // Case 2: Active segment exists
    // Ensure overlay is visible
    if (overlay.container.style.display !== "flex") {
      overlay.container.style.display = "flex";
    }

    // Update Original Text
    if (activeSegment.segmentedData) {
      overlay.original.innerHTML = renderSegmentedText(
        activeSegment.segmentedData,
      );
    } else {
      // Fallback
      overlay.original.innerHTML = activeSegment.text
        .split("")
        .map((char) => `<span class="lle-word">${char}</span>`)
        .join("");
    }

    // Update Translation Text
    overlay.translation.innerText = activeSegment.translation || "";

    // Update Additional Fields (only for structured data)
    overlay.literal.innerText = activeSegment.literal_translation || "";
    overlay.analysis.innerHTML = activeSegment.contextual_analysis
      ? snarkdown(activeSegment.contextual_analysis)
      : "";
    overlay.gotchas.innerHTML = activeSegment.grammatical_gotchas
      ? snarkdown(activeSegment.grammatical_gotchas)
      : "";

    currentActiveSegment = activeSegment;
  });

  let currentVideoId = new URLSearchParams(window.location.search).get("v");

  // Listen for YouTube navigation events to clear the store
  window.addEventListener("yt-navigate-finish", () => {
    const newVideoId = new URLSearchParams(window.location.search).get("v");
    if (newVideoId !== currentVideoId) {
      console.log(
        `[LLE] YouTube navigation detected (${currentVideoId} -> ${newVideoId}). Clearing store.`,
      );
      currentVideoId = newVideoId;
      store.clear();
      sidebar.clear();
      sidebar.setUploadActive(false);

      overlay.original.innerHTML = "";
      overlay.translation.innerText = "";
      overlay.literal.innerText = "";
      overlay.analysis.innerHTML = "";
      overlay.gotchas.innerHTML = "";
      currentActiveSegment = undefined;
    }
  });

  // @ts-ignore
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "LLE_SUBTITLES_CAPTURED") {
      console.log("[LLE] Received subtitles from background:", message.payload);
      const segments = SubtitleStore.parseYouTubeJSON(message.payload);
      store.addSegments(segments);
      sidebar.render(store.getAllSegments());
    }
  });
};

init();
