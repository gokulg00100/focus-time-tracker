/**
 * F1 Racing theme timer — speedometer-style arc gauge.
 *
 * SVG layout (viewBox 0 0 280 220):
 *   Centre (140, 175), radius 110
 *   Arc spans 240 ° clockwise, starting at SVG 150 ° (lower-left),
 *   sweeping through 270 ° (top) to 30 ° (lower-right).
 *   Tick marks every 20 ° (12 marks + start = 13 total).
 */

import { formatSeconds } from '../../utils/time'
import type { TimerStatus } from '../../types'

const CX = 140, CY = 175, R = 110
const FULL_C      = 2 * Math.PI * R          // 691.15
const ARC_DEG     = 240
const ARC_LEN     = (ARC_DEG / 360) * FULL_C // 460.77
const START_DEG   = 150  // SVG degrees (0° = 3-o'clock)

/** Convert SVG degrees → radians, return {x, y} on the arc circle */
function pt(deg: number, r = R) {
  const rad = (deg * Math.PI) / 180
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

/** Build tick-mark line data (13 ticks every 20 ° along the 240 ° arc) */
const TICKS = Array.from({ length: 13 }, (_, i) => {
  const deg     = (START_DEG + i * 20) % 360
  const major   = i % 4 === 0
  const inner   = pt(deg, R - (major ? 14 : 9))
  const outer   = pt(deg, R + 3)
  return { x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y, major }
})

interface Props {
  status:              TimerStatus
  remainingFocusSecs:  number
  elapsedFocusSecs:    number
  progress:            number
  plannedDurationSecs: number
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

export function F1TimerDisplay({
  status, remainingFocusSecs, elapsedFocusSecs,
  progress, plannedDurationSecs, accentHex,
  breakRemaining = 0, breakProgress = 0,
}: Props) {
  const isBreak     = status === 'break'
  const displaySecs = isBreak ? breakRemaining : remainingFocusSecs
  const displayPct  = isBreak ? breakProgress  : progress
  const color       = status === 'paused' ? '#f59e0b' : status === 'break' ? '#10b981' : accentHex

  const progressLen = displayPct * ARC_LEN
  const glowColor   = `${color}99`

  return (
    <div className="flex flex-col items-center gap-4">
      {/* SVG speedometer */}
      <div className="relative">
        <svg viewBox="0 0 280 220" width="320" height="249" aria-hidden>

          {/* ── Track arc ── */}
          <circle cx={CX} cy={CY} r={R}
            fill="none"
            stroke="#1c1c1c"
            strokeWidth={14}
            strokeDasharray={`${ARC_LEN} 99999`}
            transform={`rotate(${START_DEG} ${CX} ${CY})`}
            strokeLinecap="butt"
          />

          {/* ── Progress arc ── */}
          <circle cx={CX} cy={CY} r={R}
            fill="none"
            stroke={color}
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
              stroke={t.major ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.18)'}
              strokeWidth={t.major ? 2.5 : 1.5}
              strokeLinecap="round"
            />
          ))}

          {/* ── Endpoint dots ── */}
          {[pt(START_DEG, R), pt(30, R)].map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={4}
              fill="#2a2a2a" stroke={color} strokeWidth={2}
            />
          ))}

          {/* ── Inner centre text ── */}
          {/* Status label */}
          <text x={CX} y={CY - 26} textAnchor="middle"
            fill={color} fontSize="9" fontWeight="700"
            fontFamily="Inter,system-ui,sans-serif" letterSpacing="2.5">
            {STATUS_LABELS[status]}
          </text>

          {/* Main time */}
          <text x={CX} y={CY + 8} textAnchor="middle"
            fill="white" fontSize={displaySecs >= 3600 ? '28' : '34'}
            fontWeight="800" fontFamily="'JetBrains Mono',monospace">
            {formatSeconds(Math.max(Math.ceil(displaySecs), 0))}
          </text>

          {/* Sub-label */}
          <text x={CX} y={CY + 26} textAnchor="middle"
            fill="rgba(255,255,255,0.45)" fontSize="9"
            fontFamily="Inter,system-ui,sans-serif">
            {isBreak
              ? 'break remaining'
              : status === 'idle'
              ? formatSeconds(plannedDurationSecs) + ' planned'
              : formatSeconds(Math.floor(elapsedFocusSecs)) + ' elapsed'}
          </text>

          {/* ── Bottom "RPM" label ── */}
          <text x={CX} y={207} textAnchor="middle"
            fill="rgba(255,255,255,0.25)" fontSize="8" fontWeight="600"
            fontFamily="Inter,system-ui,sans-serif" letterSpacing="4">
            LAP TIMER
          </text>
        </svg>
      </div>

      {/* Progress % */}
      {status !== 'idle' && (
        <div className="text-sm font-bold tracking-wider" style={{ color }}>
          {Math.round(displayPct * 100)}%
        </div>
      )}
    </div>
  )
}
