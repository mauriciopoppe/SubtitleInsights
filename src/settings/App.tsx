import { useState, useEffect } from 'preact/hooks'
import { ProfileList } from './ProfileList'
import { ProfileEditor } from './ProfileEditor'
import { Profile, ProfileManager } from '../content/profiles'
import { Config, AppConfig } from '../content/config'

export function App() {
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)
  const [config, setConfig] = useState<AppConfig | null>(null)

  useEffect(() => {
    ProfileManager.initializeDefaults()
    Config.get().then(setConfig)
    return Config.subscribe(setConfig)
  }, [])

  const toggleDebugMode = () => {
    if (config) {
      Config.update({ isDebugMode: !config.isDebugMode })
    }
  }

  return (
    <div className="settings-container single-page">
      <div className="settings-header">
        <div className="settings-logo-container">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="settings-logo">
            <rect width="64" height="64" fill="#0F0F0F" />
            <rect x="22" y="14" width="20" height="4" rx="2" fill="#3EA6FF" fill-opacity="0.6" />
            <rect x="16" y="26" width="32" height="4" rx="2" fill="#3EA6FF" />
            <rect x="10" y="38" width="44" height="14" rx="4" fill="#FFD600" />
            <circle cx="48" cy="45" r="3" fill="#0F0F0F" fill-opacity="0.3" />
          </svg>
          <div className="settings-header-text">
            <h1>Subtitle Insights</h1>
            <p className="settings-motto">Subtitle data, clarified.</p>
          </div>
        </div>
      </div>

      <div className="settings-section" id="profiles">
        {!editingProfile ? (
          <ProfileList onEdit={setEditingProfile} />
        ) : (
          <ProfileEditor
            profile={editingProfile}
            onSave={() => setEditingProfile(null)}
            onCancel={() => setEditingProfile(null)}
          />
        )}
      </div>

      {!editingProfile && (
        <div className="settings-section developer-section" id="developer">
          <div className="developer-header">
            <h2>Developer Settings</h2>
          </div>
          <div className="settings-item">
            <div className="settings-item-info">
              <div className="settings-item-title">Debug Mode</div>
              <div className="settings-item-description">
                Enable detailed logging in the console for all si:* namespaces.
              </div>
            </div>
            <div className={`si-toggle-switch ${config?.isDebugMode ? 'enabled' : ''}`} onClick={toggleDebugMode} />
          </div>
        </div>
      )}

      <footer
        className="settings-footer"
        style={{
          textAlign: 'center',
          marginTop: '60px',
          color: '#aaa',
          borderTop: 'var(--si-border-standard)',
          paddingTop: '20px'
        }}
      >
        <a
          href="https://mauriciopoppe.github.io/SubtitleInsights/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#3ea6ff', textDecoration: 'none' }}
        >
          Subtitle Insights
        </a>
        {' • '}
        Made with{' '}
        <span style={{ color: 'deeppink', fontSize: '1.5em', verticalAlign: 'middle', margin: '0 4px' }}>
          ♥
        </span> by{' '}
        <a
          href="https://mauriciopoppe.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#3ea6ff', textDecoration: 'none' }}
        >
          Mauricio Poppe
        </a>
      </footer>
    </div>
  )
}
