import './styles.css'
import { store, SubtitleStore } from './store'
import { grammarExplainer } from './ai/explainer'
import { translationManager } from './ai/manager'

import { render } from 'preact'
import { App } from './components/App'

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

let lastVideoId: string | null = null

chrome.runtime.onMessage.addListener(message => {
  if (message.type === 'SI_SUBTITLES_CAPTURED') {
    const currentVideoId = new URLSearchParams(window.location.search).get('v')
    
    // Safety check: ensure the message is for the current video
    if (message.videoId && message.videoId !== currentVideoId) {
      console.log(`[SI] Ignoring subtitles for different video (got ${message.videoId}, expected ${currentVideoId})`)
      return
    }

    // Race condition fix: If subtitles arrive before 'yt-navigate-finish' or 'init' runs,
    // we must reset the store NOW to prepare for the new video.
    if (currentVideoId && currentVideoId !== lastVideoId) {
      console.log(`[SI] New video detected via subtitles message (${lastVideoId} -> ${currentVideoId}). Clearing store.`)
      store.clear()
      grammarExplainer.resetSession()
      lastVideoId = currentVideoId
    }

    console.log('[SI] Accepted message to process from background:', message)
    if (message.language) {
      store.setSourceLanguage(message.language)
    }
    const segments = SubtitleStore.parseYouTubeJSON(message.payload)

    // Reset AI managers because content has changed
    // Note: We might have just reset them above, but doing it here ensures
    // consistency if this message arrives for the *same* video (e.g. language toggle).
    translationManager.reset()
    if (currentVideoId === lastVideoId) { 
        // Only reset session if we didn't just do it above (to avoid double reset log noise/overhead)
        // actually grammarExplainer.resetSession() is cheap, but let's be clean.
        // Wait, if it's the SAME video, we *might* want to keep the session? 
        // No, new subtitles = new content context.
        grammarExplainer.resetSession()
    }

    store.replaceSegments(segments)
  }
})

let isInitializing = false

const cleanup = () => {
  const appRoot = document.getElementById('si-root')
  if (appRoot) {
    render(null, appRoot) // Unmount Preact tree
    appRoot.remove()
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
  const existingRoot = document.getElementById('si-root')
  if (existingRoot && existingRoot.isConnected) {
    console.log('[SI] UI exists and is valid. Skipping re-init.')
    isInitializing = false
    return
  }

  console.log('[SI] Initializing extension for watch page...')
  
  // Run cleanup to ensure a clean state
  cleanup()

  console.log('[SI] Waiting for video player...')
  const player = await waitForElement('#movie_player')
  const video = (await waitForElement('video')) as HTMLVideoElement
  const secondaryInner = await waitForElement('#secondary-inner')
  console.log('[SI] Video player, element and secondary column found.')

  // Injection: Right Controls Toggle
  const rightControls = await waitForElement('.ytp-right-controls')
  const subtitlesBtn = document.querySelector('.ytp-subtitles-button')
  
  const toggleContainer = document.createElement('div')
  toggleContainer.id = 'si-toggle-root'
  toggleContainer.style.display = 'contents'

  if (subtitlesBtn && subtitlesBtn.parentNode) {
    subtitlesBtn.parentNode.insertBefore(toggleContainer, subtitlesBtn)
  } else {
    rightControls.prepend(toggleContainer)
  }

  const sidebarContainer = document.createElement('div')
  sidebarContainer.id = 'si-sidebar-root'
  sidebarContainer.style.marginBottom = '12px'
  secondaryInner.prepend(sidebarContainer)

  const overlayContainer = document.createElement('div')
  overlayContainer.id = 'si-overlay-root'
  player.appendChild(overlayContainer)

  // Create Root for App
  const appRoot = document.createElement('div')
  appRoot.id = 'si-root'
  appRoot.style.display = 'none'
  document.body.appendChild(appRoot)

  // Render App with Portals
  render(
    <App
      player={player}
      video={video}
      secondaryInner={secondaryInner}
      sidebarContainer={sidebarContainer}
      overlayContainer={overlayContainer}
      toggleContainer={toggleContainer}
    />,
    appRoot
  )

  console.log('[SI] App injected.')

  // AI Translation & Grammar Setup
  translationManager.initializeAIServices()

  isInitializing = false
}

const run = () => {
  if (window.location.pathname === '/watch' || window.location.pathname.startsWith('/watch')) {
    init()
  }
}

window.addEventListener('yt-navigate-finish', run)
run()
