import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isToday, parseISO } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'
import { Button } from '../ui/Button'
import type { FocusSession } from '../../types'

interface CalendarViewProps {
  sessions: FocusSession[]
  onSelectDate: (date: string) => void
  selectedDate: string | null
}

export function CalendarView({ sessions, onSelectDate, selectedDate }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const sessionsByDate = new Map<string, number>()
  sessions.forEach((s) => {
    const key = s.date
    sessionsByDate.set(key, (sessionsByDate.get(key) ?? 0) + Math.round(s.actualFocusSecs / 60))
  })

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  const maxMins = Math.max(...Array.from(sessionsByDate.values()), 1)

  const getIntensity = (mins: number) => {
    const r = mins / maxMins
    if (r > 0.75) return 'bg-primary-500 text-white'
    if (r > 0.5) return 'bg-primary-400 text-white'
    if (r > 0.25) return 'bg-primary-200 dark:bg-primary-800 text-primary-800 dark:text-primary-200'
    return 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1))}>
          <ChevronLeft size={18} />
        </Button>
        <h2 className="font-semibold text-slate-900 dark:text-white text-lg">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <Button variant="ghost" size="sm" onClick={() => setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1))}>
          <ChevronRight size={18} />
        </Button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-slate-400 dark:text-slate-500 py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd')
          const mins = sessionsByDate.get(key) ?? 0
          const hasData = mins > 0
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isSelected = selectedDate === key
          const isTodayDate = isToday(day)

          return (
            <button
              key={key}
              onClick={() => onSelectDate(key)}
              className={clsx(
                'relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium transition-all duration-150',
                !isCurrentMonth && 'opacity-30',
                isSelected && 'ring-2 ring-primary-500 ring-offset-1 dark:ring-offset-slate-900',
                hasData && isCurrentMonth ? getIntensity(mins) : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300',
                isTodayDate && !hasData && 'ring-1 ring-primary-400 text-primary-600 dark:text-primary-400',
              )}
            >
              <span className="text-xs">{format(day, 'd')}</span>
              {hasData && isCurrentMonth && (
                <span className="text-[9px] font-normal opacity-80">{mins}m</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 justify-end">
        <span className="text-[10px] text-slate-400">Less</span>
        {[100, 200, 300, 400].map((v) => (
          <div key={v} className={clsx('w-4 h-4 rounded', getIntensity(v).split(' ')[0])} />
        ))}
        <span className="text-[10px] text-slate-400">More</span>
      </div>
    </div>
  )
}
