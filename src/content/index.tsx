import './styles.css'
import { store, SubtitleStore } from './store'
import { Config } from './config'
import { grammarExplainer } from './ai/explainer'
import { translationManager } from './ai/manager'

import { render } from 'preact'
import { SidebarApp } from './components/SidebarApp'
import { OverlayApp } from './components/OverlayApp'
import { ExtensionToggle } from './components/ExtensionToggle'

console.log('[SI] Content script injected.')

const waitForElement = (selector: string): Promise<HTMLElement> => {
  return new Promise(resolve => {
    const element = document.querySelector(selector)
    if (element) {
      resolve(element as HTMLElement)
      return
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector)
      if (element) {
        resolve(element as HTMLElement)
        observer.disconnect()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  })
}

chrome.runtime.onMessage.addListener(message => {
  if (message.type === 'SI_SUBTITLES_CAPTURED') {
    const currentVideoId = new URLSearchParams(window.location.search).get('v')
    if (message.videoId && message.videoId !== currentVideoId) {
      console.log(`[SI] Ignoring subtitles for different video (got ${message.videoId}, expected ${currentVideoId})`)
      return
    }

    console.log('[SI] Accepted message to process from background:', message)
    if (message.language) {
      store.setSourceLanguage(message.language)
    }
    const segments = SubtitleStore.parseYouTubeJSON(message.payload)

    // Reset AI managers because content has changed
    translationManager.reset()
    grammarExplainer.resetSession()

    store.replaceSegments(segments)
  }
})

let resizeObserver: ResizeObserver | null = null
let mutationObserver: MutationObserver | null = null
let heightUpdateListener: (() => void) | null = null
let isInitializing = false
let lastVideoId: string | null = null

const cleanup = () => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (mutationObserver) {
    mutationObserver.disconnect()
    mutationObserver = null
  }
  if (heightUpdateListener) {
    store.removeChangeListener(heightUpdateListener)
    heightUpdateListener = null
  }

  document.getElementById('si-sidebar-root')?.remove()
  document.getElementById('si-overlay-root')?.remove()
  document.getElementById('si-toggle-root')?.remove()
}

