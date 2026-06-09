/**
 * FIFA World Cup theme timer — stadium scoreboard style.
 *
 * Two concentric rings + a crown of decorative dots.
 * The SVG uses viewBox="0 0 320 320" with className="w-full h-auto" so
 * the parent container controls the render size.
 *
 * Token props ensure WCAG-compliant text in both light and dark modes:
 *   Light: dark-green digits on near-white bg  ≈ 11 : 1 (AAA ✓)
 *   Dark:  near-white digits on very-dark-green ≈ 17 : 1 (AAA ✓)
 */

import { formatSeconds } from '../../utils/time'
import type { TimerStatus } from '../../types'

// ── Geometry ──────────────────────────────────────────────────────────────────

const CX = 160, CY = 160, R_OUTER = 110, R_INNER = 90

const arcLen = (r: number) => 2 * Math.PI * r

const DOTS = 30

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  status:              TimerStatus
  remainingFocusSecs:  number
  elapsedFocusSecs:    number
  progress:            number
  plannedDurationSecs: number
  /** WCAG-passing timer digit colour — from theme tokens */
  timerTextColor:  string
  /** Subtle track-ring colour — from theme tokens */
  timerTrackColor: string
  /** Active accent (may be overridden for paused/break states) */
  accentHex: string
  breakRemaining?: number
  breakProgress?:  number
}

const STATUS_LABELS: Record<TimerStatus, string> = {
  idle:      'KICK OFF',
  running:   'IN PLAY',
  paused:    'HALF TIME',
  break:     'RECOVERY',
  completed: 'FULL TIME',
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

  const outerC = arcLen(R_OUTER)
  const innerC = arcLen(R_INNER)
  const glowColor = `${ringColor}88`

  const dimText   = timerTextColor + '70'
  const faintText = timerTextColor + '40'

  // Decorative dot crown
  const dots = Array.from({ length: DOTS }, (_, i) => {
    const deg = (i / DOTS) * 360
    const rad = (deg * Math.PI) / 180
    const lit = i / DOTS < displayPct
    return {
      x: CX + (R_OUTER + 18) * Math.cos(rad),
      y: CY + (R_OUTER + 18) * Math.sin(rad),
      lit,
    }
  })

  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 320 320" className="w-full h-auto" aria-hidden>

        {/* ── Dot crown ── */}
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={3}
            fill={d.lit ? ringColor : timerTrackColor}
            style={{ transition: 'fill 0.3s ease' }}
          />
        ))}

        {/* ── Outer ring track ── */}
        <circle cx={CX} cy={CY} r={R_OUTER}
          fill="none" stroke={timerTrackColor}
          strokeWidth={8}
        />

        {/* ── Outer ring progress ── */}
        <circle cx={CX} cy={CY} r={R_OUTER}
          fill="none" stroke={ringColor}
          strokeWidth={8} strokeLinecap="round"
          strokeDasharray={`${displayPct * outerC} 99999`}
          transform={`rotate(-90 ${CX} ${CY})`}
          opacity={0.6}
          style={{
            filter: `drop-shadow(0 0 6px ${glowColor})`,
            transition: 'stroke-dasharray 0.5s ease',
          }}
        />

        {/* ── Inner ring track ── */}
        <circle cx={CX} cy={CY} r={R_INNER}
          fill="none" stroke={timerTrackColor}
          strokeWidth={16}
        />

        {/* ── Inner ring progress ── */}
        <circle cx={CX} cy={CY} r={R_INNER}
          fill="none" stroke={ringColor}
          strokeWidth={16} strokeLinecap="round"
          strokeDasharray={`${displayPct * innerC} 99999`}
          transform={`rotate(-90 ${CX} ${CY})`}
          style={{
            filter: `drop-shadow(0 0 14px ${glowColor})`,
            transition: 'stroke-dasharray 0.5s ease',
          }}
        />

        {/* ── Centre glow fill ── */}
        <circle cx={CX} cy={CY} r={72}
          fill={ringColor + '08'}
        />

        {/* ── Status label ── */}
        <text x={CX} y={CY - 30} textAnchor="middle"
          fill={ringColor} fontSize="9" fontWeight="700"
          fontFamily="Inter,system-ui,sans-serif" letterSpacing="3">
          {STATUS_LABELS[status]}
        </text>

        {/* ── Main time ── */}
        <text x={CX} y={CY + 14} textAnchor="middle"
          fill={timerTextColor}
          fontSize={displaySecs >= 3600 ? '34' : '42'}
          fontWeight="900"
          fontFamily="'JetBrains Mono','Courier New',monospace">
          {formatSeconds(Math.max(Math.ceil(displaySecs), 0))}
        </text>

        {/* ── Sub-label ── */}
        <text x={CX} y={CY + 34} textAnchor="middle"
          fill={dimText} fontSize="9"
          fontFamily="Inter,system-ui,sans-serif">
          {isBreak
            ? 'recovery time'
            : status === 'idle'
            ? formatSeconds(plannedDurationSecs) + ' planned'
            : formatSeconds(Math.floor(elapsedFocusSecs)) + ' elapsed'}
        </text>

        {/* ── Corner soccer-ball accents ── */}
        <text x={CX - 54} y={CY + 5}
          textAnchor="middle" fontSize="16" fill={faintText}>⚽</text>
        <text x={CX + 54} y={CY + 5}
          textAnchor="middle" fontSize="16" fill={faintText}>⚽</text>
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
