import { useRef, useCallback } from 'preact/hooks'
import { SubtitleSegment, store } from '../store'
import { renderSegmentedText } from '../render'
import snarkdown from 'snarkdown'
import { trimThinkingProcess } from '../ai/utils'
import { useConfig } from '../hooks/useConfig'
import { useProximity } from '../hooks/useProximity'

interface SidebarItemProps {
  segment: SubtitleSegment
  index: number
  isActive: boolean
}

export function SidebarItem({ segment, index, isActive }: SidebarItemProps) {
  const config = useConfig()
  const itemRef = useRef<HTMLDivElement>(null)

  const checkProximity = useCallback((x: number, _y: number, rect: DOMRect) => {
    // Show if within 60px of the right edge
    return x >= rect.width - 60
  }, [])

  const isHoveringControls = useProximity(itemRef, checkProximity)

  const handleJumpClick = (e: MouseEvent) => {
    e.stopPropagation()
    const video = document.querySelector('video')
    if (video) {
      video.currentTime = segment.start / 1000
      if (video.paused) {
        video.play()
      }
    }
  }

  const handleSyncClick = (e: MouseEvent) => {
    e.stopPropagation()
    const video = document.querySelector('video')
    if (!video) return

    const videoTimeMs = video.currentTime * 1000
    const offsetMs = Math.round(videoTimeMs - segment.start)

    if (confirm(`Shift all subtitles by ${offsetMs}ms?`)) {
      store.applyOffset(offsetMs)
      store.setSystemMessage('Subtitles synchronized')
      setTimeout(() => {
        store.setSystemMessage(null)
      }, 3000)
    }
  }

  return (
    <div
      ref={itemRef}
      className={`si-sidebar-item ${isActive ? 'active' : ''}`}
      data-index={index}
      data-start={segment.start}
      data-end={segment.end}
    >
      <div className={`si-sidebar-item-controls ${isHoveringControls ? 'visible' : ''}`}>
        <button
          className="si-sidebar-sync-btn"
          title="Jump to segment"
          onClick={handleJumpClick}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        <button
          className="si-sidebar-sync-btn"
          title="Sync subtitles to current video time"
          onClick={handleSyncClick}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
          </svg>
        </button>
      </div>

      {/* Original text with Furigana */}
      <div className="si-sidebar-original">
        {segment.segmentedData ? (
          <span
            dangerouslySetInnerHTML={{
              __html: renderSegmentedText(segment.segmentedData)
            }}
          />
        ) : (
          segment.text
        )}
      </div>

      {/* Natural Translation */}
      {config.isTranslationVisibleInSidebar && (
        <div className="si-sidebar-translation">{segment.translation || ''}</div>
      )}

      {/* Insights */}
      {segment.insights && config.isInsightsVisibleInSidebar && (
        <div
          className="si-sidebar-insights"
          dangerouslySetInnerHTML={{
            __html: snarkdown(trimThinkingProcess(segment.insights, segment.text))
          }}
        />
      )}
    </div>
  )
}
