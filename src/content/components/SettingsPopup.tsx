import { useEffect, useRef, useState } from 'preact/hooks'
import { useConfig } from '../hooks/useConfig'
import { Config } from '../config'
import { useSubtitleStore } from '../hooks/useSubtitleStore'
import { store } from '../store'
import { ComponentChildren, RefObject } from 'preact'

type View = 'main' | 'overlay' | 'sidebar'

interface SettingsItemProps {
  label: string
  icon?: ComponentChildren
  onClick?: () => void
  status?: 'enabled' | 'disabled' | 'indeterminate'
  title?: string
  isNested?: boolean
  style?: any
  type?: 'toggle' | 'link' | 'back'
  subLabel?: string
  disabled?: boolean
}

export function SettingsItem({
  label,
  icon,
  onClick,
  status,
  title,
  isNested,
  style,
  type = 'toggle',
  subLabel,
  disabled
}: SettingsItemProps) {
  const className = `si-settings-popup-item ${type} ${status || ''} ${isNested ? 'nested' : ''} ${disabled ? 'si-item-disabled' : ''}`

  return (
    <div className={className} title={title} onClick={disabled ? undefined : onClick} style={style}>
      {type === 'back' && (
        <span className="si-settings-item-icon back">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </span>
      )}
      {icon && <span className="si-settings-item-icon">{icon}</span>}
      
      <span className="si-settings-item-label">{label}</span>

      {(type === 'link' || subLabel) && (
        <span className="si-settings-item-value">
          {subLabel}
          {type === 'link' && (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ marginLeft: '4px' }}>
              <path d="M9.29 15.88L13.17 12 9.29 8.12c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l4.59 4.59c.39.39.39 1.02 0 1.41L10.7 17.29c-.39.39-1.02.39-1.41 0-.38-.39-.38-1.03 0-1.41z" />
            </svg>
          )}
        </span>
      )}

      {type === 'toggle' && status !== undefined && (
        <div className="si-settings-item-value">
           <div className={`si-toggle-switch ${status}`} />
        </div>
      )}
    </div>
  )
}

interface SettingsPopupProps {
  isOpen: boolean
  onClose: () => void
  triggerRef?: RefObject<HTMLElement>
}

