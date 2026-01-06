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
        <h1>Subtitle Insights Settings</h1>
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
