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
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="22" y="14" width="20" height="4" rx="2" fill="#3EA6FF" fill-opacity="0.6" />
      <rect x="16" y="26" width="32" height="4" rx="2" fill="#3EA6FF" />
      <rect x="10" y="38" width="44" height="14" rx="4" fill="#FFD600" />
      <circle cx="48" cy="45" r="3" fill="#0F0F0F" fill-opacity="0.3" />
    </svg>
  )

  const className = [
    platform === 'youtube' ? 'ytp-button' : 'si-toggle-stremio',
    'si-toggle-btn',
    isPopupOpen ? 'active' : ''
  ].join(' ')

  const isYouTube = platform === 'youtube'

  return (
    <div
      className="si-toggle-container"
      style={{
        position: 'relative',
        display: 'inline-block',
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
          opacity: isEnabled ? 1 : 0.5,
          filter: 'grayscale(1)',
          color: isEnabled ? '#fff' : '#aaa',
          display: isLoading ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          width: isYouTube ? '46px' : 'auto',
          height: '100%',
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
