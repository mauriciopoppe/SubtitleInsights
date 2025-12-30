import { h, Fragment } from 'preact';
import { SubtitleSegment } from '../store';
import { renderSegmentedText } from '../render';
import snarkdown from 'snarkdown';

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

      {/* Literal Translation */}
      {segment.literal_translation && (
        <div className="lle-sidebar-literal">
          {segment.literal_translation}
        </div>
      )}

      {/* Contextual Analysis */}
      {segment.contextual_analysis && (
        <div
          className="lle-sidebar-analysis"
          dangerouslySetInnerHTML={{ __html: snarkdown(segment.contextual_analysis) }}
        />
      )}

      {/* Grammatical Gotchas */}
      {segment.grammatical_gotchas && (
        <div
          className="lle-sidebar-gotchas"
          dangerouslySetInnerHTML={{ __html: snarkdown(segment.grammatical_gotchas) }}
        />
      )}
    </div>
  );
}
