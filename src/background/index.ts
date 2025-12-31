console.log('[LLE] Background script loading...', new Date().toISOString());

if (typeof chrome !== 'undefined' && chrome.webRequest) {
  chrome.webRequest.onCompleted.addListener(
    async (details) => {
      const { url, tabId } = details;

      if (url.includes('/api/timedtext') && !url.includes('lle_ignore=true')) {
        console.log('[LLE] Detected subtitle URL:', url);
        
        const urlObj = new URL(url);
        const lang = urlObj.searchParams.get('lang');
        const videoId = urlObj.searchParams.get('v');

        try {
          // We add a param to avoid intercepting our own fetch
          const fetchUrl = url + (url.includes('?') ? '&' : '?') + 'lle_ignore=true';
          const response = await fetch(fetchUrl);
          const data = await response.json();

          if (tabId !== -1) {
            chrome.tabs.sendMessage(tabId, {
              type: 'LLE_SUBTITLES_CAPTURED',
              payload: data,
              language: lang,
              videoId: videoId
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'OPEN_OPTIONS_PAGE') {
    chrome.runtime.openOptionsPage();
  }
});
