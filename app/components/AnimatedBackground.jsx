import { useMemo } from 'react'

/**
 * Floating particles background — creates depth and dynamism.
 * Pure CSS animations, no JS overhead.
 */
export default function AnimatedBackground() {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 3,
      duration: 12 + Math.random() * 18,
      delay: Math.random() * 15,
      opacity: 0.15 + Math.random() * 0.25
    }))
  }, [])

  return (
    <div className="animated-bg">
      <div className="landing-particles">
        {particles.map(p => (
          <span
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              bottom: '-10px',
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              opacity: p.opacity
            }}
          />
        ))}
      </div>
    </div>
  )
}
