/**
 * F1 Racing theme timer — speedometer arc gauge with animated race car.
 *
 * The Formula 1 car travels along the 240 ° progress arc:
 *   • Running  → car drives smoothly at the arc tip + red neon glow trail
 *   • Paused   → car shakes in place (pit-stop animation)
 *   • Idle     → no car displayed
 *   • Complete → car sits at 100 % position, engine glows
 *
 * Position animation: useSmoothValue interpolates between each 1-second
 * timer tick at 60 fps (cubic ease-out, 650 ms) so the car moves fluidly.
 *
 * Car orientation: drawn facing RIGHT (+x).  SVG transform `rotate(θ+90)`
 * aligns the nose to the clockwise tangent at arc angle θ.
 */

import { useState, useEffect, useRef } from 'react'
import { formatSeconds } from '../../utils/time'
import type { TimerStatus } from '../../types'

// ── Arc geometry ──────────────────────────────────────────────────────────────

const CX = 140, CY = 175, R = 110
const FULL_C    = 2 * Math.PI * R
const ARC_DEG   = 240
const ARC_LEN   = (ARC_DEG / 360) * FULL_C
const START_DEG = 150

function pt(deg: number, r = R) {
  const rad = (deg * Math.PI) / 180
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

const TICKS = Array.from({ length: 13 }, (_, i) => {
  const deg   = (START_DEG + i * 20) % 360
  const major = i % 4 === 0
  return {
    x1: pt(deg, R - (major ? 14 : 9)).x, y1: pt(deg, R - (major ? 14 : 9)).y,
    x2: pt(deg, R + 3).x,                y2: pt(deg, R + 3).y,
    major,
  }
})

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
      const eased = 1 - Math.pow(1 - t, 3) // cubic ease-out
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
  idle:      'READY',
  running:   'ON TRACK',
  paused:    'PIT STOP',
  break:     'COOLDOWN',
  completed: 'CHEQUERED',
}

// ── F1 Car SVG (drawn facing right, origin at centre of car) ─────────────────

