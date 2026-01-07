import { useEffect, useRef, useState, useLayoutEffect } from 'preact/hooks'
import { useConfig } from '../hooks/useConfig'
import { Config } from '../config'
import { useSubtitleStore } from '../hooks/useSubtitleStore'
import { store } from '../store'
import { ComponentChildren, RefObject } from 'preact'
import { createPortal } from 'preact/compat'
import { Platform } from '../types'

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
  showArrow?: boolean
  iconSpace?: boolean
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
  disabled,
  showArrow = true,
  iconSpace = false
}: SettingsItemProps) {
  const className = `si-settings-popup-item ${type} ${status || ''} ${isNested ? 'nested' : ''} ${disabled ? 'si-item-disabled' : ''}`

  return (
    <div className={className} title={title} onClick={disabled ? undefined : onClick} style={style}>
      {type === 'back' ? (
        <span className="si-settings-item-icon back">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </span>
      ) : (
        (icon || iconSpace) && <span className="si-settings-item-icon">{icon}</span>
      )}
      
      <span className="si-settings-item-label">{label}</span>

      {(type === 'link' || subLabel) && (
        <span className="si-settings-item-value">
          {subLabel}
          {type === 'link' && showArrow && (
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
  platform?: Platform
}

export function SettingsPopup({ isOpen, onClose, triggerRef, platform = 'youtube' }: SettingsPopupProps) {
  const config = useConfig()
  const { aiStatus, warning, isUploadActive, uploadFilename } = useSubtitleStore()
  const [view, setView] = useState<View>('main')
  const menuRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [position, setPosition] = useState({ bottom: 0, right: 0 })

  const isStremio = platform === 'stremio'
  const isYouTube = platform === 'youtube'

  // Reset view to main when opened
  useEffect(() => {
    if (isOpen) setView('main')
  }, [isOpen])

  // Dynamic positioning logic
  useLayoutEffect(() => {
    if (!isOpen || !triggerRef?.current) return

    const updatePosition = () => {
      const rect = triggerRef.current!.getBoundingClientRect()
      
      if (isStremio) {
        // Stremio: Fixed position relative to viewport
        setPosition({
          bottom: window.innerHeight - rect.top + 12, // 12px gap
          right: window.innerWidth - rect.right
        })
      } else if (isYouTube) {
        // YouTube: Absolute position relative to toggle button
        const player = document.querySelector('#movie_player')
        if (player) {
          const playerRect = player.getBoundingClientRect()
          // Shift popup right to align with player edge minus 12px padding
          const offset = playerRect.right - rect.right - 12
          setPosition(prev => ({ ...prev, right: -offset }))
        } else {
          setPosition(prev => ({ ...prev, right: 0 }))
        }
      }
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [isOpen, triggerRef, isStremio, isYouTube])

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

  const handleToggleMaster = async () => {
    const { isEnabled } = await Config.get()
    await Config.update({ isEnabled: !isEnabled })
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

  const style: any = isStremio ? {
    position: 'fixed',
    bottom: `${position.bottom}px`,
    right: `${position.right}px`
  } : {
    right: `${position.right}px`
  }

  const popupContent = (
    <div 
      ref={menuRef} 
      className="si-settings-popup" 
      onClick={e => e.stopPropagation()}
      style={style}
    >
      <input type="file" accept=".srt" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />

      {view === 'main' && (
        <div className="si-settings-view main">
          {/* Status Section */}
          <div className="si-settings-popup-status">
            {getStatusIcon()}
            <span className="si-settings-popup-status-text">{getStatusText()}</span>
          </div>

          <div className="si-settings-popup-divider" />

          {/* General Controls */}
          <SettingsItem
            label="Extension Enabled"
            type="toggle"
            status={config.isEnabled ? 'enabled' : 'disabled'}
            onClick={handleToggleMaster}
            icon={
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" />
              </svg>
            }
          />

          <SettingsItem
            label="Upload Subtitles"
            subLabel={isUploadActive ? uploadFilename : undefined}
            disabled={!config.isEnabled}
            onClick={handleUploadClick}
            type="link"
            showArrow={false}
            icon={
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
              </svg>
            }
          />

          <SettingsItem
            label="Detailed Settings"
            title="Open full settings page"
            disabled={!config.isEnabled}
            onClick={handleOpenSettings}
            type="link"
            showArrow={false}
            icon={
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49.84c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 13.95 2h-4c-.3 0-.51.18-.54.45l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-.84c-.22-.08-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-.84c.52.4 1.08.73 1.69.98l.38 2.65c.03.27.24.45.54.45h4c.3 0 .51-.18.54-.45l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49.84c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
              </svg>
            }
          />

          <div className="si-settings-popup-divider" />

          {/* Feature Navigation */}
          <SettingsItem
            label="Overlay"
            subLabel={config.isOverlayEnabled ? getSummary(overlayStatusSummary) : 'Off'}
            type="link"
            disabled={!config.isEnabled}
            onClick={() => setView('overlay')}
            icon={
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M19 4H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V6h14v14zM7 15h3v2H7v-2zm7 0h3v2h-3v-2zm-7-4h10v2H7v-2z" />
              </svg>
            }
          />

          <SettingsItem
            label="Sidebar"
            subLabel={config.isSidebarEnabled ? getSummary(sidebarStatusSummary) : 'Off'}
            type="link"
            disabled={!config.isEnabled}
            onClick={() => setView('sidebar')}
            icon={
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-2 14h-4V6h4v12z" />
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
            disabled={!config.isEnabled}
            status={config.isOverlayEnabled ? 'enabled' : 'disabled'}
            onClick={handleToggleOverlayActive}
          />
          <SettingsItem
            label="Show Original"
            disabled={!config.isEnabled || !config.isOverlayEnabled}
            status={config.isOriginalVisibleInOverlay ? 'enabled' : 'disabled'}
            onClick={handleToggleOriginalOverlay}
          />
          <SettingsItem
            label="Show Translation"
            disabled={!config.isEnabled || !config.isOverlayEnabled}
            status={config.isTranslationVisibleInOverlay ? 'enabled' : 'disabled'}
            onClick={handleToggleTranslationOverlay}
          />
          <SettingsItem
            label="Show Insights"
            disabled={!config.isEnabled || !config.isOverlayEnabled}
            status={config.isInsightsVisibleInOverlay ? 'enabled' : 'disabled'}
            onClick={handleToggleInsightsOverlay}
          />
          <SettingsItem
            label="Pause on Hover"
            disabled={!config.isEnabled || !config.isOverlayEnabled}
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
            disabled={!config.isEnabled}
            status={config.isSidebarEnabled ? 'enabled' : 'disabled'}
            onClick={handleToggleSidebarActive}
          />
          <SettingsItem
            label="Show Translation"
            disabled={!config.isEnabled || !config.isSidebarEnabled}
            status={config.isTranslationVisibleInSidebar ? 'enabled' : 'disabled'}
            onClick={handleToggleTranslationSidebar}
          />
          <SettingsItem
            label="Show Insights"
            disabled={!config.isEnabled || !config.isSidebarEnabled}
            status={config.isInsightsVisibleInSidebar ? 'enabled' : 'disabled'}
            onClick={handleToggleInsightsSidebar}
          />
        </div>
      )}
    </div>
  )

  return isStremio ? createPortal(popupContent, document.body) : popupContent
}