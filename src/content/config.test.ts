import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Config } from './config'

describe('Config', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock chrome.storage.local
    vi.stubGlobal('chrome', {
      storage: {
        local: {
          get: vi.fn(),
          set: vi.fn(),
        },
        onChanged: {
          addListener: vi.fn(),
        },
      },
    })
  })

  it('should return default values when storage is empty', async () => {
    const mockGet = vi.mocked(chrome.storage.local.get)
    mockGet.mockImplementation((_keys, callback) => {
      callback({})
    })

    const config = await Config.get()
    expect(config.overlayFontSize).toBe(24)
    expect(config.isEnabled).toBe(true)
  })

  it('should return values from storage', async () => {
    const mockGet = vi.mocked(chrome.storage.local.get)
    mockGet.mockImplementation((_keys, callback) => {
      callback({
        si_overlay_font_size: 32,
        si_is_enabled: false
      })
    })

    const config = await Config.get()
    expect(config.overlayFontSize).toBe(32)
    expect(config.isEnabled).toBe(false)
  })

  it('should update storage with partial config', async () => {
    const mockSet = vi.mocked(chrome.storage.local.set)
    mockSet.mockImplementation((_data, callback) => {
      callback()
    })

    await Config.update({ overlayFontSize: 36 })

    expect(mockSet).toHaveBeenCalledWith(
      { si_overlay_font_size: 36 },
      expect.any(Function)
    )
  })
})
