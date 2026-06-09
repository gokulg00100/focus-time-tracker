import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card } from '../ui/Card'
import type { MonthlyData } from '../../types'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">{label}</p>
      <p className="text-primary-600 dark:text-primary-400">{payload[0].value} min focus</p>
      {payload[1] && <p className="text-emerald-500">{payload[1].value} sessions</p>}
    </div>
  )
}

export function MonthlyChart({ data }: { data: MonthlyData[] }) {
  return (
    <Card>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Monthly Overview</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
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
            yAxisId="left"
            tick={{ fontSize: 10, fill: 'currentColor' }}
            className="text-slate-500 dark:text-slate-400"
            tickLine={false}
            axisLine={false}
            unit="m"
          />
          <YAxis yAxisId="right" orientation="right" hide />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
          <Bar yAxisId="left" dataKey="focusMins" name="Focus (min)" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={28} />
          <Bar yAxisId="right" dataKey="sessions" name="Sessions" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
