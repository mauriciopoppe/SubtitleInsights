import { useState, useEffect } from 'preact/hooks';
import { Config } from '../config';

export function useConfig() {
  const [config, setConfig] = useState({
    isEnabled: true,
    isOverlayEnabled: true,
    isGrammarEnabled: true,
    isPauseOnHoverEnabled: false,
    isLoading: true
  });

  useEffect(() => {
    let isMounted = true;

    async function loadConfig() {
      const [isEnabled, isOverlayEnabled, isGrammarEnabled, isPauseOnHoverEnabled] = await Promise.all([
        Config.getIsEnabled(),
        Config.getIsOverlayEnabled(),
        Config.getIsGrammarExplainerEnabled(),
        Config.getIsPauseOnHoverEnabled()
      ]);

      if (isMounted) {
        setConfig({
          isEnabled,
          isOverlayEnabled,
          isGrammarEnabled,
          isPauseOnHoverEnabled,
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

    Config.addChangeListener(handleEnabledChange);
    Config.addOverlayChangeListener(handleOverlayChange);
    Config.addGrammarExplainerChangeListener(handleGrammarChange);
    Config.addPauseOnHoverChangeListener(handlePauseOnHoverChange);

    return () => {
      isMounted = false;
      // chrome.storage.onChanged.removeListener is not exposed via our Config wrapper
      // but in a production app we'd want to handle cleanup.
    };
  }, []);

  return config;
}