const init = async () => {
  if (isInitializing) return
  isInitializing = true

  const currentVideoId = new URLSearchParams(window.location.search).get('v')
  
  // Clear store if video changed
  if (currentVideoId && currentVideoId !== lastVideoId) {
    console.log(`[SI] Video ID changed (${lastVideoId} -> ${currentVideoId}). Clearing store.`)
    store.clear()
    grammarExplainer.resetSession()
    lastVideoId = currentVideoId
  }

  // Check if UI already exists and is connected
  const existingSidebar = document.getElementById('si-sidebar-root')
  if (existingSidebar && existingSidebar.isConnected) {
    console.log('[SI] UI exists and is valid. Skipping re-init.')
    isInitializing = false
    return
  }

  console.log('[SI] Initializing extension for watch page...')
  
  // If we are here, either it's the first run or the UI was removed (SPA nav).
  // Run cleanup to ensure a clean state (e.g. remove detached roots if any).
  cleanup()

  console.log('[SI] Waiting for video player...')
  const player = await waitForElement('#movie_player')
  const video = (await waitForElement('video')) as HTMLVideoElement
  // secondary-inner might take longer or depend on layout (theater mode etc)
  const secondaryInner = await waitForElement('#secondary-inner')
  console.log('[SI] Video player, element and secondary column found.')

  // Injection: Right Controls Toggle
  // We re-query these because they might have been replaced
  const rightControls = await waitForElement('.ytp-right-controls')
  const subtitlesBtn = document.querySelector('.ytp-subtitles-button') // Don't await, optional position
  
  const toggleContainer = document.createElement('div')
  toggleContainer.id = 'si-toggle-root'
  toggleContainer.style.display = 'contents' // No layout impact

  if (subtitlesBtn && subtitlesBtn.parentNode) {
    subtitlesBtn.parentNode.insertBefore(toggleContainer, subtitlesBtn)
  } else {
    rightControls.prepend(toggleContainer)
  }
  render(<ExtensionToggle />, toggleContainer)

  const sidebarContainer = document.createElement('div')
  sidebarContainer.id = 'si-sidebar-root'
  sidebarContainer.style.marginBottom = '12px'
  secondaryInner.prepend(sidebarContainer)
  render(<SidebarApp />, sidebarContainer)

  const updateSidebarHeight = () => {
    // Only enforce height if there are segments (content mode).
    // Otherwise let it autosize (e.g. for upload UI).
    const hasSegments = store.getAllSegments().length > 0
    if (hasSegments) {
      const rect = player.getBoundingClientRect()
      // Subtract margin if needed, but usually exact match is okay if container handles overflow
      sidebarContainer.style.setProperty('--si-sidebar-height', `${rect.height}px`)
    } else {
      sidebarContainer.style.removeProperty('--si-sidebar-height')
    }
  }

  // Save reference for cleanup
  heightUpdateListener = updateSidebarHeight

  // Sync Sidebar Height with Video Player
  resizeObserver = new ResizeObserver(() => {
    updateSidebarHeight()
  })
  resizeObserver.observe(player)

  // Update height when segments change (e.g. loaded)
  store.addChangeListener(updateSidebarHeight)

  // Ensure Sidebar stays at the top (above playlist)
  mutationObserver = new MutationObserver(() => {
    if (secondaryInner.firstChild !== sidebarContainer) {
      // Check if sidebarContainer is still in DOM (it might have been removed by YouTube)
      // If it's removed, we actually need to re-run init/cleanup, but for now just try to move it back
      // if it's still technically the same 'secondaryInner' we observed.
      if (sidebarContainer.isConnected) {
        secondaryInner.prepend(sidebarContainer)
      } else {
        // If our sidebar was removed, we might need to rely on the next 'yt-navigate-finish' or loop.
        // But usually 'yt-navigate-finish' handles the major DOM resets.
      }
    }
  })
  mutationObserver.observe(secondaryInner, { childList: true })

  const overlayContainer = document.createElement('div')
  overlayContainer.id = 'si-overlay-root'
  player.appendChild(overlayContainer)
  render(<OverlayApp />, overlayContainer)

  console.log('[SI] Overlay and Preact Sidebar injected.')

  // AI Translation & Grammar Setup
  translationManager.initializeAIServices()

  // We don't need to unsubscribe this one on cleanup as Config is global singleton, 
  // but we should ensure we don't leak listeners if we implemented unsubscribe in Config.
  // For now, it's fine.
  Config.subscribe(config => {
    if (!config.isEnabled || !config.isOverlayEnabled) {
      overlayContainer.style.display = 'none'
    } else {
      overlayContainer.style.display = 'block'
    }
  })

  // Sync Engine
  // We need to be careful not to add duplicate listeners to 'video' if we re-init.
  // But 'video' element might be new if page refreshed. 
  // Ideally we should track these listeners too.
  // For MVP, we'll assume video element replacement clears listeners.
  video.addEventListener('timeupdate', () => {
    const currentTimeMs = video.currentTime * 1000
    translationManager.onTimeUpdate(currentTimeMs)
  })

  isInitializing = false
}

// Global navigation listeners
// These persist across the lifetime of the content script
window.addEventListener('yt-navigate-finish', () => {
    // Only run if on watch page
    if (window.location.pathname === '/watch' || window.location.pathname.startsWith('/watch')) {
        init()
    }
})
window.addEventListener('popstate', () => {
    // Basic check for popstate (back/forward)
    if (window.location.pathname === '/watch' || window.location.pathname.startsWith('/watch')) {
        setTimeout(init, 500) // Delay to let DOM settle
    }
})

// Initial run
if (window.location.pathname === '/watch' || window.location.pathname.startsWith('/watch')) {
    init()
}
