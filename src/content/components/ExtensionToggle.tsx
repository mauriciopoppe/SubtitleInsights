import { useState, useRef } from 'preact/hooks'
import { useConfig } from '../hooks/useConfig'
import { SettingsPopup } from './SettingsPopup'
import { Platform } from '../types'

interface ExtensionToggleProps {
  platform?: Platform
}

export function ExtensionToggle({ platform = 'youtube' }: ExtensionToggleProps) {
  const { isEnabled, isLoading } = useConfig()
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = () => {
    setIsPopupOpen(!isPopupOpen)
  }

  const title = 'Subtitle Insights Settings'
  const ariaLabel = 'Open Subtitle Insights Settings'

  const icon = (
    <svg viewBox="0 -4 64 72" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect
        x="22"
        y="14"
        width="20"
        height="4"
        rx="2"
        stroke="currentColor"
      />
      <rect
        x="16"
        y="26"
        width="32"
        height="4"
        rx="2"
        stroke="currentColor"
      />
      <rect
        x="10"
        y="38"
        width="44"
        height="14"
        rx="4"
        stroke="currentColor"
      />
      <circle cx="48" cy="45" r="3" />
    </svg>
  )

  const className = [
    platform === 'youtube' ? 'ytp-button' : 'si-toggle-stremio',
    'si-toggle-btn',
    isPopupOpen ? 'active' : '',
    isEnabled ? 'si-icon-enabled' : 'si-icon-disabled'
  ].join(' ')

  const isYouTube = platform === 'youtube'

  return (
    <div
      className="si-toggle-container"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: isYouTube ? 'top' : 'middle',
        height: isYouTube ? '100%' : 'auto'
      }}
    >
      <button
        ref={buttonRef}
        className={className}
        aria-label={ariaLabel}
        aria-haspopup="true"
        aria-expanded={isPopupOpen ? 'true' : 'false'}
        title={title}
        onClick={handleClick}
        style={{
          display: isLoading ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          width: isYouTube ? '46px' : '36px',
          height: isYouTube ? '100%' : '36px',
          padding: 0
        }}
      >
        <div
          className="si-button-icon"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </div>
      </button>

      <SettingsPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        triggerRef={buttonRef}
        platform={platform}
      />
    </div>
  )
}
