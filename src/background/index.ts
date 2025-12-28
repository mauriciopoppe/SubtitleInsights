chrome.webRequest.onCompleted.addListener(
  async (details) => {
    const { url, tabId } = details;

    if (url.includes('/api/timedtext') && !url.includes('&lle_ignore=true')) {
      console.log('[LLE] Detected subtitle URL:', url);

      try {
        // We add a param to avoid intercepting our own fetch if it were to trigger webRequest again
        // though usually background fetches don't trigger webRequest for the same extension in a loop
        const fetchUrl = url + (url.includes('?') ? '&' : '?') + 'lle_ignore=true';
        const response = await fetch(fetchUrl);
        const data = await response.json();

        if (tabId !== -1) {
          chrome.tabs.sendMessage(tabId, {
            type: 'LLE_SUBTITLES_CAPTURED',
            payload: data
          });
        }
      } catch (e) {
        console.error('[LLE] Background fetch failed', e);
      }
    }
  },
  { urls: ['*://*.youtube.com/api/timedtext*'] }
);
