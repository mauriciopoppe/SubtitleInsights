import { ProfileManager } from '../profiles'

export type TranslationAvailability =
  | 'available'
  | 'downloadable'
  | 'downloading'
  | 'unavailable'

export class MyTranslator {
  private translator: any = null

  async checkAvailability(): Promise<TranslationAvailability> {
    // @ts-ignore
    if (typeof Translator === 'undefined') {
      return 'unavailable'
    }

    const profile = await ProfileManager.getActiveProfile()
    // @ts-ignore
    return await Translator.availability({
      sourceLanguage: profile.sourceLanguage,
      targetLanguage: profile.targetLanguage
    })
  }

  async initialize(
    onProgress?: (loaded: number, total: number) => void
  ): Promise<boolean> {
    try {
      // @ts-ignore
      if (typeof Translator === 'undefined') {
        return false
      }

      const profile = await ProfileManager.getActiveProfile()
      const options: any = {
        sourceLanguage: profile.sourceLanguage,
        targetLanguage: profile.targetLanguage
      }

      if (onProgress) {
        options.monitor = (m: any) => {
          m.addEventListener('downloadprogress', (e: any) => {
            onProgress(e.loaded, e.total)
          })
        }
      }

      // @ts-ignore
      this.translator = await Translator.create(options)

      return true
    } catch (error) {
      console.error('Error initializing translator:', error)
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
      console.error('Error translating text:', error)
      throw error
    }
  }

  isReady(): boolean {
    return this.translator !== null
  }
}

export const translatorService = new MyTranslator()
