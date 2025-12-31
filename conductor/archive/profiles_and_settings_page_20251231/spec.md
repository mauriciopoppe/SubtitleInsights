# Specification: Language Profiles & Settings Page

## Overview
Introduce a profile system to manage language-specific configurations (source/target language, system prompts, etc.). Create a dedicated full-page Settings UI (similar to Yomitan) accessible from the extension sidebar/popup to manage these profiles and global settings.

## Data Model: Profile
*   `id`: string (UUID)
*   `name`: string (e.g., "Japanese Default", "French Study")
*   `sourceLanguage`: string (ISO code, e.g., 'ja', 'fr')
*   `targetLanguage`: string (ISO code, e.g., 'en')
*   `systemPrompt`: string (Custom prompt for the AI explainer)

## Functional Requirements
1.  **Settings Page:**
    *   A dedicated HTML page (`settings.html`) registered in `manifest.json`.
    *   **Profile Management:**
        *   List existing profiles.
        *   Create new profile.
        *   Edit profile details (Languages, Prompts).
        *   Delete profile.
        *   Select "Active" profile.
    *   **Global Settings:** (Start small, maybe just a placeholder or move generic toggles here later).
2.  **Storage:**
    *   Persist profiles in `chrome.storage.local` (or `sync` if size permits, but `local` is safer for large prompts).
    *   Store the `activeProfileId` separately to quickly load the current config.
3.  **Integration:**
    *   Update `SidebarHeader` (or a new menu item) to link to the Settings Page (`chrome.runtime.openOptionsPage()`).
    *   Update `GrammarExplainer` and `Translator` to use the `activeProfile`'s configuration instead of hardcoded/global values.
4.  **Migration:**
    *   On first run, create a "Default Japanese" profile using current hardcoded defaults.

## UI/UX
*   Clean, modern dashboard style (Material Design / YouTube-ish to match extension).
*   Sidebar navigation in the settings page (Profiles, General, About).
