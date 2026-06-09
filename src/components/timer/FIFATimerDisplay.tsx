/**
 * FIFA World Cup theme timer — stadium scoreboard style.
 *
 * Two concentric rings:
 *   Outer:  r=110, strokeWidth=8  — thin "stadium lights" ring
 *   Inner:  r=90,  strokeWidth=16 — thick progress ring
 * Bold digital countdown in the centre, flanked by a stadium-arch motif.
 */

import { formatSeconds } from '../../utils/time'
import type { TimerStatus } from '../../types'

const CX = 160, CY = 160, R_OUTER = 110, R_INNER = 90

function arcLen(r: number) { return 2 * Math.PI * r }

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
  idle:      'KICK OFF',
  running:   'IN PLAY',
  paused:    'HALF TIME',
  break:     'RECOVERY',
  completed: 'FULL TIME',
}

const DOTS = 30  // decorative dots around the outer ring

export function FIFATimerDisplay({
  status, remainingFocusSecs, elapsedFocusSecs,
  progress, plannedDurationSecs, accentHex,
  breakRemaining = 0, breakProgress = 0,
}: Props) {
  const isBreak    = status === 'break'
  const displaySecs = isBreak ? breakRemaining : remainingFocusSecs
  const displayPct  = isBreak ? breakProgress  : progress
  const color       = status === 'paused' ? '#f59e0b' : status === 'break' ? '#10b981' : accentHex
  const outerC      = arcLen(R_OUTER)
  const innerC      = arcLen(R_INNER)
  const glowColor   = `${color}88`

  // Decorative dots placed evenly around the outer ring
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
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg viewBox="0 0 320 320" width="300" height="300" aria-hidden>

          {/* ── Outer decorative dot ring ── */}
          {dots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={3}
              fill={d.lit ? color : 'rgba(255,255,255,0.12)'}
              style={{ transition: 'fill 0.3s ease' }}
            />
          ))}

          {/* ── Outer ring track ── */}
          <circle cx={CX} cy={CY} r={R_OUTER}
            fill="none" stroke="rgba(255,255,255,0.06)"
            strokeWidth={8}
          />

          {/* ── Outer ring progress ── */}
          <circle cx={CX} cy={CY} r={R_OUTER}
            fill="none" stroke={color}
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
            fill="none" stroke="rgba(255,255,255,0.08)"
            strokeWidth={16}
          />

          {/* ── Inner ring progress ── */}
          <circle cx={CX} cy={CY} r={R_INNER}
            fill="none" stroke={color}
            strokeWidth={16} strokeLinecap="round"
            strokeDasharray={`${displayPct * innerC} 99999`}
            transform={`rotate(-90 ${CX} ${CY})`}
            style={{
              filter: `drop-shadow(0 0 14px ${glowColor})`,
              transition: 'stroke-dasharray 0.5s ease',
            }}
          />

          {/* ── Centre fill circle ── */}
          <circle cx={CX} cy={CY} r={72}
            fill={`${color}08`}
          />

          {/* ── Status label ── */}
          <text x={CX} y={CY - 30} textAnchor="middle"
            fill={color} fontSize="9" fontWeight="700"
            fontFamily="Inter,system-ui,sans-serif" letterSpacing="3">
            {STATUS_LABELS[status]}
          </text>

          {/* ── Main time ── */}
          <text x={CX} y={CY + 14}
            textAnchor="middle"
            fill="white"
            fontSize={displaySecs >= 3600 ? '34' : '42'}
            fontWeight="900"
            fontFamily="'JetBrains Mono','Courier New',monospace">
            {formatSeconds(Math.max(Math.ceil(displaySecs), 0))}
          </text>

          {/* ── Sub-label ── */}
          <text x={CX} y={CY + 34} textAnchor="middle"
            fill="rgba(255,255,255,0.4)" fontSize="9"
            fontFamily="Inter,system-ui,sans-serif">
            {isBreak
              ? 'recovery time'
              : status === 'idle'
              ? formatSeconds(plannedDurationSecs) + ' planned'
              : formatSeconds(Math.floor(elapsedFocusSecs)) + ' elapsed'}
          </text>

          {/* ── Corner soccer-ball hex accents ── */}
          <text x={CX - 54} y={CY + 5}
            textAnchor="middle" fontSize="16" opacity="0.15">⚽</text>
          <text x={CX + 54} y={CY + 5}
            textAnchor="middle" fontSize="16" opacity="0.15">⚽</text>
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
