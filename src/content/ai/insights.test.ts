import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AIInsights } from './insights'
import { ProfileManager } from '../profiles' // Import for typing
import { store } from '../store' // Import for typing

vi.mock('../profiles') // Mock the module globally
vi.mock('../store') // Mock the module globally

describe('AIInsights', () => {
  let insights: AIInsights
  let mockRootSession: any
  let mockWorkingSession: any

  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks()

    mockWorkingSession = {
      prompt: vi.fn().mockResolvedValue('Grammar explanation'),
      destroy: vi.fn().mockResolvedValue(undefined)
    }

    mockRootSession = {
      clone: vi.fn().mockResolvedValue(mockWorkingSession),
      destroy: vi.fn().mockResolvedValue(undefined)
    }

    // Mock global LanguageModel using Vitest helper
    vi.stubGlobal('LanguageModel', {
      params: vi.fn().mockResolvedValue({ defaultTopK: 3 }),
      create: vi.fn().mockResolvedValue(mockRootSession),
      availability: vi.fn().mockResolvedValue('available')
    })

    // Default mock for ProfileManager, can be overridden per test
    vi.mocked(ProfileManager.getActiveProfile).mockResolvedValue({
      id: 'mock-id',
      name: 'Mock Profile',
      systemPrompt: 'Mock Prompt',
      sourceLanguage: 'ja',
      targetLanguage: 'en'
    })
    // Default mock for store.setWarning, can be overridden per test
    vi.mocked(store.setWarning).mockClear()

    insights = new AIInsights()
  })

  it('should initialize and create a root session and a working clone', async () => {
    const success = await insights.initialize()
    expect(success).toBe(true)
    expect(insights.isReady()).toBe(true)
    expect(vi.mocked(window.LanguageModel.create)).toHaveBeenCalled()
    expect(vi.mocked(mockRootSession.clone)).toHaveBeenCalled()
  })

  it('should reuse root session but recreate working session on reset', async () => {
    await insights.initialize()
    expect(vi.mocked(window.LanguageModel.create)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(mockRootSession.clone)).toHaveBeenCalledTimes(1)

    const firstWorkingSession = mockWorkingSession
    const secondWorkingSession = { ...mockWorkingSession }
    vi.mocked(mockRootSession.clone).mockResolvedValue(secondWorkingSession)

    await insights.resetSession()

    expect(vi.mocked(window.LanguageModel.create)).toHaveBeenCalledTimes(1) // Still 1
    expect(firstWorkingSession.destroy).toHaveBeenCalled()
    expect(vi.mocked(mockRootSession.clone)).toHaveBeenCalledTimes(2)
    expect(insights.isReady()).toBe(true)
  })

  it('should clear both sessions on destroy', async () => {
    await insights.initialize()
    expect(insights.isReady()).toBe(true)

    await insights.destroy()
    expect(insights.isReady()).toBe(false)
    expect(mockWorkingSession.destroy).toHaveBeenCalled()
    expect(mockRootSession.destroy).toHaveBeenCalled()
  })

  it('should fail to explain if not initialized', async () => {
    await expect(insights.explainGrammar('test')).rejects.toThrow('Language Model session not initialized')
  })

  it('should call prompt on the working session', async () => {
    await insights.initialize()
    const result = await insights.explainGrammar('毎日お茶を飲みます。')

    expect(result).toBe('Grammar explanation')
    expect(mockWorkingSession.prompt).toHaveBeenCalledWith(expect.stringContaining('毎日お茶を飲みます。'))
  })

  it('should surface a warning and fallback source language if not supported in initialize', async () => {
    vi.mocked(ProfileManager.getActiveProfile).mockResolvedValueOnce({
      id: 'mock-id',
      name: 'Mock Profile',
      systemPrompt: 'Mock Prompt',
      sourceLanguage: 'fr', // Unsupported
      targetLanguage: 'en'
    })

    const success = await insights.initialize()
    expect(success).toBe(true)
    expect(store.setWarning).toHaveBeenCalledWith(
      expect.stringContaining('Source language "fr" not supported by Insights. Falling back to "en".')
    )
    expect(vi.mocked(window.LanguageModel.create)).toHaveBeenCalledWith(
      expect.objectContaining({
        expectedInputs: expect.arrayContaining([
          expect.objectContaining({ languages: ['en', 'en'] }) // Target 'en', Fallback source 'en'
        ])
      })
    )
  })

  it('should surface a warning and be unavailable if target language not supported in checkAvailability', async () => {
    vi.mocked(ProfileManager.getActiveProfile).mockResolvedValueOnce({
      id: 'mock-id',
      name: 'Mock Profile',
      systemPrompt: 'Mock Prompt',
      sourceLanguage: 'ja',
      targetLanguage: 'fr' // Unsupported
    })
    vi.mocked(window.LanguageModel.availability).mockResolvedValueOnce('unavailable')

    const availability = await insights.checkAvailability()
    expect(availability).toBe('unavailable')
    expect(store.setWarning).toHaveBeenCalledWith(
      expect.stringContaining('Target language "fr" not supported by Insights. Only en, ja, es are supported.')
    )
  })

  it('should surface a warning and fallback source language in checkAvailability', async () => {
    vi.mocked(ProfileManager.getActiveProfile).mockResolvedValueOnce({
      id: 'mock-id',
      name: 'Mock Profile',
      systemPrompt: 'Mock Prompt',
      sourceLanguage: 'fr', // Unsupported
      targetLanguage: 'en'
    })
    vi.mocked(window.LanguageModel.availability).mockResolvedValueOnce('available') // Assuming model can still become available with fallback

    const availability = await insights.checkAvailability()
    expect(availability).toBe('available')
    expect(store.setWarning).toHaveBeenCalledWith(
      expect.stringContaining('Source language "fr" not supported by Insights. Falling back to "en" for analysis.')
    )
    expect(vi.mocked(window.LanguageModel.availability)).toHaveBeenCalledWith(
      expect.objectContaining({
        expectedInputs: [
          {
            type: 'text',
            languages: ['en', 'en'] // Target 'en', Fallback source 'en'
          }
        ]
      })
    )
  })
})
