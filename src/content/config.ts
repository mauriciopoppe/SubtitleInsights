export interface AppConfig {
  isEnabled: boolean
  isOverlayEnabled: boolean
  isGrammarEnabled: boolean
  isPauseOnHoverEnabled: boolean
  isInsightsVisibleInOverlay: boolean
  isInsightsVisibleInSidebar: boolean
  isTranslationVisibleInOverlay: boolean
  isTranslationVisibleInSidebar: boolean
  isOriginalVisibleInOverlay: boolean
}

export class Config {
  private static KEYS = {
    isEnabled: 'si_is_enabled',
    isOverlayEnabled: 'si_is_overlay_enabled',
    isGrammarEnabled: 'si_is_grammar_explainer_enabled',
    isPauseOnHoverEnabled: 'si_is_pause_on_hover_enabled',
    isInsightsVisibleInOverlay: 'si_is_insights_in_overlay',
    isInsightsVisibleInSidebar: 'si_is_insights_in_sidebar',
    isTranslationVisibleInOverlay: 'si_is_translation_in_overlay',
    isTranslationVisibleInSidebar: 'si_is_translation_in_sidebar',
    isOriginalVisibleInOverlay: 'si_is_original_in_overlay'
  }

  private static DEFAULTS: AppConfig = {
    isEnabled: true,
    isOverlayEnabled: true,
    isGrammarEnabled: true,
    isPauseOnHoverEnabled: false,
    isInsightsVisibleInOverlay: true,
    isInsightsVisibleInSidebar: true,
    isTranslationVisibleInOverlay: true,
    isTranslationVisibleInSidebar: true,
    isOriginalVisibleInOverlay: true
  }

  private static listeners: Set<(config: AppConfig) => void> = new Set()
  private static _initialized = false

  private static init() {
    if (this._initialized) return
    this._initialized = true

    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== 'local') return

      // Check if any of our keys changed
      const relevantChange = Object.values(this.KEYS).some(key => changes[key])
      if (relevantChange) {
        this.get().then(config => {
          this.listeners.forEach(cb => cb(config))
        })
      }
    })
  }

  static async get(): Promise<AppConfig> {
    return new Promise(resolve => {
      const keys = Object.values(this.KEYS)
      chrome.storage.local.get(keys, result => {
        const config: any = {}
        // Map storage keys back to AppConfig keys
        for (const [configKey, storageKey] of Object.entries(this.KEYS)) {
          config[configKey] = result[storageKey] ?? (this.DEFAULTS as any)[configKey]
        }
        resolve(config as AppConfig)
      })
    })
  }

  static async update(partial: Partial<AppConfig>): Promise<void> {
    const storageUpdate: any = {}
    for (const [key, value] of Object.entries(partial)) {
      const storageKey = (this.KEYS as any)[key]
      if (storageKey) {
        storageUpdate[storageKey] = value
      }
    }
    return new Promise(resolve => {
      chrome.storage.local.set(storageUpdate, () => resolve())
    })
  }

  static subscribe(callback: (config: AppConfig) => void): () => void {
    this.init()
    this.listeners.add(callback)
    return () => {
      this.listeners.delete(callback)
    }
  }

  // Helper for specific keys if needed (compatibility wrappers could go here,
  // but better to migrate usage).
  // For now, I will remove all old methods to force migration and cleaner code.
}
