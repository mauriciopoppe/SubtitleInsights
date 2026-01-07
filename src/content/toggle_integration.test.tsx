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

// Mock useSubtitleStore to avoid issues with SyncExternalStore in tests
vi.mock('./hooks/useSubtitleStore', () => ({
  useSubtitleStore: () => ({
    aiStatus: { status: 'ready' },
    warning: undefined,
    isUploadActive: false,
    uploadFilename: undefined,
    segments: [],
    systemMessage: undefined
  })
}))

describe('Integration: ExtensionToggle', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="toggle-root"></div>'
    vi.clearAllMocks()
  })

  it('should render with initial state and closed popup', async () => {
    await act(async () => {
      render(<ExtensionToggle />, document.getElementById('toggle-root')!)
    })

    await act(async () => {
      await Promise.resolve()
    })

    const button = document.querySelector('.si-toggle-btn') as HTMLButtonElement
    expect(button).not.toBeNull()
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(document.querySelector('.si-settings-popup')).toBeNull()
  })

  it('should toggle popup when clicked', async () => {
    await act(async () => {
      render(<ExtensionToggle />, document.getElementById('toggle-root')!)
    })

    await act(async () => {
      await Promise.resolve()
    })

    const button = document.querySelector('.si-toggle-btn') as HTMLButtonElement

    // Open popup
    await act(async () => {
      button.click()
    })

    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(document.querySelector('.si-settings-popup')).not.toBeNull()

    // Close popup
    await act(async () => {
      button.click()
    })

    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(document.querySelector('.si-settings-popup')).toBeNull()
  })

  it('should navigate to sub-menu and call Config.update when a sub-item is clicked', async () => {
    await act(async () => {
      render(<ExtensionToggle />, document.getElementById('toggle-root')!)
    })

    await act(async () => {
      await Promise.resolve()
    })

    const button = document.querySelector('.si-toggle-btn') as HTMLButtonElement

    // Open popup
    await act(async () => {
      button.click()
    })

    // Find "Overlay" navigation link
    const items = document.querySelectorAll('.si-settings-popup-item.link')
    const overlayLink = Array.from(items).find(item => item.textContent?.includes('Overlay')) as HTMLElement
    expect(overlayLink).not.toBeNull()

    // Navigate to Overlay sub-menu
    await act(async () => {
      overlayLink.click()
    })

    // Sub-menu should show "Back" button and specific toggles
    expect(document.querySelector('.si-settings-popup-item.back')).not.toBeNull()

    // Find "Show Original" toggle in sub-menu
    const toggles = document.querySelectorAll('.si-settings-popup-item.toggle')
    const originalToggle = Array.from(toggles).find(item => item.textContent?.includes('Show Original')) as HTMLElement
    expect(originalToggle).not.toBeNull()

    await act(async () => {
      originalToggle.click()
    })

    // It should call Config.update with the opposite of initial (which was true)
    expect(Config.update).toHaveBeenCalledWith({
      isOriginalVisibleInOverlay: false
    })
  })

  it('should apply grayed out style when disabled', async () => {
    vi.mocked(Config.get).mockResolvedValue({
      isEnabled: false
    } as any)

    await act(async () => {
      render(<ExtensionToggle />, document.getElementById('toggle-root')!)
    })

    await act(async () => {
      await Promise.resolve()
    })

    const button = document.querySelector('.si-toggle-btn') as HTMLButtonElement
    expect(button.style.opacity).toBe('0.7')
  })
})
