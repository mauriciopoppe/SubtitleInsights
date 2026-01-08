import { describe, it, expect, beforeEach, vi } from 'vitest'
import { VideoController } from './VideoController'
import { SubtitleStore } from './store'

describe('VideoController', () => {
  let store: SubtitleStore
  let controller: VideoController
  let mockVideo: HTMLVideoElement

  beforeEach(() => {
    store = new SubtitleStore()
    controller = new VideoController(store)
    mockVideo = document.createElement('video')
    
    // Mock video properties
    Object.defineProperty(mockVideo, 'currentTime', { value: 0, writable: true })
    Object.defineProperty(mockVideo, 'paused', { value: true, writable: true })
    Object.defineProperty(mockVideo, 'seeking', { value: false, writable: true })
    
    // Mock methods
    mockVideo.play = vi.fn()
    mockVideo.pause = vi.fn()
  })

  it('should initialize with default values', () => {
    expect(controller.currentTimeMs.value).toBe(0)
    expect(controller.isPlaying.value).toBe(false)
    expect(controller.activeSegmentIndex.value).toBe(-1)
  })

  it('should update state when video is set', () => {
    mockVideo.currentTime = 10
    Object.defineProperty(mockVideo, 'paused', { value: false })
    
    controller.setVideo(mockVideo)
    
    expect(controller.currentTimeMs.value).toBe(10000)
    expect(controller.isPlaying.value).toBe(true)
  })

  it('should update currentTimeMs on timeupdate event', () => {
    controller.setVideo(mockVideo)
    
    mockVideo.currentTime = 5
    mockVideo.dispatchEvent(new Event('timeupdate'))
    
    expect(controller.currentTimeMs.value).toBe(5000)
  })

  it('should update isPlaying on play/pause events', () => {
    controller.setVideo(mockVideo)
    
    mockVideo.dispatchEvent(new Event('play'))
    expect(controller.isPlaying.value).toBe(true)
    
    mockVideo.dispatchEvent(new Event('pause'))
    expect(controller.isPlaying.value).toBe(false)
  })

  it('should update activeSegmentIndex when time changes', () => {
    store.addSegments([
      { start: 0, end: 1000, text: 'First' },
      { start: 1000, end: 2000, text: 'Second' }
    ])
    
    controller.setVideo(mockVideo)
    
    mockVideo.currentTime = 0.5
    mockVideo.dispatchEvent(new Event('timeupdate'))
    expect(controller.activeSegmentIndex.value).toBe(0)
    
    mockVideo.currentTime = 1.5
    mockVideo.dispatchEvent(new Event('timeupdate'))
    expect(controller.activeSegmentIndex.value).toBe(1)
    
    mockVideo.currentTime = 2.5
    mockVideo.dispatchEvent(new Event('timeupdate'))
    expect(controller.activeSegmentIndex.value).toBe(-1)
  })

  it('should update activeSegmentIndex when store changes', () => {
    controller.setVideo(mockVideo)
    mockVideo.currentTime = 0.5
    mockVideo.dispatchEvent(new Event('timeupdate'))
    
    expect(controller.activeSegmentIndex.value).toBe(-1)
    
    store.addSegments([{ start: 0, end: 1000, text: 'Late arrival' }])
    expect(controller.activeSegmentIndex.value).toBe(0)
  })

  it('should update targetSegmentIndex correctly during gaps', () => {
    store.addSegments([
      { start: 1000, end: 2000, text: 'First' },
      { start: 3000, end: 4000, text: 'Second' }
    ])
    
    controller.setVideo(mockVideo)
    
    // Before first segment
    mockVideo.currentTime = 0.5
    mockVideo.dispatchEvent(new Event('timeupdate'))
    expect(controller.activeSegmentIndex.value).toBe(-1)
    expect(controller.targetSegmentIndex.value).toBe(0) // Should point to "First"
    
    // Inside first segment
    mockVideo.currentTime = 1.5
    mockVideo.dispatchEvent(new Event('timeupdate'))
    expect(controller.activeSegmentIndex.value).toBe(0)
    expect(controller.targetSegmentIndex.value).toBe(0)
    
    // In gap between first and second
    mockVideo.currentTime = 2.5
    mockVideo.dispatchEvent(new Event('timeupdate'))
    expect(controller.activeSegmentIndex.value).toBe(-1)
    expect(controller.targetSegmentIndex.value).toBe(1) // Should point to "Second"
    
    // Inside second segment
    mockVideo.currentTime = 3.5
    mockVideo.dispatchEvent(new Event('timeupdate'))
    expect(controller.activeSegmentIndex.value).toBe(1)
    expect(controller.targetSegmentIndex.value).toBe(1)
    
    // After last segment
    mockVideo.currentTime = 4.5
    mockVideo.dispatchEvent(new Event('timeupdate'))
    expect(controller.activeSegmentIndex.value).toBe(-1)
    expect(controller.targetSegmentIndex.value).toBe(-1) // No next segment
  })

  describe('Navigation', () => {
    beforeEach(() => {
      store.addSegments([
        { start: 1000, end: 2000, text: 'First' },
        { start: 3000, end: 4000, text: 'Second' },
        { start: 5000, end: 6000, text: 'Third' }
      ])
      controller.setVideo(mockVideo)
    })

    it('seekToNext should seek to the next segment and preserve playback state (paused)', () => {
      mockVideo.currentTime = 0.5 // before First
      mockVideo.dispatchEvent(new Event('timeupdate'))
      Object.defineProperty(mockVideo, 'paused', { value: true })

      controller.seekToNext()
      expect(mockVideo.currentTime).toBe(1) // Start of First
      expect(mockVideo.play).not.toHaveBeenCalled()
    })

    it('seekToNext should seek to the next segment and preserve playback state (playing)', () => {
      mockVideo.currentTime = 1.5 // in First
      mockVideo.dispatchEvent(new Event('timeupdate'))
      Object.defineProperty(mockVideo, 'paused', { value: false })

      controller.seekToNext()
      expect(mockVideo.currentTime).toBe(3) // Start of Second
      // We don't necessarily call play() if it was already playing, but it should stay playing.
    })

    it('seekToPrev should seek to the previous segment and preserve state', () => {
      mockVideo.currentTime = 3.5 // in Second
      mockVideo.dispatchEvent(new Event('timeupdate'))
      Object.defineProperty(mockVideo, 'paused', { value: true })

      controller.seekToPrev()
      expect(mockVideo.currentTime).toBe(1) // Start of First
      expect(mockVideo.play).not.toHaveBeenCalled()
    })

    it('replayCurrent should seek to current segment start and FORCE play', () => {
      mockVideo.currentTime = 3.5 // in Second
      mockVideo.dispatchEvent(new Event('timeupdate'))
      Object.defineProperty(mockVideo, 'paused', { value: true })

      controller.replayCurrent()
      expect(mockVideo.currentTime).toBe(3) // Start of Second
      expect(mockVideo.play).toHaveBeenCalled()
    })

    it('seekToNext should seek to segment at index 1 when at index 0', () => {
      mockVideo.currentTime = 1.5
      mockVideo.dispatchEvent(new Event('timeupdate'))
      controller.seekToNext()
      expect(mockVideo.currentTime).toBe(3)
    })

    it('seekToPrev should seek to segment at index 0 when at index 1', () => {
      mockVideo.currentTime = 3.5
      mockVideo.dispatchEvent(new Event('timeupdate'))
      controller.seekToPrev()
      expect(mockVideo.currentTime).toBe(1)
    })
  })
})
