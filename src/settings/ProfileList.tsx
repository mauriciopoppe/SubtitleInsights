import { useEffect, useState } from 'preact/hooks'
import { Profile, ProfileManager } from '../content/profiles'

export function ProfileList({
  onEdit
}: {
  onEdit: (profile: Profile) => void
}) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  const loadProfiles = async () => {
    const list = await ProfileManager.getProfiles()
    const active = await ProfileManager.getActiveProfileId()
    setProfiles(list)
    setActiveId(active)
  }

  useEffect(() => {
    loadProfiles()
  }, [])

  const handleCreate = () => {
    const newProfile: Profile = {
      id: crypto.randomUUID(),
      name: 'New Profile',
      sourceLanguage: 'ja',
      targetLanguage: 'en',
      systemPrompt: ''
    }
    onEdit(newProfile)
  }

  return (
    <div className="profile-list">
      <div className="profile-header">
        <h2>Profiles</h2>
        <button className="create-btn" onClick={handleCreate}>
          Create New Profile
        </button>
      </div>
      <ul className="profile-items">
        {profiles.map(p => (
          <li
            key={p.id}
            className={`profile-item ${p.id === activeId ? 'active-profile' : ''}`}
          >
            <div className="profile-info">
              <span className="profile-name">{p.name}</span>
              <span className="profile-lang">
                {p.sourceLanguage} → {p.targetLanguage}
              </span>
              {p.id === activeId && (
                <span className="badge-active">Active</span>
              )}
            </div>
            <div className="profile-actions">
              <button onClick={() => onEdit(p)}>Edit</button>
              {p.id !== activeId && (
                <button
                  onClick={async () => {
                    await ProfileManager.setActiveProfile(p.id)
                    loadProfiles()
                  }}
                >
                  Set Active
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
