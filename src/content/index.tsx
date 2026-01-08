import { render } from 'preact'
import { App } from './components/App'
import { grammarExplainer } from './ai/explainer'
import { translationManager } from './ai/manager'
import { store, SubtitleStore } from './store'
import { Config } from './config'
import { videoController } from './VideoController'
import './styles.css'
import { Platform } from './types'

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

const detectPlatform = (): Platform => {
  const host = window.location.hostname
  if (host.includes('youtube.com')) return 'youtube'
  if (host.includes('stremio.com')) return 'stremio'
  return 'unknown'
}

let lastVideoId: string | null = null

chrome.runtime.onMessage.addListener(message => {
  if (message.type === 'SI_COMMAND') {
    Config.get().then(config => {
      if (!config.isEnabled) return

      switch (message.command) {
        case 'next_segment':
          videoController.seekToNext()
          break
        case 'previous_segment':
          videoController.seekToPrev()
          break
        case 'replay_segment':
          videoController.replayCurrent()
          break
      }
    })
  }

  if (message.type === 'SI_SUBTITLES_CAPTURED') {
    const platform = detectPlatform()
    if (platform !== 'youtube') return

    const currentVideoId = new URLSearchParams(window.location.search).get('v')

    // Safety check: ensure the message is for the current video
    if (message.videoId && message.videoId !== currentVideoId) {
      console.log(`[SI] Ignoring subtitles for different video (got ${message.videoId}, expected ${currentVideoId})`)
      return
    }

    // Race condition fix: If subtitles arrive before 'yt-navigate-finish' or 'init' runs,
    // we must reset the store NOW to prepare for the new video.
    if (currentVideoId && currentVideoId !== lastVideoId) {
      console.log(
        `[SI] New video detected via subtitles message (${lastVideoId} -> ${currentVideoId}). Clearing store.`
      )
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
    translationManager.reset()
    if (currentVideoId === lastVideoId) {
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

const initYouTube = async () => {
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
    return
  }

  console.log('[SI] Initializing extension for YouTube watch page...')

  cleanup()

  console.log('[SI] Waiting for YouTube elements...')
  const player = await waitForElement('#movie_player')
  const video = (await waitForElement('video')) as HTMLVideoElement
  const secondaryInner = await waitForElement('#secondary-inner')

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
      platform="youtube"
    />,
    appRoot
  )

  console.log('[SI] App injected for YouTube.')
  translationManager.initializeAIServices()
}

const initStremio = async () => {
  // Check if UI already exists and is connected
  const existingRoot = document.getElementById('si-root')
  if (existingRoot && existingRoot.isConnected) {
    console.log('[SI] UI exists and is valid. Skipping re-init.')
    return
  }

  console.log('[SI] Initializing extension for Stremio...')

  cleanup()

  console.log('[SI] Waiting for Stremio video element...')
  const video = (await waitForElement('video')) as HTMLVideoElement

  // Stremio's DOM is dynamic. We look for a container that holds the video and likely the controls.
  // We'll target .route-content as it seems stable and wraps the player.
  let player = video.parentElement as HTMLElement
  const routeContent = video.closest('.route-content') as HTMLElement
  if (routeContent) {
    player = routeContent
  } else {
    // Fallback to player-container if route-content not found
    const playerContainer = video.closest('[class*="player-container"]') as HTMLElement
    if (playerContainer) {
      player = playerContainer
    } else {
      const layer = video.closest('.layer') as HTMLElement
      if (layer) player = layer
    }
  }

  // Look for control bar to inject toggle
  let toggleContainer: HTMLElement | null = null
  const controls = document.querySelector('[class*="control-bar-buttons-menu-container"]') as HTMLElement

  if (controls) {
    toggleContainer = document.createElement('div')
    toggleContainer.id = 'si-toggle-root'
    toggleContainer.style.display = 'flex'
    toggleContainer.style.verticalAlign = 'middle'
    controls.prepend(toggleContainer)
  }

  const sidebarContainer = document.createElement('div')
  sidebarContainer.id = 'si-sidebar-root'
  document.body.appendChild(sidebarContainer)

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
      secondaryInner={document.body} // Stremio doesn't have secondaryInner, we use body as anchor
      sidebarContainer={sidebarContainer}
      overlayContainer={overlayContainer}
      toggleContainer={toggleContainer || undefined}
      platform="stremio"
    />,
    appRoot
  )

  console.log('[SI] App injected for Stremio.')
  translationManager.initializeAIServices()
}

const init = async () => {
  if (isInitializing) return
  isInitializing = true

  const platform = detectPlatform()
  if (platform === 'youtube') {
    if (window.location.pathname.startsWith('/watch')) {
      await initYouTube()
    }
  } else if (platform === 'stremio') {
    document.body.classList.add('si-platform-stremio')
    await initStremio()
  }

  isInitializing = false
}

const run = () => {
  const platform = detectPlatform()
  if (platform === 'youtube') {
    if (window.location.pathname.startsWith('/watch')) {
      init()
    }
  } else if (platform === 'stremio') {
    init()
  }
}

window.addEventListener('yt-navigate-finish', run)
// For Stremio or other SPAs that don't use yt-navigate-finish
if (detectPlatform() === 'stremio') {
  // Stremio might need a different trigger or just run once and handle internal navigation
  // For now, let's just call run()
}
run()
