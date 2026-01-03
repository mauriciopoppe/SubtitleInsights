import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render } from 'preact'
import { act } from 'preact/test-utils'
import { ExtensionToggle } from './components/ExtensionToggle'
import { Config } from './config'

// Mock Config
vi.mock('./config', () => ({
  Config: {
    get: vi.fn().mockResolvedValue({
      isEnabled: true,
      isOverlayEnabled: true,
      isGrammarEnabled: true,
      isPauseOnHoverEnabled: false,
      isInsightsVisibleInOverlay: true,
      isInsightsVisibleInSidebar: true,
      isTranslationVisibleInOverlay: true,
      isTranslationVisibleInSidebar: true,
      isOriginalVisibleInOverlay: true
    }),
    update: vi.fn().mockResolvedValue(undefined),
    subscribe: vi.fn().mockReturnValue(() => {})
  }
}))

describe('Integration: ExtensionToggle', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="toggle-root"></div>'
    vi.clearAllMocks()
  })

  it('should render with initial enabled state', async () => {
    // Default mock has isEnabled: true
    await act(async () => {
      render(<ExtensionToggle />, document.getElementById('toggle-root')!)
    })

    // Wait for useConfig useEffect to finish
    await act(async () => {
      await Promise.resolve()
    })

    const button = document.querySelector('.si-toggle-btn') as HTMLButtonElement
    expect(button).not.toBeNull()
    expect(button.getAttribute('aria-pressed')).toBe('true')
    expect(button.style.opacity).toBe('1')
  })

  it('should call Config.update when clicked', async () => {
    // Default mock has isEnabled: true
    await act(async () => {
      render(<ExtensionToggle />, document.getElementById('toggle-root')!)
    })

    await act(async () => {
      await Promise.resolve()
    })

    const button = document.querySelector('.si-toggle-btn') as HTMLButtonElement

    await act(async () => {
      button.click()
    })

    // Since initial was true, click should set to false
    expect(Config.update).toHaveBeenCalledWith({ isEnabled: false })
  })

  it('should update appearance when config changes', async () => {
    let changeCallback: (val: any) => void = () => {}
    ;(Config.subscribe as any).mockImplementation((cb: any) => {
      changeCallback = cb
      return () => {}
    })

    await act(async () => {
      render(<ExtensionToggle />, document.getElementById('toggle-root')!)
    })

    await act(async () => {
      await Promise.resolve()
    })

    const button = document.querySelector('.si-toggle-btn') as HTMLButtonElement
    expect(button.getAttribute('aria-pressed')).toBe('true')

    // Simulate external change to disabled
    await act(async () => {
      changeCallback({ isEnabled: false })
    })

    expect(button.getAttribute('aria-pressed')).toBe('false')
    expect(button.style.opacity).toBe('0.4')
  })
})
