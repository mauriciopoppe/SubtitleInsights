import { useState, useEffect } from 'preact/hooks';
import { Config } from '../config';

export function useConfig() {
  const [config, setConfig] = useState({
    isEnabled: true,
    isOverlayEnabled: true,
    isGrammarEnabled: true,
    targetJLPTLevel: 'N5',
    isLoading: true
  });

  useEffect(() => {
    let isMounted = true;

    async function loadConfig() {
      const [isEnabled, isOverlayEnabled, isGrammarEnabled, targetJLPTLevel] = await Promise.all([
        Config.getIsEnabled(),
        Config.getIsOverlayEnabled(),
        Config.getIsGrammarExplainerEnabled(),
        Config.getTargetJLPTLevel()
      ]);

      if (isMounted) {
        setConfig({
          isEnabled,
          isOverlayEnabled,
          isGrammarEnabled,
          targetJLPTLevel,
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
    const handleJLPTChange = (val: string) => {
      setConfig(prev => ({ ...prev, targetJLPTLevel: val }));
    };

    Config.addChangeListener(handleEnabledChange);
    Config.addOverlayChangeListener(handleOverlayChange);
    Config.addGrammarExplainerChangeListener(handleGrammarChange);
    Config.addJLPTLevelChangeListener(handleJLPTChange);

    return () => {
      isMounted = false;
      // chrome.storage.onChanged.removeListener is not exposed via our Config wrapper
      // but in a production app we'd want to handle cleanup.
    };
  }, []);

  return config;
}
