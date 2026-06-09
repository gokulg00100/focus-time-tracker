/**
 * F1Celebration
 * ─────────────
 * Formula 1 podium celebration for the F1 Racing theme.
 *
 * Sequence:
 *    0 ms → black backdrop + red ambient glow + canvas confetti starts
 *   80 ms → checkered flag starts sweeping from right to left
 *  950 ms → flag exits, "🏁 SESSION COMPLETE" stamps in
 * 1 400 ms → red tagline fades up
 * 1 900 ms → stats card slides up
 * 2 400 ms → "tap to dismiss" hint
 *
 * Visual: Ferrari-red / carbon-black palette · checkered flag sweep ·
 * red + white confetti · bold uppercase motorsport typography.
 */

import { useEffect, useRef, useState } from 'react'
import { CelebrationStats, type CelebrationData } from './CelebrationStats'

// ── Taglines ──────────────────────────────────────────────────────────────────

const TAGLINES = [
  'Pole Position Achieved!',
  'Race Won!',
  'Another Lap Conquered!',
  'Focus Champion!',
  'Victory Through Consistency!',
]

// ── Confetti ──────────────────────────────────────────────────────────────────

const F1_COLORS = ['#e10600', '#ff5e5e', '#ffffff', '#c8c8c8', '#ff9999', '#8b0000']

function useF1Confetti(canvasRef: React.RefObject<HTMLCanvasElement>, active: boolean, reduced: boolean) {
  useEffect(() => {
    if (!active || reduced) return
    const canvas = canvasRef.current
    if (!canvas) return

    const W = (canvas.width  = window.innerWidth)
    const H = (canvas.height = window.innerHeight)
    const ctx = canvas.getContext('2d')!

    type P = {
      x: number; y: number; vx: number; vy: number
      rot: number; rotV: number; color: string
      w: number; h: number; life: number; decay: number
    }
    const particles: P[] = Array.from({ length: 90 }, () => ({
      x:     W * 0.5 + (Math.random() - 0.5) * W * 0.7,
      y:     H * 0.28,
      vx:    (Math.random() - 0.5) * 14,
      vy:    -(Math.random() * 14 + 3),
      rot:   Math.random() * 360,
      rotV:  (Math.random() - 0.5) * 14,
      color: F1_COLORS[Math.floor(Math.random() * F1_COLORS.length)],
      w:     Math.random() * 12 + 4,
      h:     Math.random() * 6  + 2,
      life:  1,
      decay: Math.random() * 0.007 + 0.004,
    }))

    let raf: number
    const frame = () => {
      ctx.clearRect(0, 0, W, H)
      let alive = false
      for (const p of particles) {
        if (p.life <= 0) continue
        alive = true
        ctx.save()
        ctx.globalAlpha = Math.max(0, p.life)
        ctx.fillStyle   = p.color
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rot * Math.PI) / 180)
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
        p.x += p.vx;  p.y += p.vy
        p.vy += 0.28;  p.vx *= 0.985
        p.rot += p.rotV
        p.life -= p.decay
      }
      if (alive) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [active]) // eslint-disable-line react-hooks/exhaustive-deps
}

// ── Checkered flag ────────────────────────────────────────────────────────────
// Sweeps from right edge → off left edge using CSS transition on translateX.

type FlagPhase = 'pre' | 'sweep' | 'done'

function CheckeredFlag({ phase }: { phase: FlagPhase }) {
  const tx = phase === 'pre' ? '100%' : phase === 'sweep' ? '-110%' : '-220%'
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex:     60,
        background: 'repeating-conic-gradient(#1a1a1a 0% 25%, #f2f2f2 0% 50%)',
        backgroundSize: '52px 52px',
        opacity:    0.9,
        transform:  `translateX(${tx})`,
        transition: phase === 'pre'
          ? 'none'
          : phase === 'sweep'
          ? 'transform 0.88s ease-in'
          : 'transform 0.3s ease-in',
      }}
    />
  )
}

// ── Red glow pulse rings ──────────────────────────────────────────────────────

function GlowRings({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {[0, 0.8, 1.6].map((d) => (
        <div
          key={d}
          className="absolute w-48 h-48 rounded-full"
          style={{
            border:    '2px solid rgba(225,6,0,0.35)',
            animation: `redPulse 2.2s ease-out ${d}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  data:    CelebrationData
  reduced: boolean
}

export function F1Celebration({ data, reduced }: Props) {
  const tagline  = useRef(TAGLINES[Math.floor(Math.random() * TAGLINES.length)]).current
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [phase,     setPhase]     = useState(reduced ? 5 : 0)
  const [flagPhase, setFlagPhase] = useState<FlagPhase>('pre')

  useF1Confetti(canvasRef, true, reduced)

  useEffect(() => {
    if (reduced) return
    const t = [
      setTimeout(() => setFlagPhase('sweep'), 80),
      setTimeout(() => setFlagPhase('done'),  970),
      setTimeout(() => setPhase(1), 1050), // title
      setTimeout(() => setPhase(2), 1500), // tagline
      setTimeout(() => setPhase(3), 2000), // stats
      setTimeout(() => setPhase(4), 2500), // hint
    ]
    return () => t.forEach(clearTimeout)
  }, [reduced])

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]">

      {/* Ambient red radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 75% 50% at 50% 20%, rgba(225,6,0,0.22) 0%, transparent 65%)',
      }} />

      {/* Canvas confetti (behind content) */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />

      {/* Animated flag sweep */}
      <CheckeredFlag phase={reduced ? 'done' : flagPhase} />

      {/* Ambient glow rings */}
      <GlowRings active={phase >= 1} />

      {/* ── Main content ──────────────────────────────────────────── */}
      <div
        className="relative flex flex-col items-center text-center px-6 max-w-sm w-full"
        style={{ zIndex: 10 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 🏁 icon */}
        <div
          className="text-5xl mb-5 transition-all duration-500"
          style={{
            opacity:   phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? 'scale(1)' : 'scale(0.6)',
          }}
        >
          🏁
        </div>

        {/* Title */}
        <h1
          className={phase >= 1 && !reduced ? 'f1-stamp mb-2' : 'mb-2'}
          style={{
            fontFamily:  '"Inter", system-ui, sans-serif',
            fontSize:    'clamp(1.6rem, 5vw, 2.4rem)',
            fontWeight:  900,
            color:       '#ffffff',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            opacity:     phase >= 1 || reduced ? 1 : 0,
          }}
        >
          Session Complete
        </h1>

        {/* Tagline */}
        <p
          className={phase >= 2 && !reduced ? 'f1-tag-in mb-8 text-base font-bold tracking-widest uppercase' : 'mb-8 text-base font-bold tracking-widest uppercase'}
          style={{
            color:   '#e10600',
            opacity: phase >= 2 || reduced ? 1 : 0,
          }}
        >
          {tagline}
        </p>

        {/* Stats */}
        <div
          className={!reduced && phase >= 3 ? 'celeb-stats-in w-full' : 'w-full'}
          style={{ opacity: phase >= 3 || reduced ? 1 : 0 }}
        >
          <CelebrationStats data={data} dark accentColor="#e10600" />
        </div>

        {/* Dismiss hint */}
        <p
          className="text-xs mt-6 font-medium tracking-widest uppercase transition-opacity duration-500"
          style={{
            color:   'rgba(255,255,255,0.3)',
            opacity: phase >= 4 || reduced ? 1 : 0,
          }}
        >
          Tap anywhere to continue
        </p>
      </div>
    </div>
  )
}
