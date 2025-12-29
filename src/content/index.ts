import "./styles.css";
import { store, SubtitleSegment, SubtitleStore } from "./store";
import { Config } from "./config";
import { Sidebar } from "./sidebar";
import { Overlay } from "./overlay";
import { translatorService } from "./ai/translator";
import { translationManager } from "./ai/manager";

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

const setupToggle = async (
  onFileLoaded?: (filename: string) => void,
  onWarning?: (msg?: string) => void,
) => {
  console.log("[LLE] Setting up toggle...");
  const leftControls = await waitForElement(".ytp-left-controls");
  const timeDisplay = await waitForElement(".ytp-time-display");

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
        const { segments, errors } = store.parseMarkdownStructuredData(content);

        if (errors.length > 0) {
          console.group("[LLE] Import Errors");
          errors.forEach((err) => console.error(err));
          console.groupEnd();
          if (onWarning)
            onWarning("Import errors occurred. Check console for details.");
        } else {
          if (onWarning) onWarning(undefined);
        }

        if (segments && segments.length > 0) {
          store.loadStructuredData(segments);
          if (onFileLoaded) onFileLoaded(file.name);
          console.log(
            `[LLE] Successfully loaded ${segments.length} segments from ${file.name}`,
          );
        } else {
          console.warn("[LLE] No valid segments found in file:", file.name);
          alert(
            "No valid segments found in the Markdown file. Please check the format and console for errors.",
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

// @ts-ignore
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "LLE_SUBTITLES_CAPTURED") {
    const currentVideoId = new URLSearchParams(window.location.search).get("v");
    if (message.videoId && message.videoId !== currentVideoId) {
      console.log(`[LLE] Ignoring subtitles for different video (got ${message.videoId}, expected ${currentVideoId})`);
      return;
    }

    console.log("[LLE] Received subtitles from background:", message.payload);
    if (message.language) {
      store.setSourceLanguage(message.language);
    }
    const segments = SubtitleStore.parseYouTubeJSON(message.payload);
    store.addSegments(segments);
  }
});

let isInitialized = false;
let isInitializing = false;

