export class Config {
  private static MASTER_STORAGE_KEY = "lle_is_enabled";
  private static OVERLAY_STORAGE_KEY = "lle_is_overlay_enabled";

  static async getIsEnabled(): Promise<boolean> {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.MASTER_STORAGE_KEY], (result) => {
        // Default to true if not set
        resolve(result[this.MASTER_STORAGE_KEY] ?? true);
      });
    });
  }

  static async setIsEnabled(value: boolean): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [this.MASTER_STORAGE_KEY]: value }, () => {
        resolve();
      });
    });
  }

  static async getIsOverlayEnabled(): Promise<boolean> {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.OVERLAY_STORAGE_KEY], (result) => {
        // Default to true if not set
        resolve(result[this.OVERLAY_STORAGE_KEY] ?? true);
      });
    });
  }

  static async setIsOverlayEnabled(value: boolean): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [this.OVERLAY_STORAGE_KEY]: value }, () => {
        resolve();
      });
    });
  }

  static addChangeListener(callback: (isEnabled: boolean) => void) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === "local" && changes[this.MASTER_STORAGE_KEY]) {
        callback(changes[this.MASTER_STORAGE_KEY].newValue);
      }
    });
  }

  static addOverlayChangeListener(callback: (isOverlayEnabled: boolean) => void) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === "local" && changes[this.OVERLAY_STORAGE_KEY]) {
        callback(changes[this.OVERLAY_STORAGE_KEY].newValue);
      }
    });
  }
}