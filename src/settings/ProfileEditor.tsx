import { useState } from 'preact/hooks'
import { Profile, ProfileManager } from '../content/profiles'

export function ProfileEditor({
  profile,
  onSave,
  onCancel
}: {
  profile: Profile
  onSave: () => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<Profile>({ ...profile })

  const handleSave = async () => {
    await ProfileManager.saveProfile(form)
    onSave()
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this profile?')) {
      await ProfileManager.deleteProfile(profile.id)
      onSave() // Acts as refresh
    }
  }

  return (
    <div className="profile-editor">
      <h3>{profile.id ? 'Edit Profile' : 'New Profile'}</h3>
      <div className="form-group">
        <label>Name</label>
        <input
          value={form.name}
          onInput={e => setForm({ ...form, name: e.currentTarget.value })}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Source Language (ISO)</label>
          <input
            value={form.sourceLanguage}
            onInput={e =>
              setForm({ ...form, sourceLanguage: e.currentTarget.value })
            }
          />
        </div>
        <div className="form-group">
          <label>Target Language (ISO)</label>
          <input
            value={form.targetLanguage}
            onInput={e =>
              setForm({ ...form, targetLanguage: e.currentTarget.value })
            }
          />
        </div>
      </div>
      <div className="form-group">
        <label>System Prompt</label>
        <textarea
          value={form.systemPrompt}
          onInput={e =>
            setForm({ ...form, systemPrompt: e.currentTarget.value })
          }
          rows={15}
        />
        <small>Instructions for the AI to explain grammar.</small>
      </div>
      <div className="actions">
        <button className="primary" onClick={handleSave}>
          Save Profile
        </button>
        <button onClick={onCancel}>Cancel</button>
        {profile.id && (
          <button
            className="danger"
            onClick={handleDelete}
            style={{ marginLeft: 'auto' }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
