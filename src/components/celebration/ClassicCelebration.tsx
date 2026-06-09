/**
 * ClassicCelebration
 * ──────────────────
 * Premium, minimal celebration for the Classic (indigo) theme.
 *
 * Sequence:
 *   0 ms  → backdrop fades in, three expanding ripple rings start
 *  150 ms  → white card rises (celebCardIn)
 *  350 ms  → checkmark circle strokes in
 *  850 ms  → checkmark tick draws
 * 1 200 ms → heading + tagline fade up
 * 1 800 ms → stats card slides up
 *
 * Visual: semi-transparent dark blur backdrop · centred white card ·
 * animated SVG checkmark · soft indigo particle rings behind the card.
 */

import { useEffect, useRef, useState } from 'react'
import { CelebrationStats, type CelebrationData } from './CelebrationStats'

// ── Taglines ──────────────────────────────────────────────────────────────────

const TAGLINES = [
  'Excellent Work.',
  'Deep Focus Achieved.',
  'Consistency Wins.',
  'Progress Made Today.',
  'Another Step Forward.',
]

// ── Checkmark SVG ─────────────────────────────────────────────────────────────
// Circle ring draws first, then the tick draws through.

function AnimatedCheckmark({ phase }: { phase: number }) {
  // Circumference of ring at r=42 ≈ 263.9
  return (
    <svg viewBox="0 0 100 100" width={100} height={100} className="mx-auto mb-5">
      {/* Background fill circle */}
      <circle cx="50" cy="50" r="44" fill="rgba(34,197,94,0.08)" />

      {/* Track ring */}
      <circle cx="50" cy="50" r="42" fill="none"
        stroke="rgba(34,197,94,0.18)" strokeWidth="3" />

      {/* Animated progress ring */}
      <circle cx="50" cy="50" r="42" fill="none"
        stroke="#22c55e" strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="264"
        className={phase >= 2 ? 'check-ring' : ''}
        style={{
          strokeDashoffset: phase >= 2 ? undefined : 264,
          transform: 'rotate(-90deg)',
          transformOrigin: '50px 50px',
        }}
      />

      {/* Checkmark tick — draws after ring */}
      <path
        d="M 27 50 L 42 66 L 73 34"
        fill="none" stroke="#22c55e" strokeWidth="4.5"
        strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="63"
        className={phase >= 3 ? 'check-tick' : ''}
        style={{ strokeDashoffset: phase >= 3 ? undefined : 63 }}
      />
    </svg>
  )
}

// ── Ripple rings behind the card ─────────────────────────────────────────────

function RippleRings({ active, color }: { active: boolean; color: string }) {
  if (!active) return null
  return (
    <>
      {[0, 0.7, 1.4].map((delay) => (
        <div
          key={delay}
          className="absolute w-28 h-28 rounded-full border-2 pointer-events-none"
          style={{
            borderColor: color + '30',
            animation: `rippleRing 2.4s ease-out ${delay}s infinite`,
          }}
        />
      ))}
    </>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  data:    CelebrationData
  reduced: boolean
  isDark:  boolean
}

export function ClassicCelebration({ data, reduced, isDark }: Props) {
  const tagline = useRef(TAGLINES[Math.floor(Math.random() * TAGLINES.length)]).current

  const [phase, setPhase] = useState(reduced ? 6 : 0)

  useEffect(() => {
    if (reduced) return
    const t = [
      setTimeout(() => setPhase(1), 150),
      setTimeout(() => setPhase(2), 350),
      setTimeout(() => setPhase(3), 850),
      setTimeout(() => setPhase(4), 1200),
      setTimeout(() => setPhase(5), 1800),
    ]
    return () => t.forEach(clearTimeout)
  }, [reduced])

  const accentColor = 'rgb(var(--p-500))'
  const surfaceBg   = isDark ? '#1e293b' : '#ffffff'
  const headingClr  = isDark ? '#f1f5f9' : '#0f172a'
  const mutedClr    = isDark ? '#94a3b8' : '#64748b'

  return (
    /* Full-screen backdrop — semi-transparent, blurred */
    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm">

      {/* Ripple rings centred on the card */}
      <RippleRings active={phase >= 1} color="rgb(var(--p-500))" />

      {/* ── Main card ─────────────────────────────────────────────── */}
      <div
        className={[
          'relative z-10 w-full max-w-sm mx-5 rounded-3xl p-8 shadow-2xl',
          !reduced && phase >= 1 ? 'celeb-card-in' : '',
        ].join(' ')}
        style={{
          backgroundColor: surfaceBg,
          opacity:         !reduced && phase < 1 ? 0 : undefined,
          border:          `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
        }}
        onClick={(e) => e.stopPropagation()} /* don't let card click dismiss overlay */
      >
        {/* Animated checkmark */}
        <AnimatedCheckmark phase={reduced ? 99 : phase} />

        {/* Heading */}
        <div
          style={{
            opacity:    phase >= 4 ? 1 : 0,
            transform:  phase >= 4 ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.45s ease, transform 0.45s ease',
          }}
        >
          <div className="text-center mb-1">
            <span
              className="text-3xl font-bold tracking-tight"
              style={{ color: headingClr }}
            >
              Session Complete
            </span>
          </div>
          <p
            className="text-center text-base font-medium"
            style={{ color: accentColor }}
          >
            {tagline}
          </p>
        </div>

        {/* Stats */}
        <div
          className={!reduced && phase >= 5 ? 'celeb-stats-in mt-6' : 'mt-6'}
          style={{ opacity: phase >= 5 || reduced ? 1 : 0 }}
        >
          <CelebrationStats
            data={data}
            dark={isDark}
            accentColor="rgb(var(--p-500))"
          />
        </div>

        {/* Dismiss hint */}
        <p
          className="text-center text-xs mt-5 transition-opacity duration-500"
          style={{
            color:   mutedClr,
            opacity: phase >= 5 ? 0.6 : 0,
          }}
        >
          Tap anywhere to continue
        </p>
      </div>
    </div>
  )
}
