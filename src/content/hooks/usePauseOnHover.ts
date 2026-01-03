import { RefObject } from 'preact'
import { useEffect, useState, useRef, useCallback } from 'preact/hooks'
import { store } from '../store'

export function usePauseOnHover(isEnabled: boolean, overlayRef: RefObject<HTMLElement>, isOverlayVisible: boolean) {
  const [isHovering, setIsHovering] = useState(false)
  const wasPausedByHoverRef = useRef(false)

  // Track if we have already triggered the pause for the current segment
  // to prevent looping pauses when the user manually resumes.
  const hasAlreadyPausedRef = useRef(false)
  const currentSegmentStartRef = useRef<number | null>(null)

  const resetPauseLogic = useCallback(() => {
    wasPausedByHoverRef.current = false
    hasAlreadyPausedRef.current = false
    currentSegmentStartRef.current = null
  }, [])

  const resetHoverState = useCallback(() => {
    setIsHovering(false)
    resetPauseLogic()
  }, [resetPauseLogic])

  useEffect(() => {
    if (!isEnabled || !isOverlayVisible) {
      resetHoverState()
      return
    }

    const overlay = overlayRef.current
    if (!overlay) return

    // Check if the mouse is already over the element (e.g. it just appeared under the cursor)
    if (overlay.matches(':hover')) {
      setIsHovering(true)
    }

    const handleMouseMove = () => {
      setIsHovering(true)
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
      // We don't reset hasAlreadyPausedRef here because leaving the overlay
      // shouldn't re-enable pausing for the *same* segment if we return to it immediately.
      // It resets naturally when segment changes or seeks.

      const video = document.querySelector('video')
      if (video && wasPausedByHoverRef.current && video.paused) {
        video.play()
      }
      wasPausedByHoverRef.current = false
    }

    overlay.addEventListener('mousemove', handleMouseMove)
    overlay.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      overlay.removeEventListener('mousemove', handleMouseMove)
      overlay.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isEnabled, isOverlayVisible, overlayRef, resetHoverState])

  useEffect(() => {
    if (!isEnabled) return

    const video = document.querySelector('video')
    if (!video) return

    const handleTimeUpdate = () => {
      // If the video is playing, it's no longer "paused by hover"
      if (!video.paused && wasPausedByHoverRef.current) {
        wasPausedByHoverRef.current = false
      }

      if (!isHovering) return

      const currentTimeMs = video.currentTime * 1000
      const activeSegment = store.getSegmentAt(currentTimeMs)

      if (activeSegment) {
        // Detect segment change
        if (currentSegmentStartRef.current !== activeSegment.start) {
          currentSegmentStartRef.current = activeSegment.start
          hasAlreadyPausedRef.current = false
        }

        if (hasAlreadyPausedRef.current) {
          return
        }

        const remainingTimeMs = activeSegment.end - currentTimeMs

        // Pause if we are within 300ms (0.3s) of the end of the segment
        // We can't get rid of this magic number because we depend on the timedupdated
        // event which fires every ~250 ms or so.
        if (remainingTimeMs > 0 && remainingTimeMs <= 300) {
          if (!video.paused) {
            wasPausedByHoverRef.current = true
            hasAlreadyPausedRef.current = true
            video.pause()
          }
        }
      } else {
        // No active segment, reset state
        resetPauseLogic()
      }
    }

    const handlePlay = () => {
      wasPausedByHoverRef.current = false
    }

    const handleSeeking = () => {
      // Seeking always resets the "action completed" state
      resetPauseLogic()
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('play', handlePlay)
    video.addEventListener('seeking', handleSeeking)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('seeking', handleSeeking)
    }
  }, [isEnabled, isHovering, resetPauseLogic])

  return { isHovering }
}
