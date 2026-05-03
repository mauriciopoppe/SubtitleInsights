import { MyTranslator, translatorService } from './translator'
import { AIInsights, aiInsights } from './insights'
import { JapaneseFuriganaService, furiganaService } from './furigana'
import { isComplexSentence } from './utils'
import { Config } from '../config'
import { SubtitleStore, store } from '../store'
import { VideoController, videoController } from '../VideoController'
import { aiLogger } from '../logger'

export class AIManager {
  private isTranslationProcessing = false
  private isInsightsProcessing = false
  private isRubyProcessing = false

  private pendingTranslationIndices = new Set<number>()
  private pendingInsightsIndices = new Set<number>()
  private pendingRubyIndices = new Set<number>()

  private translateBuffer = 10
  private insightsBuffer = 5
  private rubyBuffer = 10

  private lastTriggerIndex = -1
  private unsubscribe: (() => void) | null = null

  constructor(
    private translatorService: MyTranslator,
    private aiInsights: AIInsights,
    private furiganaService: JapaneseFuriganaService,
    private store: SubtitleStore,
    private videoController: VideoController
  ) {}

  async reset() {
    aiLogger.V(2).info('Hard resetting AIManager.')
    this.pendingTranslationIndices.clear()
    this.pendingInsightsIndices.clear()
    this.pendingRubyIndices.clear()
    this.lastTriggerIndex = -1
    
    await Promise.all([
      this.aiInsights.destroy(),
      this.translatorService.destroy(),
      this.furiganaService.destroy()
    ])
    await this.initializeAIServices()
  }

  private async initializeAIServices() {
    // Translator Setup
    const translationAvailability = await this.translatorService.checkAvailability()
    aiLogger.V(1).info('AI Translation availability:', translationAvailability)

    if (translationAvailability === 'available') {
      this.store.setAIStatus('ready', 'AI Translator Ready')
      await this.translatorService.initialize()
      aiLogger.V(1).info('AI Translator initialized.')
    } else if (translationAvailability === 'downloadable') {
      this.initiateDownloadFlow()
    }

    // AI Insights Setup
    const grammarAvailability = await this.aiInsights.checkAvailability()
    aiLogger.V(1).info('AI Insights availability:', grammarAvailability)
    if (grammarAvailability === 'available') {
      await this.aiInsights.initialize()
      aiLogger.V(1).info('AI Insights initialized.')
    }

    // Furigana Setup
    const furiganaAvailability = await this.furiganaService.checkAvailability()
    aiLogger.V(1).info('AI Furigana availability:', furiganaAvailability)
    if (furiganaAvailability === 'available') {
      await this.furiganaService.initialize()
      aiLogger.V(1).info('AI Furigana initialized.')
    }

    // Setup subscription to segment changes
    if (!this.unsubscribe) {
      this.unsubscribe = this.videoController.targetSegmentIndex.subscribe(index => {
        this.handleSegmentChange(index)
      })
    }
  }

