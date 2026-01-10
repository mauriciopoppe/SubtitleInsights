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
            `Source language "${profile.sourceLanguage}" not supported by Insights. Falling back to "en" for analysis.`
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
          `Source language "${profile.sourceLanguage}" not supported by Insights. Falling back to "en".`
        )
      }

      const sourceLangForModel = isSourceSupported ? profile.sourceLanguage : 'en'

      aiLogger('Initializing LanguageModel:', {
        targetLanguage: profile.targetLanguage,
        sourceLanguage: sourceLangForModel
      })

      const params = await window.LanguageModel.params()
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
        expectedOutputs: [{ type: 'text', languages: [profile.targetLanguage] }],
        temperature: 0.2,
        topK: params.defaultTopK || undefined
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
    if (!this.workingSession) {
      throw new Error('Language Model session not initialized')
    }

    const { inputUsage, inputQuota } = this.workingSession
    const quotaLimit = 0.5
    if (inputUsage / inputQuota > quotaLimit) {
      // Reset if usage exceeds 50%
      aiLogger(
        `AIInsights: Input usage is ${inputUsage}/${inputQuota} at around ${quotaLimit * 100}%. Resetting session.`
      )
      await this.resetSession()
      if (!this.workingSession) {
        throw new Error('Language Model session failed to reset')
      }
    }

    try {
      const rawResponse = await this.workingSession.prompt(`Sentence: ${text}`)
      const processedResponse = trimThinkingProcess(rawResponse, text)
      return processedResponse
    } catch (error) {
      aiLogger('ERROR: Error explaining grammar:', error)
      throw error
    }
  }

  isReady(): boolean {
    return this.workingSession !== null
  }
}

export const aiInsights = new AIInsights()
