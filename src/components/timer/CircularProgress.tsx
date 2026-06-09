import { clsx } from 'clsx'

interface CircularProgressProps {
  progress: number // 0–1
  size?: number
  strokeWidth?: number
  color?: string
  trailColor?: string
  children?: React.ReactNode
  className?: string
  animated?: boolean
}

export function CircularProgress({
  progress,
  size = 280,
  strokeWidth = 12,
  color = '#6366f1',
  trailColor,
  children,
  className,
  animated = true,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.min(Math.max(progress, 0), 1))

  return (
    <div className={clsx('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
        className="absolute"
      >
        {/* Trail */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trailColor ?? 'currentColor'}
          strokeWidth={strokeWidth}
          className="text-slate-200 dark:text-slate-700"
          opacity={0.4}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: animated ? 'stroke-dashoffset 0.5s ease' : undefined,
            filter: `drop-shadow(0 0 8px ${color}66)`,
          }}
        />
      </svg>
      <div className="relative z-10 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  )
}
