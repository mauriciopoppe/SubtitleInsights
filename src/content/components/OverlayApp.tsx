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

  // The overlay is visible if the extension is enabled AND there is actual content to show
  // (either a system message or an active segment with at least one visible field).
  const hasOverlayContent = !!systemMessage || (!!activeSegment && (
    config.isOriginalVisibleInOverlay || 
    config.isTranslationVisibleInOverlay || 
    (!!activeSegment.insights && config.isInsightsVisibleInOverlay)
  ));

  const isVisible = config.isEnabled && hasOverlayContent;

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
          {config.isOriginalVisibleInOverlay && (
            <div className="lle-original">
              {activeSegment.segmentedData ? (
                <span dangerouslySetInnerHTML={{ __html: renderSegmentedText(activeSegment.segmentedData) }} />
              ) : (
                activeSegment.text
              )}
            </div>
          )}

          {config.isTranslationVisibleInOverlay && (
            <div className="lle-translation">
              {activeSegment.translation || ''}
            </div>
          )}

          {activeSegment.insights && config.isInsightsVisibleInOverlay && (
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
