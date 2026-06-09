import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card } from '../ui/Card'
import type { DailyData } from '../../types'

interface DailyChartProps {
  data: DailyData[]
  title?: string
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">{label}</p>
      <p className="text-primary-600 dark:text-primary-400">{payload[0].value} min focus</p>
      {payload[1] && <p className="text-slate-500">{payload[1].value} sessions</p>}
    </div>
  )
}

export function DailyChart({ data, title = 'Daily Focus (last 30 days)' }: DailyChartProps) {
  const maxVal = Math.max(...data.map((d) => d.focusMins), 1)

  return (
    <Card>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-700" opacity={0.5} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: 'currentColor' }}
            className="text-slate-500 dark:text-slate-400"
            interval={4}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'currentColor' }}
            className="text-slate-500 dark:text-slate-400"
            tickLine={false}
            axisLine={false}
            unit="m"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="focusMins" radius={[4, 4, 0, 0]} maxBarSize={20}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.focusMins === maxVal ? '#6366f1' : entry.focusMins > 0 ? '#a5b4fc' : '#e2e8f0'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
