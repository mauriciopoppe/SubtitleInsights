import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from 'preact'
import { SidebarItem } from './SidebarItem'
import { signal } from '@preact/signals'

// Mock VideoController
vi.mock('../VideoController', () => ({
  videoController: {
    activeSegmentIndex: signal(-1)
  }
}))

// Mock useProximity to always return true for controls visibility
vi.mock('../hooks/useProximity', () => ({
  useProximity: () => true
}))

// Mock Config
vi.mock('../hooks/useConfig', () => ({
  useConfig: () => ({
    isEnabled: true,
    isTranslationVisibleInSidebar: true,
    isInsightsVisibleInSidebar: true
  })
}))

describe('SidebarItem', () => {
  let videoEl: HTMLVideoElement
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    videoEl = document.createElement('video')
    document.body.appendChild(videoEl)

    // Mock video methods
    videoEl.play = vi.fn().mockResolvedValue(undefined)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should render the Jump to Segment button', () => {
    const segment = { start: 5000, end: 7000, text: 'Test Segment' }

    render(<SidebarItem segment={segment} index={0} />, container)

    const controls = container.querySelector('.si-sidebar-item-controls')
    expect(controls).not.toBeNull()

    const jumpBtn = controls?.querySelector('button[title="Jump to segment"]')
    expect(jumpBtn).not.toBeNull()
  })

  it('should seek video to start time and play when Jump button is clicked', () => {
    const segment = { start: 5000, end: 7000, text: 'Test Segment' }

    render(<SidebarItem segment={segment} index={0} />, container)

    const jumpBtn = container.querySelector('button[title="Jump to segment"]') as HTMLButtonElement
    expect(jumpBtn).not.toBeNull()

    // Ensure video is "paused" initially
    Object.defineProperty(videoEl, 'paused', { value: true, writable: true })

    // Click button
    jumpBtn.click()

    expect(videoEl.currentTime).toBe(5) // 5000ms / 1000
    expect(videoEl.play).toHaveBeenCalled()
  })
})
