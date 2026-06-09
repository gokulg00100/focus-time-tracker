import { clsx } from 'clsx'

interface ProgressBarProps {
  value: number // 0–100
  max?: number
  color?: 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animated?: boolean
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  color = 'primary',
  size = 'md',
  showLabel,
  animated,
  className,
}: ProgressBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100)

  const colors = {
    primary: 'bg-primary-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
  }
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }

  return (
    <div className={clsx('w-full', className)}>
      <div
        className={clsx(
          'w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden',
          heights[size]
        )}
      >
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-500',
            colors[color],
            animated && 'animate-pulse'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-right text-slate-500 dark:text-slate-400 mt-1">{Math.round(pct)}%</p>
      )}
    </div>
  )
}
