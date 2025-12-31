import { useState, useEffect } from 'preact/hooks';
import { Config } from '../config';

export function useConfig() {
  const [config, setConfig] = useState({
    isEnabled: true,
    isOverlayEnabled: true,
    isGrammarEnabled: true,
    isPauseOnHoverEnabled: false,
    isInsightsVisibleInOverlay: true,
    isInsightsVisibleInSidebar: true,
    isTranslationVisibleInOverlay: true,
    isTranslationVisibleInSidebar: true,
    isOriginalVisibleInOverlay: true,
    isLoading: true
  });

  useEffect(() => {
    let isMounted = true;

    async function loadConfig() {
      const [
        isEnabled,
        isOverlayEnabled,
        isGrammarEnabled,
        isPauseOnHoverEnabled,
        isInsightsVisibleInOverlay,
        isInsightsVisibleInSidebar,
        isTranslationVisibleInOverlay,
        isTranslationVisibleInSidebar,
        isOriginalVisibleInOverlay,
      ] = await Promise.all([
        Config.getIsEnabled(),
        Config.getIsOverlayEnabled(),
        Config.getIsGrammarExplainerEnabled(),
        Config.getIsPauseOnHoverEnabled(),
        Config.getIsInsightsVisibleInOverlay(),
        Config.getIsInsightsVisibleInSidebar(),
        Config.getIsTranslationVisibleInOverlay(),
        Config.getIsTranslationVisibleInSidebar(),
        Config.getIsOriginalVisibleInOverlay(),
      ]);

      if (isMounted) {
        setConfig({
          isEnabled,
          isOverlayEnabled,
          isGrammarEnabled,
          isPauseOnHoverEnabled,
          isInsightsVisibleInOverlay,
          isInsightsVisibleInSidebar,
          isTranslationVisibleInOverlay,
          isTranslationVisibleInSidebar,
          isOriginalVisibleInOverlay,
          isLoading: false
        });
      }
    }

    loadConfig();

    const handleEnabledChange = (val: boolean) => {
      setConfig(prev => ({ ...prev, isEnabled: val }));
    };
    const handleOverlayChange = (val: boolean) => {
      setConfig(prev => ({ ...prev, isOverlayEnabled: val }));
    };
    const handleGrammarChange = (val: boolean) => {
      setConfig(prev => ({ ...prev, isGrammarEnabled: val }));
    };
    const handlePauseOnHoverChange = (val: boolean) => {
      setConfig(prev => ({ ...prev, isPauseOnHoverEnabled: val }));
    };
    const handleInsightsOverlayChange = (val: boolean) => {
      setConfig(prev => ({ ...prev, isInsightsVisibleInOverlay: val }));
    };
    const handleInsightsSidebarChange = (val: boolean) => {
      setConfig(prev => ({ ...prev, isInsightsVisibleInSidebar: val }));
    };
    const handleTranslationOverlayChange = (val: boolean) => {
      setConfig(prev => ({ ...prev, isTranslationVisibleInOverlay: val }));
    };
    const handleTranslationSidebarChange = (val: boolean) => {
      setConfig(prev => ({ ...prev, isTranslationVisibleInSidebar: val }));
    };
    const handleOriginalOverlayChange = (val: boolean) => {
      setConfig(prev => ({ ...prev, isOriginalVisibleInOverlay: val }));
    };

    Config.addChangeListener(handleEnabledChange);
    Config.addOverlayChangeListener(handleOverlayChange);
    Config.addGrammarExplainerChangeListener(handleGrammarChange);
    Config.addPauseOnHoverChangeListener(handlePauseOnHoverChange);
    Config.addInsightsInOverlayChangeListener(handleInsightsOverlayChange);
    Config.addInsightsInSidebarChangeListener(handleInsightsSidebarChange);
    Config.addTranslationInOverlayChangeListener(handleTranslationOverlayChange);
    Config.addTranslationInSidebarChangeListener(handleTranslationSidebarChange);
    Config.addOriginalInOverlayChangeListener(handleOriginalOverlayChange);

    return () => {
      isMounted = false;
      // chrome.storage.onChanged.removeListener is not exposed via our Config wrapper
      // but in a production app we'd want to handle cleanup.
    };
  }, []);

  return config;
}
