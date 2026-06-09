import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from '../ui/Card'
import type { WeeklyData } from '../../types'

interface WeeklyChartProps {
  data: WeeklyData[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Week of {label}</p>
      <p className="text-primary-600 dark:text-primary-400">{payload[0].value} min focus</p>
      <p className="text-slate-500">{payload[1]?.value ?? 0} sessions</p>
    </div>
  )
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  return (
    <Card>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Weekly Focus</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="weeklyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-700" opacity={0.5} />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 10, fill: 'currentColor' }}
            className="text-slate-500 dark:text-slate-400"
            tickLine={false}
            axisLine={false}
            interval={1}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'currentColor' }}
            className="text-slate-500 dark:text-slate-400"
            tickLine={false}
            axisLine={false}
            unit="m"
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="focusMins"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#weeklyGradient)"
            dot={{ fill: '#6366f1', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#6366f1' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}
