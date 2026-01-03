import { useEffect } from 'preact/hooks'
import { createPortal } from 'preact/compat'
import { SidebarApp } from './SidebarApp'
import { OverlayApp } from './OverlayApp'
import { ExtensionToggle } from './ExtensionToggle'
import { store } from '../store'
import { translationManager } from '../ai/manager'
import { Config } from '../config'

interface AppProps {
  player: HTMLElement
  video: HTMLVideoElement
  secondaryInner: HTMLElement
  sidebarContainer?: HTMLElement
  overlayContainer: HTMLElement
  toggleContainer?: HTMLElement
}

export function App({
  player,
  video,
  secondaryInner,
  sidebarContainer,
  overlayContainer,
  toggleContainer
}: AppProps) {

  // Layout Logic: Sidebar Height Sync
  useEffect(() => {
    if (!sidebarContainer) return

    const updateSidebarHeight = () => {
        const hasSegments = store.getAllSegments().length > 0
        if (hasSegments) {
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
  }, [player, sidebarContainer])

  // Layout Logic: Sidebar Position (MutationObserver)
  useEffect(() => {
    if (!sidebarContainer) return

    const observer = new MutationObserver(() => {
        if (secondaryInner.firstChild !== sidebarContainer) {
            if (sidebarContainer.isConnected) {
                secondaryInner.prepend(sidebarContainer)
            }
        }
    })
    observer.observe(secondaryInner, { childList: true })
    return () => observer.disconnect()
  }, [secondaryInner, sidebarContainer])

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
    const handleTimeUpdate = () => {
        const currentTimeMs = video.currentTime * 1000
        translationManager.onTimeUpdate(currentTimeMs)
    }
    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [video])

  return (
    <>
      {toggleContainer && createPortal(<ExtensionToggle />, toggleContainer)}
      {sidebarContainer && createPortal(<SidebarApp />, sidebarContainer)}
      {createPortal(<OverlayApp />, overlayContainer)}
    </>
  )
}
