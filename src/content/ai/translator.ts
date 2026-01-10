import { ProfileManager } from '../profiles'
import { aiLogger } from '../logger'

export class MyTranslator {
  private translator: Translator | null = null

  async checkAvailability(): Promise<Availability> {
    if (typeof Translator === 'undefined') {
      return 'unavailable'
    }

    const profile = await ProfileManager.getActiveProfile()
    aiLogger('Checking Translator availability:', {
      sourceLanguage: profile.sourceLanguage,
      targetLanguage: profile.targetLanguage
    })
    return await Translator.availability({
      sourceLanguage: profile.sourceLanguage,
      targetLanguage: profile.targetLanguage
    })
  }

  async initialize(onProgress?: (loaded: number, total: number) => void): Promise<boolean> {
    try {
      if (typeof Translator === 'undefined') {
        return false
      }

      const profile = await ProfileManager.getActiveProfile()
      aiLogger('Initializing Translator:', {
        sourceLanguage: profile.sourceLanguage,
        targetLanguage: profile.targetLanguage
      })
      const options: TranslatorCreateOptions = {
        sourceLanguage: profile.sourceLanguage,
        targetLanguage: profile.targetLanguage
      }

      if (onProgress) {
        options.monitor = (m: CreateMonitor) => {
          m.addEventListener('downloadprogress', (e: { loaded: number; total: number }) => {
            onProgress(e.loaded, e.total)
          })
        }
      }

      this.translator = await Translator.create(options)

      return true
    } catch (error) {
      aiLogger('ERROR: Error initializing translator:', error)
      return false
    }
  }

  async translate(text: string): Promise<string> {
    if (!this.translator) {
      throw new Error('Translator not initialized')
    }

    try {
      return await this.translator.translate(text)
    } catch (error) {
      aiLogger('ERROR: Error translating text:', error)
      throw error
    }
  }

  isReady(): boolean {
    return this.translator !== null
  }
}

export const translatorService = new MyTranslator()
