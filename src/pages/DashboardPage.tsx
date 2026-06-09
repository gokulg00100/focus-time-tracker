import { Header } from '../components/layout/Header'
import { StatCard } from '../components/dashboard/StatCard'
import { GoalProgressCard } from '../components/dashboard/GoalProgress'
import { StreakCard } from '../components/dashboard/StreakCard'
import { DailyChart } from '../components/analytics/DailyChart'
import { Card } from '../components/ui/Card'
import { useSessions } from '../hooks/useSessions'
import { useStats } from '../hooks/useStats'
import { useGoals } from '../hooks/useGoals'
import { useSettingsStore } from '../store/settingsStore'
import { getDailyData } from '../utils/stats'
import { formatDuration } from '../utils/time'
import { getFocusScoreLabel, getFocusScoreColor } from '../utils/focusScore'
import {
  Timer, Target, Flame, Trophy, TrendingUp, Coffee, Star, CheckCircle
} from 'lucide-react'
import { format } from 'date-fns'

export function DashboardPage() {
  const { sessions, loading } = useSessions()
  const { settings } = useSettingsStore()
  const stats = useStats(sessions, settings.goals)
  const goals = useGoals(stats, settings.goals)
  const dailyData = getDailyData(sessions, 14)

  const scoreLabel = getFocusScoreLabel(stats.focusScore)
  const scoreColor = getFocusScoreColor(stats.focusScore)

  if (loading) {
    return (
      <div className="flex flex-col">
        <Header title="Dashboard" subtitle={format(new Date(), 'EEEE, MMMM d')} />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <Header title="Dashboard" subtitle={format(new Date(), 'EEEE, MMMM d')} />

      <div className="flex-1 p-6 space-y-6">
        {/* Focus Score */}
        <Card className="flex items-center gap-4 bg-gradient-to-r from-primary-500 to-purple-600 border-0 text-white">
          <div
            className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 flex-shrink-0"
          >
            <span className="text-2xl font-bold">{stats.focusScore}</span>
          </div>
          <div>
            <p className="text-white/70 text-sm font-medium">Focus Score</p>
            <p className="text-xl font-bold">{scoreLabel}</p>
            <p className="text-white/60 text-xs mt-0.5">Based on consistency, streaks & goals</p>
          </div>
          <Star size={40} className="ml-auto text-white/20" />
        </Card>

        {/* Time stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <StatCard title="Today" value={formatDuration(stats.todayFocusMins)} subtitle="Focus time" icon={<Timer size={16} />} accent="primary" />
          <StatCard title="This Week" value={formatDuration(stats.weekFocusMins)} icon={<TrendingUp size={16} />} accent="primary" />
          <StatCard title="This Month" value={formatDuration(stats.monthFocusMins)} icon={<Target size={16} />} accent="success" />
          <StatCard title="This Year" value={formatDuration(stats.yearFocusMins)} icon={<Trophy size={16} />} accent="warning" />
          <StatCard title="Lifetime" value={formatDuration(stats.lifetimeFocusMins)} subtitle="All time" icon={<Star size={16} />} accent="danger" className="col-span-2 lg:col-span-1" />
        </div>

        {/* Sessions & breaks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard title="Completed" value={String(stats.completedSessions)} subtitle="sessions" icon={<CheckCircle size={16} />} accent="success" />
          <StatCard title="Total Sessions" value={String(stats.totalSessions)} icon={<Timer size={16} />} />
          <StatCard title="Avg Session" value={formatDuration(stats.averageSessionMins)} icon={<Timer size={16} />} />
          <StatCard title="Breaks Taken" value={String(stats.totalBreaksTaken)} icon={<Coffee size={16} />} accent="warning" />
        </div>

        {/* Goals + Streaks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GoalProgressCard goals={goals} />
          <StreakCard
            currentStreak={stats.currentStreak}
            longestStreak={stats.longestStreak}
            weeklyConsistency={stats.weeklyConsistencyScore}
            monthlyConsistency={stats.monthlyConsistencyScore}
          />
        </div>

        {/* Recent activity chart */}
        <DailyChart data={dailyData} title="Last 14 Days" />
      </div>
    </div>
  )
}
