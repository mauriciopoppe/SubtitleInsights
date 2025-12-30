import { h, Fragment } from 'preact';
import { useState, useEffect, useMemo } from 'preact/hooks';
import { useSubtitleStore } from '../hooks/useSubtitleStore';
import { useConfig } from '../hooks/useConfig';
import { renderSegmentedText } from '../render';
import { store } from '../store';
import snarkdown from 'snarkdown';

export function OverlayApp() {
  const segments = useSubtitleStore();
  const config = useConfig();
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [systemMessage, setSystemMessage] = useState<string | null>(null);

  useEffect(() => {
    const video = document.querySelector('video');
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTimeMs(video.currentTime * 1000);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  // Bridge for index.tsx
  useEffect(() => {
    (window as any).__LLE_OVERLAY__ = {
      setSystemMessage: (msg: string | null) => setSystemMessage(msg)
    };
    return () => delete (window as any).__LLE_OVERLAY__;
  }, []);

  const activeSegment = useMemo(() => {
    return store.getSegmentAt(currentTimeMs);
  }, [segments, currentTimeMs]);

  const isVisible = config.isEnabled && config.isOverlayEnabled && (!!activeSegment || !!systemMessage);

  if (!isVisible) return null;

  return (
    <div id="lle-overlay" style={{ display: 'flex' }}>
      {systemMessage && (
        <div className="lle-system-message" style={{ display: 'block' }}>
          {systemMessage}
        </div>
      )}

      {activeSegment && !systemMessage && (
        <Fragment>
          <div className="lle-original">
            {activeSegment.segmentedData ? (
              <span dangerouslySetInnerHTML={{ __html: renderSegmentedText(activeSegment.segmentedData) }} />
            ) : (
              activeSegment.text.split('').map((char, i) => (
                <span key={i} className="lle-word">{char}</span>
              ))
            )}
          </div>

          <div className="lle-translation">
            {activeSegment.translation || ''}
          </div>

          <div className="lle-literal">
            {activeSegment.literal_translation || ''}
          </div>

          {activeSegment.contextual_analysis && (
            <div
              className="lle-analysis"
              dangerouslySetInnerHTML={{ __html: snarkdown(activeSegment.contextual_analysis) }}
            />
          )}

          {activeSegment.grammatical_gotchas && (
            <div
              className="lle-gotchas"
              dangerouslySetInnerHTML={{ __html: snarkdown(activeSegment.grammatical_gotchas) }}
            />
          )}
        </Fragment>
      )}
    </div>
  );
}
