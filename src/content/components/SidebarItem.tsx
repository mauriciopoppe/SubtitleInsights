import { SubtitleSegment } from '../store';
import { renderSegmentedText } from '../render';
import snarkdown from 'snarkdown';
import { trimThinkingProcess } from '../ai/utils';

interface SidebarItemProps {
  segment: SubtitleSegment;
  index: number;
  isActive: boolean;
}

export function SidebarItem({ segment, index, isActive }: SidebarItemProps) {
  return (
    <div
      className={`lle-sidebar-item ${isActive ? 'active' : ''}`}
      data-index={index}
      data-start={segment.start}
      data-end={segment.end}
    >
      {/* Original text with Furigana */}
      <div className="lle-sidebar-original">
        {segment.segmentedData ? (
          <span dangerouslySetInnerHTML={{ __html: renderSegmentedText(segment.segmentedData) }} />
        ) : (
          segment.text
        )}
      </div>

      {/* Natural Translation */}
      <div className="lle-sidebar-translation">
        {segment.translation || ''}
      </div>

      {/* Insights */}
      {segment.insights && (
        <div
          className="lle-sidebar-insights"
          dangerouslySetInnerHTML={{ __html: snarkdown(trimThinkingProcess(segment.insights)) }}
        />
      )}
    </div>
  );
}
