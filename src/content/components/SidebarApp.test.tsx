import { describe, it, expect, beforeEach, vi, Mock } from 'vitest'
import { render } from 'preact'
import { SidebarApp } from './SidebarApp'
import { useConfig } from '../hooks/useConfig'
import { useSubtitleStore } from '../hooks/useSubtitleStore'

// Mock hooks
vi.mock('../hooks/useSubtitleStore', () => ({
  useSubtitleStore: vi.fn()
}))

vi.mock('../hooks/useConfig', () => ({
  useConfig: vi.fn()
}))

describe('SidebarApp Rendering', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    vi.clearAllMocks()

    // Default mocks
    ;(useSubtitleStore as Mock).mockReturnValue({
      segments: [{ start: 1000, end: 2000, text: 'Test' }],
      isUploadActive: false,
      uploadFilename: undefined
    })
    ;(useConfig as Mock).mockReturnValue({ isEnabled: true, isSidebarEnabled: true })
  })

  it('should render when isEnabled and isSidebarEnabled are true', async () => {
    render(<SidebarApp />, container)
    await new Promise(resolve => setTimeout(resolve, 0))

    const sidebar = container.querySelector('#si-sidebar')
    expect(sidebar).not.toBeNull()
  })

  it('should return null when isEnabled is false', async () => {
    ;(useConfig as Mock).mockReturnValue({ isEnabled: false, isSidebarEnabled: true })

    render(<SidebarApp />, container)
    await new Promise(resolve => setTimeout(resolve, 0))

    const sidebar = container.querySelector('#si-sidebar')
    expect(sidebar).toBeNull()
  })

  it('should return null when isSidebarEnabled is false', async () => {
    ;(useConfig as Mock).mockReturnValue({ isEnabled: true, isSidebarEnabled: false })

    render(<SidebarApp />, container)
    await new Promise(resolve => setTimeout(resolve, 0))

    const sidebar = container.querySelector('#si-sidebar')
    expect(sidebar).toBeNull()
  })

  it('should return null when segments are empty', async () => {
    ;(useSubtitleStore as Mock).mockReturnValue({
      segments: [],
      isUploadActive: false,
      uploadFilename: undefined
    })

    render(<SidebarApp />, container)
    await new Promise(resolve => setTimeout(resolve, 0))

    const sidebar = container.querySelector('#si-sidebar')
    expect(sidebar).toBeNull()
  })
})
