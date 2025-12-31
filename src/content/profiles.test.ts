import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProfileManager, DEFAULT_JAPANESE_PROFILE, Profile } from './profiles';

// Mock chrome.storage.local
const mockStorage: Record<string, any> = {};
vi.stubGlobal('chrome', {
  storage: {
    local: {
      get: vi.fn().mockImplementation((keys: string[] | string) => {
        const result: Record<string, any> = {};
        if (typeof keys === 'string') {
          result[keys] = mockStorage[keys];
        } else {
          keys.forEach(k => {
            result[k] = mockStorage[k];
          });
        }
        return Promise.resolve(result);
      }),
      set: vi.fn().mockImplementation((data: Record<string, any>) => {
        Object.assign(mockStorage, data);
        return Promise.resolve();
      })
    }
  }
});

describe('ProfileManager', () => {
  beforeEach(() => {
    // Clear mock storage
    for (const key in mockStorage) {
      delete mockStorage[key];
    }
    vi.clearAllMocks();
  });

  it('should initialize with default profile if none exists', async () => {
    const active = await ProfileManager.getActiveProfile();
    expect(active.id).toBe(DEFAULT_JAPANESE_PROFILE.id);
    expect(active.name).toBe(DEFAULT_JAPANESE_PROFILE.name);
    
    const profiles = await ProfileManager.getProfiles();
    expect(profiles.length).toBe(1);
    expect(profiles[0].id).toBe(DEFAULT_JAPANESE_PROFILE.id);
  });

  it('should save and retrieve profiles', async () => {
    const newProfile: Profile = {
      id: 'test-profile',
      name: 'Test Profile',
      sourceLanguage: 'fr',
      targetLanguage: 'en',
      systemPrompt: 'French Prompt'
    };

    await ProfileManager.saveProfile(newProfile);
    const profiles = await ProfileManager.getProfiles();
    
    expect(profiles.find(p => p.id === 'test-profile')).toBeDefined();
    expect(profiles.length).toBe(1);
  });

  it('should manage active profile', async () => {
    await ProfileManager.initializeDefaults();
    
    const newProfile: Profile = {
      id: 'test-profile',
      name: 'Test Profile',
      sourceLanguage: 'fr',
      targetLanguage: 'en',
      systemPrompt: 'French Prompt'
    };
    await ProfileManager.saveProfile(newProfile);
    await ProfileManager.setActiveProfile('test-profile');
    
    const active = await ProfileManager.getActiveProfile();
    expect(active.id).toBe('test-profile');
  });

  it('should fallback to first profile if active profile id is invalid', async () => {
    await ProfileManager.initializeDefaults();
    await ProfileManager.setActiveProfile('invalid-id');
    
    const active = await ProfileManager.getActiveProfile();
    expect(active.id).toBe(DEFAULT_JAPANESE_PROFILE.id);
  });
});
