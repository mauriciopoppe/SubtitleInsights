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
  // targetSegmentIndex points to the active segment, or if none, the next upcoming segment.
  // This is used for pre-fetching AI data even during gaps.
  public targetSegmentIndex: Signal<number>

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

    this.targetSegmentIndex = computed(() => {
      const active = this.activeSegmentIndex.value
      if (active !== -1) return active

      // If no active segment, we are in a gap or outside boundaries.
      // Find the next segment.
      // We access dependencies again to be safe, though activeSegmentIndex change usually implies time/store change.
      const version = storeVersion.value
      const time = this.currentTimeMs.value
      const segments = this.store.getAllSegments()
      
      // Optimization: findIndex is O(N), but necessary if we don't assume sorted/non-overlapping perfect structure.
      // Given segments are sorted by start time:
      const nextIndex = segments.findIndex(seg => seg.start >= time)
      
      // If found, return it. If not found (end of video), return -1.
      // If nextIndex is 0, it means we are before the first segment.
      return version >= 0 ? nextIndex : -1
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

  public seekToNext() {
    const segments = this.store.getAllSegments()
    if (segments.length === 0) return

    const active = this.activeSegmentIndex.value
    const target = this.targetSegmentIndex.value
    let nextIndex = -1

    if (active !== -1) {
      nextIndex = active + 1
    } else if (target !== -1) {
      nextIndex = target
    }

    if (nextIndex !== -1 && nextIndex < segments.length) {
      this.seekTo(segments[nextIndex].start)
    }
  }

  public seekToPrev() {
    const segments = this.store.getAllSegments()
    if (segments.length === 0) return

    const active = this.activeSegmentIndex.value
    const target = this.targetSegmentIndex.value
    let prevIndex = -1

    if (active !== -1) {
      prevIndex = active - 1
    } else if (target !== -1) {
      prevIndex = target - 1
    }

    if (prevIndex >= 0) {
      this.seekTo(segments[prevIndex].start)
    }
  }

  public replayCurrent() {
    const segments = this.store.getAllSegments()
    const active = this.activeSegmentIndex.value

    if (active !== -1) {
      this.seekTo(segments[active].start, true)
    }
  }

  public seekTo(timeMs: number, forcePlay: boolean = false) {
    if (this.video) {
      this.video.currentTime = timeMs / 1000
      if (forcePlay) {
        this.video.play()
      }
    }
  }
}

export const videoController = new VideoController(store)
