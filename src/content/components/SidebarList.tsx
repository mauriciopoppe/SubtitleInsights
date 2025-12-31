import { SubtitleSegment } from '../store';
import { SidebarItem } from './SidebarItem';
import { useMemo } from 'preact/hooks';

interface SidebarListProps {
  segments: SubtitleSegment[];
  currentTimeMs: number;
}

export function SidebarList({ segments, currentTimeMs }: SidebarListProps) {
  const activeIndex = useMemo(() => {
    return segments.findIndex(
      (seg) => currentTimeMs >= seg.start && currentTimeMs <= seg.end
    );
  }, [segments, currentTimeMs]);

  return (
    <div className="lle-sidebar-list">
      {segments.map((segment, index) => (
        <SidebarItem
          key={`${segment.start}-${index}`}
          segment={segment}
          index={index}
          isActive={index === activeIndex}
        />
      ))}
    </div>
  );
}
