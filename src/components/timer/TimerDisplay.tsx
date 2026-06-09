import { CircularProgress } from './CircularProgress'
import { formatSeconds } from '../../utils/time'
import { clsx } from 'clsx'
import type { TimerStatus } from '../../types'

interface TimerDisplayProps {
  status: TimerStatus
  remainingFocusSecs: number
  elapsedFocusSecs: number
  progress: number
  breakRemaining: number
  breakProgress: number
  plannedDurationSecs: number
}

const STATUS_COLORS: Record<TimerStatus, string> = {
  idle: '#6366f1',
  running: '#6366f1',
  paused: '#f59e0b',
  break: '#10b981',
  completed: '#10b981',
}

const STATUS_LABELS: Record<TimerStatus, string> = {
  idle: 'Ready',
  running: 'Focusing',
  paused: 'Paused',
  break: 'Break',
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
}: TimerDisplayProps) {
  const isBreak = status === 'break'
  const displaySecs = isBreak ? breakRemaining : remainingFocusSecs
  const displayProgress = isBreak ? breakProgress : progress
  const color = STATUS_COLORS[status]

  return (
    <div className="flex flex-col items-center gap-4">
      <CircularProgress
        progress={displayProgress}
        size={280}
        strokeWidth={10}
        color={color}
        animated
      >
        {/* Status label */}
        <span
          className={clsx(
            'text-xs font-semibold uppercase tracking-widest mb-1 transition-colors',
            isBreak ? 'text-emerald-500' : status === 'paused' ? 'text-amber-500' : 'text-primary-500'
          )}
        >
          {STATUS_LABELS[status]}
        </span>

        {/* Main time display */}
        <span
          className={clsx(
            'font-mono font-bold text-slate-900 dark:text-white transition-all select-none',
            displaySecs >= 3600 ? 'text-4xl' : 'text-5xl'
          )}
        >
          {formatSeconds(Math.max(Math.ceil(displaySecs), 0))}
        </span>

        {/* Planned / elapsed sub-label */}
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
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {Math.round((isBreak ? breakProgress : progress) * 100)}% complete
        </div>
      )}
    </div>
  )
}
