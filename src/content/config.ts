export class Config {
  private static STORAGE_KEY = 'lle_is_enabled';

  static async getIsEnabled(): Promise<boolean> {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.STORAGE_KEY], (result) => {
        // Default to true if not set
        resolve(result[this.STORAGE_KEY] ?? true);
      });
    });
  }

  static async setIsEnabled(value: boolean): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [this.STORAGE_KEY]: value }, () => {
        resolve();
      });
    });
  }

  static addChangeListener(callback: (isEnabled: boolean) => void) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && changes[this.STORAGE_KEY]) {
        callback(changes[this.STORAGE_KEY].newValue);
      }
    });
  }
}
