import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock chrome APIs
const mockSendMessage = vi.fn()
vi.stubGlobal('chrome', {
  webRequest: {
    onCompleted: {
      addListener: vi.fn()
    }
  },
  tabs: {
    sendMessage: mockSendMessage
  },
  runtime: {
    onMessage: { addListener: vi.fn() },
    openOptionsPage: vi.fn(),
    lastError: null
  },
  action: {
    onClicked: { addListener: vi.fn() }
  },
  commands: {
    onCommand: { addListener: vi.fn() }
  },
  storage: {
    sync: {
      get: vi.fn().mockImplementation((_keys, cb) => cb({})),
      set: vi.fn().mockImplementation((_data, cb) => cb?.())
    },
    onChanged: { addListener: vi.fn() }
  }
})

// Mock global fetch
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('Background Script', () => {
  let requestListener: (details: any) => Promise<void>

  beforeEach(async () => {
    vi.clearAllMocks()
    // Reset the module to ensure fresh listener registration
    vi.resetModules()
    await import('./index')
    
    // Capture the listener registered in index.ts
    const addListenerMock = vi.mocked(chrome.webRequest.onCompleted.addListener)
    requestListener = addListenerMock.mock.calls[0][0] as (details: any) => Promise<void>
  })

  it('should prioritize tlang over lang when detecting subtitle language', async () => {
    const youtubeUrl = 'https://www.youtube.com/api/timedtext?v=xuMcuD2aMCA&lang=en&kind=asr&tlang=fr&fmt=json3'
    const mockPayload = { events: [] }

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockPayload)
    })

    await requestListener({
      url: youtubeUrl,
      tabId: 123
    })

    // Verify fetch was called with ignore param
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('si_ignore=true'))
    
    // Verify message sent to tab contains the CORRECT language (fr, not en)
    expect(mockSendMessage).toHaveBeenCalledWith(
      123,
      expect.objectContaining({
        type: 'SI_SUBTITLES_CAPTURED',
        language: 'fr',
        videoId: 'xuMcuD2aMCA',
        payload: mockPayload
      }),
      expect.any(Function)
    )
  })

  it('should fallback to lang if tlang is missing', async () => {
    const youtubeUrl = 'https://www.youtube.com/api/timedtext?v=abc123&lang=ja&fmt=json3'
    const mockPayload = { events: [] }

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockPayload)
    })

    await requestListener({
      url: youtubeUrl,
      tabId: 456
    })

    expect(mockSendMessage).toHaveBeenCalledWith(
      456,
      expect.objectContaining({
        language: 'ja',
        videoId: 'abc123'
      }),
      expect.any(Function)
    )
  })

  it('should ignore requests with si_ignore parameter to avoid loops', async () => {
    const ignoreUrl = 'https://www.youtube.com/api/timedtext?v=test&si_ignore=true'
    
    await requestListener({
      url: ignoreUrl,
      tabId: 123
    })

    expect(mockFetch).not.toHaveBeenCalled()
    expect(mockSendMessage).not.toHaveBeenCalled()
  })
})
