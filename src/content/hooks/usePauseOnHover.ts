import { RefObject } from 'preact'
import { useEffect, useState, useRef, useCallback } from 'preact/hooks'
import { store } from '../store'
import { videoController } from '../VideoController'

/**
 * Checks if the mouse is currently over a Yomitan definition popup.
 * Yomitan popups are typically inside a shadow root of a div with 'all: initial' style.
 */
function isMouseOverYomitan(e: MouseEvent): boolean {
  try {
    const hosts = document.querySelectorAll('div[style*="all: initial"]')
    for (const host of Array.from(hosts)) {
      // @ts-ignore - chrome.dom.openOrClosedShadowRoot is a browser-specific API
      const shadowRoot = typeof chrome !== 'undefined' && chrome.dom ? chrome.dom.openOrClosedShadowRoot(host) : null
      if (shadowRoot) {
        const popup = shadowRoot.querySelector('.yomitan-popup')
        if (popup instanceof HTMLElement) {
          const rect = popup.getBoundingClientRect()
          if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
            return true
          }
        }
      }
    }
  } catch (err) {
    // Gracefully handle errors (e.g. if chrome.dom is restricted)
  }
  return false
}

export function usePauseOnHover(isEnabled: boolean, overlayRef: RefObject<HTMLElement>, isOverlayVisible: boolean) {
  const [isHovering, setIsHovering] = useState(false)
  const isHoveringRef = useRef(false)
  const wasPausedByHoverRef = useRef(false)
  const isOverYomitanRef = useRef(false)

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
    isOverYomitanRef.current = false
    resetPauseLogic()
  }, [resetPauseLogic])

  // Reset state when overlay becomes invisible
  useEffect(() => {
    if (!isOverlayVisible) {
      resetHoverState()
    }
  }, [isOverlayVisible, resetHoverState])

  useEffect(() => {
    if (!isEnabled) {
      resetHoverState()
      return
    }

    const overlay = overlayRef.current
    if (!overlay) return

    const handleMouseMove = () => {
      setIsHovering(true)
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // If the mouse left the overlay but is now over Yomitan, don't set isHovering to false yet
      if (isMouseOverYomitan(e)) {
        isOverYomitanRef.current = true
        return
      }
      setIsHovering(false)
    }

    overlay.addEventListener('mousemove', handleMouseMove)
    overlay.addEventListener('mouseleave', handleMouseLeave)

    // Global mouse listener to detect when leaving Yomitan
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isOverYomitanRef.current) {
        const overYomitan = isMouseOverYomitan(e)
        const overOverlay = e.target instanceof Node && overlay.contains(e.target)

        if (!overYomitan && !overOverlay) {
          isOverYomitanRef.current = false
          setIsHovering(false)
        }
      }
    }

    window.addEventListener('mousemove', handleGlobalMouseMove)

    // ResizeObserver to handle content changes shrinking the overlay from under the mouse
    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        if (overlay) {
          setIsHovering(overlay.matches(':hover') || isOverYomitanRef.current)
        }
      })
      resizeObserver.observe(overlay)
    }

    return () => {
      overlay.removeEventListener('mousemove', handleMouseMove)
      overlay.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mousemove', handleGlobalMouseMove)
      resizeObserver?.disconnect()
    }
  }, [isEnabled, overlayRef, resetHoverState, isOverlayVisible])

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

    const unsubscribe = videoController.currentTimeMs.subscribe(currentTimeMs => {
      // If the video is playing, it's no longer "paused by hover"
      if (!video.paused && wasPausedByHoverRef.current) {
        wasPausedByHoverRef.current = false
      }

      if (!isHoveringRef.current) return

      const activeIndex = videoController.activeSegmentIndex.value
      const segments = store.getAllSegments()
      const activeSegment = segments[activeIndex]

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
    })

    const handlePlay = () => {
      wasPausedByHoverRef.current = false
    }

    const handleSeeking = () => {
      // Seeking always resets the "action completed" state
      resetPauseLogic()
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('seeking', handleSeeking)

    return () => {
      unsubscribe()
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('seeking', handleSeeking)
    }
  }, [isEnabled, resetPauseLogic])

  return { isHovering }
}
