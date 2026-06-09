/**
 * CelebrationStats
 * ────────────────
 * Compact three-column stats card used inside every theme's celebration overlay.
 *
 * Columns: Focus Time · Current Streak · Today's Goal progress.
 *
 * `dark` prop flips colours to work on dark (F1/FIFA) backdrops.
 */

import { Clock, Flame, Target } from 'lucide-react'

export interface CelebrationData {
  completedSecs: number  // just-finished session duration
  streak:        number  // current daily streak (days)
  todayMins:     number  // total focus minutes accumulated today
  goalMins:      number  // user's daily goal in minutes
}

interface Props {
  data:         CelebrationData
  dark?:        boolean   // true → white text for F1/FIFA dark overlays
  accentColor?: string    // accent for icon tints
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatSecs(secs: number): string {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  if (h > 0)          return `${h}h ${m}m`
  if (m > 0 && s > 0) return `${m}m ${s}s`
  if (m > 0)          return `${m}m`
  return `${s}s`
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CelebrationStats({ data, dark = false, accentColor = '#6366f1' }: Props) {
  const goalPct = Math.min(Math.round((data.todayMins / Math.max(data.goalMins, 1)) * 100), 100)
  const dividerColor = dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)'

  const cols = [
    { icon: Clock,  color: accentColor,  label: 'Focus Time',     value: formatSecs(data.completedSecs) },
    { icon: Flame,  color: '#f97316',    label: 'Streak',         value: `${data.streak} day${data.streak !== 1 ? 's' : ''}` },
    { icon: Target, color: '#22c55e',    label: "Today's Goal",   value: `${goalPct}%` },
  ]

  return (
    <div
      className="rounded-2xl overflow-hidden w-full"
      style={{
        backgroundColor: dark ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.95)',
        border:          `1px solid ${dark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.07)'}`,
        backdropFilter:  'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="flex">
        {cols.map(({ icon: Icon, color, label, value }, i) => (
          <div
            key={label}
            className="flex-1 flex flex-col items-center gap-1 py-4 px-2"
            style={{ borderLeft: i > 0 ? `1px solid ${dividerColor}` : 'none' }}
          >
            <Icon size={15} style={{ color }} />
            <span
              className="text-base sm:text-lg font-bold tabular-nums leading-none"
              style={{ color: dark ? '#ffffff' : '#0f172a' }}
            >
              {value}
            </span>
            <span
              className="text-[10px] sm:text-xs font-medium text-center leading-tight"
              style={{ color: dark ? 'rgba(255,255,255,0.48)' : '#94a3b8' }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
