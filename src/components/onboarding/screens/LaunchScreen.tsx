/**
 * LaunchScreen — celebratory final step.
 *
 * Shows:
 *   • Deterministic confetti particles (no randomness to avoid hydration issues)
 *   • A floating ✨ icon
 *   • "You're Ready." heading
 *   • Subtitle
 *   • Large "Launch Focus Timer ✨" CTA that calls onComplete
 *
 * The bottom nav is hidden for this screen (see OnboardingFlow.tsx).
 * Calling onComplete dismisses onboarding and takes the user to the main app.
 */

import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'

// ── Confetti particle data (deterministic positions) ──────────────────────────

const PARTICLES: Array<{
  color: string; x: number; y: number
  size: number; delay: number; duration: number
}> = [
  { color: '#6366f1', x:  8, y: 20, size:  8, delay:    0, duration: 2400 },
  { color: '#e10600', x: 88, y: 28, size:  6, delay:  280, duration: 2100 },
  { color: '#22c55e', x: 22, y: 68, size: 10, delay:  140, duration: 2600 },
  { color: '#f59e0b', x: 76, y: 62, size:  7, delay:  420, duration: 2200 },
  { color: '#06b6d4', x: 50, y: 12, size:  9, delay:  560, duration: 2500 },
  { color: '#ec4899', x: 34, y: 80, size:  6, delay:  200, duration: 2000 },
  { color: '#6366f1', x: 66, y: 16, size:  7, delay:  700, duration: 2700 },
  { color: '#f59e0b', x: 18, y: 44, size:  8, delay:   90, duration: 2300 },
  { color: '#22c55e', x: 82, y: 50, size:  6, delay:  490, duration: 2100 },
  { color: '#e10600', x: 44, y: 84, size:  9, delay:  330, duration: 2400 },
  { color: '#ec4899', x: 92, y: 74, size:  7, delay:  240, duration: 2200 },
  { color: '#06b6d4', x:  6, y: 58, size:  8, delay:  650, duration: 2600 },
  { color: '#6366f1', x: 58, y: 72, size:  6, delay:  380, duration: 1950 },
  { color: '#f59e0b', x: 30, y: 32, size:  7, delay:  810, duration: 2350 },
  { color: '#22c55e', x: 72, y: 38, size:  8, delay:  120, duration: 2450 },
  { color: '#ec4899', x: 46, y: 90, size:  6, delay:  530, duration: 2050 },
]

// ── Component ─────────────────────────────────────────────────────────────────

interface Props { onComplete?: () => void }

export function LaunchScreen({ onComplete }: Props) {
  const [visible, setVisible] = useState(false)

  // Small delay so the screen can paint before animating in
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="relative flex flex-col items-center justify-center
                 text-center px-6 py-12 max-w-lg mx-auto w-full overflow-hidden"
      style={{ minHeight: 340 }}
    >

      {/* ── Confetti particles ──────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-sm"
            style={{
              left:            `${p.x}%`,
              top:             `${p.y}%`,
              width:           p.size,
              height:          p.size,
              backgroundColor: p.color,
              animation:       `confettiFloat ${p.duration}ms ease-out ${p.delay}ms infinite`,
              rotate:          `${(i * 37) % 180}deg`,
            }}
          />
        ))}
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div
        className="relative z-10 flex flex-col items-center"
        style={{
          opacity:    visible ? 1 : 0,
          transform:  visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}
      >
        {/* Floating icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-7 shadow-glow-lg animate-float"
          style={{ backgroundColor: 'rgb(var(--p-500))' }}
        >
          <Sparkles size={36} className="text-white" />
        </div>

        {/* Heading */}
        <h1
          className="text-5xl sm:text-6xl font-bold text-slate-900 mb-3 leading-tight"
          style={{
            opacity:    visible ? 1 : 0,
            transform:  visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s',
          }}
        >
          You're Ready.
        </h1>

        {/* Subtitle */}
        <p
          className="text-xl text-slate-500 mb-10 max-w-xs"
          style={{
            opacity:    visible ? 1 : 0,
            transform:  visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.5s ease 0.28s, transform 0.5s ease 0.28s',
          }}
        >
          Let's build something great today.
        </p>

        {/* CTA button */}
        <button
          onClick={onComplete}
          className="flex items-center gap-2.5 px-8 py-4 rounded-2xl text-lg font-bold text-white
                     transition-all duration-200 hover:scale-105 active:scale-95 shadow-glow-lg"
          style={{
            backgroundColor: 'rgb(var(--p-500))',
            opacity:         visible ? 1 : 0,
            transform:       visible ? 'translateY(0)' : 'translateY(10px)',
            transition:      'opacity 0.5s ease 0.42s, transform 0.5s ease 0.42s, scale 0.15s ease, background-color 0.15s ease',
          }}
        >
          <Sparkles size={20} />
          Launch Focus Timer ✨
        </button>

        {/* Reassurance note */}
        <p
          className="text-slate-400 text-xs mt-6"
          style={{
            opacity:    visible ? 1 : 0,
            transition: 'opacity 0.5s ease 0.6s',
          }}
        >
          Themes &amp; settings can be changed anytime from the sidebar.
        </p>
      </div>
    </div>
  )
}
