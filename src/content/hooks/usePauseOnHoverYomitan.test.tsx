import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from 'preact'
import { useRef } from 'preact/hooks'
import { act } from 'preact/test-utils'
import { usePauseOnHover } from './usePauseOnHover'
import { store } from '../store'
import { videoController } from '../VideoController'

function TestComponent({ isEnabled, isOverlayVisible = true }: { isEnabled: boolean; isOverlayVisible?: boolean }) {
  const overlayRef = useRef<HTMLDivElement>(null)
  usePauseOnHover(isEnabled, overlayRef, isOverlayVisible)
  return (
    <div ref={overlayRef} id="test-overlay" style={{ display: isOverlayVisible ? 'block' : 'none' }}>
      Overlay
    </div>
  )
}

describe('usePauseOnHover Yomitan Awareness', () => {
  let videoEl: HTMLVideoElement

  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>'
    store.clear()
    videoController.reset()

    // Mock video element
    videoEl = document.createElement('video')
    vi.spyOn(document, 'querySelector').mockImplementation(selector => {
      if (selector === 'video') return videoEl
      if (selector === '#test-overlay') return document.getElementById('test-overlay')
      return null
    })

    // Mock paused property
    Object.defineProperty(videoEl, 'paused', {
      get: () => videoEl.hasAttribute('paused-mock'),
      set: val => (val ? videoEl.setAttribute('paused-mock', 'true') : videoEl.removeAttribute('paused-mock')),
      configurable: true
    })

    // Mock play and pause
    videoEl.play = vi.fn().mockImplementation(async () => {
      ;(videoEl as any).paused = false
    })
    videoEl.pause = vi.fn().mockImplementation(() => {
      ;(videoEl as any).paused = true
    })

    // Initial state: playing
    ;(videoEl as any).paused = false

    videoController.setVideo(videoEl)

    // Mock chrome.dom
    vi.stubGlobal('chrome', {
      dom: {
        openOrClosedShadowRoot: vi.fn()
      }
    })
  })

  afterEach(() => {
    const root = document.getElementById('root')
    if (root) {
      render(null, root)
    }
    vi.restoreAllMocks()
  })

  it('should not resume playback if mouse moves from overlay to Yomitan popup', async () => {
    const activeSegment = { start: 1000, end: 2000, text: 'Test' }
    store.addSegments([activeSegment])

    await act(async () => {
      render(<TestComponent isEnabled />, document.getElementById('root')!)
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const overlayEl = document.getElementById('test-overlay')!

    // 1. Simulate hover and pause
    await act(async () => {
      overlayEl.dispatchEvent(new MouseEvent('mousemove'))
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    await act(() => {
      Object.defineProperty(videoEl, 'currentTime', {
        value: 1.8,
        configurable: true
      })
      videoEl.dispatchEvent(new Event('timeupdate'))
    })
    expect(videoEl.pause).toHaveBeenCalled()
    expect(videoEl.paused).toBe(true)

    // 2. Setup Yomitan DOM
    const yomitanHost = document.createElement('div')
    yomitanHost.style.cssText = 'all: initial;'
    document.body.appendChild(yomitanHost)

    const yomitanShadowRoot = document.createElement('div') // Mock shadow root as a div for JSDOM
    const yomitanIframe = document.createElement('iframe')
    yomitanIframe.className = 'yomitan-popup'
    // Mock getBoundingClientRect for the iframe
    vi.spyOn(yomitanIframe, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      left: 100,
      bottom: 200,
      right: 200,
      width: 100,
      height: 100,
      x: 100,
      y: 100,
      toJSON: () => {}
    })
    yomitanShadowRoot.appendChild(yomitanIframe)

    ;(chrome.dom.openOrClosedShadowRoot as any).mockReturnValue(yomitanShadowRoot)
    vi.spyOn(document, 'querySelectorAll').mockImplementation(selector => {
      if (selector === 'div[style*="all: initial"]') {
        return [yomitanHost] as any
      }
      return [] as any
    })

    // 3. Simulate mouse leaving overlay but entering Yomitan popup
    await act(() => {
      // First mousemove on window to simulate moving towards Yomitan
      window.dispatchEvent(new MouseEvent('mousemove', {
        clientX: 150,
        clientY: 150,
        bubbles: true
      }))
      // Then mouseleave on overlay
      overlayEl.dispatchEvent(new MouseEvent('mouseleave', {
        clientX: 150,
        clientY: 150,
        bubbles: true
      }))
    })

    // Should NOT resume playback
    expect(videoEl.play).not.toHaveBeenCalled()
    expect(videoEl.paused).toBe(true)

    // 4. Simulate mouse leaving Yomitan popup
    await act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', {
        clientX: 50,
        clientY: 50
      }))
    })

    // Now it should resume
    expect(videoEl.play).toHaveBeenCalled()
    expect(videoEl.paused).toBe(false)
  })
})
