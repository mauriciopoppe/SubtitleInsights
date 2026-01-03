export class Config {
  private static MASTER_STORAGE_KEY = 'si_is_enabled'
  private static OVERLAY_STORAGE_KEY = 'si_is_overlay_enabled'
  private static GRAMMAR_EXPLAINER_STORAGE_KEY = 'si_is_grammar_explainer_enabled'
  private static PAUSE_ON_HOVER_STORAGE_KEY = 'si_is_pause_on_hover_enabled'
  private static INSIGHTS_IN_OVERLAY_KEY = 'si_is_insights_in_overlay'
  private static INSIGHTS_IN_SIDEBAR_KEY = 'si_is_insights_in_sidebar'
  private static TRANSLATION_IN_OVERLAY_KEY = 'si_is_translation_in_overlay'
  private static TRANSLATION_IN_SIDEBAR_KEY = 'si_is_translation_in_sidebar'
  private static ORIGINAL_IN_OVERLAY_KEY = 'si_is_original_in_overlay'

  static async getIsEnabled (): Promise<boolean> {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.MASTER_STORAGE_KEY], (result) => {
        // Default to true if not set
        resolve((result[this.MASTER_STORAGE_KEY] as boolean) ?? true)
      })
    })
  }

  static async setIsEnabled (value: boolean): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [this.MASTER_STORAGE_KEY]: value }, () => {
        resolve()
      })
    })
  }

  static async getIsOverlayEnabled (): Promise<boolean> {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.OVERLAY_STORAGE_KEY], (result) => {
        // Default to true if not set
        resolve((result[this.OVERLAY_STORAGE_KEY] as boolean) ?? true)
      })
    })
  }

  static async setIsOverlayEnabled (value: boolean): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [this.OVERLAY_STORAGE_KEY]: value }, () => {
        resolve()
      })
    })
  }

  static async getIsGrammarExplainerEnabled (): Promise<boolean> {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.GRAMMAR_EXPLAINER_STORAGE_KEY], (result) => {
        // Default to true if not set
        resolve((result[this.GRAMMAR_EXPLAINER_STORAGE_KEY] as boolean) ?? true)
      })
    })
  }

  static async setIsGrammarExplainerEnabled (value: boolean): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [this.GRAMMAR_EXPLAINER_STORAGE_KEY]: value }, () => {
        resolve()
      })
    })
  }

  static async getIsPauseOnHoverEnabled (): Promise<boolean> {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.PAUSE_ON_HOVER_STORAGE_KEY], (result) => {
        // Default to false if not set (safer for new behavior)
        resolve((result[this.PAUSE_ON_HOVER_STORAGE_KEY] as boolean) ?? false)
      })
    })
  }

  static async setIsPauseOnHoverEnabled (value: boolean): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [this.PAUSE_ON_HOVER_STORAGE_KEY]: value }, () => {
        resolve()
      })
    })
  }

  // Granular Visibility Getters/Setters

  static async getIsInsightsVisibleInOverlay (): Promise<boolean> {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.INSIGHTS_IN_OVERLAY_KEY], (result) => {
        resolve((result[this.INSIGHTS_IN_OVERLAY_KEY] as boolean) ?? true)
      })
    })
  }

  static async setIsInsightsVisibleInOverlay (value: boolean): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [this.INSIGHTS_IN_OVERLAY_KEY]: value }, () => resolve())
    })
  }

  static async getIsInsightsVisibleInSidebar (): Promise<boolean> {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.INSIGHTS_IN_SIDEBAR_KEY], (result) => {
        resolve((result[this.INSIGHTS_IN_SIDEBAR_KEY] as boolean) ?? true)
      })
    })
  }

  static async setIsInsightsVisibleInSidebar (value: boolean): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [this.INSIGHTS_IN_SIDEBAR_KEY]: value }, () => resolve())
    })
  }

  static async getIsTranslationVisibleInOverlay (): Promise<boolean> {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.TRANSLATION_IN_OVERLAY_KEY], (result) => {
        resolve((result[this.TRANSLATION_IN_OVERLAY_KEY] as boolean) ?? true)
      })
    })
  }

  static async setIsTranslationVisibleInOverlay (value: boolean): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [this.TRANSLATION_IN_OVERLAY_KEY]: value }, () => resolve())
    })
  }

  static async getIsTranslationVisibleInSidebar (): Promise<boolean> {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.TRANSLATION_IN_SIDEBAR_KEY], (result) => {
        resolve((result[this.TRANSLATION_IN_SIDEBAR_KEY] as boolean) ?? true)
      })
    })
  }

  static async setIsTranslationVisibleInSidebar (value: boolean): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [this.TRANSLATION_IN_SIDEBAR_KEY]: value }, () => resolve())
    })
  }

  static async getIsOriginalVisibleInOverlay (): Promise<boolean> {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.ORIGINAL_IN_OVERLAY_KEY], (result) => {
        resolve((result[this.ORIGINAL_IN_OVERLAY_KEY] as boolean) ?? true)
      })
    })
  }

  static async setIsOriginalVisibleInOverlay (value: boolean): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [this.ORIGINAL_IN_OVERLAY_KEY]: value }, () => resolve())
    })
  }

  static addChangeListener (callback: (isEnabled: boolean) => void) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && changes[this.MASTER_STORAGE_KEY]) {
        callback(changes[this.MASTER_STORAGE_KEY].newValue as boolean)
      }
    })
  }

  static addOverlayChangeListener (callback: (isOverlayEnabled: boolean) => void) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && changes[this.OVERLAY_STORAGE_KEY]) {
        callback(changes[this.OVERLAY_STORAGE_KEY].newValue as boolean)
      }
    })
  }

  static addGrammarExplainerChangeListener (callback: (isEnabled: boolean) => void) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && changes[this.GRAMMAR_EXPLAINER_STORAGE_KEY]) {
        callback(changes[this.GRAMMAR_EXPLAINER_STORAGE_KEY].newValue as boolean)
      }
    })
  }

  static addPauseOnHoverChangeListener (callback: (isEnabled: boolean) => void) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && changes[this.PAUSE_ON_HOVER_STORAGE_KEY]) {
        callback(changes[this.PAUSE_ON_HOVER_STORAGE_KEY].newValue as boolean)
      }
    })
  }

  static addInsightsInOverlayChangeListener (callback: (value: boolean) => void) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && changes[this.INSIGHTS_IN_OVERLAY_KEY]) {
        callback(changes[this.INSIGHTS_IN_OVERLAY_KEY].newValue as boolean)
      }
    })
  }

  static addInsightsInSidebarChangeListener (callback: (value: boolean) => void) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && changes[this.INSIGHTS_IN_SIDEBAR_KEY]) {
        callback(changes[this.INSIGHTS_IN_SIDEBAR_KEY].newValue as boolean)
      }
    })
  }

  static addTranslationInOverlayChangeListener (callback: (value: boolean) => void) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && changes[this.TRANSLATION_IN_OVERLAY_KEY]) {
        callback(changes[this.TRANSLATION_IN_OVERLAY_KEY].newValue as boolean)
      }
    })
  }

  static addTranslationInSidebarChangeListener (callback: (value: boolean) => void) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && changes[this.TRANSLATION_IN_SIDEBAR_KEY]) {
        callback(changes[this.TRANSLATION_IN_SIDEBAR_KEY].newValue as boolean)
      }
    })
  }

  static addOriginalInOverlayChangeListener (callback: (value: boolean) => void) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && changes[this.ORIGINAL_IN_OVERLAY_KEY]) {
        callback(changes[this.ORIGINAL_IN_OVERLAY_KEY].newValue as boolean)
      }
    })
  }
}
