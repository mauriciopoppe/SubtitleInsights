export class Config {
    private static MASTER_STORAGE_KEY = "lle_is_enabled";
    private static OVERLAY_STORAGE_KEY = "lle_is_overlay_enabled";
    private static GRAMMAR_EXPLAINER_STORAGE_KEY = "lle_is_grammar_explainer_enabled";
    private static PAUSE_ON_HOVER_STORAGE_KEY = "lle_is_pause_on_hover_enabled";
  
    static async getIsEnabled(): Promise<boolean> {
      return new Promise((resolve) => {
        chrome.storage.local.get([this.MASTER_STORAGE_KEY], (result) => {
          // Default to true if not set
          resolve((result[this.MASTER_STORAGE_KEY] as boolean) ?? true);
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
          resolve((result[this.OVERLAY_STORAGE_KEY] as boolean) ?? true);
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
  
    static async getIsGrammarExplainerEnabled(): Promise<boolean> {
      return new Promise((resolve) => {
        chrome.storage.local.get([this.GRAMMAR_EXPLAINER_STORAGE_KEY], (result) => {
          // Default to true if not set
          resolve((result[this.GRAMMAR_EXPLAINER_STORAGE_KEY] as boolean) ?? true);
        });
      });
    }
  
    static async setIsGrammarExplainerEnabled(value: boolean): Promise<void> {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [this.GRAMMAR_EXPLAINER_STORAGE_KEY]: value }, () => {
          resolve();
        });
      });
    }

    static async getIsPauseOnHoverEnabled(): Promise<boolean> {
      return new Promise((resolve) => {
        chrome.storage.local.get([this.PAUSE_ON_HOVER_STORAGE_KEY], (result) => {
          // Default to false if not set (safer for new behavior)
          resolve((result[this.PAUSE_ON_HOVER_STORAGE_KEY] as boolean) ?? false);
        });
      });
    }
  
    static async setIsPauseOnHoverEnabled(value: boolean): Promise<void> {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [this.PAUSE_ON_HOVER_STORAGE_KEY]: value }, () => {
          resolve();
        });
      });
    }
  
    static addChangeListener(callback: (isEnabled: boolean) => void) {
      chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === "local" && changes[this.MASTER_STORAGE_KEY]) {
          callback(changes[this.MASTER_STORAGE_KEY].newValue as boolean);
        }
      });
    }
  
    static addOverlayChangeListener(callback: (isOverlayEnabled: boolean) => void) {
      chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === "local" && changes[this.OVERLAY_STORAGE_KEY]) {
          callback(changes[this.OVERLAY_STORAGE_KEY].newValue as boolean);
        }
      });
    }
  
    static addGrammarExplainerChangeListener(callback: (isEnabled: boolean) => void) {
      chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === "local" && changes[this.GRAMMAR_EXPLAINER_STORAGE_KEY]) {
          callback(changes[this.GRAMMAR_EXPLAINER_STORAGE_KEY].newValue as boolean);
        }
      });
    }

    static addPauseOnHoverChangeListener(callback: (isEnabled: boolean) => void) {
      chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === "local" && changes[this.PAUSE_ON_HOVER_STORAGE_KEY]) {
          callback(changes[this.PAUSE_ON_HOVER_STORAGE_KEY].newValue as boolean);
        }
      });
    }
  }
  