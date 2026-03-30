import { translatorService } from './translator'
import { aiInsights } from './insights'
import { furiganaService } from './furigana'
import { isComplexSentence } from './utils'
import { Config } from '../config'
import { store } from '../store'
import { videoController } from '../VideoController'
import { aiLogger } from '../logger'

export class AIManager {
  private isTranslationProcessing = false
  private isInsightsProcessing = false
  private pendingTranslationIndices = new Set<number>()
  private pendingInsightsIndices = new Set<number>()
  private translateBuffer = 10
  private insightsBuffer = 5
  private lastTriggerIndex = -1
  private unsubscribe: (() => void) | null = null

  public reset() {
    aiLogger('Resetting AIManager queues.')
    this.pendingTranslationIndices.clear()
    this.pendingInsightsIndices.clear()
    this.lastTriggerIndex = -1
  }

  public async initializeAIServices() {
    // Translator Setup
    const translationAvailability = await translatorService.checkAvailability()
    aiLogger('AI Translation availability:', translationAvailability)

    if (translationAvailability === 'available') {
      store.setAIStatus('ready', 'AI Translator Ready')
      await translatorService.initialize()
      aiLogger('AI Translator initialized.')
    } else if (translationAvailability === 'downloadable') {
      this.initiateDownloadFlow()
    }

    // AI Insights Setup
    const grammarAvailability = await aiInsights.checkAvailability()
    aiLogger('AI Insights availability:', grammarAvailability)
    if (grammarAvailability === 'available') {
      await aiInsights.initialize()
      aiLogger('AI Insights initialized.')
    }

    // Furigana Setup
    const furiganaAvailability = await furiganaService.checkAvailability()
    aiLogger('AI Furigana availability:', furiganaAvailability)
    if (furiganaAvailability === 'available') {
      await furiganaService.initialize()
      aiLogger('AI Furigana initialized.')
    }

    // Setup subscription to segment changes
    if (!this.unsubscribe) {
      this.unsubscribe = videoController.targetSegmentIndex.subscribe(index => {
        this.handleSegmentChange(index)
      })
    }
  }

  private initiateDownloadFlow() {
    store.setAIStatus('none')
    aiLogger('AI models need download.')

    const initDownload = async () => {
      store.setAIStatus('downloading', 'Downloading AI models...')
      store.setSystemMessage('Downloading AI models...')
      const success = await translatorService.initialize((loaded, total) => {
        const percent = Math.round((loaded / total) * 100)
        store.setAIStatus('downloading', `Downloading AI models: ${percent}%`)
        store.setSystemMessage(`Downloading AI models: ${percent}%`)
        aiLogger(`AI Download progress: ${percent}%`)
      })

      if (success) {
        store.setAIStatus('ready', 'AI Translator Ready')
        store.setSystemMessage(null)
        aiLogger('AI Translator initialized after download.')
      } else {
        store.setAIStatus('error', 'AI Initialization Failed')
        store.setSystemMessage('AI Translation Failed to initialize')
      }
    }

    if (navigator.userActivation?.isActive) {
      aiLogger('User activation active. Starting download immediately.')
      initDownload()
    } else {
      aiLogger('Waiting for user interaction to start download...')
      const onUserInteraction = (e: Event) => {
        if (e.type === 'keydown' && (e as KeyboardEvent).key === 'Escape') {
          return
        }

        document.removeEventListener('mousedown', onUserInteraction)
        document.removeEventListener('pointerdown', onUserInteraction)
        document.removeEventListener('pointerup', onUserInteraction)
        document.removeEventListener('touchend', onUserInteraction)
        document.removeEventListener('keydown', onUserInteraction)

        aiLogger(`User interaction detected (${e.type}). Starting download...`)
        initDownload()
      }

      document.addEventListener('mousedown', onUserInteraction)
      document.addEventListener('pointerdown', onUserInteraction)
      document.addEventListener('pointerup', onUserInteraction)
      document.addEventListener('touchend', onUserInteraction)
      document.addEventListener('keydown', onUserInteraction)
    }
  }

  private async handleSegmentChange(targetIndex: number) {
    if (targetIndex === -1) return

    const { isEnabled } = await Config.get()
    if (!isEnabled) return

    // Detect significant jumps to clear queues
    // Note: With targetSegmentIndex, a "jump" is an index shift.
    // If we move from segment 5 to segment 50, we clear.
    if (this.lastTriggerIndex !== -1 && Math.abs(targetIndex - this.lastTriggerIndex) > 5) {
      aiLogger(`Significant jump detected (${this.lastTriggerIndex} -> ${targetIndex}). Clearing queues.`)
      this.pendingTranslationIndices.clear()
      this.pendingInsightsIndices.clear()
    }
    this.lastTriggerIndex = targetIndex

    await this.triggerPrefetch(targetIndex)
  }

