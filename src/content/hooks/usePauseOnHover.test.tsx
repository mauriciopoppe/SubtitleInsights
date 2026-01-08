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

describe('usePauseOnHover', () => {
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

    // Mock seeking property
    Object.defineProperty(videoEl, 'seeking', {
      get: () => videoEl.hasAttribute('seeking-mock'),
      set: val => (val ? videoEl.setAttribute('seeking-mock', 'true') : videoEl.removeAttribute('seeking-mock')),
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
  })

  afterEach(() => {
    const root = document.getElementById('root')
    if (root) {
      render(null, root)
    }
    vi.restoreAllMocks()
  })

  it('should pause video when hovering near the end of a segment', async () => {
    const activeSegment = { start: 1000, end: 2000, text: 'Test' }
    store.addSegments([activeSegment])

    await act(async () => {
      render(<TestComponent isEnabled />, document.getElementById('root')!)
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const overlayEl = document.getElementById('test-overlay')!

    // Simulate hover
    await act(async () => {
      overlayEl.dispatchEvent(new MouseEvent('mousemove'))
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // Move time to 1800ms (200ms remaining, which is < 300ms)
    await act(() => {
      Object.defineProperty(videoEl, 'currentTime', {
        value: 1.8,
        configurable: true
      })
      videoEl.dispatchEvent(new Event('timeupdate'))
    })

    expect(videoEl.pause).toHaveBeenCalled()
  })

  it('should not pause if not hovering', async () => {
    const activeSegment = { start: 1000, end: 2000, text: 'Test' }
    store.addSegments([activeSegment])

    await act(async () => {
      render(<TestComponent isEnabled />, document.getElementById('root')!)
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // Move time to 1800ms without hover
    await act(() => {
      Object.defineProperty(videoEl, 'currentTime', {
        value: 1.8,
        configurable: true
      })
      videoEl.dispatchEvent(new Event('timeupdate'))
    })

    expect(videoEl.pause).not.toHaveBeenCalled()
  })

  it('should resume playback when mouse leaves overlay after a hover pause', async () => {
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

    // 2. Simulate mouse leave
    await act(() => {
      overlayEl.dispatchEvent(new MouseEvent('mouseleave'))
    })
    expect(videoEl.play).toHaveBeenCalled()
    expect(videoEl.paused).toBe(false)
  })

  it('should not resume if it was already paused before hovering', async () => {
    await act(async () => {
      render(<TestComponent isEnabled />, document.getElementById('root')!)
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const overlayEl = document.getElementById('test-overlay')!

    // Video is already paused
    await act(() => {
      ;(videoEl as any).paused = true
    })

    // Simulate mouse leave
    await act(() => {
      overlayEl.dispatchEvent(new MouseEvent('mouseleave'))
    })
    expect(videoEl.play).not.toHaveBeenCalled()
  })

  it('should not re-pause immediately if the user manually plays the video while hovering', async () => {
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
    expect(videoEl.pause).toHaveBeenCalledTimes(1)
    expect(videoEl.paused).toBe(true)

    // 2. Simulate user clicking "Play" manually
    await act(() => {
      videoEl.play()
      videoEl.dispatchEvent(new Event('play'))
    })
    expect(videoEl.paused).toBe(false)

    // 3. Trigger timeupdate again at the same position
    await act(() => {
      videoEl.dispatchEvent(new Event('timeupdate'))
    })

    // Should NOT pause again for the same segment
    expect(videoEl.pause).toHaveBeenCalledTimes(1)
  })

  it('should still pause at the end if the segment is replayed from the beginning', async () => {
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
    expect(videoEl.pause).toHaveBeenCalledTimes(1)

    // 2. Simulate "Replay" action: seek to start and play
    await act(() => {
      Object.defineProperty(videoEl, 'currentTime', {
        value: 1.0,
        configurable: true
      })
      videoEl.dispatchEvent(new Event('seeking'))
      videoEl.play()
      videoEl.dispatchEvent(new Event('play'))
    })

    // 3. Reach the end of the segment again
    await act(() => {
      Object.defineProperty(videoEl, 'currentTime', {
        value: 1.9,
        configurable: true
      })
      videoEl.dispatchEvent(new Event('timeupdate'))
    })

    // Should pause AGAIN (total 2 times)
    expect(videoEl.pause).toHaveBeenCalledTimes(2)
  })

  it('should reset hover state when overlay becomes invisible', async () => {
    const activeSegment = { start: 1000, end: 2000, text: 'Test' }
    store.addSegments([activeSegment])

    await act(async () => {
      render(<TestComponent isEnabled isOverlayVisible />, document.getElementById('root')!)
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const overlayEl = document.getElementById('test-overlay')!

    // 1. Hover
    await act(async () => {
      overlayEl.dispatchEvent(new MouseEvent('mousemove'))
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // 2. Make overlay invisible
    await act(async () => {
      render(<TestComponent isEnabled isOverlayVisible={false} />, document.getElementById('root')!)
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // 3. Make overlay visible again (mouse is technically not "on" it unless we move it again)
    // In our logic, it should reset isHovering to false.
    await act(async () => {
      render(<TestComponent isEnabled isOverlayVisible />, document.getElementById('root')!)
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // 4. Update time to trigger pause logic
    await act(() => {
      Object.defineProperty(videoEl, 'currentTime', {
        value: 1.8,
        configurable: true
      })
      videoEl.dispatchEvent(new Event('timeupdate'))
    })

    // Should NOT pause because hover state was reset
    expect(videoEl.pause).not.toHaveBeenCalled()
  })

  it('should re-attach listeners when overlay is re-mounted after being disabled', async () => {
    function ReMountComponent({ isEnabled }: { isEnabled: boolean }) {
      const overlayRef = useRef<HTMLDivElement>(null)
      // Pass isVisible=isEnabled to simulate the relationship
      usePauseOnHover(isEnabled, overlayRef, isEnabled)

      if (!isEnabled) return null

      return (
        <div ref={overlayRef} id="remount-overlay">
          Overlay
        </div>
      )
    }

    const activeSegment = { start: 1000, end: 2000, text: 'Test' }
    store.addSegments([activeSegment])

    // 1. Initial Render (Enabled)
    await act(async () => {
      render(<ReMountComponent isEnabled />, document.getElementById('root')!)
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    let overlayEl = document.getElementById('remount-overlay')!
    expect(overlayEl).not.toBeNull()

    // Verify it works
    await act(async () => {
      overlayEl.dispatchEvent(new MouseEvent('mousemove'))
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    await act(() => {
      Object.defineProperty(videoEl, 'currentTime', { value: 1.8, configurable: true })
      videoEl.dispatchEvent(new Event('timeupdate'))
    })
    expect(videoEl.pause).toHaveBeenCalledTimes(1)

    // Reset mocks for next step
    ;(videoEl.pause as any).mockClear()
    ;(videoEl as any).paused = false

    // 2. Disable (Unmount)
    await act(async () => {
      render(<ReMountComponent isEnabled={false} />, document.getElementById('root')!)
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    expect(document.getElementById('remount-overlay')).toBeNull()

    // 3. Re-enable (Re-mount)
    await act(async () => {
      render(<ReMountComponent isEnabled />, document.getElementById('root')!)
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    overlayEl = document.getElementById('remount-overlay')!
    expect(overlayEl).not.toBeNull()

    // Verify it works again
    await act(async () => {
      Object.defineProperty(videoEl, 'currentTime', { value: 0, configurable: true })
      videoEl.dispatchEvent(new Event('timeupdate'))
      overlayEl.dispatchEvent(new MouseEvent('mousemove'))
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    await act(() => {
      Object.defineProperty(videoEl, 'currentTime', { value: 1.8, configurable: true })
      videoEl.dispatchEvent(new Event('timeupdate'))
    })
    expect(videoEl.pause).toHaveBeenCalledTimes(1)
  })
})