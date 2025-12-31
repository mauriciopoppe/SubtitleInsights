import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from 'preact';
import { store, SubtitleStore } from './store';
import { SidebarApp } from './components/SidebarApp';

// Mock Config to avoid async calls issues or dependency on storage
vi.mock('./config', () => ({
  Config: {
    getIsEnabled: vi.fn().mockResolvedValue(true),
    getIsOverlayEnabled: vi.fn().mockResolvedValue(true),
    getIsGrammarExplainerEnabled: vi.fn().mockResolvedValue(true),
    getIsPauseOnHoverEnabled: vi.fn().mockResolvedValue(false),
    getIsInsightsVisibleInOverlay: vi.fn().mockResolvedValue(true),
    getIsInsightsVisibleInSidebar: vi.fn().mockResolvedValue(true),
    getIsTranslationVisibleInOverlay: vi.fn().mockResolvedValue(true),
    getIsTranslationVisibleInSidebar: vi.fn().mockResolvedValue(true),
    getIsOriginalVisibleInOverlay: vi.fn().mockResolvedValue(true),
    addChangeListener: vi.fn(),
    addOverlayChangeListener: vi.fn(),
    addGrammarExplainerChangeListener: vi.fn(),
    addPauseOnHoverChangeListener: vi.fn(),
    addInsightsInOverlayChangeListener: vi.fn(),
    addInsightsInSidebarChangeListener: vi.fn(),
    addTranslationInOverlayChangeListener: vi.fn(),
    addTranslationInSidebarChangeListener: vi.fn(),
    addOriginalInOverlayChangeListener: vi.fn(),
  },
}));

describe('Integration: Background Message -> Sidebar Render', () => {
  beforeEach(() => {
    // Reset store
    store.clear();
    
    // Clear DOM
    document.body.innerHTML = '<div id="test-root"></div>';
    
    // Mock video element for SidebarApp useEffect
    const video = document.createElement('video');
    document.body.appendChild(video);
  });

  it('should render segments in the sidebar when "SI_SUBTITLES_CAPTURED" payload is processed', async () => {
    // 1. Mount SidebarApp
    render(<SidebarApp />, document.getElementById('test-root')!);

    // 2. Simulate the data payload from the background script
    const mockPayload = {
      events: [
        {
          tStartMs: 1000,
          dDurationMs: 2000,
          segs: [{ utf8: 'Hello' }],
        },
        {
          tStartMs: 3500,
          dDurationMs: 1500,
          segs: [{ utf8: 'World' }],
        },
      ],
    };

    // 3. Simulate the logic inside chrome.runtime.onMessage listener
    const segments = SubtitleStore.parseYouTubeJSON(mockPayload);
    store.replaceSegments(segments);

    // Wait for Preact to render
    await new Promise((resolve) => setTimeout(resolve, 50));
    
    // 4. Verify Sidebar DOM
    const items = document.querySelectorAll('.si-sidebar-item');

    expect(items.length).toBe(2);
    
    const firstItem = items[0] as HTMLElement;
    expect(firstItem.dataset.start).toBe('1000');
    expect(firstItem.querySelector('.si-sidebar-original')?.textContent).toBe('Hello');

    const secondItem = items[1] as HTMLElement;
    expect(secondItem.dataset.start).toBe('3500');
    expect(secondItem.querySelector('.si-sidebar-original')?.textContent).toBe('World');
  });
});