  private async triggerPrefetch(startIndex: number) {
    if (this.isTranslationProcessing && this.isInsightsProcessing) return

    const allSegments = store.getAllSegments()
    const translationTasks: number[] = []
    const insightsTasks: number[] = []

    const { isGrammarEnabled } = await Config.get()
    const sourceLang = store.sourceLanguage

    // Determine what needs processing in the current window
    for (let i = startIndex; i < Math.min(startIndex + this.translateBuffer, allSegments.length); i++) {
      const seg = allSegments[i]

      const needsTranslation = !this.pendingTranslationIndices.has(i) && translatorService.isReady() && !seg.translation

      const inInsightsRange = i < startIndex + this.insightsBuffer
      const needsInsights =
        !this.pendingInsightsIndices.has(i) &&
        inInsightsRange &&
        ((isGrammarEnabled && aiInsights.isReady() && !seg.insights && isComplexSentence(seg.text)) ||
          (sourceLang?.startsWith('ja') && furiganaService.isReady() && !seg.segmentedData))

      if (needsTranslation) translationTasks.push(i)
      if (needsInsights) insightsTasks.push(i)
    }

    if (translationTasks.length > 0 && !this.isTranslationProcessing) {
      this.processTranslations(translationTasks)
    }

    if (insightsTasks.length > 0 && !this.isInsightsProcessing) {
      // Mark as pending immediately to indicate they are scheduled.
      // If a jump occurs, these will be cleared, and processInsights will skip them.
      insightsTasks.forEach(i => this.pendingInsightsIndices.add(i))
      this.processInsights(insightsTasks)
    }
  }

  private async processTranslations(indices: number[]) {
    this.isTranslationProcessing = true
    try {
      await Promise.all(indices.map(idx => this.executeTask(idx, true, false, false)))
    } finally {
      this.isTranslationProcessing = false
    }
  }

  private async processInsights(indices: number[]) {
    this.isInsightsProcessing = true
    try {
      // Process serially
      for (const idx of indices) {
        // Only process if still marked as pending.
        // If a jump occurred, pendingInsightsIndices would have been cleared,
        // so we should skip the remaining tasks from the old queue.
        if (this.pendingInsightsIndices.has(idx)) {
          // Both grammar and furigana share the same 'insights' serial queue
          await this.executeTask(idx, false, true, true)
        }
      }
    } finally {
      this.isInsightsProcessing = false
    }
  }

  private async executeTask(index: number, translate: boolean, insights: boolean, furigana: boolean) {
    const allSegments = store.getAllSegments()
    const segment = allSegments[index]
    if (!segment) return

    if (translate) this.pendingTranslationIndices.add(index)
    if (insights || furigana) this.pendingInsightsIndices.add(index)

    try {
      const withTimeout = (promise: Promise<any>, ms: number) => {
        return Promise.race([
          promise,
          new Promise((_resolve, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
        ])
      }

      if (translate) {
        try {
          const translation = await withTimeout(translatorService.translate(segment.text), 10000)
          store.updateSegmentTranslation(index, translation)
        } catch (e) {
          aiLogger(`ERROR: Translation failed for ${index}:`, e)
        }
      }

      // Insights & Furigana block
      if (insights || furigana) {
        const { isGrammarEnabled } = await Config.get()
        const sourceLang = store.sourceLanguage

        let getGrammar = false
        let getFurigana = false

        if (insights && isGrammarEnabled && aiInsights.isReady() && !segment.insights && isComplexSentence(segment.text)) {
          getGrammar = true
        }

        if (furigana && sourceLang?.startsWith('ja') && furiganaService.isReady() && !segment.segmentedData) {
          getFurigana = true
        }

        if (getGrammar || getFurigana) {
          const results = await Promise.all([
            getGrammar
              ? withTimeout(aiInsights.explainGrammar(segment.text), 10000).catch(e => {
                  aiLogger(`ERROR: Insights explanation failed for ${index}:`, e)
                  return undefined
                })
              : Promise.resolve(undefined),
            getFurigana
              ? (async () => {
                  // Optimization: Pre-check for Kanji presence
                  if (!/[\u4E00-\u9FAF]/.test(segment.text)) {
                    return [[{ word: segment.text }]]
                  }
                  return withTimeout(furiganaService.generateFurigana(segment.text), 15000).catch(e => {
                    aiLogger(`ERROR: Furigana generation failed for ${index}:`, e)
                    return undefined
                  })
                })()
              : Promise.resolve(undefined)
          ])

          const [grammarResult, furiganaResult] = results
          if (grammarResult !== undefined || furiganaResult !== undefined) {
            store.updateSegmentInsights(index, grammarResult, furiganaResult)
          }
        }
      }
    } catch (error) {
      aiLogger(`ERROR: Execution error for segment ${index}`, error)
    }
  }
}

export const translationManager = new AIManager()
