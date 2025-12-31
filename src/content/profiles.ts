export interface Profile {
  id: string;
  name: string;
  sourceLanguage: string;
  targetLanguage: string;
  systemPrompt: string;
}

export const DEFAULT_JAPANESE_PROFILE: Profile = {
  id: 'default-ja',
  name: 'Japanese (Default)',
  sourceLanguage: 'ja',
  targetLanguage: 'en',
  systemPrompt: `
Role: Japanese Grammar Instructor for English speakers.

Task: Analyze the grammar of the user's provided Japanese sentence.

Constraints:
- PROSE LANGUAGE: Use English for the explanation.
- NO JAPANESE PROSE: Never write full sentences in Japanese.
- NO TRANSLATION: Never translate the sentence.
- KEY TERMS: Use Hiragana/Katakana for particles (は, が, を, に, etc.) and specific vocabulary,
  focus on explaning grammar.
- BREVITY: 1-2 sentences maximum.
- START: Begin the explanation immediately with no filler.

RESPONSE RULE: Your response MUST have an English word

Example:
Input: 毎日お茶を飲みます。
Output: The particle を indicates that お茶 is the direct object of the verb 飲みます, which is in the polite present-tense form.
`.trim()
};

export class ProfileManager {
  private static STORAGE_KEY = 'lle_profiles';
  private static ACTIVE_PROFILE_KEY = 'lle_active_profile_id';

  static async getProfiles(): Promise<Profile[]> {
    const result = await chrome.storage.local.get(this.STORAGE_KEY);
    return result[this.STORAGE_KEY] || [];
  }

  static async getActiveProfileId(): Promise<string | null> {
    const result = await chrome.storage.local.get(this.ACTIVE_PROFILE_KEY);
    return result[this.ACTIVE_PROFILE_KEY] || null;
  }

  static async getActiveProfile(): Promise<Profile> {
    const profiles = await this.getProfiles();
    const activeId = await this.getActiveProfileId();
    
    if (profiles.length === 0) {
      await this.initializeDefaults();
      return DEFAULT_JAPANESE_PROFILE;
    }

    const active = profiles.find(p => p.id === activeId);
    return active || profiles[0];
  }

  static async saveProfile(profile: Profile): Promise<void> {
    const profiles = await this.getProfiles();
    const index = profiles.findIndex(p => p.id === profile.id);
    
    if (index >= 0) {
      profiles[index] = profile;
    } else {
      profiles.push(profile);
    }
    
    await chrome.storage.local.set({ [this.STORAGE_KEY]: profiles });
  }

  static async deleteProfile(id: string): Promise<void> {
    let profiles = await this.getProfiles();
    profiles = profiles.filter(p => p.id !== id);
    await chrome.storage.local.set({ [this.STORAGE_KEY]: profiles });
    
    // If we deleted the active profile, reset active to the first available
    const activeId = await this.getActiveProfileId();
    if (activeId === id) {
      const remaining = profiles;
      if (remaining.length > 0) {
        await this.setActiveProfile(remaining[0].id);
      } else {
        // No profiles left? Restore default or leave in bad state?
        // Let's restore default to be safe
        await this.initializeDefaults();
      }
    }
  }

  static async setActiveProfile(id: string): Promise<void> {
    await chrome.storage.local.set({ [this.ACTIVE_PROFILE_KEY]: id });
  }

  static async initializeDefaults(): Promise<void> {
    const profiles = await this.getProfiles();
    if (profiles.length === 0) {
      await this.saveProfile(DEFAULT_JAPANESE_PROFILE);
      await this.setActiveProfile(DEFAULT_JAPANESE_PROFILE.id);
    }
  }
}
