import { useState } from 'react'
import { Header } from '../components/layout/Header'
import { DailyChart } from '../components/analytics/DailyChart'
import { WeeklyChart } from '../components/analytics/WeeklyChart'
import { MonthlyChart } from '../components/analytics/MonthlyChart'
import { YearlyChart } from '../components/analytics/YearlyChart'
import { Heatmap } from '../components/analytics/Heatmap'
import { useSessions } from '../hooks/useSessions'
import { useSettingsStore } from '../store/settingsStore'
import { getDailyData, getWeeklyData, getMonthlyData, getHeatmapData } from '../utils/stats'
import { clsx } from 'clsx'

const TABS = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'Heatmap'] as const
type Tab = (typeof TABS)[number]

export function AnalyticsPage() {
  const [tab, setTab] = useState<Tab>('Daily')
  const { sessions } = useSessions()
  const { settings } = useSettingsStore()

  const dailyData = getDailyData(sessions, 30)
  const weeklyData = getWeeklyData(sessions, 12)
  const monthlyData = getMonthlyData(sessions, 12)
  const heatmapData = getHeatmapData(sessions)

  return (
    <div className="flex flex-col">
      <Header title="Analytics" subtitle="Visualize your focus patterns" />

      <div className="flex-1 p-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                tab === t
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Charts */}
        <div className="animate-fade-in">
          {tab === 'Daily' && <DailyChart data={dailyData} />}
          {tab === 'Weekly' && <WeeklyChart data={weeklyData} />}
          {tab === 'Monthly' && <MonthlyChart data={monthlyData} />}
          {tab === 'Yearly' && (
            <YearlyChart data={monthlyData} monthlyGoal={settings.goals.monthlyMins} />
          )}
          {tab === 'Heatmap' && <Heatmap data={heatmapData} />}
        </div>

        {/* Always show heatmap at bottom */}
        {tab !== 'Heatmap' && (
          <Heatmap data={heatmapData} />
        )}
      </div>
    </div>
  )
}
