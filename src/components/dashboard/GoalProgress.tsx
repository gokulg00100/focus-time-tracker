import { Card } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'
import { Target } from 'lucide-react'
import { formatDuration } from '../../utils/time'
import type { GoalProgress as GoalProgressType } from '../../hooks/useGoals'
import { clsx } from 'clsx'

interface GoalProgressProps {
  goals: GoalProgressType
}

function GoalRow({
  label,
  current,
  target,
  percentage,
  remaining,
  color,
}: {
  label: string
  current: number
  target: number
  percentage: number
  remaining: number
  color: 'primary' | 'success' | 'warning'
}) {
  const achieved = percentage >= 100
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        <div className="flex items-center gap-2">
          {achieved && (
            <span className="text-xs font-semibold text-emerald-500">Achieved!</span>
          )}
          <span className={clsx('text-xs font-semibold', achieved ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400')}>
            {percentage}%
          </span>
        </div>
      </div>
      <ProgressBar value={percentage} color={achieved ? 'success' : color} size="md" />
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{formatDuration(current)} done</span>
        {!achieved && <span>{formatDuration(remaining)} remaining</span>}
        <span>{formatDuration(target)} goal</span>
      </div>
    </div>
  )
}

export function GoalProgressCard({ goals }: GoalProgressProps) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Target size={18} className="text-primary-500" />
        <h3 className="font-semibold text-slate-900 dark:text-white">Goals</h3>
      </div>
      <div className="space-y-5">
        <GoalRow label="Daily" color="primary" {...goals.daily} />
        <GoalRow label="Weekly" color="warning" {...goals.weekly} />
        <GoalRow label="Monthly" color="success" {...goals.monthly} />
      </div>
    </Card>
  )
}