export function SettingsPopup({ isOpen, onClose, triggerRef }: SettingsPopupProps) {
  const config = useConfig()
  const { aiStatus, warning, isUploadActive, uploadFilename } = useSubtitleStore()
  const [view, setView] = useState<View>('main')
  const menuRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset view to main when opened
  useEffect(() => {
    if (isOpen) setView('main')
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (triggerRef?.current && triggerRef.current.contains(target)) {
        return
      }
      if (menuRef.current && !menuRef.current.contains(target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose, triggerRef])

  if (!isOpen) return null

  const getMasterStatus = (...children: boolean[]): 'enabled' | 'disabled' | 'indeterminate' => {
    if (children.every(c => c)) return 'enabled'
    if (children.every(c => !c)) return 'disabled'
    return 'indeterminate'
  }

  const getSummary = (status: 'enabled' | 'disabled' | 'indeterminate') => {
    if (status === 'enabled') return 'On'
    if (status === 'disabled') return 'Off'
    return 'Partial'
  }

  const handleToggleOriginalOverlay = async () => {
    const { isOriginalVisibleInOverlay } = await Config.get()
    await Config.update({ isOriginalVisibleInOverlay: !isOriginalVisibleInOverlay })
  }

  const handleToggleTranslationOverlay = async () => {
    const { isTranslationVisibleInOverlay } = await Config.get()
    await Config.update({ isTranslationVisibleInOverlay: !isTranslationVisibleInOverlay })
  }

  const handleToggleInsightsOverlay = async () => {
    const { isInsightsVisibleInOverlay } = await Config.get()
    await Config.update({ isInsightsVisibleInOverlay: !isInsightsVisibleInOverlay })
  }

  const handleTogglePauseOnHover = async () => {
    const { isPauseOnHoverEnabled } = await Config.get()
    await Config.update({ isPauseOnHoverEnabled: !isPauseOnHoverEnabled })
  }

  const handleToggleTranslationSidebar = async () => {
    const { isTranslationVisibleInSidebar } = await Config.get()
    await Config.update({ isTranslationVisibleInSidebar: !isTranslationVisibleInSidebar })
  }

  const handleToggleInsightsSidebar = async () => {
    const { isInsightsVisibleInSidebar } = await Config.get()
    await Config.update({ isInsightsVisibleInSidebar: !isInsightsVisibleInSidebar })
  }

  const handleToggleOverlayActive = async () => {
    const { isOverlayEnabled } = await Config.get()
    await Config.update({ isOverlayEnabled: !isOverlayEnabled })
  }

  const handleToggleSidebarActive = async () => {
    const { isSidebarEnabled } = await Config.get()
    await Config.update({ isSidebarEnabled: !isSidebarEnabled })
  }

  const handleOpenSettings = () => {
    chrome.runtime.sendMessage({ type: 'OPEN_OPTIONS_PAGE' })
    onClose()
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
    onClose()
  }

  const getStatusIcon = () => {
    if (warning) {
      return (
        <span className="si-status-icon warning" title={warning}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </span>
      )
    }
    if (aiStatus.status !== 'none') {
      return (
        <span className={`si-status-icon ai-${aiStatus.status}`} title={aiStatus.message || aiStatus.status}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.08-.34.12-.57.12s-.41-.04-.57-.12l-7.9-4.44A1.001 1.001 0 013 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.08.34-.12.57-.12s.41.04.57.12l7.9 4.44c.32.17.53.5.53.88v9zM12 4.15L6.04 7.5 12 10.85l5.96-3.35L12 4.15zM5 15.91l6 3.38v-6.71L5 9.21v6.7zm14 0v-6.7l-6 3.37v6.71l6-3.38z" />
          </svg>
        </span>
      )
    }
    return null
  }

  const getStatusText = () => {
    if (warning) return 'Warning'
    if (aiStatus.status === 'downloading') return 'Downloading Models'
    if (aiStatus.status === 'ready') return 'AI Ready'
    if (aiStatus.status === 'error') return 'AI Error'
    return 'Extension Active'
  }

  const overlayStatusSummary = getMasterStatus(
    config.isOriginalVisibleInOverlay,
    config.isTranslationVisibleInOverlay,
    config.isInsightsVisibleInOverlay
  )

  const sidebarStatusSummary = getMasterStatus(config.isTranslationVisibleInSidebar, config.isInsightsVisibleInSidebar)

  return (
    <div ref={menuRef} className="si-settings-popup" onClick={e => e.stopPropagation()}>
      <input type="file" accept=".srt" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />

      {view === 'main' && (
        <div className="si-settings-view main">
          {/* Status Section */}
          <div className="si-settings-popup-status">
            {getStatusIcon()}
            <span className="si-settings-popup-status-text">{getStatusText()}</span>
          </div>

          <div className="si-settings-popup-divider" />

          {/* Overlay Navigation */}
          <SettingsItem
            label="Overlay"
            subLabel={config.isOverlayEnabled ? getSummary(overlayStatusSummary) : 'Off'}
            type="link"
            onClick={() => setView('overlay')}
            icon={
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M19 4H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V6h14v14zM7 15h3v2H7v-2zm7 0h3v2h-3v-2zm-7-4h10v2H7v-2z" />
              </svg>
            }
          />

          {/* Sidebar Navigation */}
          <SettingsItem
            label="Sidebar"
            subLabel={config.isSidebarEnabled ? getSummary(sidebarStatusSummary) : 'Off'}
            type="link"
            onClick={() => setView('sidebar')}
            icon={
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
              </svg>
            }
          />

          <div className="si-settings-popup-divider" />

          {/* Upload Section */}
          <SettingsItem
            label="Upload Subtitles"
            subLabel={isUploadActive ? uploadFilename : undefined}
            onClick={handleUploadClick}
            type="link"
            icon={
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
              </svg>
            }
          />

          <div className="si-settings-popup-divider" />

          {/* Detailed Settings */}
          <SettingsItem
            label="Detailed Settings"
            title="Open full settings page"
            onClick={handleOpenSettings}
            type="link"
            icon={
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
              </svg>
            }
          />
        </div>
      )}

      {view === 'overlay' && (
        <div className="si-settings-view overlay">
          <SettingsItem label="Overlay" type="back" onClick={() => setView('main')} />
          <div className="si-settings-popup-divider" />
          <SettingsItem
            label="Show Overlay"
            status={config.isOverlayEnabled ? 'enabled' : 'disabled'}
            onClick={handleToggleOverlayActive}
          />
          <SettingsItem
            label="Show Original"
            disabled={!config.isOverlayEnabled}
            status={config.isOriginalVisibleInOverlay ? 'enabled' : 'disabled'}
            onClick={handleToggleOriginalOverlay}
          />
          <SettingsItem
            label="Show Translation"
            disabled={!config.isOverlayEnabled}
            status={config.isTranslationVisibleInOverlay ? 'enabled' : 'disabled'}
            onClick={handleToggleTranslationOverlay}
          />
          <SettingsItem
            label="Show Insights"
            disabled={!config.isOverlayEnabled}
            status={config.isInsightsVisibleInOverlay ? 'enabled' : 'disabled'}
            onClick={handleToggleInsightsOverlay}
          />
          <SettingsItem
            label="Pause on Hover"
            disabled={!config.isOverlayEnabled}
            status={config.isPauseOnHoverEnabled ? 'enabled' : 'disabled'}
            onClick={handleTogglePauseOnHover}
          />
        </div>
      )}

      {view === 'sidebar' && (
        <div className="si-settings-view sidebar">
          <SettingsItem label="Sidebar" type="back" onClick={() => setView('main')} />
          <div className="si-settings-popup-divider" />
          <SettingsItem
            label="Show Sidebar"
            status={config.isSidebarEnabled ? 'enabled' : 'disabled'}
            onClick={handleToggleSidebarActive}
          />
          <SettingsItem
            label="Show Translation"
            disabled={!config.isSidebarEnabled}
            status={config.isTranslationVisibleInSidebar ? 'enabled' : 'disabled'}
            onClick={handleToggleTranslationSidebar}
          />
          <SettingsItem
            label="Show Insights"
            disabled={!config.isSidebarEnabled}
            status={config.isInsightsVisibleInSidebar ? 'enabled' : 'disabled'}
            onClick={handleToggleInsightsSidebar}
          />
        </div>
      )}
    </div>
  )
}