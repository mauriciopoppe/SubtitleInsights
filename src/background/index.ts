console.log('[LLE] Background script loading...', new Date().toISOString());

if (typeof chrome !== 'undefined' && chrome.webRequest) {
  chrome.webRequest.onCompleted.addListener(
    async (details) => {
      const { url, tabId } = details;

      if (url.includes('/api/timedtext') && !url.includes('lle_ignore=true')) {
        console.log('[LLE] Detected subtitle URL:', url);

        try {
          // We add a param to avoid intercepting our own fetch
          const fetchUrl = url + (url.includes('?') ? '&' : '?') + 'lle_ignore=true';
          const response = await fetch(fetchUrl);
          const data = await response.json();

          if (tabId !== -1) {
            chrome.tabs.sendMessage(tabId, {
              type: 'LLE_SUBTITLES_CAPTURED',
              payload: data
            }, () => {
              if (chrome.runtime.lastError) {
                console.warn('[LLE] Could not send subtitles to tab. Content script might not be ready yet.', chrome.runtime.lastError.message);
              }
            });
          }
        } catch (e) {
          console.error('[LLE] Background fetch failed', e);
        }
      }
    },
    { urls: ['*://*.youtube.com/api/timedtext*'] }
  );
  console.log('[LLE] webRequest listener registered.');
} else {
  console.error('[LLE] chrome.webRequest is not available. Check permissions in manifest.json.');
}
