import { useState } from 'react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/ui/Card'
import { CalendarView } from '../components/calendar/CalendarView'
import { DayDetail } from '../components/calendar/DayDetail'
import { useSessions } from '../hooks/useSessions'
import { useTasks } from '../hooks/useTasks'
import { format, parseISO } from 'date-fns'

export function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const { sessions } = useSessions()
  const { tasks } = useTasks()

  const selectedSessions = selectedDate
    ? sessions.filter((s) => s.date === selectedDate)
    : []

  const taskSummaries = tasks.map((t) => ({ id: t.id, title: t.title, color: t.color }))

  return (
    <div className="flex flex-col">
      <Header title="Calendar" subtitle="Click a day to view sessions" />

      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="lg:col-span-2">
            <Card padding={false} className="p-5">
              <CalendarView
                sessions={sessions}
                onSelectDate={setSelectedDate}
                selectedDate={selectedDate}
              />
            </Card>
          </div>

          <div className="space-y-4">
            {selectedDate ? (
              <>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {format(parseISO(selectedDate), 'MMMM d, yyyy')}
                </h3>
                <DayDetail
                  date={selectedDate}
                  sessions={selectedSessions}
                  tasks={taskSummaries}
                />
              </>
            ) : (
              <Card className="text-center py-8">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Select a day to view sessions
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
