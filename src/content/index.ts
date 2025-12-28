import './styles.css';
import { store, SubtitleStore } from './store';
import { aiClient } from './ai';
import { renderSegmentedText } from './render';

console.log('[LLE] Content script injected.');

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
  const overlay = document.createElement('div');
  overlay.id = 'lle-overlay';
  
  const translationText = document.createElement('div');
  translationText.className = 'lle-translation';
  
  const originalText = document.createElement('div');
  originalText.className = 'lle-original';
  
  const enableButton = document.createElement('button');
  enableButton.className = 'lle-enable-btn';
  enableButton.innerText = 'Enable AI Translation (Download Model)';
  enableButton.style.display = 'none'; // Hidden by default
  
  overlay.appendChild(enableButton);
  overlay.appendChild(translationText);
  overlay.appendChild(originalText);
  
  return {
    container: overlay,
    translation: translationText,
    original: originalText,
    enableButton
  };
};

const createTooltip = (): HTMLElement => {
  const tooltip = document.createElement('div');
  tooltip.className = 'lle-tooltip';
  document.body.appendChild(tooltip);
  return tooltip;
};

const init = async () => {
  console.log('[LLE] Waiting for video player...');
  const player = await waitForElement('#movie_player');
  const video = await waitForElement('video') as HTMLVideoElement;
  console.log('[LLE] Video player and element found.');

  const overlay = createOverlay();
  player.appendChild(overlay.container);
  const tooltip = createTooltip();
  console.log('[LLE] Overlay and tooltip injected.');

  // Check availability and setup enable button
  const availability = await aiClient.getAvailability();
  if (availability === 'after-download') {
      overlay.enableButton.style.display = 'block';
      overlay.translation.style.display = 'none';
      overlay.original.style.display = 'none';
      
      overlay.enableButton.onclick = async () => {
          overlay.enableButton.innerText = 'Downloading Model...';
          overlay.enableButton.disabled = true;
          try {
              await aiClient.getSession("System Prompt Placeholder"); // Trigger download
              overlay.enableButton.style.display = 'none';
              overlay.translation.style.display = 'block';
              overlay.original.style.display = 'block';
          } catch (e) {
              console.error('Failed to download model', e);
              overlay.enableButton.innerText = 'Download Failed. Retry?';
              overlay.enableButton.disabled = false;
          }
      };
  }

  let lastSegmentText = '';

  // Sync Engine
  video.addEventListener('timeupdate', () => {
    const currentTimeMs = video.currentTime * 1000;
    store.updatePlaybackTime(currentTimeMs); // Trigger lazy loading
    const activeSegment = store.getSegmentAt(currentTimeMs);

    // Only update if not waiting for download interaction
    if (activeSegment && overlay.enableButton.style.display === 'none') {
      overlay.container.style.display = 'flex'; // Show overlay
      if (activeSegment.text !== lastSegmentText) {
          overlay.original.innerHTML = '';
          
          if (activeSegment.segmentedData) {
              overlay.original.innerHTML = renderSegmentedText(activeSegment.segmentedData);
          } else {
            // Fallback while processing or if failed
            const words = activeSegment.text.split(''); 
            words.forEach(char => {
                const span = document.createElement('span');
                span.className = 'lle-word';
                span.innerText = char;
                overlay.original.appendChild(span);
            });
          }
          lastSegmentText = activeSegment.text;
      } else if (activeSegment.segmentedData && overlay.original.innerHTML.indexOf('ruby') === -1) {
          // Re-render if segmentation arrived after initial render
           overlay.original.innerHTML = renderSegmentedText(activeSegment.segmentedData);
      }

      if (aiClient.isDownloading) {
        overlay.translation.innerText = "AI Model downloading... please wait";
      } else {
        overlay.translation.innerText = activeSegment.translation || 'Translating...';
      }
    } else if (!activeSegment && overlay.enableButton.style.display === 'none') {
      overlay.container.style.display = 'none'; // Hide overlay
      overlay.original.innerText = '';
      overlay.translation.innerText = '';
      lastSegmentText = '';
    } else if (activeSegment && overlay.enableButton.style.display !== 'none') {
        // Show overlay container even if button is visible, so button can be clicked
        overlay.container.style.display = 'flex';
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
      console.log('[LLE] Received subtitles:', event.data.payload);
      const segments = SubtitleStore.parseYouTubeJSON(event.data.payload);
      store.addSegments(segments);
    }
  });
};

init();
