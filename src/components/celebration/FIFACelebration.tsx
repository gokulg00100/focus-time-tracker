/**
 * FIFACelebration
 * ───────────────
 * Stadium-atmosphere celebration for the FIFA World Cup theme.
 *
 * Sequence:
 *    0 ms → very-dark-green backdrop + confetti + green stadium glow
 *  300 ms → brief white goal-flash
 *  600 ms → flash fades; "⚽ GOOOOAAALLLL!!!" zooms in (goalZoom)
 * 1 200 ms → player-silhouette slides in (playerIn)
 * 1 800 ms → tagline fades up
 * 2 300 ms → stats card slides up
 * 2 800 ms → dismiss hint
 *
 * Visual: dark-stadium green · gold + green + white confetti ·
 * massive GOAL text in gold · celebrating-player silhouette.
 */

import { useEffect, useRef, useState } from 'react'
import { CelebrationStats, type CelebrationData } from './CelebrationStats'

// ── Taglines ──────────────────────────────────────────────────────────────────

const TAGLINES = [
  'Goal Scored!',
  'Championship Focus!',
  'Match Won!',
  'Victory Through Discipline!',
  'World-Class Performance!',
]

// ── Confetti ──────────────────────────────────────────────────────────────────

const FIFA_COLORS = ['#22c55e', '#4ade80', '#f59e0b', '#fbbf24', '#ffffff', '#86efac']

function useFIFAConfetti(canvasRef: React.RefObject<HTMLCanvasElement>, active: boolean, reduced: boolean) {
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
      x:     W * 0.5 + (Math.random() - 0.5) * W * 0.75,
      y:     H * 0.30,
      vx:    (Math.random() - 0.5) * 13,
      vy:    -(Math.random() * 13 + 2),
      rot:   Math.random() * 360,
      rotV:  (Math.random() - 0.5) * 12,
      color: FIFA_COLORS[Math.floor(Math.random() * FIFA_COLORS.length)],
      w:     Math.random() * 11 + 4,
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
        p.vy += 0.26;  p.vx *= 0.985
        p.rot += p.rotV
        p.life -= p.decay
      }
      if (alive) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [active]) // eslint-disable-line react-hooks/exhaustive-deps
}

// ── Player silhouette SVG ─────────────────────────────────────────────────────
// Simple celebrating human shape: arms raised in a V, legs spread.

function PlayerSilhouette() {
  return (
    <svg viewBox="0 0 64 90" width={64} height={90} aria-hidden>
      {/* Head */}
      <circle cx="32" cy="10" r="9" fill="white" opacity={0.85} />
      {/* Body */}
      <rect x="22" y="22" width="20" height="26" rx="6" fill="white" opacity={0.85} />
      {/* Left arm raised */}
      <line x1="22" y1="29" x2="4"  y2="10" stroke="white" strokeWidth="7.5" strokeLinecap="round" opacity={0.85} />
      {/* Right arm raised */}
      <line x1="42" y1="29" x2="60" y2="10" stroke="white" strokeWidth="7.5" strokeLinecap="round" opacity={0.85} />
      {/* Left leg */}
      <line x1="27" y1="48" x2="18" y2="78" stroke="white" strokeWidth="7.5" strokeLinecap="round" opacity={0.85} />
      {/* Right leg */}
      <line x1="37" y1="48" x2="46" y2="78" stroke="white" strokeWidth="7.5" strokeLinecap="round" opacity={0.85} />
    </svg>
  )
}

// ── Green glow pulse rings ────────────────────────────────────────────────────

