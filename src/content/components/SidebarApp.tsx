import { useEffect, useRef } from 'preact/hooks'
import { SidebarHeader } from './SidebarHeader'
import { SidebarList } from './SidebarList'
import { useSubtitleStore } from '../hooks/useSubtitleStore'
import { useConfig } from '../hooks/useConfig'
import { store, storeLogger } from '../store'
import { videoController } from '../VideoController'

export function SidebarApp() {
  const { segments, isUploadActive, uploadFilename } = useSubtitleStore()
  const config = useConfig()
  const hasInitiallyScrolledRef = useRef(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset scroll tracker when segments are cleared (usually on video change)
  useEffect(() => {
    if (segments.length === 0) {
      hasInitiallyScrolledRef.current = false
    }
  }, [segments.length])

  // Handle initial auto-scroll when segments arrive
  useEffect(() => {
    if (segments.length > 0 && !hasInitiallyScrolledRef.current) {
      const targetIndex = videoController.targetSegmentIndex.value

      if (targetIndex !== -1) {
        // We need to wait a tick for the items to actually be in the DOM
        setTimeout(() => {
          const listContainer = document.querySelector('.si-sidebar-list') as HTMLElement
          const item = document.querySelector(`.si-sidebar-item[data-index="${targetIndex}"]`) as HTMLElement

          if (listContainer && item) {
            // Calculate position to center the item
            const itemTop = item.offsetTop
            const itemHeight = item.offsetHeight
            const listHeight = listContainer.clientHeight

            const scrollTop = itemTop - listHeight / 2 + itemHeight / 2
            if (typeof listContainer.scrollTo === 'function') {
              listContainer.scrollTo({ top: scrollTop, behavior: 'auto' })
            }

            hasInitiallyScrolledRef.current = true
          }
        }, 0)
      }
    }
  }, [segments])

  const handleScrollToCurrent = () => {
    const listContainer = document.querySelector('.si-sidebar-list') as HTMLElement
    const targetIndex = videoController.targetSegmentIndex.value
    const item = document.querySelector(`.si-sidebar-item[data-index="${targetIndex}"]`) as HTMLElement

    if (listContainer && item) {
      const itemTop = item.offsetTop
      const itemHeight = item.offsetHeight
      const listHeight = listContainer.clientHeight

      const scrollTop = itemTop - listHeight / 2 + itemHeight / 2
      if (typeof listContainer.scrollTo === 'function') {
        listContainer.scrollTo({ top: scrollTop, behavior: 'smooth' })
      }
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = event => {
      try {
        const content = event.target?.result as string
        const { segments: newSegments, errors } = store.parseSRTData(content)

        if (errors.length > 0) {
          storeLogger('Import Errors:', errors)
          store.setWarning('Import errors occurred. Check console for details.')
        } else {
          store.setWarning(undefined)
        }

        if (newSegments && newSegments.length > 0) {
          store.loadCustomSegments(newSegments)
          store.setUploadStatus(true, file.name)
          storeLogger(`Successfully loaded ${newSegments.length} segments from ${file.name}`)
        } else {
          alert('No valid segments found in the SRT file.')
        }
      } catch (err) {
        storeLogger('ERROR: Failed to parse SRT file', err)
        alert('Failed to parse SRT file.')
      }
    }
    reader.readAsText(file)
  }

  const handleWheel = (e: WheelEvent) => {
    e.stopPropagation()
  }

  if (!config.isEnabled || !config.isSidebarEnabled || segments.length === 0) return null

  return (
    <div id="si-sidebar" style={{ display: 'flex' }} onWheel={handleWheel}>
      <input type="file" accept=".srt" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />
      <SidebarHeader
        onScrollToCurrent={handleScrollToCurrent}
        onUpload={handleUploadClick}
        isUploadActive={isUploadActive}
        uploadFilename={uploadFilename}
      />
      <SidebarList segments={segments} />
    </div>
  )
}
