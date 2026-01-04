import { RefObject } from 'preact'
import { useEffect, useState, useRef, useCallback } from 'preact/hooks'
import { store } from '../store'

export function usePauseOnHover(isEnabled: boolean, overlayRef: RefObject<HTMLElement>, isOverlayVisible: boolean) {
  const [isHovering, setIsHovering] = useState(false)
  const isHoveringRef = useRef(false)
  const wasPausedByHoverRef = useRef(false)

  // Sync ref with state
  useEffect(() => {
    isHoveringRef.current = isHovering
  }, [isHovering])

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

    const handleMouseMove = () => {
      setIsHovering(true)
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
    }

    overlay.addEventListener('mousemove', handleMouseMove)
    overlay.addEventListener('mouseleave', handleMouseLeave)

    // ResizeObserver to handle content changes shrinking the overlay from under the mouse
    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        if (overlay) {
          setIsHovering(overlay.matches(':hover'))
        }
      })
      resizeObserver.observe(overlay)
    }

    return () => {
      overlay.removeEventListener('mousemove', handleMouseMove)
      overlay.removeEventListener('mouseleave', handleMouseLeave)
      resizeObserver?.disconnect()
    }
  }, [isEnabled, isOverlayVisible, overlayRef, resetHoverState])

  // Resume playback when hover ends, if we paused it
  useEffect(() => {
    if (!isHovering) {
      const video = document.querySelector('video')
      if (video && wasPausedByHoverRef.current && video.paused) {
        video.play()
      }
    }
  }, [isHovering])

  // Optimization: use a ref for isHovering in the video event listeners
  // This prevents the effect from tearing down and re-attaching listeners
  // every time the mouse moves in/out of the overlay (isHovering changes).
  // Attaching/detaching listeners frequently can cause performance stutters,
  // especially when segments are ending.
  useEffect(() => {
    if (!isEnabled) return

    const video = document.querySelector('video')
    if (!video) return

    const handleTimeUpdate = () => {
      // If the video is playing, it's no longer "paused by hover"
      if (!video.paused && wasPausedByHoverRef.current) {
        wasPausedByHoverRef.current = false
      }

      if (!isHoveringRef.current) return

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
  }, [isEnabled, resetPauseLogic])

  return { isHovering }
}
