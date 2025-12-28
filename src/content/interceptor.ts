export {};

console.log('[LLE] Interceptor loaded in MAIN world');

// Patch Fetch
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const [resource] = args;
  let url = '';
  if (typeof resource === 'string') {
    url = resource;
  } else if (resource instanceof Request) {
    url = resource.url;
  }

  if (url.includes('/api/timedtext')) {
    console.log('[LLE] Intercepted timedtext FETCH:', url);
  }

  const response = await originalFetch(...args);

  if (url.includes('/api/timedtext')) {
    const clone = response.clone();
    try {
      const data = await clone.json();
      window.postMessage({ type: 'LLE_SUBTITLES_CAPTURED', payload: data }, '*');
    } catch (e) {
      console.error('[LLE] Failed to parse subtitle JSON (fetch)', e);
    }
  }

  return response;
};

// Patch XHR
const originalOpen = XMLHttpRequest.prototype.open;
const originalSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.open = function (method, url, ...args) {
  // @ts-ignore
  this._url = url;
  // @ts-ignore
  return originalOpen.apply(this, [method, url, ...args]);
};

XMLHttpRequest.prototype.send = function (body) {
  this.addEventListener('load', () => {
    // @ts-ignore
    if (this._url && typeof this._url === 'string' && this._url.includes('/api/timedtext')) {
        // @ts-ignore
        console.log('[LLE] Intercepted timedtext XHR:', this._url);
        try {
            const data = JSON.parse(this.responseText);
            window.postMessage({ type: 'LLE_SUBTITLES_CAPTURED', payload: data }, '*');
        } catch (e) {
            console.error('[LLE] Failed to parse subtitle JSON (XHR)', e);
        }
    }
  });
  // @ts-ignore
  return originalSend.apply(this, [body]);
};