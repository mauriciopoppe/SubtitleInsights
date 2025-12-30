import "./styles.css";
import { store, SubtitleStore } from "./store";
import { Config } from "./config";
import { translatorService } from "./ai/translator";
import { grammarExplainer } from "./ai/explainer";
import { translationManager } from "./ai/manager";

import { render } from "preact";
import { SidebarApp } from "./components/SidebarApp";
import { OverlayApp } from "./components/OverlayApp";

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
  const rightControls = await waitForElement(".ytp-right-controls");
  // Try to find the subtitles button to insert before it
  const subtitlesBtn = await waitForElement(".ytp-subtitles-button");

  const toggle = document.createElement("button");
  toggle.className = "ytp-button lle-toggle-btn";
  toggle.setAttribute("aria-label", "Toggle Language Learning Extension");
  toggle.setAttribute("aria-pressed", "false");
  toggle.title = "LLE: Subtitle Analysis & Overlay";
  
  // Use native-like structure
  toggle.innerHTML = `
    <div class="lle-button-icon" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
      <svg height="24" viewBox="0 0 24 24" width="24" style="fill: white;">
        <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
      </svg>
    </div>
  `;

  const updateUI = (enabled: boolean) => {
    // Native buttons use aria-pressed or opacity for state
    if (enabled) {
      toggle.style.opacity = "1";
      toggle.setAttribute("aria-pressed", "true");
      toggle.style.color = "#fff";
    } else {
      toggle.style.opacity = "0.4"; // More transparent when disabled
      toggle.setAttribute("aria-pressed", "false");
      toggle.style.color = "#aaa";
    }
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

  // Insert before CC button if possible, otherwise prepend to right controls
  if (subtitlesBtn && subtitlesBtn.parentNode) {
    subtitlesBtn.parentNode.insertBefore(toggle, subtitlesBtn);
  } else {
    rightControls.prepend(toggle);
  }
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

  await setupToggle();
  
  const sidebarContainer = document.createElement("div");
  sidebarContainer.id = "lle-sidebar-root";
  secondaryInner.prepend(sidebarContainer);
  render(<SidebarApp />, sidebarContainer);

  const overlayContainer = document.createElement("div");
  overlayContainer.id = "lle-overlay-root";
  player.appendChild(overlayContainer);
  render(<OverlayApp />, overlayContainer);

  console.log("[LLE] Overlay and Preact Sidebar injected.");

  // AI Translation & Grammar Setup
  const setupAI = async () => {
    const translationAvailability = await translatorService.checkAvailability();
    console.log("[LLE] AI Translation availability:", translationAvailability);

    if (translationAvailability === "available") {
      store.setAIStatus("ready", "AI Translator Ready");
      await translatorService.initialize();
      console.log("[LLE] AI Translator initialized.");
    } else if (translationAvailability === "downloadable") {
      store.setAIStatus("none");
      console.log("[LLE] AI models need download.");
      
      const initDownload = async () => {
         store.setAIStatus("downloading", "Downloading AI models...");
         store.setSystemMessage("Downloading AI models...");
         const success = await translatorService.initialize((loaded, total) => {
          const percent = Math.round((loaded / total) * 100);
          store.setAIStatus("downloading", `Downloading AI models: ${percent}%`);
          store.setSystemMessage(`Downloading AI models: ${percent}%`);
          console.log(`[LLE] AI Download progress: ${percent}%`);
        });

        if (success) {
           store.setAIStatus("ready", "AI Translator Ready");
           store.setSystemMessage(null);
           console.log("[LLE] AI Translator initialized after download.");
        } else {
           store.setAIStatus("error", "AI Initialization Failed");
           store.setSystemMessage("AI Translation Failed to initialize");
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

    // Grammar Explainer Setup
    const grammarAvailability = await grammarExplainer.checkAvailability();
    console.log("[LLE] AI Grammar Explainer availability:", grammarAvailability);
    if (grammarAvailability === "readily" || grammarAvailability === "available") {
       await grammarExplainer.initialize();
       console.log("[LLE] AI Grammar Explainer initialized.");
    }
  };

  setupAI();

  let isEnabled = await Config.getIsEnabled();
  let isOverlayEnabled = await Config.getIsOverlayEnabled();

  Config.addChangeListener((enabled) => {
    isEnabled = enabled;
  });

  Config.addOverlayChangeListener((enabled) => {
    isOverlayEnabled = enabled;
  });

  let currentVideoId = new URLSearchParams(window.location.search).get("v");

  const checkVideoChange = () => {
    const newVideoId = new URLSearchParams(window.location.search).get("v");
    if (newVideoId !== currentVideoId) {
      console.log(
        `[LLE] Video ID changed (${currentVideoId} -> ${newVideoId}). Clearing store.`,
      );
      currentVideoId = newVideoId;
      store.clear();
    }
  };

  // Sync Engine
  video.addEventListener("timeupdate", () => {
    checkVideoChange();
    const currentTimeMs = video.currentTime * 1000;
    translationManager.onTimeUpdate(currentTimeMs);
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
