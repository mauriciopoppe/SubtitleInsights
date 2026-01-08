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
})
