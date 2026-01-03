import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render } from 'preact'
import { act } from 'preact/test-utils'
import { store } from './store'
import { OverlayApp } from './components/OverlayApp'
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

describe('Integration: Overlay Rendering', () => {
  let videoEl: HTMLVideoElement

  beforeEach(async () => {
    // Reset store
    store.clear()

    // Clear DOM
    document.body.innerHTML = '<div id="overlay-root"></div>'

    // Create mock video element
    videoEl = document.createElement('video')
    document.body.appendChild(videoEl)
  })

  it('should display the correct segment based on video time', async () => {
    // 1. Mount OverlayApp
    await act(async () => {
      render(<OverlayApp />, document.getElementById('overlay-root')!)
    })

    // 2. Add segments to store
    await act(async () => {
      store.replaceSegments([
        { start: 1000, end: 3000, text: 'First Segment' },
        { start: 4000, end: 6000, text: 'Second Segment' }
      ])
    })

    // 3. Move video time to first segment
    await act(async () => {
      // Manually set currentTime using Object.defineProperty to bypass JSDOM limitations
      Object.defineProperty(videoEl, 'currentTime', {
        value: 1.5,
        configurable: true
      })
      videoEl.dispatchEvent(new Event('timeupdate'))
    })

    // 4. Verify Overlay
    const original = document.querySelector('.si-original')
    expect(original).not.toBeNull()
    expect(original?.textContent).toBe('First Segment')

    // 5. Move video time to second segment
    await act(async () => {
      Object.defineProperty(videoEl, 'currentTime', {
        value: 5,
        configurable: true
      })
      videoEl.dispatchEvent(new Event('timeupdate'))
    })

    expect(document.querySelector('.si-original')?.textContent).toBe('Second Segment')

    // 6. Move to gap
    await act(async () => {
      Object.defineProperty(videoEl, 'currentTime', {
        value: 3.5,
        configurable: true
      })
      videoEl.dispatchEvent(new Event('timeupdate'))
    })

    expect(document.querySelector('#si-overlay')).toBeNull()
  })

  it('should display system messages when set', async () => {
    await act(async () => {
      render(<OverlayApp />, document.getElementById('overlay-root')!)
    })

    // Set system message via store
    await act(async () => {
      store.setSystemMessage('Loading AI...')
    })

    const systemMsg = document.querySelector('.si-system-message')
    expect(systemMsg).not.toBeNull()
    expect(systemMsg?.textContent).toBe('Loading AI...')

    // Check that it hides when cleared
    await act(async () => {
      store.setSystemMessage(null)
    })
    expect(document.querySelector('.si-system-message')).toBeNull()
  })

  it('should toggle pause on hover when the icon is clicked', async () => {
    await act(async () => {
      render(<OverlayApp />, document.getElementById('overlay-root')!)
    })

    // Add a segment to make the overlay visible
    await act(async () => {
      store.replaceSegments([{ start: 1000, end: 3000, text: 'Test' }])
      Object.defineProperty(videoEl, 'currentTime', {
        value: 1.5,
        configurable: true
      })
      videoEl.dispatchEvent(new Event('timeupdate'))
    })

    const toggleBtn = document.querySelector('.si-overlay-toggle-pause')
    expect(toggleBtn).not.toBeNull()

    await act(async () => {
      toggleBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(Config.update).toHaveBeenCalledWith({ isPauseOnHoverEnabled: true })
  })

  it('should scroll the sidebar to the active segment when the scroll icon is clicked', async () => {
    await act(async () => {
      render(<OverlayApp />, document.getElementById('overlay-root')!)
    })

    // Add a segment to make the overlay visible
    await act(async () => {
      store.replaceSegments([{ start: 1000, end: 3000, text: 'Test' }])
      Object.defineProperty(videoEl, 'currentTime', {
        value: 1.5,
        configurable: true
      })
      videoEl.dispatchEvent(new Event('timeupdate'))
    })

    // Mock an active sidebar item
    const mockSidebarItem = document.createElement('div')
    mockSidebarItem.className = 'si-sidebar-item active'
    mockSidebarItem.scrollIntoView = vi.fn()
    document.body.appendChild(mockSidebarItem)

    const scrollBtn = document.querySelector('.si-overlay-scroll-sidebar')
    expect(scrollBtn).not.toBeNull()

    await act(async () => {
      scrollBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(mockSidebarItem.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center'
    })

    // Cleanup
    document.body.removeChild(mockSidebarItem)
  })

  it('should replay the active segment when the replay icon is clicked', async () => {
    await act(async () => {
      render(<OverlayApp />, document.getElementById('overlay-root')!)
    })

    // Add a segment to make the overlay visible
    await act(async () => {
      store.replaceSegments([{ start: 1000, end: 3000, text: 'Test' }])
      Object.defineProperty(videoEl, 'currentTime', {
        value: 1.5,
        configurable: true,
        writable: true
      })
      videoEl.play = vi.fn().mockResolvedValue(undefined)
      videoEl.dispatchEvent(new Event('timeupdate'))
    })

    const replayBtn = document.querySelector('.si-overlay-replay-segment')
    expect(replayBtn).not.toBeNull()

    await act(async () => {
      replayBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(videoEl.currentTime).toBe(1) // 1000ms / 1000 = 1s
    expect(videoEl.play).toHaveBeenCalled()
  })

  it('should show controls only when hovering the top-left proximity zone', async () => {
    await act(async () => {
      render(<OverlayApp />, document.getElementById('overlay-root')!)
    })

    // Add a segment to make the overlay visible
    await act(async () => {
      store.replaceSegments([{ start: 1000, end: 3000, text: 'Test' }])
      Object.defineProperty(videoEl, 'currentTime', {
        value: 1.5,
        configurable: true
      })
      videoEl.dispatchEvent(new Event('timeupdate'))
    })

    const overlay = document.getElementById('si-overlay')
    const controls = document.querySelector('.si-overlay-controls')
    expect(overlay).not.toBeNull()
    expect(controls).not.toBeNull()
    expect(controls?.classList.contains('visible')).toBe(false)

    // Mock getBoundingClientRect for coordinate calculations
    vi.spyOn(overlay!, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      top: 100,
      width: 500,
      height: 100,
      bottom: 200,
      right: 600,
      x: 100,
      y: 100,
      toJSON: () => {}
    })

    // Move mouse INTO zone (relative x=10, y=10) -> Absolute 110, 110
    await act(async () => {
      overlay?.dispatchEvent(
        new MouseEvent('mousemove', {
          clientX: 110,
          clientY: 110,
          bubbles: true
        })
      )
    })
    expect(controls?.classList.contains('visible')).toBe(true)

    // Move mouse OUT of zone (relative x=200, y=10) -> Absolute 300, 110
    await act(async () => {
      overlay?.dispatchEvent(
        new MouseEvent('mousemove', {
          clientX: 300,
          clientY: 110,
          bubbles: true
        })
      )
    })
    expect(controls?.classList.contains('visible')).toBe(false)
  })
})
