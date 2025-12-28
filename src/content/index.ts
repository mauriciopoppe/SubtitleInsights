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

interface OverlayElements {
  container: HTMLElement;
  translation: HTMLElement;
  original: HTMLElement;
}

const createOverlay = (): OverlayElements => {
  const overlay = document.createElement('div');
  overlay.id = 'lle-overlay';
  
  const translationText = document.createElement('div');
  translationText.className = 'lle-translation';
  
  const originalText = document.createElement('div');
  originalText.className = 'lle-original';
  
  overlay.appendChild(translationText);
  overlay.appendChild(originalText);
  
  return {
    container: overlay,
    translation: translationText,
    original: originalText
  };
};

const createTooltip = (): HTMLElement => {
  const tooltip = document.createElement('div');
  tooltip.className = 'lle-tooltip';
  document.body.appendChild(tooltip);
  return tooltip;
};

const init = async () => {
  console.log('[Language Learning Extension] Waiting for video player...');
  const player = await waitForElement('#movie_player');
  const video = await waitForElement('video') as HTMLVideoElement;
  console.log('[Language Learning Extension] Video player and element found.');

  const overlay = createOverlay();
  player.appendChild(overlay.container);
  const tooltip = createTooltip();
  console.log('[Language Learning Extension] Overlay and tooltip injected.');

  let lastSegmentText = '';

  // Sync Engine
  video.addEventListener('timeupdate', () => {
    const currentTimeMs = video.currentTime * 1000;
    const activeSegment = store.getSegmentAt(currentTimeMs);

    if (activeSegment) {
      overlay.container.style.display = 'flex'; // Show overlay
      if (activeSegment.text !== lastSegmentText) {
          overlay.original.innerHTML = '';
          // Simple split for Japanese (needs improved tokenizer later)
          const words = activeSegment.text.split(''); 
          words.forEach(char => {
              const span = document.createElement('span');
              span.className = 'lle-word';
              span.innerText = char;
              overlay.original.appendChild(span);
          });
          lastSegmentText = activeSegment.text;
      }
      overlay.translation.innerText = activeSegment.translation || 'Translating...';
    } else {
      overlay.container.style.display = 'none'; // Hide overlay
      overlay.original.innerText = '';
      overlay.translation.innerText = '';
      lastSegmentText = '';
    }
  });

  // Hover Tooltip Logic
  overlay.container.addEventListener('mouseover', async (e) => {
    const target = e.target as HTMLElement;
    if (target.className === 'lle-word') {
      const word = target.innerText;
      tooltip.style.display = 'block';
      tooltip.innerText = 'Loading definition...';
      
      const rect = target.getBoundingClientRect();
      tooltip.style.left = `${rect.left}px`;
      tooltip.style.top = `${rect.top - 40}px`;

      try {
        const definition = await aiClient.translate(word, 'literal');
        tooltip.innerText = definition;
      } catch (err) {
        tooltip.innerText = 'Failed to load definition';
      }
    }
  });

  overlay.container.addEventListener('mouseout', (e) => {
    const target = e.target as HTMLElement;
    if (target.className === 'lle-word') {
      tooltip.style.display = 'none';
    }
  });

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
