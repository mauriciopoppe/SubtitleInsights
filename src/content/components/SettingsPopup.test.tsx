import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from 'preact'
import { act } from 'preact/test-utils'
import { SettingsPopup } from './SettingsPopup'
import { Config } from '../config'

// Mock Config
vi.mock('../config', () => ({
  Config: {
    get: vi.fn().mockResolvedValue({
      isEnabled: true,
      isOverlayEnabled: true,
      isSidebarEnabled: false,
      isGrammarEnabled: true,
      isPauseOnHoverEnabled: false
    }),
    update: vi.fn().mockResolvedValue(undefined),
    subscribe: vi.fn().mockReturnValue(() => {})
  }
}))

describe('SettingsPopup', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>'
    vi.clearAllMocks()
  })

  it('should render "Extension Enabled" toggle at the correct position', async () => {
    await act(async () => {
      render(
        <SettingsPopup isOpen onClose={() => {}} triggerRef={{ current: null }} />,
        document.getElementById('root')!
      )
    })

    // Wait for Config.get() to resolve and state to update
    await act(async () => {
      await Promise.resolve()
    })

    const items = document.querySelectorAll('.si-settings-popup-item')
    expect(items.length).toBeGreaterThan(0)

    // Check if the item at index 0 is the Extension Enabled toggle
    // 0: Extension Enabled, 1: Upload, 2: Detailed Settings, 3: Overlay, 4: Sidebar
    const extensionEnabledItem = items[0]
    expect(extensionEnabledItem.textContent).toContain('Extension Enabled')
    expect(extensionEnabledItem.classList.contains('toggle')).toBe(true)
  })

  it('should call Config.update when Extension Enabled toggle is clicked', async () => {
    await act(async () => {
      render(
        <SettingsPopup isOpen onClose={() => {}} triggerRef={{ current: null }} />,
        document.getElementById('root')!
      )
    })

    await act(async () => {
      await Promise.resolve()
    })

    const items = document.querySelectorAll('.si-settings-popup-item')
    const masterToggle = items[0] as HTMLElement

    await act(async () => {
      masterToggle.click()
    })

    expect(Config.update).toHaveBeenCalledWith({ isEnabled: false })
  })

  it('should disable all other items when Extension Enabled is off', async () => {
    vi.mocked(Config.get).mockResolvedValue({
      isEnabled: false,
      isOverlayEnabled: true,
      isSidebarEnabled: false,
      isGrammarEnabled: true,
      isPauseOnHoverEnabled: false
    } as any)

    await act(async () => {
      render(
        <SettingsPopup isOpen onClose={() => {}} triggerRef={{ current: null }} />,
        document.getElementById('root')!
      )
    })

    await act(async () => {
      await Promise.resolve()
    })

    const items = document.querySelectorAll('.si-settings-popup-item')
    console.log('Items found:', items.length)
    items.forEach((item, i) => {
      console.log(`Item ${i} (${item.textContent}): classList = ${Array.from(item.classList).join(' ')}`)
    })

    expect(items.length).toBe(4)
    expect(items[1].classList.contains('si-item-disabled')).toBe(true)
    expect(items[2].classList.contains('si-item-disabled')).toBe(true)
    expect(items[3].classList.contains('si-item-disabled')).toBe(true)
  })
})