function F1Car({ color, isPitStop }: { color: string; isPitStop: boolean }) {
  return (
    /* Outer group: positioned & rotated by parent.
       Inner group: receives CSS pit-stop animation. */
    <g className={isPitStop ? 'f1-pit-stop' : 'actor-appear'}>
      {/* Exhaust glow behind the car */}
      <ellipse cx="-14" cy="0" rx="8" ry="4"
        fill={color} opacity="0.25"
        style={{ filter: 'blur(5px)' }}
      />

      {/* ── Car body ── */}
      {/* Rear wing */}
      <rect x="-14" y="-7" width="3.5" height="14" rx="1.8"
        fill="rgba(180,180,180,0.85)"/>
      {/* Main body — tapered teardrop shape */}
      <path d="M -10,-3.5 L 6,-3.5 Q 16,0 6,3.5 L -10,3.5 Z"
        fill={color}/>
      {/* Cockpit / halo */}
      <ellipse cx="-1" cy="0" rx="4.5" ry="2.2" fill="#0a0a0a"/>
      {/* Front wing */}
      <rect x="8" y="-5.5" width="6" height="2" rx="1" fill={color} opacity="0.8"/>
      <rect x="8" y="3.5"  width="6" height="2" rx="1" fill={color} opacity="0.8"/>
      {/* Race number stripe */}
      <rect x="-5" y="-1.2" width="7" height="2.4" rx="1.2"
        fill="white" opacity="0.55"/>

      {/* ── Wheels ── */}
      {/* Front pair */}
      <rect x="3" y="-8"  width="4.5" height="4.5" rx="2.2" fill="#111"/>
      <rect x="3" y="3.5" width="4.5" height="4.5" rx="2.2" fill="#111"/>
      {/* Rear pair */}
      <rect x="-10" y="-8"  width="4.5" height="4.5" rx="2.2" fill="#111"/>
      <rect x="-10" y="3.5" width="4.5" height="4.5" rx="2.2" fill="#111"/>

      {/* Wheel glint */}
      <circle cx="5.2"   cy="-5.8" r="1.2" fill="rgba(255,255,255,0.3)"/>
      <circle cx="5.2"   cy="5.8"  r="1.2" fill="rgba(255,255,255,0.3)"/>
      <circle cx="-7.8"  cy="-5.8" r="1.2" fill="rgba(255,255,255,0.3)"/>
      <circle cx="-7.8"  cy="5.8"  r="1.2" fill="rgba(255,255,255,0.3)"/>
    </g>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function F1TimerDisplay({
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

  // Smooth position for the car (runs at 60 fps between 1-second ticks)
  const smoothPct = useSmoothValue(displayPct, 650)

  // Car position along the 240 ° arc
  const carAngleDeg   = (START_DEG + smoothPct * ARC_DEG) % 360
  const carRad        = carAngleDeg * Math.PI / 180
  const carX          = CX + R * Math.cos(carRad)
  const carY          = CY + R * Math.sin(carRad)
  const carRot        = carAngleDeg + 90 // tangent for clockwise travel

  const showCar = smoothPct > 5e-4 && status !== 'idle'

  const progressLen = smoothPct * ARC_LEN
  const dimText     = timerTextColor + '70'
  const faintText   = timerTextColor + '40'
  const glowColor   = ringColor + '99'

  return (
    <div className="flex flex-col items-center gap-3">
      {/* SVG viewBox extended to 235 to avoid clipping arc endpoints */}
      <svg viewBox="0 0 280 235" overflow="visible" className="w-full h-auto" aria-hidden>

        {/* ── Radial depth gradient behind the arc ── */}
        <defs>
          <radialGradient id="arcDepth" cx="50%" cy="75%" r="55%">
            <stop offset="0%"   stopColor={ringColor} stopOpacity="0.04"/>
            <stop offset="100%" stopColor={ringColor} stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect width="280" height="235" fill="url(#arcDepth)"/>

        {/* ── Track arc ── */}
        <circle cx={CX} cy={CY} r={R}
          fill="none" stroke={timerTrackColor}
          strokeWidth={14}
          strokeDasharray={`${ARC_LEN} 99999`}
          transform={`rotate(${START_DEG} ${CX} ${CY})`}
          strokeLinecap="round"
        />

        {/* ── Glow trail (wider semi-transparent arc just behind progress tip) ── */}
        {showCar && progressLen > 30 && (
          <circle cx={CX} cy={CY} r={R}
            fill="none" stroke={ringColor}
            strokeWidth={22}
            strokeDasharray={`${Math.min(progressLen, 50)} 99999`}
            strokeDashoffset={-(Math.max(0, progressLen - 50))}
            transform={`rotate(${START_DEG} ${CX} ${CY})`}
            strokeLinecap="round"
            opacity={0.18}
            style={{ filter: `blur(4px)` }}
          />
        )}

        {/* ── Progress arc ── */}
        <circle cx={CX} cy={CY} r={R}
          fill="none" stroke={ringColor}
          strokeWidth={14}
          strokeDasharray={`${progressLen} 99999`}
          transform={`rotate(${START_DEG} ${CX} ${CY})`}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 10px ${glowColor})`,
            transition: 'stroke 0.3s ease',
          }}
        />

        {/* ── Tick marks ── */}
        {TICKS.map((t, i) => (
          <line key={i}
            x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke={t.major ? timerTextColor + '55' : timerTextColor + '28'}
            strokeWidth={t.major ? 2.5 : 1.5}
            strokeLinecap="round"
          />
        ))}

        {/* ── Arc endpoint dots ── */}
        {[pt(START_DEG), pt(30)].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4.5}
            fill={timerTrackColor} stroke={timerTrackColor} strokeWidth={2}
          />
        ))}

        {/* ── Animated F1 car ── */}
        {showCar && (
          <g transform={`translate(${carX},${carY}) rotate(${carRot})`}>
            {/* Outer glow halo */}
            <circle r={18} fill={ringColor} opacity={0.12}
              style={{ filter: 'blur(8px)' }}
            />
            {/* Car */}
            <F1Car color={ringColor} isPitStop={status === 'paused'} />

            {/* Paused: amber warning ring */}
            {status === 'paused' && (
              <circle r={24} fill="none"
                stroke="#f59e0b" strokeWidth={2}
                opacity={0.7}
                className="animate-ring-pulse"
              />
            )}
          </g>
        )}

        {/* ── Centre text ── */}
        <text x={CX} y={CY - 26} textAnchor="middle"
          fill={ringColor} fontSize="9" fontWeight="700"
          fontFamily="Inter,system-ui,sans-serif" letterSpacing="2.5">
          {STATUS_LABELS[status]}
        </text>

        <text x={CX} y={CY + 8} textAnchor="middle"
          fill={timerTextColor}
          fontSize={displaySecs >= 3600 ? '30' : '36'}
          fontWeight="800"
          fontFamily="'JetBrains Mono','Courier New',monospace">
          {formatSeconds(Math.max(Math.ceil(displaySecs), 0))}
        </text>

        <text x={CX} y={CY + 27} textAnchor="middle"
          fill={dimText} fontSize="9"
          fontFamily="Inter,system-ui,sans-serif">
          {isBreak
            ? 'break remaining'
            : status === 'idle'
            ? formatSeconds(plannedDurationSecs) + ' planned'
            : formatSeconds(Math.floor(elapsedFocusSecs)) + ' elapsed'}
        </text>

        <text x={CX} y={222} textAnchor="middle"
          fill={faintText} fontSize="8" fontWeight="600"
          fontFamily="Inter,system-ui,sans-serif" letterSpacing="4">
          LAP TIMER
        </text>
      </svg>

      {status !== 'idle' && (
        <div className="text-sm font-bold tracking-widest" style={{ color: ringColor }}>
          {Math.round(displayPct * 100)}%
        </div>
      )}
    </div>
  )
}
