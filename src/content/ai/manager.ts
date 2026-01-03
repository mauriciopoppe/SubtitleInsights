import { translatorService } from './translator'
import { grammarExplainer } from './explainer'
import { isComplexSentence } from './utils'
import { Config } from '../config'
import { store } from '../store'

export class AIManager {
  private isTranslationProcessing = false
  private isInsightsProcessing = false
  private pendingTranslationIndices = new Set<number>()
  private pendingInsightsIndices = new Set<number>()
  private translateBuffer = 10
  private insightsBuffer = 5
  private lastTriggerIndex = -1

  public reset() {
    console.log('[SI] Resetting AIManager queues.')
    this.pendingTranslationIndices.clear()
    this.pendingInsightsIndices.clear()
    this.lastTriggerIndex = -1
  }

  public async initializeAIServices() {
    // Translator Setup
    const translationAvailability = await translatorService.checkAvailability()
    console.log('[SI] AI Translation availability:', translationAvailability)

    if (translationAvailability === 'available') {
      store.setAIStatus('ready', 'AI Translator Ready')
      await translatorService.initialize()
      console.log('[SI] AI Translator initialized.')
    } else if (translationAvailability === 'downloadable') {
      this.initiateDownloadFlow()
    }

    // Grammar Explainer Setup
    const grammarAvailability = await grammarExplainer.checkAvailability()
    console.log('[SI] AI Grammar Explainer availability:', grammarAvailability)
    if (grammarAvailability === 'available') {
      await grammarExplainer.initialize()
      console.log('[SI] AI Grammar Explainer initialized.')
    }
  }

  private initiateDownloadFlow() {
    store.setAIStatus('none')
    console.log('[SI] AI models need download.')

    const initDownload = async () => {
      store.setAIStatus('downloading', 'Downloading AI models...')
      store.setSystemMessage('Downloading AI models...')
      const success = await translatorService.initialize((loaded, total) => {
        const percent = Math.round((loaded / total) * 100)
        store.setAIStatus('downloading', `Downloading AI models: ${percent}%`)
        store.setSystemMessage(`Downloading AI models: ${percent}%`)
        console.log(`[SI] AI Download progress: ${percent}%`)
      })

      if (success) {
        store.setAIStatus('ready', 'AI Translator Ready')
        store.setSystemMessage(null)
        console.log('[SI] AI Translator initialized after download.')
      } else {
        store.setAIStatus('error', 'AI Initialization Failed')
        store.setSystemMessage('AI Translation Failed to initialize')
      }
    }

    if (navigator.userActivation?.isActive) {
      console.log('[SI] User activation active. Starting download immediately.')
      initDownload()
    } else {
      console.log('[SI] Waiting for user interaction to start download...')
      const onUserInteraction = (e: Event) => {
        if (e.type === 'keydown' && (e as KeyboardEvent).key === 'Escape') {
          return
        }

        document.removeEventListener('mousedown', onUserInteraction)
        document.removeEventListener('pointerdown', onUserInteraction)
        document.removeEventListener('pointerup', onUserInteraction)
        document.removeEventListener('touchend', onUserInteraction)
        document.removeEventListener('keydown', onUserInteraction)

        console.log(
          `[SI] User interaction detected (${e.type}). Starting download...`
        )
        initDownload()
      }

      document.addEventListener('mousedown', onUserInteraction)
      document.addEventListener('pointerdown', onUserInteraction)
      document.addEventListener('pointerup', onUserInteraction)
      document.addEventListener('touchend', onUserInteraction)
      document.addEventListener('keydown', onUserInteraction)
    }
  }

  public async onTimeUpdate(currentTimeMs: number) {
    const allSegments = store.getAllSegments()
    if (allSegments.length === 0) return

    // Find current segment index
    const currentIndex = allSegments.findIndex(
      s => currentTimeMs >= s.start && currentTimeMs <= s.end
    )

    let targetIndex = currentIndex
    if (currentIndex === -1) {
      // If no current segment, find the next upcoming one to start prefetching from
      targetIndex = allSegments.findIndex(s => s.start > currentTimeMs)
      if (targetIndex === -1) targetIndex = 0 // Fallback to start
    }

    // Detect significant jumps to clear queues
    if (
      this.lastTriggerIndex !== -1 &&
      Math.abs(targetIndex - this.lastTriggerIndex) > 5
    ) {
      console.log(
        `[SI] Significant jump detected (${this.lastTriggerIndex} -> ${targetIndex}). Clearing queues.`
      )
      this.pendingTranslationIndices.clear()
      this.pendingInsightsIndices.clear()
      // We don't reset processing flags here, they'll resolve naturally or stay locked if active
    }
    this.lastTriggerIndex = targetIndex

    await this.triggerPrefetch(targetIndex)
  }

  private async triggerPrefetch(startIndex: number) {
    if (this.isTranslationProcessing && this.isInsightsProcessing) return

    const allSegments = store.getAllSegments()
    const translationTasks: number[] = []
    const insightsTasks: number[] = []

    const isInsightsEnabled = await Config.getIsGrammarExplainerEnabled()

    // Determine what needs processing in the current window
    for (
      let i = startIndex;
      i < Math.min(startIndex + this.translateBuffer, allSegments.length);
      i++
    ) {
      const seg = allSegments[i]

      const needsTranslation =
        !this.pendingTranslationIndices.has(i) &&
        translatorService.isReady() &&
        !seg.translation

      const inInsightsRange = i < startIndex + this.insightsBuffer
      const needsInsights =
        !this.pendingInsightsIndices.has(i) &&
        isInsightsEnabled &&
        grammarExplainer.isReady() &&
        !seg.insights &&
        isComplexSentence(seg.text) &&
        inInsightsRange

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
      await Promise.all(indices.map(idx => this.executeTask(idx, true, false)))
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
          await this.executeTask(idx, false, true)
        }
      }
    } finally {
      this.isInsightsProcessing = false
    }
  }

  private async executeTask(
    index: number,
    translate: boolean,
    insights: boolean
  ) {
    const allSegments = store.getAllSegments()
    const segment = allSegments[index]
    if (!segment) return

    if (translate) this.pendingTranslationIndices.add(index)
    if (insights) this.pendingInsightsIndices.add(index)

    try {
      const withTimeout = (promise: Promise<any>, ms: number) => {
        return Promise.race([
          promise,
          new Promise((_resolve, reject) =>
            setTimeout(() => reject(new Error('Timeout')), ms)
          )
        ])
      }

      if (translate) {
        try {
          const translation = await withTimeout(
            translatorService.translate(segment.text),
            10000
          )
          store.updateSegmentTranslation(index, translation)
        } catch (e) {
          console.error(`[SI] Translation failed for ${index}:`, e)
        }
      }

      if (insights) {
        try {
          const analysis = await withTimeout(
            grammarExplainer.explainGrammar(segment.text),
            10000
          )
          store.updateSegmentInsights(index, analysis)
        } catch (e) {
          console.error(`[SI] Insights explanation failed for ${index}:`, e)
        }
      }
    } catch (error) {
      console.error(
        `[SI][AIManager] Execution error for segment ${index}`,
        error
      )
    } finally {
      // We don't remove from pendingIndices here to prevent re-processing the same index
      // until the video changes or a jump occurs.
    }
  }
}

export const translationManager = new AIManager()
