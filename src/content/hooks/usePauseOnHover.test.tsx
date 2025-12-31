import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from 'preact';
import { useRef } from 'preact/hooks';
import { act } from 'preact/test-utils';
import { usePauseOnHover } from './usePauseOnHover';
import { store } from '../store';

function TestComponent({ isEnabled, isOverlayVisible = true }: { isEnabled: boolean, isOverlayVisible?: boolean }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  usePauseOnHover(isEnabled, overlayRef, isOverlayVisible);
  return isOverlayVisible ? <div ref={overlayRef} id="test-overlay">Overlay</div> : null;
}

describe('usePauseOnHover', () => {
  let videoEl: HTMLVideoElement;

  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
    
    // Mock video element
    videoEl = document.createElement('video');
    vi.spyOn(document, 'querySelector').mockImplementation((selector) => {
      if (selector === 'video') return videoEl;
      if (selector === '#test-overlay') return document.getElementById('test-overlay');
      return null;
    });

    // Mock paused property
    Object.defineProperty(videoEl, 'paused', {
      get: () => videoEl.hasAttribute('paused-mock'),
      set: (val) => val ? videoEl.setAttribute('paused-mock', 'true') : videoEl.removeAttribute('paused-mock'),
      configurable: true
    });

    // Mock play and pause
    videoEl.play = vi.fn().mockImplementation(async () => {
      (videoEl as any).paused = false;
    });
    videoEl.pause = vi.fn().mockImplementation(() => {
      (videoEl as any).paused = true;
    });
    
    // Initial state: playing
    (videoEl as any).paused = false;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should pause video when hovering near the end of a segment', async () => {
    const activeSegment = { start: 1000, end: 2000, text: 'Test' };
    vi.spyOn(store, 'getSegmentAt').mockReturnValue(activeSegment);

    await act(() => {
      render(<TestComponent isEnabled={true} />, document.getElementById('root')!);
    });

    const overlayEl = document.getElementById('test-overlay')!;

    // Simulate hover
    await act(() => {
      overlayEl.dispatchEvent(new MouseEvent('mousemove'));
    });

    // Move time to 1800ms (200ms remaining, which is < 300ms)
    await act(() => {
      Object.defineProperty(videoEl, 'currentTime', { value: 1.8, configurable: true });
      videoEl.dispatchEvent(new Event('timeupdate'));
    });

    expect(videoEl.pause).toHaveBeenCalled();
  });

  it('should not pause if not hovering', async () => {
    const activeSegment = { start: 1000, end: 2000, text: 'Test' };
    vi.spyOn(store, 'getSegmentAt').mockReturnValue(activeSegment);

    await act(() => {
      render(<TestComponent isEnabled={true} />, document.getElementById('root')!);
    });

    // Move time to 1800ms without hover
    await act(() => {
      Object.defineProperty(videoEl, 'currentTime', { value: 1.8, configurable: true });
      videoEl.dispatchEvent(new Event('timeupdate'));
    });

    expect(videoEl.pause).not.toHaveBeenCalled();
  });

  it('should resume playback when mouse leaves overlay after a hover pause', async () => {
    const activeSegment = { start: 1000, end: 2000, text: 'Test' };
    vi.spyOn(store, 'getSegmentAt').mockReturnValue(activeSegment);

    await act(() => {
      render(<TestComponent isEnabled={true} />, document.getElementById('root')!);
    });

    const overlayEl = document.getElementById('test-overlay')!;

    // 1. Simulate hover and pause
    await act(() => {
      overlayEl.dispatchEvent(new MouseEvent('mousemove'));
    });
    
    await act(() => {
      Object.defineProperty(videoEl, 'currentTime', { value: 1.8, configurable: true });
      videoEl.dispatchEvent(new Event('timeupdate'));
    });
    expect(videoEl.pause).toHaveBeenCalled();
    expect(videoEl.paused).toBe(true);

    // 2. Simulate mouse leave
    await act(() => {
      overlayEl.dispatchEvent(new MouseEvent('mouseleave'));
    });
    expect(videoEl.play).toHaveBeenCalled();
    expect(videoEl.paused).toBe(false);
  });

  it('should not resume if it was already paused before hovering', async () => {
    await act(() => {
      render(<TestComponent isEnabled={true} />, document.getElementById('root')!);
    });

    const overlayEl = document.getElementById('test-overlay')!;

    // Video is already paused
    await act(() => {
      (videoEl as any).paused = true;
    });

    // Simulate mouse leave
    await act(() => {
      overlayEl.dispatchEvent(new MouseEvent('mouseleave'));
    });
    expect(videoEl.play).not.toHaveBeenCalled();
  });

  it('should reset hover state when overlay becomes invisible', async () => {
    const activeSegment = { start: 1000, end: 2000, text: 'Test' };
    vi.spyOn(store, 'getSegmentAt').mockReturnValue(activeSegment);

    await act(() => {
      render(<TestComponent isEnabled={true} isOverlayVisible={true} />, document.getElementById('root')!);
    });

    const overlayEl = document.getElementById('test-overlay')!;

    // 1. Hover
    await act(() => {
      overlayEl.dispatchEvent(new MouseEvent('mousemove'));
    });

    // 2. Make overlay invisible
    await act(() => {
      render(<TestComponent isEnabled={true} isOverlayVisible={false} />, document.getElementById('root')!);
    });

    // 3. Make overlay visible again (mouse is technically not "on" it unless we move it again)
    // In our logic, it should reset isHovering to false.
    await act(() => {
      render(<TestComponent isEnabled={true} isOverlayVisible={true} />, document.getElementById('root')!);
    });

    // 4. Update time to trigger pause logic
    await act(() => {
      Object.defineProperty(videoEl, 'currentTime', { value: 1.8, configurable: true });
      videoEl.dispatchEvent(new Event('timeupdate'));
    });

    // Should NOT pause because hover state was reset
    expect(videoEl.pause).not.toHaveBeenCalled();
  });
});
