import { Fragment } from 'preact'
import { useState, useEffect, useMemo, useRef } from 'preact/hooks'
import { useSubtitleStore } from '../hooks/useSubtitleStore'
import { useConfig } from '../hooks/useConfig'
import { usePauseOnHover } from '../hooks/usePauseOnHover'
import { renderSegmentedText } from '../render'
import { store } from '../store'
import { Config } from '../config'
import snarkdown from 'snarkdown'
import { trimThinkingProcess } from '../ai/utils'

export function OverlayApp() {
  const { segments, systemMessage } = useSubtitleStore()
  const config = useConfig()
  const [currentTimeMs, setCurrentTimeMs] = useState(0)
  const overlayRef = useRef<HTMLDivElement>(null)

  const [isHoveringControls, setIsHoveringControls] = useState(false)

  const handleMouseMove = (e: MouseEvent) => {
    if (overlayRef.current) {
      const rect = overlayRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Show controls if mouse is in the top-left area (120x50)
      // or if we are already hovering the controls (to prevent flickering when moving fast)
      const isInZone = x >= 0 && x <= 120 && y >= 0 && y <= 50
      setIsHoveringControls(isInZone)
    }
  }

  const handleMouseLeave = () => {
    setIsHoveringControls(false)
  }

  useEffect(() => {
    const video = document.querySelector('video')
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTimeMs(video.currentTime * 1000)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [])

  const activeSegment = useMemo(() => {
    return store.getSegmentAt(currentTimeMs)
  }, [segments, currentTimeMs])

  const togglePauseOnHover = (e: MouseEvent) => {
    e.stopPropagation()
    Config.update({ isPauseOnHoverEnabled: !config.isPauseOnHoverEnabled })
  }

  const scrollSidebarToActive = (e: MouseEvent) => {
    e.stopPropagation()
    const activeItem = document.querySelector('.si-sidebar-item.active')
    if (activeItem) {
      activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const replayActiveSegment = (e: MouseEvent) => {
    e.stopPropagation()
    if (activeSegment) {
      const video = document.querySelector('video')
      if (video) {
        video.currentTime = activeSegment.start / 1000
        video.play()
      }
    }
  }

  // The overlay is visible if the extension is enabled AND there is actual content to show
  // (either a system message or an active segment with at least one visible field).
  const hasOverlayContent =
    !!systemMessage ||
    (!!activeSegment &&
      (config.isOriginalVisibleInOverlay ||
        config.isTranslationVisibleInOverlay ||
        (!!activeSegment.insights && config.isInsightsVisibleInOverlay)))

  const isVisible = config.isEnabled && hasOverlayContent

  usePauseOnHover(config.isPauseOnHoverEnabled, overlayRef, isVisible)

  if (!isVisible) return null

  return (
    <div
      id="si-overlay"
      ref={overlayRef}
      style={{ display: 'flex' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`si-overlay-controls ${isHoveringControls ? 'visible' : ''}`}>
        <button
          className={`si-overlay-toggle-pause ${config.isPauseOnHoverEnabled ? 'active' : ''}`}
          onClick={togglePauseOnHover}
          title={config.isPauseOnHoverEnabled ? 'Disable Pause on Hover' : 'Enable Pause on Hover'}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        </button>
        <button
          className="si-overlay-scroll-sidebar"
          onClick={scrollSidebarToActive}
          title="Scroll Sidebar to Active Segment"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
          </svg>
        </button>
        <button className="si-overlay-replay-segment" onClick={replayActiveSegment} title="Replay Segment">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
          </svg>
        </button>
      </div>

      {systemMessage && (
        <div className="si-system-message" style={{ display: 'block' }}>
          {systemMessage}
        </div>
      )}

      {activeSegment && !systemMessage && (
        <Fragment>
          {config.isOriginalVisibleInOverlay && (
            <div className="si-original">
              {activeSegment.segmentedData ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: renderSegmentedText(activeSegment.segmentedData)
                  }}
                />
              ) : (
                activeSegment.text
              )}
            </div>
          )}

          {config.isTranslationVisibleInOverlay && (
            <div className="si-translation">{activeSegment.translation || ''}</div>
          )}

          {activeSegment.insights && config.isInsightsVisibleInOverlay && (
            <div
              className="si-insights"
              dangerouslySetInnerHTML={{
                __html: snarkdown(trimThinkingProcess(activeSegment.insights, activeSegment.text))
              }}
            />
          )}
        </Fragment>
      )}
    </div>
  )
}
