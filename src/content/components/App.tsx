import { useEffect } from 'preact/hooks'
import { createPortal } from 'preact/compat'
import { SidebarApp } from './SidebarApp'
import { OverlayApp } from './OverlayApp'
import { ExtensionToggle } from './ExtensionToggle'
import { store } from '../store'
import { translationManager } from '../ai/manager'
import { Config } from '../config'
import { Platform } from '../types'
import { useConfig } from '../hooks/useConfig'

interface AppProps {
  player: HTMLElement
  video: HTMLVideoElement
  secondaryInner: HTMLElement
  sidebarContainer?: HTMLElement
  overlayContainer: HTMLElement
  toggleContainer?: HTMLElement
  platform: Platform
}

export function App({
  player,
  video,
  secondaryInner,
  sidebarContainer,
  overlayContainer,
  toggleContainer,
  platform
}: AppProps) {
  const config = useConfig()

  // Layout Logic: Sidebar Height Sync
  useEffect(() => {
    if (!sidebarContainer) return

    const updateSidebarHeight = () => {
        const hasSegments = store.getAllSegments().length > 0
        // On YouTube we only show if segments. On Stremio we might want it always if enabled.
        if (hasSegments || platform === 'stremio') {
            const rect = player.getBoundingClientRect()
            sidebarContainer.style.setProperty('--si-sidebar-height', `${rect.height}px`)
        } else {
            sidebarContainer.style.removeProperty('--si-sidebar-height')
        }
    }

    const resizeObserver = new ResizeObserver(updateSidebarHeight)
    resizeObserver.observe(player)
    
    // Store listener
    const unsubscribe = store.subscribe(updateSidebarHeight)
    
    // Initial call
    updateSidebarHeight()

    return () => {
        resizeObserver.disconnect()
        unsubscribe()
    }
  }, [player, sidebarContainer, platform])

  // Layout Logic: Sidebar Position (MutationObserver - YouTube)
  useEffect(() => {
    if (platform !== 'youtube' || !sidebarContainer) return

    const observer = new MutationObserver(() => {
        if (secondaryInner.firstChild !== sidebarContainer) {
            secondaryInner.prepend(sidebarContainer)
        }
    })
    observer.observe(secondaryInner, { childList: true })
    return () => observer.disconnect()
  }, [secondaryInner, sidebarContainer, platform])

  // Layout Logic: Stremio Resizing
  useEffect(() => {
    if (platform !== 'stremio') return

    let observer: MutationObserver | null = null
    let isSidebarActive = false

    const applyClass = () => {
        if (isSidebarActive && !player.classList.contains('si-player-container-resized')) {
            player.classList.add('si-player-container-resized')
        }
    }

    observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                applyClass()
            }
        }
    })
    
    observer.observe(player, { attributes: true, attributeFilter: ['class'] })

    const unsubscribe = Config.subscribe(config => {
      isSidebarActive = config.isEnabled && config.isSidebarEnabled
      if (isSidebarActive) {
        document.body.classList.add('si-sidebar-active')
        applyClass()
      } else {
        document.body.classList.remove('si-sidebar-active')
        player.classList.remove('si-player-container-resized')
      }
    })

    return () => {
        unsubscribe()
        observer?.disconnect()
    }
  }, [platform, player])

  // Config Logic: Sidebar Visibility
  useEffect(() => {
    if (!sidebarContainer) return
    return Config.subscribe(config => {
        if (!config.isEnabled || !config.isSidebarEnabled) {
            sidebarContainer.style.display = 'none'
        } else {
            sidebarContainer.style.display = 'flex'
        }
    })
  }, [sidebarContainer])

  // Config Logic: Overlay Visibility
  useEffect(() => {
    return Config.subscribe(config => {
        if (!config.isEnabled || !config.isOverlayEnabled) {
            overlayContainer.style.display = 'none'
        } else {
            overlayContainer.style.display = 'block'
        }
    })
  }, [overlayContainer])

  // Sync Logic: Time Update
  useEffect(() => {
    if (!config.isEnabled) return

    const handleTimeUpdate = () => {
        const currentTimeMs = video.currentTime * 1000
        translationManager.onTimeUpdate(currentTimeMs)
    }
    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [video, config.isEnabled])

  return (
    <>
      {toggleContainer && createPortal(<ExtensionToggle platform={platform} />, toggleContainer)}
      {sidebarContainer && createPortal(<SidebarApp />, sidebarContainer)}
      {createPortal(<OverlayApp />, overlayContainer)}
    </>
  )
}