import { RefObject } from "preact";
import { useEffect, useState } from "preact/hooks";
import { store } from "../store";

export function usePauseOnHover(
  isEnabled: boolean,
  overlayRef: RefObject<HTMLElement>,
  isOverlayVisible: boolean,
) {
  const [isHovering, setIsHovering] = useState(false);
  const [wasPausedByHover, setWasPausedByHover] = useState(false);

  useEffect(() => {
    if (!isEnabled || !isOverlayVisible) {
      setIsHovering(false);
      setWasPausedByHover(false);
      return;
    }

    const overlay = overlayRef.current;
    if (!overlay) return;

    const handleMouseMove = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);

      const video = document.querySelector("video");
      if (video && wasPausedByHover && video.paused) {
        console.log("[SI] Resuming video: Mouse left overlay.");
        video.play();
      }
      setWasPausedByHover(false);
    };

    overlay.addEventListener("mousemove", handleMouseMove);
    overlay.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      overlay.removeEventListener("mousemove", handleMouseMove);
      overlay.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isEnabled, isOverlayVisible, overlayRef.current, wasPausedByHover]);

  useEffect(() => {
    if (!isEnabled) return;

    const video = document.querySelector("video");
    if (!video) return;

    const handleTimeUpdate = () => {
      if (!isHovering) return;

      const currentTimeMs = video.currentTime * 1000;
      const activeSegment = store.getSegmentAt(currentTimeMs);

      if (activeSegment) {
        const remainingTimeMs = activeSegment.end - currentTimeMs;

        // Pause if we are within 300ms (0.3s) of the end of the segment
        if (remainingTimeMs > 0 && remainingTimeMs <= 300) {
          if (!video.paused) {
            console.log("[SI] Pausing video due to hover near segment end.");
            video.pause();
            setWasPausedByHover(true);
          }
        }
      }
    };

    const handlePlay = () => {
      // If the user manually plays the video, we should no longer consider it
      // "paused by hover" so we don't accidentally play it again later.
      if (wasPausedByHover) {
        setWasPausedByHover(false);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
    };
  }, [isEnabled, isHovering, wasPausedByHover]);

  return { isHovering };
}

