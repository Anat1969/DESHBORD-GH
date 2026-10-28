import { useMemo } from 'react'

/**
 * Ambient warm background — floating ember-like particles
 * and warm radial glow orbs. Pure CSS animations, no JS overhead.
 */
export default function AnimatedBackground() {
  const particles = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 4,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 12,
      opacity: 0.1 + Math.random() * 0.3
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
