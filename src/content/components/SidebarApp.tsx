import { useState, useEffect, useRef } from 'preact/hooks'
import { SidebarHeader } from './SidebarHeader'
import { SidebarList } from './SidebarList'
import { useSubtitleStore } from '../hooks/useSubtitleStore'
import { useConfig } from '../hooks/useConfig'
import { Config } from '../config'
import { store } from '../store'

export function SidebarApp() {
  const { segments, aiStatus, warning, isUploadActive, uploadFilename } = useSubtitleStore()
  const config = useConfig()
  const [currentTimeMs, setCurrentTimeMs] = useState(0)
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
      const video = document.querySelector('video')
      const timeMs = video ? video.currentTime * 1000 : 0

      // Find active segment or nearest upcoming one
      let targetIndex = segments.findIndex(s => timeMs >= s.start && timeMs <= s.end)
      if (targetIndex === -1) {
        targetIndex = segments.findIndex(s => s.start > timeMs)
      }

      if (targetIndex !== -1) {
        // We need to wait a tick for the items to actually be in the DOM
        setTimeout(() => {
          const item = document.querySelector(`.si-sidebar-item[data-index="${targetIndex}"]`)
          if (item && typeof item.scrollIntoView === 'function') {
            item.scrollIntoView({ behavior: 'auto', block: 'center' })
            hasInitiallyScrolledRef.current = true
          }
        }, 0)
      }
    }
  }, [segments])

  // Sync with video time
  useEffect(() => {
    const video = document.querySelector('video')
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTimeMs(video.currentTime * 1000)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [])

  const handleSync = () => {
    const activeItem = document.querySelector('.si-sidebar-item.active')
    if (activeItem) {
      activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' })
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
          console.group('[SI] Import Errors')
          errors.forEach(err => console.error(err))
          console.groupEnd()
          store.setWarning('Import errors occurred. Check console for details.')
        } else {
          store.setWarning(undefined)
        }

        if (newSegments && newSegments.length > 0) {
          store.loadCustomSegments(newSegments)
          store.setUploadStatus(true, file.name)
          console.log(`[SI] Successfully loaded ${newSegments.length} segments from ${file.name}`)
        } else {
          alert('No valid segments found in the SRT file.')
        }
      } catch (err) {
        console.error('[SI] Failed to parse SRT file', err)
        alert('Failed to parse SRT file.')
      }
    }
    reader.readAsText(file)
  }

  const handleToggleOverlayMaster = async () => {
    const config = await Config.get()
    const { isTranslationVisibleInOverlay, isInsightsVisibleInOverlay, isOriginalVisibleInOverlay } = config

    // If all are ON, turn OFF. Otherwise turn ON.
    const areAllOn = isTranslationVisibleInOverlay && isInsightsVisibleInOverlay && isOriginalVisibleInOverlay

    if (areAllOn) {
      await Config.update({
        isTranslationVisibleInOverlay: false,
        isInsightsVisibleInOverlay: false,
        isOriginalVisibleInOverlay: false
      })
    } else {
      await Config.update({
        isTranslationVisibleInOverlay: true,
        isInsightsVisibleInOverlay: true,
        isOriginalVisibleInOverlay: true
      })
    }
  }

  const handleToggleSidebarMaster = async () => {
    const config = await Config.get()
    const { isTranslationVisibleInSidebar, isInsightsVisibleInSidebar } = config

    const areBothOn = isTranslationVisibleInSidebar && isInsightsVisibleInSidebar

    if (areBothOn) {
      await Config.update({
        isTranslationVisibleInSidebar: false,
        isInsightsVisibleInSidebar: false
      })
    } else {
      await Config.update({
        isTranslationVisibleInSidebar: true,
        isInsightsVisibleInSidebar: true
      })
    }
  }

  const handleTogglePauseOnHover = async () => {
    const { isPauseOnHoverEnabled } = await Config.get()
    await Config.update({ isPauseOnHoverEnabled: !isPauseOnHoverEnabled })
  }

  const handleToggleInsightsOverlay = async () => {
    const { isInsightsVisibleInOverlay } = await Config.get()
    await Config.update({ isInsightsVisibleInOverlay: !isInsightsVisibleInOverlay })
  }

  const handleToggleInsightsSidebar = async () => {
    const { isInsightsVisibleInSidebar } = await Config.get()
    await Config.update({ isInsightsVisibleInSidebar: !isInsightsVisibleInSidebar })
  }

  const handleToggleTranslationOverlay = async () => {
    const { isTranslationVisibleInOverlay } = await Config.get()
    await Config.update({ isTranslationVisibleInOverlay: !isTranslationVisibleInOverlay })
  }

  const handleToggleTranslationSidebar = async () => {
    const { isTranslationVisibleInSidebar } = await Config.get()
    await Config.update({ isTranslationVisibleInSidebar: !isTranslationVisibleInSidebar })
  }

  const handleToggleOriginalOverlay = async () => {
    const { isOriginalVisibleInOverlay } = await Config.get()
    await Config.update({ isOriginalVisibleInOverlay: !isOriginalVisibleInOverlay })
  }

  const handleOpenSettings = () => {
    chrome.runtime.sendMessage({ type: 'OPEN_OPTIONS_PAGE' })
  }

  const handleWheel = (e: WheelEvent) => {
    e.stopPropagation()
  }

  if (!config.isEnabled) return null

  return (
    <div id="si-sidebar" style={{ display: 'flex' }} onWheel={handleWheel}>
      <input type="file" accept=".srt" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />
      <SidebarHeader
        onSync={handleSync}
        onUpload={handleUploadClick}
        onToggleOverlayMaster={handleToggleOverlayMaster}
        onToggleSidebarMaster={handleToggleSidebarMaster}
        onTogglePauseOnHover={handleTogglePauseOnHover}
        onToggleInsightsOverlay={handleToggleInsightsOverlay}
        onToggleInsightsSidebar={handleToggleInsightsSidebar}
        onToggleTranslationOverlay={handleToggleTranslationOverlay}
        onToggleTranslationSidebar={handleToggleTranslationSidebar}
        onToggleOriginalOverlay={handleToggleOriginalOverlay}
        onOpenSettings={handleOpenSettings}
        pauseOnHoverEnabled={config.isPauseOnHoverEnabled}
        isInsightsVisibleInOverlay={config.isInsightsVisibleInOverlay}
        isInsightsVisibleInSidebar={config.isInsightsVisibleInSidebar}
        isTranslationVisibleInOverlay={config.isTranslationVisibleInOverlay}
        isTranslationVisibleInSidebar={config.isTranslationVisibleInSidebar}
        isOriginalVisibleInOverlay={config.isOriginalVisibleInOverlay}
        aiStatus={aiStatus}
        warning={warning}
        isUploadActive={isUploadActive}
        uploadFilename={uploadFilename}
      />
      <SidebarList segments={segments} currentTimeMs={currentTimeMs} />
    </div>
  )
}
