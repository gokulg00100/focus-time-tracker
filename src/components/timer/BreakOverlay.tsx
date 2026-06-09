import { CircularProgress } from './CircularProgress'
import { Button } from '../ui/Button'
import { formatSeconds } from '../../utils/time'
import { Coffee, SkipForward, PlusCircle } from 'lucide-react'

interface BreakOverlayProps {
  breakRemaining: number
  breakProgress: number
  plannedDurationSecs: number
  onSkip: () => void
  onExtend: (mins: number) => void
}

export function BreakOverlay({ breakRemaining, breakProgress, plannedDurationSecs, onSkip, onExtend }: BreakOverlayProps) {
  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in">
      <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400">
        <Coffee size={20} />
        <span className="text-lg font-semibold">Break Time</span>
      </div>

      <CircularProgress
        progress={1 - breakProgress}
        size={240}
        strokeWidth={10}
        color="#10b981"
        animated
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-emerald-500 mb-1">Remaining</span>
        <span className="font-mono font-bold text-4xl text-slate-900 dark:text-white">
          {formatSeconds(Math.max(Math.ceil(breakRemaining), 0))}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          of {formatSeconds(plannedDurationSecs)}
        </span>
      </CircularProgress>

      <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-xs">
        Take a moment to rest your eyes, stretch, and hydrate. You've earned it!
      </p>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="md" onClick={() => onExtend(5)} title="Add 5 minutes">
          <PlusCircle size={16} />
          +5 min
        </Button>
        <Button variant="success" size="lg" onClick={onSkip}>
          <SkipForward size={18} />
          Skip Break
        </Button>
      </div>
    </div>
  )
}
