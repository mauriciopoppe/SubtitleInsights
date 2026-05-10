import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AIManager } from './manager'
import { Config } from '../config'

// Mock dependencies that are still global (like Config)
vi.mock('../config', () => ({
  Config: {
    get: vi.fn()
  }
}))

describe('AIManager', () => {
  let manager: AIManager
  let mockTranslator: any
  let mockInsights: any
  let mockFurigana: any
  let mockStore: any
  let mockVideoController: any

  beforeEach(() => {
    vi.clearAllMocks()

    mockTranslator = {
      checkAvailability: vi.fn().mockResolvedValue('available'),
      initialize: vi.fn().mockResolvedValue(true),
      isReady: vi.fn().mockReturnValue(true),
      translate: vi.fn().mockResolvedValue('translation'),
      destroy: vi.fn().mockResolvedValue(undefined)
    }

    mockInsights = {
      checkAvailability: vi.fn().mockResolvedValue('available'),
      initialize: vi.fn().mockResolvedValue(true),
      isReady: vi.fn().mockReturnValue(true),
      explainGrammar: vi.fn().mockResolvedValue('explanation'),
      resetSession: vi.fn().mockResolvedValue(undefined),
      destroy: vi.fn().mockResolvedValue(undefined)
    }

    mockFurigana = {
      checkAvailability: vi.fn().mockResolvedValue('available'),
      initialize: vi.fn().mockResolvedValue(true),
      isReady: vi.fn().mockReturnValue(true),
      generateFurigana: vi.fn().mockResolvedValue([]),
      resetSession: vi.fn().mockResolvedValue(undefined),
      destroy: vi.fn().mockResolvedValue(undefined)
    }

    mockStore = {
      getAllSegments: vi.fn(),
      setAIStatus: vi.fn(),
      setSystemMessage: vi.fn(),
      updateSegmentTranslation: vi.fn(),
      updateSegmentInsights: vi.fn(),
      addChangeListener: vi.fn(),
      sourceLanguage: 'en'
    }

    mockVideoController = {
      targetSegmentIndex: {
        subscribe: vi.fn()
      }
    }

    manager = new AIManager(
      mockTranslator,
      mockInsights,
      mockFurigana,
      mockStore,
      mockVideoController
    )
  })

  it('should perform a hard reset on reset()', async () => {
    mockTranslator.checkAvailability.mockResolvedValue('available')
    mockInsights.checkAvailability.mockResolvedValue('available')
    mockFurigana.checkAvailability.mockResolvedValue('available')

    await manager.reset()

    expect(mockInsights.destroy).toHaveBeenCalled()
    expect(mockTranslator.destroy).toHaveBeenCalled()
    expect(mockFurigana.destroy).toHaveBeenCalled()
    
    expect(mockInsights.initialize).toHaveBeenCalled()
    expect(mockTranslator.initialize).toHaveBeenCalled()
    expect(mockFurigana.initialize).toHaveBeenCalled()
  })

  it('should not trigger prefetch if isEnabled is false', async () => {
    vi.mocked(Config.get).mockResolvedValue({ isEnabled: false } as any)
    mockStore.getAllSegments.mockReturnValue([{ start: 0, end: 1000, text: 'Hello' }])
    mockTranslator.isReady.mockReturnValue(true)

    // Using private method for testing or we could trigger the signal
    await (manager as any).handleSegmentChange(0)

    expect(mockTranslator.translate).not.toHaveBeenCalled()
  })

  it('should trigger prefetch if isEnabled is true', async () => {
    vi.mocked(Config.get).mockResolvedValue({ isEnabled: true, isGrammarEnabled: true } as any)
    mockStore.getAllSegments.mockReturnValue([
      { start: 0, end: 1000, text: 'This is a complex sentence that should trigger insights.' }
    ])
    mockTranslator.isReady.mockReturnValue(true)
    mockInsights.isReady.mockReturnValue(true)

    // Complex sentence detection mock
    vi.mock('./utils', () => ({
      isComplexSentence: () => true
    }))

    await (manager as any).handleSegmentChange(0)

    expect(mockTranslator.translate).toHaveBeenCalled()
  })
})
