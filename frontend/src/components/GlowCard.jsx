import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Tilt card wrapper — tilts toward cursor with glowing highlight
 */
export default function GlowCard({ children, className = '', style = {}, ...props }) {
  const ref = useRef(null)
  const [hovering, setHovering] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(0, { stiffness: 300, damping: 30 })
  const rotateY = useSpring(0, { stiffness: 300, damping: 30 })
  const glowX = useMotionValue('50%')
  const glowY = useMotionValue('50%')

  const handleMouse = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    rotateX.set(((py - centerY) / centerY) * -6)
    rotateY.set(((px - centerX) / centerX) * 6)

    glowX.set(`${(px / rect.width) * 100}%`)
    glowY.set(`${(py / rect.height) * 100}%`)
  }

  const handleLeave = () => {
    setHovering(false)
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setHovering(true)}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className={`card ${className}`}
      style={{
        ...style,
        perspective: 800,
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 40px rgba(56,189,248,0.1)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      {...props}
    >
      {hovering && (
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            background: `radial-gradient(600px circle at ${glowX.get()} ${glowY.get()}, rgba(56, 189, 248, 0.08), transparent 40%)`,
            zIndex: 0,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </motion.div>
  )
}
