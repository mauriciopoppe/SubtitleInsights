import { Fragment } from 'preact';
import { useState, useEffect, useMemo, useRef } from 'preact/hooks';
import { useSubtitleStore } from '../hooks/useSubtitleStore';
import { useConfig } from '../hooks/useConfig';
import { usePauseOnHover } from '../hooks/usePauseOnHover';
import { renderSegmentedText } from '../render';
import { store } from '../store';
import snarkdown from 'snarkdown';
import { trimThinkingProcess } from '../ai/utils';

export function OverlayApp() {
  const { segments, systemMessage } = useSubtitleStore();
  const config = useConfig();
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = document.querySelector('video');
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTimeMs(video.currentTime * 1000);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  const activeSegment = useMemo(() => {
    return store.getSegmentAt(currentTimeMs);
  }, [segments, currentTimeMs]);

  const isVisible = config.isEnabled && config.isOverlayEnabled && (!!activeSegment || !!systemMessage);

  usePauseOnHover(config.isPauseOnHoverEnabled, overlayRef, isVisible);

  if (!isVisible) return null;

  return (
    <div 
      id="lle-overlay" 
      ref={overlayRef}
      style={{ display: 'flex' }}
    >
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
              activeSegment.text
            )}
          </div>

          <div className="lle-translation">
            {activeSegment.translation || ''}
          </div>

          {activeSegment.insights && (
            <div
              className="lle-insights"
              dangerouslySetInnerHTML={{ __html: snarkdown(trimThinkingProcess(activeSegment.insights)) }}
            />
          )}
        </Fragment>
      )}
    </div>
  );
}