function GlowRings({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {[0, 0.9, 1.8].map((d) => (
        <div
          key={d}
          className="absolute w-52 h-52 rounded-full"
          style={{
            border:    '2px solid rgba(74,222,128,0.30)',
            animation: `greenPulse 2.4s ease-out ${d}s infinite`,
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

export function FIFACelebration({ data, reduced }: Props) {
  const tagline   = useRef(TAGLINES[Math.floor(Math.random() * TAGLINES.length)]).current
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [phase,     setPhase]     = useState(reduced ? 6 : 0)
  const [flashOn,   setFlashOn]   = useState(false)

  useFIFAConfetti(canvasRef, true, reduced)

  useEffect(() => {
    if (reduced) return
    const t = [
      setTimeout(() => setFlashOn(true),   300),
      setTimeout(() => setFlashOn(false),  500),
      setTimeout(() => setPhase(1),        620),  // GOAL text
      setTimeout(() => setPhase(2),       1250),  // player
      setTimeout(() => setPhase(3),       1850),  // tagline
      setTimeout(() => setPhase(4),       2380),  // stats
      setTimeout(() => setPhase(5),       2900),  // hint
    ]
    return () => t.forEach(clearTimeout)
  }, [reduced])

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-[#071a0e]">

      {/* Stadium ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 55% at 50% 15%, rgba(34,197,94,0.20) 0%, transparent 60%)',
      }} />

      {/* Pitch stripe texture */}
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 58px, rgba(34,197,94,0.06) 58px, rgba(34,197,94,0.06) 60px)',
      }} />

      {/* Canvas confetti (behind content) */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />

      {/* Goal flash */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity"
        style={{
          backgroundColor: 'white',
          opacity:  flashOn ? 0.65 : 0,
          zIndex:   65,
          transition: flashOn ? 'opacity 0.08s ease' : 'opacity 0.25s ease',
        }}
      />

      {/* Ambient green rings */}
      <GlowRings active={phase >= 1} />

      {/* ── Main content ──────────────────────────────────────────── */}
      <div
        className="relative flex flex-col items-center text-center px-6 max-w-sm w-full"
        style={{ zIndex: 10 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Football + GOAL text */}
        <div
          className={phase >= 1 && !reduced ? 'goal-zoom' : ''}
          style={{
            opacity:    phase >= 1 || reduced ? 1 : 0,
            marginBottom: 8,
          }}
        >
          <span className="text-5xl">⚽</span>
          <h1
            style={{
              fontFamily:    '"Inter", system-ui, sans-serif',
              fontSize:      'clamp(2rem, 7vw, 3.2rem)',
              fontWeight:    900,
              color:         '#fbbf24',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              textShadow:    '0 0 30px rgba(251,191,36,0.5), 0 2px 0 rgba(0,0,0,0.4)',
              lineHeight:    1.1,
            }}
          >
            GOOOOAAALLLL!!!
          </h1>
        </div>

        {/* Player silhouette */}
        <div
          className={phase >= 2 && !reduced ? 'player-in my-3' : 'my-3'}
          style={{ opacity: phase >= 2 || reduced ? 1 : 0 }}
        >
          <PlayerSilhouette />
        </div>

        {/* Tagline */}
        <p
          className="text-base font-bold tracking-widest uppercase mb-6 transition-all duration-500"
          style={{
            color:     '#4ade80',
            opacity:   phase >= 3 || reduced ? 1 : 0,
            transform: phase >= 3 || reduced ? 'translateY(0)' : 'translateY(12px)',
          }}
        >
          {tagline}
        </p>

        {/* Stats */}
        <div
          className={!reduced && phase >= 4 ? 'celeb-stats-in w-full' : 'w-full'}
          style={{ opacity: phase >= 4 || reduced ? 1 : 0 }}
        >
          <CelebrationStats data={data} dark accentColor="#22c55e" />
        </div>

        {/* Dismiss hint */}
        <p
          className="text-xs mt-6 font-medium tracking-widest uppercase transition-opacity duration-500"
          style={{
            color:   'rgba(255,255,255,0.28)',
            opacity: phase >= 5 || reduced ? 1 : 0,
          }}
        >
          Tap anywhere to continue
        </p>
      </div>
    </div>
  )
}
