import { useEffect, useRef, useState } from 'react'

export default function CountUp({ end, duration = 2000, prefix = '', suffix = '', decimals = 0 }) {
  const [value, setValue] = useState(0)
  const startTime = useRef(null)
  const rafId = useRef(null)

  useEffect(() => {
    if (end === 0 || end === undefined || end === null) {
      setValue(0)
      return
    }

    const startValue = 0
    const endValue = Number(end)

    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp
      const progress = Math.min((timestamp - startTime.current) / duration, 1)

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (endValue - startValue) * eased

      setValue(current)

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate)
      }
    }

    startTime.current = null
    rafId.current = requestAnimationFrame(animate)

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [end, duration])

  const displayed = decimals > 0
    ? value.toFixed(decimals)
    : Math.round(value).toLocaleString()

  return (
    <span>
      {prefix}{displayed}{suffix}
    </span>
  )
}
