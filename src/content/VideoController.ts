import { signal, computed, Signal } from '@preact/signals'
import { SubtitleStore, store } from './store'

export class VideoController {
  public currentTimeMs = signal(0)
  public isPlaying = signal(false)
  public isSeeking = signal(false)
  private video: HTMLVideoElement | null = null
  private store: SubtitleStore

  // Computed signal that depends on currentTimeMs and potentially store changes.
  // Note: if store.segments is not a signal, we might need a way to force re-computation
  // when segments are added/removed.
  public activeSegmentIndex: Signal<number>

  constructor(store: SubtitleStore) {
    this.store = store
    
    // We create a signal that tracks store updates to force computed re-evaluation
    const storeVersion = signal(0)
    this.store.addChangeListener(() => {
      storeVersion.value++
    })

    this.activeSegmentIndex = computed(() => {
      // Accessing storeVersion.value makes this computed depend on it
      const version = storeVersion.value
      const time = this.currentTimeMs.value
      const segments = this.store.getAllSegments()
      const index = segments.findIndex(seg => time >= seg.start && time < seg.end)
      return version >= 0 ? index : -1
    })
  }

  public setVideo(video: HTMLVideoElement) {
    if (this.video === video) return
    
    if (this.video) {
      this.removeListeners()
    }
    this.video = video
    this.addListeners()
    
    // Initial state
    this.currentTimeMs.value = video.currentTime * 1000
    this.isPlaying.value = !video.paused
    this.isSeeking.value = video.seeking
  }

  private addListeners() {
    if (!this.video) return
    this.video.addEventListener('timeupdate', this.handleTimeUpdate)
    this.video.addEventListener('play', this.handlePlay)
    this.video.addEventListener('pause', this.handlePause)
    this.video.addEventListener('seeking', this.handleSeeking)
    this.video.addEventListener('seeked', this.handleSeeked)
  }

  private removeListeners() {
    if (!this.video) return
    this.video.removeEventListener('timeupdate', this.handleTimeUpdate)
    this.video.removeEventListener('play', this.handlePlay)
    this.video.removeEventListener('pause', this.handlePause)
    this.video.removeEventListener('seeking', this.handleSeeking)
    this.video.removeEventListener('seeked', this.handleSeeked)
  }

  private handleTimeUpdate = () => {
    if (this.video) {
      // Small optimization: avoid updating if time hasn't changed much
      // though signals already handle value equality check.
      this.currentTimeMs.value = this.video.currentTime * 1000
    }
  }

  private handlePlay = () => {
    this.isPlaying.value = true
  }

  private handlePause = () => {
    this.isPlaying.value = false
  }

  private handleSeeking = () => {
    this.isSeeking.value = true
  }

  private handleSeeked = () => {
    this.isSeeking.value = false
    if (this.video) {
      this.currentTimeMs.value = this.video.currentTime * 1000
    }
  }

  public dispose() {
    this.removeListeners()
    this.video = null
  }

  public reset() {
    this.dispose()
    this.currentTimeMs.value = 0
    this.isPlaying.value = false
    this.isSeeking.value = false
  }
}

export const videoController = new VideoController(store)
