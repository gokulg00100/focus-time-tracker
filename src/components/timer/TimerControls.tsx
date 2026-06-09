import { Play, Pause, Square, RotateCcw } from 'lucide-react'
import { Button } from '../ui/Button'
import type { TimerStatus } from '../../types'

interface TimerControlsProps {
  status: TimerStatus
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
  onReset: () => void
}

export function TimerControls({ status, onStart, onPause, onResume, onStop, onReset }: TimerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* Reset */}
      {status !== 'idle' && (
        <Button variant="ghost" size="lg" onClick={onReset} title="Reset (R)">
          <RotateCcw size={20} />
        </Button>
      )}

      {/* Main action */}
      {status === 'idle' || status === 'completed' ? (
        <Button variant="primary" size="xl" onClick={onStart} className="shadow-glow min-w-[140px]">
          <Play size={22} className="fill-current" />
          Start Focus
        </Button>
      ) : status === 'running' ? (
        <Button variant="secondary" size="xl" onClick={onPause} className="min-w-[140px]">
          <Pause size={22} />
          Pause
        </Button>
      ) : status === 'paused' ? (
        <Button variant="primary" size="xl" onClick={onResume} className="shadow-glow min-w-[140px]">
          <Play size={22} className="fill-current" />
          Resume
        </Button>
      ) : (
        // Break state — controls handled by BreakOverlay
        null
      )}

      {/* Stop */}
      {status !== 'idle' && status !== 'completed' && (
        <Button variant="ghost" size="lg" onClick={onStop} title="Stop (Esc)" className="text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
          <Square size={20} className="fill-current" />
        </Button>
      )}
    </div>
  )
}
