import { Header } from '../components/layout/Header'
import { StatCard } from '../components/dashboard/StatCard'
import { Card } from '../components/ui/Card'
import { useSessions } from '../hooks/useSessions'
import { useStats } from '../hooks/useStats'
import { useSettingsStore } from '../store/settingsStore'
import { formatDuration } from '../utils/time'
import { getFocusScoreLabel, getFocusScoreColor } from '../utils/focusScore'
import { BarChart2, TrendingUp, Calendar, Coffee, Clock, Flame, Star, Trophy } from 'lucide-react'
import { clsx } from 'clsx'

function StatRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
      <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
      <div className="text-right">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">{value}</span>
        {sub && <p className="text-xs text-slate-400 dark:text-slate-500">{sub}</p>}
      </div>
    </div>
  )
}

export function StatisticsPage() {
  const { sessions, loading } = useSessions()
  const { settings } = useSettingsStore()
  const stats = useStats(sessions, settings.goals)

  const scoreColor = getFocusScoreColor(stats.focusScore)
  const scoreLabel = getFocusScoreLabel(stats.focusScore)

  const completionRate = stats.totalSessions > 0
    ? Math.round((stats.completedSessions / stats.totalSessions) * 100)
    : 0

  if (loading) {
    return (
      <div className="flex flex-col">
        <Header title="Statistics" />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <Header title="Statistics" subtitle="Your productivity insights" />

      <div className="flex-1 p-6 space-y-6">
        {/* Focus Score */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="flex flex-col items-center gap-2 py-6 sm:col-span-1">
            <div
              className="flex items-center justify-center w-20 h-20 rounded-full border-4"
              style={{ borderColor: scoreColor }}
            >
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold" style={{ color: scoreColor }}>{stats.focusScore}</span>
                <span className="text-xs text-slate-400">/100</span>
              </div>
            </div>
            <p className="font-semibold text-slate-900 dark:text-white">{scoreLabel}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">Focus Score</p>
          </Card>

          <Card className="sm:col-span-2">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <BarChart2 size={16} className="text-primary-500" />
              Focus Score Breakdown
            </h3>
            {[
              { label: 'Session completion rate', value: `${completionRate}%`, color: completionRate >= 80 ? 'bg-emerald-500' : completionRate >= 50 ? 'bg-primary-500' : 'bg-amber-500', pct: completionRate },
              { label: 'Weekly consistency', value: `${stats.weeklyConsistencyScore}%`, color: 'bg-primary-500', pct: stats.weeklyConsistencyScore },
              { label: 'Monthly consistency', value: `${stats.monthlyConsistencyScore}%`, color: 'bg-purple-500', pct: stats.monthlyConsistencyScore },
              { label: 'Current streak', value: `${stats.currentStreak} days`, color: 'bg-orange-500', pct: stats.longestStreak > 0 ? Math.round((stats.currentStreak / stats.longestStreak) * 100) : 0 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 mb-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 w-36 flex-shrink-0">{item.label}</span>
                <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className={clsx('h-full rounded-full transition-all duration-500', item.color)} style={{ width: `${item.pct}%` }} />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-12 text-right">{item.value}</span>
              </div>
            ))}
          </Card>
        </div>

        {/* Time stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Clock size={16} className="text-primary-500" />
              Time Averages
            </h3>
            <StatRow label="Average daily focus" value={formatDuration(stats.averageDailyFocusMins)} />
            <StatRow label="Average session length" value={formatDuration(stats.averageSessionMins)} />
            <StatRow label="Total lifetime focus" value={formatDuration(stats.lifetimeFocusMins)} />
          </Card>

          <Card>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-500" />
              Best Performance
            </h3>
            <StatRow label="Most productive day" value={stats.mostProductiveDay} />
            <StatRow label="Best week" value={stats.mostProductiveWeek} />
            <StatRow label="Best month" value={stats.mostProductiveMonth} />
          </Card>
        </div>

        {/* Sessions stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Calendar size={16} className="text-purple-500" />
              Session Stats
            </h3>
            <StatRow label="Total sessions" value={String(stats.totalSessions)} />
            <StatRow label="Completed sessions" value={String(stats.completedSessions)} />
            <StatRow label="Completion rate" value={`${completionRate}%`} />
          </Card>

          <Card>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Flame size={16} className="text-orange-500" />
              Streaks
            </h3>
            <StatRow label="Current streak" value={`${stats.currentStreak} days`} />
            <StatRow label="Longest streak" value={`${stats.longestStreak} days`} />
            <StatRow label="Weekly consistency" value={`${stats.weeklyConsistencyScore}%`} />
            <StatRow label="Monthly consistency" value={`${stats.monthlyConsistencyScore}%`} />
          </Card>
        </div>
      </div>
    </div>
  )
}
