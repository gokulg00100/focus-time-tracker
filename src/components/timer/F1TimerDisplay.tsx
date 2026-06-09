/**
 * F1 Racing theme timer — speedometer-style arc gauge.
 *
 * Sizing: controlled entirely by the parent wrapper div.
 * The SVG uses viewBox="0 0 280 220" with className="w-full h-auto" so
 * it fills whatever container the parent provides.
 *
 * Token props replace all previously-hardcoded colours so the display
 * remains readable in both light and dark modes (WCAG AAA).
 */

import { formatSeconds } from '../../utils/time'
import type { TimerStatus } from '../../types'

// ── Arc geometry ──────────────────────────────────────────────────────────────

const CX = 140, CY = 175, R = 110
const FULL_C    = 2 * Math.PI * R          // 691.15
const ARC_DEG   = 240
const ARC_LEN   = (ARC_DEG / 360) * FULL_C // 460.77
const START_DEG = 150  // SVG degrees (0 ° = 3-o'clock)

function pt(deg: number, r = R) {
  const rad = (deg * Math.PI) / 180
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

const TICKS = Array.from({ length: 13 }, (_, i) => {
  const deg   = (START_DEG + i * 20) % 360
  const major = i % 4 === 0
  return {
    ...{ x1: pt(deg, R - (major ? 14 : 9)).x, y1: pt(deg, R - (major ? 14 : 9)).y },
    ...{ x2: pt(deg, R + 3).x,                y2: pt(deg, R + 3).y },
    major,
  }
})

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  status:              TimerStatus
  remainingFocusSecs:  number
  elapsedFocusSecs:    number
  progress:            number
  plannedDurationSecs: number
  /** WCAG-passing colour for the timer digits — from theme tokens */
  timerTextColor:  string
  /** Subtle track-arc colour — from theme tokens */
  timerTrackColor: string
  /** Active accent colour (may be overridden by state: amber=paused, green=break) */
  accentHex: string
  breakRemaining?: number
  breakProgress?:  number
}

const STATUS_LABELS: Record<TimerStatus, string> = {
  idle:      'READY',
  running:   'ON TRACK',
  paused:    'PIT STOP',
  break:     'COOLDOWN',
  completed: 'CHEQUERED',
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

  // Ring colour changes for pause / break — semantic state feedback
  const ringColor =
    status === 'paused' ? '#f59e0b' :
    status === 'break'  ? '#10b981' :
    accentHex

  const progressLen = displayPct * ARC_LEN
  const glowColor   = `${ringColor}99`

  // Sub-label alpha derived from timerTextColor — avoids hardcoded rgba
  // by appending hex opacity suffixes.
  const dimText  = timerTextColor + '70'  // ~44% opacity
  const faintText = timerTextColor + '40' // ~25% opacity

  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 280 220" className="w-full h-auto" aria-hidden>

        {/* ── Track arc ── */}
        <circle cx={CX} cy={CY} r={R}
          fill="none" stroke={timerTrackColor}
          strokeWidth={14}
          strokeDasharray={`${ARC_LEN} 99999`}
          transform={`rotate(${START_DEG} ${CX} ${CY})`}
          strokeLinecap="butt"
        />

        {/* ── Progress arc ── */}
        <circle cx={CX} cy={CY} r={R}
          fill="none" stroke={ringColor}
          strokeWidth={14}
          strokeDasharray={`${progressLen} 99999`}
          transform={`rotate(${START_DEG} ${CX} ${CY})`}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 12px ${glowColor})`,
            transition: 'stroke-dasharray 0.5s ease',
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

        {/* ── Endpoint dots ── */}
        {[pt(START_DEG, R), pt(30, R)].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4}
            fill={timerTrackColor} stroke={ringColor} strokeWidth={2}
          />
        ))}

        {/* ── Status label ── */}
        <text x={CX} y={CY - 26} textAnchor="middle"
          fill={ringColor} fontSize="9" fontWeight="700"
          fontFamily="Inter,system-ui,sans-serif" letterSpacing="2.5">
          {STATUS_LABELS[status]}
        </text>

        {/* ── Main time ── */}
        <text x={CX} y={CY + 8} textAnchor="middle"
          fill={timerTextColor}
          fontSize={displaySecs >= 3600 ? '28' : '34'}
          fontWeight="800"
          fontFamily="'JetBrains Mono','Courier New',monospace">
          {formatSeconds(Math.max(Math.ceil(displaySecs), 0))}
        </text>

        {/* ── Sub-label ── */}
        <text x={CX} y={CY + 26} textAnchor="middle"
          fill={dimText} fontSize="9"
          fontFamily="Inter,system-ui,sans-serif">
          {isBreak
            ? 'break remaining'
            : status === 'idle'
            ? formatSeconds(plannedDurationSecs) + ' planned'
            : formatSeconds(Math.floor(elapsedFocusSecs)) + ' elapsed'}
        </text>

        {/* ── Bottom decorative label ── */}
        <text x={CX} y={207} textAnchor="middle"
          fill={faintText} fontSize="8" fontWeight="600"
          fontFamily="Inter,system-ui,sans-serif" letterSpacing="4">
          LAP TIMER
        </text>
      </svg>

      {/* Progress % */}
      {status !== 'idle' && (
        <div className="text-sm font-bold tracking-widest" style={{ color: ringColor }}>
          {Math.round(displayPct * 100)}%
        </div>
      )}
    </div>
  )
}
