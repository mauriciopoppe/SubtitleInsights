import { useState, useEffect } from 'preact/hooks'
import { ProfileList } from './ProfileList'
import { ProfileEditor } from './ProfileEditor'
import { Profile, ProfileManager } from '../content/profiles'

export function App() {
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)

  useEffect(() => {
    ProfileManager.initializeDefaults()
  }, [])

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

      <div className="settings-section" id="general">
        <h2>General</h2>
        <div className="placeholder-card">
          <p>Global configuration options will appear here.</p>
        </div>
      </div>

      <div className="settings-section" id="about">
        <h2>About</h2>
        <div className="placeholder-card">
          <p>Subtitle Insights v1.0.0</p>
          <p>Built with Chrome Prompt API</p>
        </div>
      </div>
    </div>
  )
}
