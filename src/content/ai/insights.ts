import { ProfileManager } from '../profiles'
import { store } from '../store'
import { trimThinkingProcess } from './utils'
import { aiLogger } from '../logger'

const SUPPORTED_LANGUAGES = ['en', 'ja', 'es']

export class AIInsights {
  private rootSession: LanguageModel | null = null
  private workingSession: LanguageModel | null = null

  async checkAvailability(): Promise<Availability> {
    try {
      if (typeof window.LanguageModel !== 'undefined') {
        const profile = await ProfileManager.getActiveProfile()

        const isSourceSupported = SUPPORTED_LANGUAGES.includes(profile.sourceLanguage)
        const isTargetSupported = SUPPORTED_LANGUAGES.includes(profile.targetLanguage)

        let sourceLangForModel = profile.sourceLanguage
        if (!isSourceSupported) {
          sourceLangForModel = 'en'
        }

        if (!isTargetSupported) {
          store.setWarning(
            `Target language "${profile.targetLanguage}" not supported by Insights. Only en, ja, es are supported.`
          )
          return 'unavailable'
        }
        if (!isSourceSupported) {
          store.setWarning(
            `Source language "${profile.sourceLanguage}" may have limited support. Falling back to "en" for model initialization.`
          )
        }

        aiLogger('Checking LanguageModel availability:', {
          targetLanguage: profile.targetLanguage,
          sourceLanguage: sourceLangForModel
        })

        return await window.LanguageModel.availability({
          expectedInputs: [{ type: 'text', languages: [profile.targetLanguage, sourceLangForModel] }]
        })
      }
      return 'unavailable'
    } catch (error) {
      aiLogger('ERROR: Error checking language model availability:', error)
      return 'unavailable'
    }
  }

  async initialize(): Promise<boolean> {
    try {
      if (this.rootSession) {
        return true
      }

      if (typeof window.LanguageModel === 'undefined') {
        return false
      }

      const profile = await ProfileManager.getActiveProfile()

      const isSourceSupported = SUPPORTED_LANGUAGES.includes(profile.sourceLanguage)

      if (!isSourceSupported) {
        store.setWarning(
          `Source language "${profile.sourceLanguage}" may have limited support. Falling back to "en" for model initialization.`
        )
      }

      const sourceLangForModel = isSourceSupported ? profile.sourceLanguage : 'en'

      aiLogger('Initializing LanguageModel:', {
        targetLanguage: profile.targetLanguage,
        sourceLanguage: sourceLangForModel
      })

      const options: LanguageModelCreateOptions = {
        initialPrompts: [
          {
            role: 'system',
            content: profile.systemPrompt
          }
        ],
        expectedInputs: [
          {
            type: 'text',
            languages: [profile.targetLanguage, sourceLangForModel]
          }
        ],
        expectedOutputs: [{ type: 'text', languages: [profile.targetLanguage] }]
      }

      this.rootSession = await window.LanguageModel.create(options)

      if (this.rootSession) {
        await this.resetSession()
        return true
      }

      return false
    } catch (error) {
      aiLogger('ERROR: Error initializing language model:', error)
      return false
    }
  }

  async resetSession() {
    if (!this.rootSession) {
      await this.initialize()
      return
    }

    try {
      if (this.workingSession) {
        this.workingSession.destroy()
        this.workingSession = null
      }

      this.workingSession = await this.rootSession.clone()
      aiLogger('AIInsights: Session reset via clone.')
    } catch (error) {
      aiLogger('ERROR: Error resetting insights session:', error)
    }
  }

  async destroy() {
    if (this.workingSession) {
      this.workingSession.destroy()
      this.workingSession = null
    }
    if (this.rootSession) {
      this.rootSession.destroy()
      this.rootSession = null
    }
  }

  async explainGrammar(text: string): Promise<string> {
    if (!this.rootSession) {
      throw new Error('Language Model session not initialized')
    }

    // Baseline Clone pattern:
    // 1. Clone a fresh session from the root (system prompt only)
    // 2. Execute the prompt
    // 3. Destroy the working session immediately to free resources
    const workingSession = await this.rootSession.clone()

    try {
      const rawResponse = await workingSession.prompt(`Sentence: ${text}`)
      const processedResponse = trimThinkingProcess(rawResponse, text)
      return processedResponse
    } catch (error) {
      aiLogger('ERROR: Error explaining grammar:', error)
      throw error
    } finally {
      workingSession.destroy()
    }
  }

  isReady(): boolean {
    return this.rootSession !== null
  }
}

export const aiInsights = new AIInsights()
