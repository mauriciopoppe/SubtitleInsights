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

const init = async () => {
  console.log('[Language Learning Extension] Waiting for video player...');
  const player = await waitForElement('#movie_player');
  console.log('[Language Learning Extension] Video player found:', player);
};

init();