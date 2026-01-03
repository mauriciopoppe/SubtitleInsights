import { SubtitleSegment } from '../store'
import { renderSegmentedText } from '../render'
import snarkdown from 'snarkdown'
import { trimThinkingProcess } from '../ai/utils'
import { useConfig } from '../hooks/useConfig'

interface SidebarItemProps {
  segment: SubtitleSegment
  index: number
  isActive: boolean
}

export function SidebarItem({ segment, index, isActive }: SidebarItemProps) {
  const config = useConfig()

  return (
    <div
      className={`si-sidebar-item ${isActive ? 'active' : ''}`}
      data-index={index}
      data-start={segment.start}
      data-end={segment.end}
    >
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
        <div className="si-sidebar-translation">
          {segment.translation || ''}
        </div>
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
