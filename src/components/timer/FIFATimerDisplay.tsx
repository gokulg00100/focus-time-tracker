/**
 * FIFA World Cup theme timer — stadium scoreboard style with animated football.
 *
 * The football travels clockwise around the outer ring:
 *   • Running   → ball moves smoothly at the ring tip + rolls (spins)
 *   • Paused    → ball bounces in place (half-time animation)
 *   • Completed → ball sits at 100 % with a glow
 *   • Idle      → no ball shown
 *
 * Rolling physics:
 *   ballSpin = progress × 360 × (R_OUTER / ballRadius) degrees
 *   (arc distance ÷ circumference × 360 °)
 *
 * Position starts at the top (−90 °) and travels clockwise.
 */

import { useState, useEffect, useRef } from 'react'
import { formatSeconds } from '../../utils/time'
import type { TimerStatus } from '../../types'

// ── Geometry ──────────────────────────────────────────────────────────────────

const CX = 160, CY = 160, R_OUTER = 110, R_INNER = 90
const BALL_R = 10 // radius of the football
const arcLen = (r: number) => 2 * Math.PI * r
const DOTS = 32

// ── Smooth animation hook ─────────────────────────────────────────────────────

function useSmoothValue(target: number, duration = 650): number {
  const [value, setValue] = useState(target)
  const prevRef = useRef(target)

  useEffect(() => {
    const from = prevRef.current
    prevRef.current = target
    if (Math.abs(target - from) < 5e-5) { setValue(target); return }

    let raf: number
    const t0 = performance.now()

    const step = (now: number) => {
      const t     = Math.min((now - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(from + (target - from) * eased)
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return value
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  status:              TimerStatus
  remainingFocusSecs:  number
  elapsedFocusSecs:    number
  progress:            number
  plannedDurationSecs: number
  timerTextColor:      string
  timerTrackColor:     string
  accentHex:           string
  breakRemaining?:     number
  breakProgress?:      number
}

const STATUS_LABELS: Record<TimerStatus, string> = {
  idle:      'KICK OFF',
  running:   'IN PLAY',
  paused:    'HALF TIME',
  break:     'RECOVERY',
  completed: 'FULL TIME',
}

// ── Football SVG ──────────────────────────────────────────────────────────────

function Football({ isPaused }: { isPaused: boolean }) {
  return (
    <g className={isPaused ? 'ball-half-time' : 'actor-appear'}>
      {/* Glow shadow */}
      <circle r={BALL_R + 5} fill="#22c55e" opacity={0.2}
        style={{ filter: 'blur(5px)' }}
      />
      {/* White ball */}
      <circle r={BALL_R} fill="white"/>
      {/* Outer ring */}
      <circle r={BALL_R} fill="none" stroke="#1a1a1a" strokeWidth="0.6"/>

      {/* ── Black pentagon patches (classic football pattern) ── */}
      {/* Centre pentagon */}
      <polygon
        points="0,-4 3.8,-1.2 2.4,3.2 -2.4,3.2 -3.8,-1.2"
        fill="#1a1a1a"/>
      {/* 5 satellite pentagons — positioned around the centre */}
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const rad = ((deg - 90) * Math.PI) / 180
        const px  = 6.5 * Math.cos(rad)
        const py  = 6.5 * Math.sin(rad)
        return (
          <polygon key={i}
            transform={`translate(${px},${py}) rotate(${deg})`}
            points="0,-2.5 2.4,-0.8 1.5,2 -1.5,2 -2.4,-0.8"
            fill="#1a1a1a"
          />
        )
      })}
    </g>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function FIFATimerDisplay({
  status, remainingFocusSecs, elapsedFocusSecs,
  progress, plannedDurationSecs,
  timerTextColor, timerTrackColor, accentHex,
  breakRemaining = 0, breakProgress = 0,
}: Props) {
  const isBreak    = status === 'break'
  const displaySecs = isBreak ? breakRemaining : remainingFocusSecs
  const displayPct  = isBreak ? breakProgress  : progress

  const ringColor =
    status === 'paused' ? '#f59e0b' :
    status === 'break'  ? '#10b981' :
    accentHex

  const smoothPct = useSmoothValue(displayPct, 650)

  // Football travels clockwise from top (−90 °)
  const ballAngleDeg = (-90 + smoothPct * 360) % 360
  const ballRad      = ballAngleDeg * Math.PI / 180
  const ballX        = CX + R_OUTER * Math.cos(ballRad)
  const ballY        = CY + R_OUTER * Math.sin(ballRad)
  // Rolling spin: arc distance ÷ ball circumference × 360 °
  const ballSpin     = smoothPct * 360 * (R_OUTER / BALL_R)

  const showBall = smoothPct > 5e-4 && status !== 'idle'

  const outerC = arcLen(R_OUTER)
  const innerC = arcLen(R_INNER)
  const glowColor  = ringColor + '88'
  const dimText    = timerTextColor + '70'
  const faintText  = timerTextColor + '40'

  // Decorative dot crown
  const dots = Array.from({ length: DOTS }, (_, i) => {
    const deg  = (i / DOTS) * 360
    const rad  = (deg * Math.PI) / 180
    const lit  = i / DOTS < smoothPct
    return {
      x: CX + (R_OUTER + 20) * Math.cos(rad),
      y: CY + (R_OUTER + 20) * Math.sin(rad),
      lit,
    }
  })

  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 320 320" className="w-full h-auto" aria-hidden>
        <defs>
          <radialGradient id="stadiumGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={ringColor} stopOpacity="0.06"/>
            <stop offset="100%" stopColor={ringColor} stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* Ambient centre fill */}
        <rect width="320" height="320" fill="url(#stadiumGlow)"/>

        {/* ── Dot crown ── */}
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={3.5}
            fill={d.lit ? ringColor : timerTrackColor}
            style={{ transition: 'fill 0.3s ease' }}
          />
        ))}

        {/* ── Outer ring track ── */}
        <circle cx={CX} cy={CY} r={R_OUTER}
          fill="none" stroke={timerTrackColor} strokeWidth={8}
        />

        {/* ── Outer ring progress ── */}
        <circle cx={CX} cy={CY} r={R_OUTER}
          fill="none" stroke={ringColor}
          strokeWidth={8} strokeLinecap="round"
          strokeDasharray={`${smoothPct * outerC} 99999`}
          transform={`rotate(-90 ${CX} ${CY})`}
          opacity={0.65}
          style={{
            filter: `drop-shadow(0 0 6px ${glowColor})`,
            transition: 'stroke-dasharray 0.5s ease, stroke 0.3s ease',
          }}
        />

        {/* ── Inner ring track ── */}
        <circle cx={CX} cy={CY} r={R_INNER}
          fill="none" stroke={timerTrackColor} strokeWidth={16}
        />

        {/* ── Inner ring progress ── */}
        <circle cx={CX} cy={CY} r={R_INNER}
          fill="none" stroke={ringColor}
          strokeWidth={16} strokeLinecap="round"
          strokeDasharray={`${smoothPct * innerC} 99999`}
          transform={`rotate(-90 ${CX} ${CY})`}
          style={{
            filter: `drop-shadow(0 0 16px ${glowColor})`,
            transition: 'stroke-dasharray 0.5s ease, stroke 0.3s ease',
          }}
        />

        {/* ── Centre ambient fill ── */}
        <circle cx={CX} cy={CY} r={72} fill={ringColor + '0a'}/>

        {/* ── Animated football ── */}
        {showBall && (
          <g transform={`translate(${ballX},${ballY}) rotate(${ballSpin})`}>
            <Football isPaused={status === 'paused'} />
          </g>
        )}

        {/* ── Status label ── */}
        <text x={CX} y={CY - 30} textAnchor="middle"
          fill={ringColor} fontSize="9" fontWeight="700"
          fontFamily="Inter,system-ui,sans-serif" letterSpacing="3">
          {STATUS_LABELS[status]}
        </text>

        {/* ── Main time ── */}
        <text x={CX} y={CY + 14} textAnchor="middle"
          fill={timerTextColor}
          fontSize={displaySecs >= 3600 ? '36' : '44'}
          fontWeight="900"
          fontFamily="'JetBrains Mono','Courier New',monospace">
          {formatSeconds(Math.max(Math.ceil(displaySecs), 0))}
        </text>

        {/* ── Sub-label ── */}
        <text x={CX} y={CY + 35} textAnchor="middle"
          fill={dimText} fontSize="9"
          fontFamily="Inter,system-ui,sans-serif">
          {isBreak
            ? 'recovery time'
            : status === 'idle'
            ? formatSeconds(plannedDurationSecs) + ' planned'
            : formatSeconds(Math.floor(elapsedFocusSecs)) + ' elapsed'}
        </text>

        {/* ── Corner accent balls (decorative) ── */}
        <text x={CX - 56} y={CY + 6} textAnchor="middle"
          fontSize="15" fill={faintText}>⚽</text>
        <text x={CX + 56} y={CY + 6} textAnchor="middle"
          fontSize="15" fill={faintText}>⚽</text>
      </svg>

      {status !== 'idle' && (
        <div className="text-sm font-bold tracking-widest" style={{ color: ringColor }}>
          {Math.round(displayPct * 100)}%
        </div>
      )}
    </div>
  )
}
