import './styles.css';
import { store, SubtitleStore } from './store';
import { aiClient } from './ai';

console.log('[Language Learning Extension] Content script injected.');

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

const createOverlay = (): HTMLElement => {
  const overlay = document.createElement('div');
  overlay.id = 'lle-overlay';
  
  const translationText = document.createElement('div');
  translationText.className = 'lle-translation';
  translationText.innerText = "I'm going to the store.";
  
  const originalText = document.createElement('div');
  originalText.className = 'lle-original';
  originalText.innerText = 'お店に行きます。';
  
  overlay.appendChild(translationText);
  overlay.appendChild(originalText);
  
  return overlay;
};

const init = async () => {
  console.log('[Language Learning Extension] Waiting for video player...');
  const player = await waitForElement('#movie_player');
  console.log('[Language Learning Extension] Video player found:', player);

  const overlay = createOverlay();
  player.appendChild(overlay);
  console.log('[Language Learning Extension] Overlay injected.');

  aiClient.testPromptAPI();

  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    
    if (event.data.type === 'LLE_SUBTITLES_CAPTURED') {
      console.log('[Language Learning Extension] Received subtitles:', event.data.payload);
      const segments = SubtitleStore.parseYouTubeJSON(event.data.payload);
      store.addSegments(segments);
    }
  });
};

init();
