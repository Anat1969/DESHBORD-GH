import { useState, useEffect, useRef } from 'react'

/**
 * Animated number counter — counts from 0 to target value.
 * Used in KPI cards and landing stats for a dynamic feel.
 */
export default function useCountUp(target, duration = 1200, decimals = 0) {
  const [value, setValue] = useState(0)
  const rafRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    if (target === 0 || target == null) {
      setValue(0)
      return
    }

    const numTarget = typeof target === 'string' ? parseFloat(target.replace(/,/g, '')) : target
    if (isNaN(numTarget)) {
      setValue(target)
      return
    }

    startRef.current = performance.now()

    function step(now) {
      const elapsed = now - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * numTarget

      setValue(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.round(current))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      }
    }

    rafRef.current = requestAnimationFrame(step)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration, decimals])

  return value
}
