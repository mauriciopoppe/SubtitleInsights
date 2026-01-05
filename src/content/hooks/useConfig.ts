import { useState, useEffect } from 'preact/hooks'
import { Config, AppConfig } from '../config'

const DEFAULT_CONFIG: AppConfig = {
  isEnabled: true,
  isOverlayEnabled: true,
  isSidebarEnabled: false,
  isGrammarEnabled: true,
  isPauseOnHoverEnabled: false,
  isInsightsVisibleInOverlay: true,
  isInsightsVisibleInSidebar: true,
  isTranslationVisibleInOverlay: true,
  isTranslationVisibleInSidebar: true,
  isOriginalVisibleInOverlay: true
}

export function useConfig() {
  const [config, setConfig] = useState<AppConfig & { isLoading: boolean }>({
    ...DEFAULT_CONFIG,
    isLoading: true
  })

  useEffect(() => {
    let isMounted = true

    // Initial load
    Config.get().then(initialConfig => {
      if (isMounted) {
        setConfig({ ...initialConfig, isLoading: false })
      }
    })

    // Subscription
    const unsubscribe = Config.subscribe(newConfig => {
      if (isMounted) {
        setConfig({ ...newConfig, isLoading: false })
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  return config
}
