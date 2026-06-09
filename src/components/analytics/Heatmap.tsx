import { useMemo, useState } from 'react'
import { format, parseISO, getDay, startOfWeek, eachWeekOfInterval } from 'date-fns'
import { Card } from '../ui/Card'
import { clsx } from 'clsx'
import type { HeatmapDay } from '../../types'

const LEVEL_COLORS = [
  'bg-slate-100 dark:bg-slate-800',
  'bg-primary-200 dark:bg-primary-900',
  'bg-primary-400 dark:bg-primary-700',
  'bg-primary-500 dark:bg-primary-500',
  'bg-primary-700 dark:bg-primary-300',
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

interface HeatmapProps {
  data: HeatmapDay[]
  year?: number
}

export function Heatmap({ data, year }: HeatmapProps) {
  const [tooltip, setTooltip] = useState<{ date: string; value: number } | null>(null)
  const y = year ?? new Date().getFullYear()

  const { weeks, monthPositions } = useMemo(() => {
    const yearStart = new Date(y, 0, 1)
    const yearEnd = new Date(y, 11, 31)
    const allWeeks = eachWeekOfInterval({ start: yearStart, end: yearEnd }, { weekStartsOn: 1 })

    const dataMap = new Map(data.map((d) => [d.date, d]))

    const weeks = allWeeks.map((weekStart) => {
      const days: (HeatmapDay | null)[] = []
      for (let i = 0; i < 7; i++) {
        const d = new Date(weekStart)
        d.setDate(d.getDate() + i)
        if (d.getFullYear() !== y) {
          days.push(null)
        } else {
          const key = format(d, 'yyyy-MM-dd')
          days.push(dataMap.get(key) ?? { date: key, value: 0, level: 0 })
        }
      }
      return { weekStart, days }
    })

    // Month label positions
    const monthPositions: { month: number; col: number }[] = []
    let lastMonth = -1
    weeks.forEach((w, i) => {
      const m = w.weekStart.getMonth()
      if (m !== lastMonth) {
        monthPositions.push({ month: m, col: i })
        lastMonth = m
      }
    })

    return { weeks, monthPositions }
  }, [data, y])

  return (
    <Card>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4">{y} Focus Heatmap</h3>
      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1 min-w-max">
          {/* Month labels */}
          <div className="flex ml-7">
            {weeks.map((_, i) => {
              const mp = monthPositions.find((m) => m.col === i)
              return (
                <div key={i} className="w-[13px] mr-0.5">
                  {mp && (
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
                      {MONTHS[mp.month]}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Grid */}
          <div className="flex gap-0.5">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 mr-1">
              {DAYS.map((d, i) => (
                <div key={i} className="h-[13px] flex items-center">
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium w-6 text-right leading-none">
                    {d}
                  </span>
                </div>
              ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.days.map((day, di) => (
                  <div
                    key={di}
                    className={clsx(
                      'w-[13px] h-[13px] rounded-sm transition-all duration-100',
                      day === null ? 'opacity-0' : LEVEL_COLORS[day.level],
                      day !== null && 'cursor-pointer hover:ring-1 hover:ring-primary-500 hover:ring-offset-1'
                    )}
                    title={day ? `${day.date}: ${day.value} min` : ''}
                    onMouseEnter={() => day && setTooltip({ date: day.date, value: day.value })}
                    onMouseLeave={() => setTooltip(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-[10px] text-slate-400 dark:text-slate-500">Less</span>
          {LEVEL_COLORS.map((c, i) => (
            <div key={i} className={clsx('w-3 h-3 rounded-sm', c)} />
          ))}
          <span className="text-[10px] text-slate-400 dark:text-slate-500">More</span>
        </div>
      </div>

      {tooltip && (
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-center">
          {format(parseISO(tooltip.date), 'MMMM d, yyyy')} — {tooltip.value === 0 ? 'No focus' : `${tooltip.value} min`}
        </div>
      )}
    </Card>
  )
}
