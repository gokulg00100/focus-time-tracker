/**
 * Classic theme timer — circular progress ring.
 *
 * Accepts optional token overrides (timerTextColor, timerRingColor,
 * timerTrackColor, size) so ThemeTimerDisplay can drive it from the
 * centralised theme config.  Falls back to safe Tailwind dark-mode
 * classes when overrides are not provided.
 */

import { CircularProgress } from './CircularProgress'
import { formatSeconds }    from '../../utils/time'
import { clsx }             from 'clsx'
import type { TimerStatus } from '../../types'

interface TimerDisplayProps {
  status:              TimerStatus
  remainingFocusSecs:  number
  elapsedFocusSecs:    number
  progress:            number
  breakRemaining:      number
  breakProgress:       number
  plannedDurationSecs: number
  /** Ring diameter in px — defaults to 260 for mobile, set 420 for desktop */
  size?: number
  /**
   * Override the timer digit colour with a hex string from theme tokens.
   * When undefined, falls back to Tailwind's `text-slate-900 dark:text-white`.
   */
  timerTextColor?: string
  /**
   * Override the progress-arc colour.  When undefined, STATUS_COLORS applies.
   */
  timerRingColor?: string
  /** Override the trail-arc colour. */
  timerTrackColor?: string
}

const STATUS_COLORS: Record<TimerStatus, string> = {
  idle:      '#6366f1',
  running:   '#6366f1',
  paused:    '#f59e0b',
  break:     '#10b981',
  completed: '#10b981',
}

const STATUS_LABELS: Record<TimerStatus, string> = {
  idle:      'Ready',
  running:   'Focusing',
  paused:    'Paused',
  break:     'Break',
  completed: 'Completed!',
}

export function TimerDisplay({
  status,
  remainingFocusSecs,
  elapsedFocusSecs,
  progress,
  breakRemaining,
  breakProgress,
  plannedDurationSecs,
  size = 260,
  timerTextColor,
  timerRingColor,
  timerTrackColor,
}: TimerDisplayProps) {
  const isBreak       = status === 'break'
  const displaySecs   = isBreak ? breakRemaining : remainingFocusSecs
  const displayProgress = isBreak ? breakProgress : progress

  // Resolve ring colour: explicit override → state colours → default
  const ringColor =
    timerRingColor ??
    (status === 'paused'    ? '#f59e0b' :
     status === 'break'     ? '#10b981' :
     status === 'completed' ? '#10b981' :
     STATUS_COLORS[status])

  return (
    <div className="flex flex-col items-center gap-4">
      <CircularProgress
        progress={displayProgress}
        size={size}
        strokeWidth={Math.max(8, Math.round(size * 0.033))} // ~10px at 300, ~14px at 420
        color={ringColor}
        trailColor={timerTrackColor}
        animated
      >
        {/* Status label */}
        <span
          className={clsx(
            'text-xs font-semibold uppercase tracking-widest mb-1 transition-colors',
            isBreak
              ? 'text-emerald-500'
              : status === 'paused'
              ? 'text-amber-500'
              : 'text-primary-500'
          )}
        >
          {STATUS_LABELS[status]}
        </span>

        {/* Main time */}
        <span
          className={clsx(
            'font-mono font-bold transition-all select-none',
            displaySecs >= 3600 ? 'text-4xl' : 'text-5xl',
            // Only apply Tailwind colour class when no token override
            !timerTextColor && 'text-slate-900 dark:text-white'
          )}
          style={timerTextColor ? { color: timerTextColor } : undefined}
        >
          {formatSeconds(Math.max(Math.ceil(displaySecs), 0))}
        </span>

        {/* Sub-label */}
        <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          {isBreak
            ? 'break remaining'
            : status === 'idle'
            ? formatSeconds(plannedDurationSecs) + ' planned'
            : formatSeconds(Math.floor(elapsedFocusSecs)) + ' elapsed'}
        </span>
      </CircularProgress>

      {/* Progress percentage */}
      {status !== 'idle' && (
        <div
          className="text-sm font-bold tracking-widest"
          style={{ color: ringColor }}
        >
          {Math.round(displayProgress * 100)}%
        </div>
      )}
    </div>
  )
}
