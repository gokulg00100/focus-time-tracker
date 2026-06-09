import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Card } from '../ui/Card'
import type { MonthlyData } from '../../types'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">{label}</p>
      <p className="text-primary-600 dark:text-primary-400">{payload[0].value} min</p>
    </div>
  )
}

export function YearlyChart({ data, monthlyGoal }: { data: MonthlyData[], monthlyGoal: number }) {
  return (
    <Card>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Yearly Trend</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-700" opacity={0.5} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: 'currentColor' }}
            className="text-slate-500 dark:text-slate-400"
            tickLine={false}
            axisLine={false}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={40}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'currentColor' }}
            className="text-slate-500 dark:text-slate-400"
            tickLine={false}
            axisLine={false}
            unit="m"
          />
          <Tooltip content={<CustomTooltip />} />
          {monthlyGoal > 0 && (
            <ReferenceLine
              y={monthlyGoal}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              label={{ value: 'Goal', position: 'right', fontSize: 10, fill: '#f59e0b' }}
            />
          )}
          <Line
            type="monotone"
            dataKey="focusMins"
            stroke="#6366f1"
            strokeWidth={2.5}
            dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
