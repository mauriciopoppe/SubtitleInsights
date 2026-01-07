import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AIManager } from './manager'
import { Config } from '../config'
import { store } from '../store'
import { translatorService } from './translator'
import { grammarExplainer } from './explainer'

// Mock dependencies
vi.mock('../config', () => ({
  Config: {
    get: vi.fn()
  }
}))

vi.mock('../store', () => ({
  store: {
    getAllSegments: vi.fn(),
    setAIStatus: vi.fn(),
    updateSegmentTranslation: vi.fn(),
    updateSegmentInsights: vi.fn()
  }
}))

vi.mock('./translator', () => ({
  translatorService: {
    checkAvailability: vi.fn(),
    initialize: vi.fn(),
    isReady: vi.fn(),
    translate: vi.fn()
  }
}))

vi.mock('./explainer', () => ({
  grammarExplainer: {
    checkAvailability: vi.fn(),
    initialize: vi.fn(),
    isReady: vi.fn(),
    explainGrammar: vi.fn()
  }
}))

describe('AIManager', () => {
  let manager: AIManager

  beforeEach(() => {
    vi.clearAllMocks()
    manager = new AIManager()
  })

  it('should not trigger prefetch if isEnabled is false', async () => {
    vi.mocked(Config.get).mockResolvedValue({ isEnabled: false } as any)
    vi.mocked(store.getAllSegments).mockReturnValue([{ start: 0, end: 1000, text: 'Hello' }])
    vi.mocked(translatorService.isReady).mockReturnValue(true)

    await manager.onTimeUpdate(500)

    expect(translatorService.translate).not.toHaveBeenCalled()
  })

  it('should trigger prefetch if isEnabled is true', async () => {
    vi.mocked(Config.get).mockResolvedValue({ isEnabled: true, isGrammarEnabled: true } as any)
    vi.mocked(store.getAllSegments).mockReturnValue([
      { start: 0, end: 1000, text: 'This is a complex sentence that should trigger insights.' }
    ])
    vi.mocked(translatorService.isReady).mockReturnValue(true)
    vi.mocked(grammarExplainer.isReady).mockReturnValue(true)

    // Complex sentence detection mock
    vi.mock('./utils', () => ({
      isComplexSentence: () => true
    }))

    await manager.onTimeUpdate(500)

    expect(translatorService.translate).toHaveBeenCalled()
  })
})
