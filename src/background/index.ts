import { Config } from '../content/config'
import { enableDebug, disableDebug, bgLogger } from '../content/logger'

bgLogger('Background script loading...', new Date().toISOString())

// Initialize logging
Config.get().then(config => {
  if (config.isDebugMode) {
    enableDebug()
  } else {
    disableDebug()
  }
})

// Subscribe to logging changes
Config.subscribe(config => {
  if (config.isDebugMode) {
    enableDebug()
  } else {
    disableDebug()
  }
})

if (typeof chrome !== 'undefined' && chrome.webRequest) {
  chrome.webRequest.onCompleted.addListener(
    async details => {
      const { url, tabId } = details

      if (url.includes('/api/timedtext') && !url.includes('si_ignore=true')) {
        bgLogger('Detected subtitle URL:', url)

        const urlObj = new URL(url)
        const lang = urlObj.searchParams.get('lang')
        const videoId = urlObj.searchParams.get('v')

        try {
          // We add a param to avoid intercepting our own fetch
          const fetchUrl = url + (url.includes('?') ? '&' : '?') + 'si_ignore=true'
          const response = await fetch(fetchUrl)
          const data = await response.json()

          if (tabId !== -1) {
            chrome.tabs.sendMessage(
              tabId,
              {
                type: 'SI_SUBTITLES_CAPTURED',
                payload: data,
                language: lang,
                videoId
              },
              () => {
                if (chrome.runtime.lastError) {
                  bgLogger(
                    'WARN: Could not send subtitles to tab. Content script might not be ready yet.',
                    chrome.runtime.lastError.message
                  )
                }
              }
            )
          }
        } catch (e) {
          bgLogger('ERROR: Background fetch failed', e)
        }
      }
    },
    { urls: ['*://*.youtube.com/api/timedtext*'] }
  )
  bgLogger('webRequest listener registered.')
} else {
  bgLogger('ERROR: chrome.webRequest is not available. Check permissions in manifest.json.')
}

chrome.runtime.onMessage.addListener(message => {
  if (message.type === 'OPEN_OPTIONS_PAGE') {
    chrome.runtime.openOptionsPage()
  }
})

chrome.commands.onCommand.addListener(async command => {
  bgLogger('Received command:', command)
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, {
      type: 'SI_COMMAND',
      command
    })
  }
})
