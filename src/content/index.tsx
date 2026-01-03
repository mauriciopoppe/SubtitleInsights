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

let isInitialized = false
let isInitializing = false

const init = async () => {
  if (isInitialized || isInitializing) return
  isInitializing = true

  console.log('[SI] Initializing extension for watch page...')

  console.log('[SI] Waiting for video player...')
  const player = await waitForElement('#movie_player')
  const video = (await waitForElement('video')) as HTMLVideoElement
  // secondary-inner might take longer or depend on layout (theater mode etc)
  const secondaryInner = await waitForElement('#secondary-inner')
  console.log('[SI] Video player, element and secondary column found.')

  // Injection: Right Controls Toggle
  const rightControls = await waitForElement('.ytp-right-controls')
  const subtitlesBtn = await waitForElement('.ytp-subtitles-button')
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
    const hasSegments = store.getAllSegments().length > 0
    if (hasSegments) {
      const rect = player.getBoundingClientRect()
      sidebarContainer.style.setProperty('--si-sidebar-height', `${rect.height}px`)
    } else {
      sidebarContainer.style.removeProperty('--si-sidebar-height')
    }
  }

  // Sync Sidebar Height with Video Player
  const resizeObserver = new ResizeObserver(() => {
    updateSidebarHeight()
  })
  resizeObserver.observe(player)

  // Update height when segments change (e.g. loaded)
  store.addChangeListener(updateSidebarHeight)

  // Ensure Sidebar stays at the top (above playlist)
  const mutationObserver = new MutationObserver(() => {
    if (secondaryInner.firstChild !== sidebarContainer) {
      // console.log('[SI] Re-asserting sidebar position at top.')
      secondaryInner.prepend(sidebarContainer)
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

  Config.subscribe(config => {
    if (!config.isEnabled || !config.isOverlayEnabled) {
      overlayContainer.style.display = 'none'
    } else {
      overlayContainer.style.display = 'block'
    }
  })

  let currentVideoId = new URLSearchParams(window.location.search).get('v')

  const checkVideoChange = () => {
    const newVideoId = new URLSearchParams(window.location.search).get('v')
    if (newVideoId !== currentVideoId) {
      console.log(`[SI] Video ID changed (${currentVideoId} -> ${newVideoId}). Clearing store.`)
      currentVideoId = newVideoId
      store.clear()
      grammarExplainer.resetSession()
    }
  }

  // Sync Engine
  video.addEventListener('timeupdate', () => {
    checkVideoChange()
    const currentTimeMs = video.currentTime * 1000
    translationManager.onTimeUpdate(currentTimeMs)
  })

  // Listen for YouTube navigation events to clear the store
  window.addEventListener('yt-navigate-finish', checkVideoChange)
  window.addEventListener('popstate', checkVideoChange)

  isInitialized = true
  isInitializing = false
}

const run = () => {
  if (window.location.pathname === '/watch' || window.location.pathname.startsWith('/watch')) {
    init()
  }
}

window.addEventListener('yt-navigate-finish', run)
run()
