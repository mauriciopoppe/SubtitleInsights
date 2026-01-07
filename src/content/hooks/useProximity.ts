import { RefObject } from 'preact'
import { useState, useEffect } from 'preact/hooks'

type ProximityPredicate = (x: number, y: number, rect: DOMRect) => boolean

export function useProximity(ref: RefObject<HTMLElement>, predicate: ProximityPredicate) {
  const [isProximate, setIsProximate] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const isInside = predicate(x, y, rect)
      setIsProximate(isInside)
    }

    const handleMouseLeave = () => {
      setIsProximate(false)
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [ref, predicate])

  return isProximate
}
