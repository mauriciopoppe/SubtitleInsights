import { SubtitleSegment } from '../store'
import { SidebarItem } from './SidebarItem'

interface SidebarListProps {
  segments: SubtitleSegment[]
}

export function SidebarList({ segments }: SidebarListProps) {
  return (
    <div className="si-sidebar-list">
      {segments.map((segment, index) => (
        <SidebarItem key={`${segment.start}-${index}`} segment={segment} index={index} />
      ))}
    </div>
  )
}
