import { useConfig } from '../hooks/useConfig'
import { Config } from '../config'

export function ExtensionToggle() {
  const { isEnabled, isLoading } = useConfig()

  const handleClick = async () => {
    await Config.update({ isEnabled: !isEnabled })
  }

  const title = 'SubLayer: AI Subtitles & Insights'
  const ariaLabel = 'Toggle SubLayer Extension'

  // Use the same SVG from index.tsx
  const icon = (
    <svg height="24" viewBox="0 0 24 24" width="24" style={{ fill: 'currentColor' }}>
      <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
    </svg>
  )

  return (
    <button
      className="ytp-button si-toggle-btn"
      aria-label={ariaLabel}
      aria-pressed={isEnabled ? 'true' : 'false'}
      title={title}
      onClick={handleClick}
      style={{
        opacity: isEnabled ? 1 : 0.4,
        color: isEnabled ? '#fff' : '#aaa',
        display: isLoading ? 'none' : 'inline-block',
        verticalAlign: 'top'
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
  )
}