  private initiateDownloadFlow() {
    this.store.setAIStatus('none')
    aiLogger.V(1).info('AI models need download.')

    const initDownload = async () => {
      this.store.setAIStatus('downloading', 'Downloading AI models...')
      this.store.setSystemMessage('Downloading AI models...')
      const success = await this.translatorService.initialize((loaded, total) => {
        const percent = Math.round((loaded / total) * 100)
        this.store.setAIStatus('downloading', `Downloading AI models: ${percent}%`)
        this.store.setSystemMessage(`Downloading AI models: ${percent}%`)
        aiLogger.V(2).info(`AI Download progress: ${percent}%`)
      })

      if (success) {
        this.store.setAIStatus('ready', 'AI Translator Ready')
        this.store.setSystemMessage(null)
        aiLogger.V(1).info('AI Translator initialized after download.')
      } else {
        this.store.setAIStatus('error', 'AI Initialization Failed')
        this.store.setSystemMessage('AI Translation Failed to initialize')
      }
    }

    if (navigator.userActivation?.isActive) {
      aiLogger.V(1).info('User activation active. Starting download immediately.')
      initDownload()
    } else {
      aiLogger.V(1).info('Waiting for user interaction to start download...')
      const onUserInteraction = (e: Event) => {
        if (e.type === 'keydown' && (e as KeyboardEvent).key === 'Escape') {
          return
        }

        document.removeEventListener('mousedown', onUserInteraction)
        document.removeEventListener('pointerdown', onUserInteraction)
        document.removeEventListener('pointerup', onUserInteraction)
        document.removeEventListener('touchend', onUserInteraction)
        document.removeEventListener('keydown', onUserInteraction)

        aiLogger.V(1).info(`User interaction detected (${e.type}). Starting download...`)
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
    if (this.lastTriggerIndex !== -1 && Math.abs(targetIndex - this.lastTriggerIndex) > 5) {
      aiLogger.V(2).info(`Significant jump detected (${this.lastTriggerIndex} -> ${targetIndex}). Clearing queues.`)
      this.pendingTranslationIndices.clear()
      this.pendingInsightsIndices.clear()
      this.pendingRubyIndices.clear()
    }
    this.lastTriggerIndex = targetIndex

    await this.triggerPrefetch(targetIndex)
  }

  private async triggerPrefetch(startIndex: number) {
    if (this.isTranslationProcessing && this.isInsightsProcessing && this.isRubyProcessing) return

    const allSegments = this.store.getAllSegments()
    const translationTasks: number[] = []
    const insightsTasks: number[] = []
    const rubyTasks: number[] = []

    const { isGrammarEnabled } = await Config.get()
    const sourceLang = this.store.sourceLanguage

    const maxBuffer = Math.max(this.translateBuffer, this.insightsBuffer, this.rubyBuffer)

    // Determine what needs processing in the current window
    for (let i = startIndex; i < Math.min(startIndex + maxBuffer, allSegments.length); i++) {
      const seg = allSegments[i]

      // Translation
      if (i < startIndex + this.translateBuffer) {
        if (!this.pendingTranslationIndices.has(i) && this.translatorService.isReady() && !seg.translation) {
          translationTasks.push(i)
        }
      }

      // Insights
      if (i < startIndex + this.insightsBuffer) {
        if (
          !this.pendingInsightsIndices.has(i) &&
          isGrammarEnabled &&
          this.aiInsights.isReady() &&
          !seg.insights &&
          isComplexSentence(seg.text)
        ) {
          insightsTasks.push(i)
        }
      }

      // Ruby (Furigana)
      if (i < startIndex + this.rubyBuffer) {
        if (
          !this.pendingRubyIndices.has(i) &&
          sourceLang?.startsWith('ja') &&
          this.furiganaService.isReady() &&
          !seg.segmentedData
        ) {
          rubyTasks.push(i)
        }
      }
    }

    if (translationTasks.length > 0 && !this.isTranslationProcessing) {
      this.processTranslations(translationTasks)
    }

    if (insightsTasks.length > 0 && !this.isInsightsProcessing) {
      insightsTasks.forEach(i => this.pendingInsightsIndices.add(i))
      this.processInsights(insightsTasks)
    }

    if (rubyTasks.length > 0 && !this.isRubyProcessing) {
      rubyTasks.forEach(i => this.pendingRubyIndices.add(i))
      this.processRuby(rubyTasks)
    }
  }

  private async processTranslations(indices: number[]) {
    this.isTranslationProcessing = true
    try {
      await Promise.all(indices.map(idx => this.executeTranslationTask(idx)))
    } finally {
      this.isTranslationProcessing = false
    }
  }

  private async processInsights(indices: number[]) {
    this.isInsightsProcessing = true
    try {
      for (const idx of indices) {
        if (this.pendingInsightsIndices.has(idx)) {
          await this.executeInsightsTask(idx)
        }
      }
    } finally {
      this.isInsightsProcessing = false
    }
  }

  private async processRuby(indices: number[]) {
    this.isRubyProcessing = true
    try {
      for (const idx of indices) {
        if (this.pendingRubyIndices.has(idx)) {
          await this.executeRubyTask(idx)
        }
      }
    } finally {
      this.isRubyProcessing = false
    }
  }

  private withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_resolve, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
    ])
  }

  private async executeTranslationTask(index: number) {
    const allSegments = this.store.getAllSegments()
    const segment = allSegments[index]
    if (!segment) return

    this.pendingTranslationIndices.add(index)

    try {
      const translation = await this.withTimeout(this.translatorService.translate(segment.text), 10000)
      aiLogger.V(2).info(`Translation completed for ${index}`)
      this.store.updateSegmentTranslation(index, translation)
    } catch (e) {
      aiLogger(`ERROR: Translation failed for ${index}:`, e)
    }
  }

  private async executeInsightsTask(index: number) {
    const allSegments = this.store.getAllSegments()
    const segment = allSegments[index]
    if (!segment) return

    this.pendingInsightsIndices.add(index)

    try {
      const analysis = await this.withTimeout(this.aiInsights.explainGrammar(segment.text), 10000)
      aiLogger.V(2).info(`Insights completed for ${index}`)
      this.store.updateSegmentInsights(index, analysis, undefined)
    } catch (e) {
      aiLogger(`ERROR: Insights explanation failed for ${index}:`, e)
    }
  }

  private async executeRubyTask(index: number) {
    const allSegments = this.store.getAllSegments()
    const segment = allSegments[index]
    if (!segment) return

    this.pendingRubyIndices.add(index)

    try {
      if (!/[\u4E00-\u9FAF]/.test(segment.text)) {
        aiLogger.V(2).info(`Skipping Furigana for ${index} (no Kanji)`)
        this.store.updateSegmentInsights(index, undefined, [[{ word: segment.text }]])
        return
      }

      const data = await this.withTimeout(this.furiganaService.generateFurigana(segment.text), 15000)
      aiLogger.V(2).info(`Furigana completed for ${index}`)
      this.store.updateSegmentInsights(index, undefined, data)
    } catch (e) {
      aiLogger(`ERROR: Furigana generation failed for ${index}:`, e)
    }
  }
}

export const translationManager = new AIManager(
  translatorService,
  aiInsights,
  furiganaService,
  store,
  videoController
)