const init = async () => {
  if (isInitialized || isInitializing) return;
  isInitializing = true;

  console.log("[LLE] Initializing extension for watch page...");

  console.log("[LLE] Waiting for video player...");
  const player = await waitForElement("#movie_player");
  const video = (await waitForElement("video")) as HTMLVideoElement;
  // secondary-inner might take longer or depend on layout (theater mode etc)
  const secondaryInner = await waitForElement("#secondary-inner");
  console.log("[LLE] Video player, element and secondary column found.");

  let sidebar: Sidebar;
  const { fileInput } = await setupToggle(
    (filename) => {
      if (sidebar) sidebar.setUploadActive(true, filename);
    },
    (msg) => {
      if (sidebar) sidebar.setWarning(msg);
    },
  );

  sidebar = new Sidebar(() => {
    fileInput.click();
  });

  const overlay = new Overlay();
  player.appendChild(overlay.getElement());
  secondaryInner.prepend(sidebar.getElement());
  console.log("[LLE] Overlay and Sidebar injected.");

  // AI Translation Setup
  const setupAI = async () => {
    const availability = await translatorService.checkAvailability();
    console.log("[LLE] AI Translation availability:", availability);

    if (availability === "available") {
      sidebar.setAIStatus("ready", "AI Translator Ready");
      await translatorService.initialize();
      console.log("[LLE] AI Translator initialized.");
    } else if (availability === "downloadable") {
      sidebar.setAIStatus("none");
      console.log("[LLE] AI models need download.");
      
      const initDownload = async () => {
         sidebar.setAIStatus("downloading", "Downloading AI models...");
         overlay.setSystemMessage("Downloading AI models...");
         const success = await translatorService.initialize((loaded, total) => {
          const percent = Math.round((loaded / total) * 100);
          sidebar.setAIStatus("downloading", `Downloading AI models: ${percent}%`);
          overlay.setSystemMessage(`Downloading AI models: ${percent}%`);
          console.log(`[LLE] AI Download progress: ${percent}%`);
        });

        if (success) {
           sidebar.setAIStatus("ready", "AI Translator Ready");
           overlay.setSystemMessage(null);
           console.log("[LLE] AI Translator initialized after download.");
        } else {
           sidebar.setAIStatus("error", "AI Initialization Failed");
           overlay.setSystemMessage("AI Translation Failed to initialize");
        }
      };

      if (navigator.userActivation?.isActive) {
        console.log("[LLE] User activation active. Starting download immediately.");
        await initDownload();
      } else {
        console.log("[LLE] Waiting for user interaction to start download...");
        const onUserInteraction = async (e: Event) => {
           // Filter invalid keydown events
           if (e.type === 'keydown' && (e as KeyboardEvent).key === 'Escape') return;

           // Remove all listeners
           document.removeEventListener('mousedown', onUserInteraction);
           document.removeEventListener('pointerdown', onUserInteraction);
           document.removeEventListener('pointerup', onUserInteraction);
           document.removeEventListener('touchend', onUserInteraction);
           document.removeEventListener('keydown', onUserInteraction);
           
           console.log(`[LLE] User interaction detected (${e.type}). Starting download...`);
           await initDownload();
        };
        
        document.addEventListener('mousedown', onUserInteraction);
        document.addEventListener('pointerdown', onUserInteraction);
        document.addEventListener('pointerup', onUserInteraction);
        document.addEventListener('touchend', onUserInteraction);
        document.addEventListener('keydown', onUserInteraction);
      }
    }
  };

  setupAI();

  store.addChangeListener(() => {
    sidebar.render(store.getAllSegments());
  });

  store.addSegmentUpdateListener((index, segment) => {
    sidebar.updateSegment(index, segment);
  });
  
  // Initial render in case data arrived before sidebar was ready
  sidebar.render(store.getAllSegments());

  let isEnabled = await Config.getIsEnabled();
  let isOverlayEnabled = await Config.getIsOverlayEnabled();

  sidebar.setVisible(isEnabled);

  Config.addChangeListener((enabled) => {
    isEnabled = enabled;
    sidebar.setVisible(isEnabled);
    if (!isEnabled) {
      overlay.setVisible(false);
    }
  });

  Config.addOverlayChangeListener((enabled) => {
    isOverlayEnabled = enabled;
    if (!isOverlayEnabled) {
      overlay.setVisible(false);
    }
  });

  let currentActiveSegment: SubtitleSegment | undefined = undefined;
  let currentVideoId = new URLSearchParams(window.location.search).get("v");

  const checkVideoChange = () => {
    const newVideoId = new URLSearchParams(window.location.search).get("v");
    if (newVideoId !== currentVideoId) {
      console.log(
        `[LLE] Video ID changed (${currentVideoId} -> ${newVideoId}). Clearing store.`,
      );
      currentVideoId = newVideoId;
      store.clear();
      sidebar.clear();
      sidebar.setUploadActive(false);

      overlay.clear();
      currentActiveSegment = undefined;
    }
  };

  // Sync Engine
  video.addEventListener("timeupdate", () => {
    checkVideoChange();
    const currentTimeMs = video.currentTime * 1000;
    sidebar.highlight(currentTimeMs);
    translationManager.onTimeUpdate(currentTimeMs);

    if (!isEnabled || !isOverlayEnabled) {
      overlay.setVisible(false);
      return;
    }

    const activeSegment = store.getSegmentAt(currentTimeMs);

    // Case 1: No active segment
    if (!activeSegment) {
      if (currentActiveSegment !== undefined) {
        overlay.clear();
        currentActiveSegment = undefined;
      }
      return;
    }

    // Case 2: Active segment exists
    // Ensure overlay is visible
    if (!overlay.isVisible()) {
      overlay.setVisible(true);
    }

    if (activeSegment === currentActiveSegment) {
      return;
    }

    overlay.update(activeSegment);
    currentActiveSegment = activeSegment;
  });

  // Listen for YouTube navigation events to clear the store
  window.addEventListener("yt-navigate-finish", checkVideoChange);
  window.addEventListener("popstate", checkVideoChange);

  isInitialized = true;
  isInitializing = false;
};

const run = () => {
    if (window.location.pathname === '/watch' || window.location.pathname.startsWith('/watch')) {
        init();
    }
};

window.addEventListener("yt-navigate-finish", run);
run();