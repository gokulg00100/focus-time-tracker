import { Card } from '../ui/Card'
import { Flame, Trophy } from 'lucide-react'
import { clsx } from 'clsx'

interface StreakCardProps {
  currentStreak: number
  longestStreak: number
  weeklyConsistency: number
  monthlyConsistency: number
}

export function StreakCard({ currentStreak, longestStreak, weeklyConsistency, monthlyConsistency }: StreakCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame size={18} className="text-orange-500" />
          <h3 className="font-semibold text-slate-900 dark:text-white">Streaks</h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className={clsx(
          'flex flex-col items-center gap-1 p-4 rounded-xl',
          currentStreak > 0 ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-slate-50 dark:bg-slate-700/50'
        )}>
          <div className="flex items-center gap-1">
            <Flame size={20} className={currentStreak > 0 ? 'text-orange-500' : 'text-slate-400'} />
            <span className={clsx('text-3xl font-bold', currentStreak > 0 ? 'text-orange-500' : 'text-slate-400')}>
              {currentStreak}
            </span>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Current Streak</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">{currentStreak === 1 ? '1 day' : `${currentStreak} days`}</span>
        </div>

        <div className="flex flex-col items-center gap-1 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20">
          <div className="flex items-center gap-1">
            <Trophy size={20} className="text-amber-500" />
            <span className="text-3xl font-bold text-amber-500">{longestStreak}</span>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Longest Streak</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">{longestStreak === 1 ? '1 day' : `${longestStreak} days`}</span>
        </div>
      </div>

      <div className="space-y-2">
        <ConsistencyRow label="Weekly Consistency" value={weeklyConsistency} />
        <ConsistencyRow label="Monthly Consistency" value={monthlyConsistency} />
      </div>
    </Card>
  )
}

function ConsistencyRow({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? 'text-emerald-500' : value >= 60 ? 'text-primary-500' : value >= 40 ? 'text-amber-500' : 'text-slate-400'
  const bg = value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-primary-500' : value >= 40 ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-500 dark:text-slate-400 w-36 flex-shrink-0">{label}</span>
      <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
        <div className={clsx('h-full rounded-full transition-all duration-500', bg)} style={{ width: `${value}%` }} />
      </div>
      <span className={clsx('text-xs font-semibold w-10 text-right', color)}>{value}%</span>
    </div>
  )
}
