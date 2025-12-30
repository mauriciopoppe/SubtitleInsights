import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { ExtensionToggle } from './components/ExtensionToggle';
import { Config } from './config';

// Mock Config
vi.mock('./config', () => ({
  Config: {
    getIsEnabled: vi.fn().mockResolvedValue(true),
    getIsOverlayEnabled: vi.fn().mockResolvedValue(true),
    getIsGrammarExplainerEnabled: vi.fn().mockResolvedValue(true),
    getTargetJLPTLevel: vi.fn().mockResolvedValue('N5'),
    setIsEnabled: vi.fn().mockResolvedValue(undefined),
    addChangeListener: vi.fn(),
    addOverlayChangeListener: vi.fn(),
    addGrammarExplainerChangeListener: vi.fn(),
    addJLPTLevelChangeListener: vi.fn(),
  },
}));

describe('Integration: ExtensionToggle', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="toggle-root"></div>';
    vi.clearAllMocks();
  });

  it('should render with initial enabled state', async () => {
    // Initial mock value is true
    (Config.getIsEnabled as any).mockResolvedValue(true);

    await act(async () => {
      render(<ExtensionToggle />, document.getElementById('toggle-root')!);
    });

    // Wait for useConfig useEffect to finish
    await act(async () => {
      await Promise.resolve(); 
    });

    const button = document.querySelector('.lle-toggle-btn') as HTMLButtonElement;
    expect(button).not.toBeNull();
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.style.opacity).toBe('1');
  });

  it('should call Config.setIsEnabled when clicked', async () => {
    (Config.getIsEnabled as any).mockResolvedValue(true);

    await act(async () => {
      render(<ExtensionToggle />, document.getElementById('toggle-root')!);
    });

    // Wait for load
    await act(async () => { await Promise.resolve(); });

    const button = document.querySelector('.lle-toggle-btn') as HTMLButtonElement;
    
    await act(async () => {
      button.click();
    });

    // Since initial was true, click should set to false
    expect(Config.setIsEnabled).toHaveBeenCalledWith(false);
  });

  it('should update appearance when config changes', async () => {
    // Start enabled
    (Config.getIsEnabled as any).mockResolvedValue(true);
    
    let changeCallback: (val: boolean) => void = () => {};
    (Config.addChangeListener as any).mockImplementation((cb: any) => {
      changeCallback = cb;
    });

    await act(async () => {
      render(<ExtensionToggle />, document.getElementById('toggle-root')!);
    });

    await act(async () => { await Promise.resolve(); });

    const button = document.querySelector('.lle-toggle-btn') as HTMLButtonElement;
    expect(button.getAttribute('aria-pressed')).toBe('true');

    // Simulate external change to disabled
    await act(async () => {
      changeCallback(false);
    });

    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.style.opacity).toBe('0.4');
  });
});
