import { describe, it, expect, beforeEach, vi } from 'vitest';
import { store, SubtitleStore } from './store';
import { Sidebar } from './sidebar';

// Mock Config to avoid async calls issues or dependency on storage
vi.mock('./config', () => ({
  Config: {
    getIsEnabled: vi.fn().mockResolvedValue(true),
    getIsOverlayEnabled: vi.fn().mockResolvedValue(true),
    getIsGrammarExplainerEnabled: vi.fn().mockResolvedValue(true),
    addChangeListener: vi.fn(),
    addOverlayChangeListener: vi.fn(),
    addGrammarExplainerChangeListener: vi.fn(),
  },
}));

describe('Integration: Background Message -> Sidebar Render', () => {
  let sidebar: Sidebar;

  beforeEach(() => {
    // Reset store
    store.clear();
    
    // Setup Sidebar
    sidebar = new Sidebar();
    
    // Bind Store to Sidebar (mimicking index.ts logic)
    store.addChangeListener(() => {
      sidebar.render(store.getAllSegments());
    });
  });

  it('should render segments in the sidebar when "LLE_SUBTITLES_CAPTURED" payload is processed', async () => {
    // 1. Simulate the data payload from the background script
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

    // 2. Simulate the logic inside chrome.runtime.onMessage listener
    const segments = SubtitleStore.parseYouTubeJSON(mockPayload);
    store.addSegments(segments);

    // 3. Verify Sidebar DOM
    const sidebarEl = sidebar.getElement();
    const items = sidebarEl.querySelectorAll('.lle-sidebar-item');

    expect(items.length).toBe(2);
    
    const firstItem = items[0] as HTMLElement;
    expect(firstItem.dataset.start).toBe('1000');
    expect(firstItem.querySelector('.lle-sidebar-original')?.textContent).toBe('Hello');

    const secondItem = items[1] as HTMLElement;
    expect(secondItem.dataset.start).toBe('3500');
    expect(secondItem.querySelector('.lle-sidebar-original')?.textContent).toBe('World');
  });
});
