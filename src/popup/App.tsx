import { h } from 'preact'

export function App() {
  const openOptionsPage = () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage()
    } else {
      window.open(chrome.runtime.getURL('src/settings/index.html'))
    }
  }

  return (
    <div className="popup-container">
      <img src="/public/logo.svg" alt="Subtitle Insights Logo" className="logo" />
      <h1>Subtitle Insights</h1>
      <p>Smart AI insights for subtitles</p>
      <button className="settings-btn" onClick={openOptionsPage}>
        Open Settings
      </button>
    </div>
  )
}
