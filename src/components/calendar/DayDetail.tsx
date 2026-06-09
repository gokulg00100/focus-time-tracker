import { format, parseISO } from 'date-fns'
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { formatDuration, formatSeconds } from '../../utils/time'
import type { FocusSession } from '../../types'
import { clsx } from 'clsx'

interface DayDetailProps {
  date: string
  sessions: FocusSession[]
  tasks: { id: string; title: string; color: string }[]
}

const StatusIcon = ({ status }: { status: FocusSession['completionStatus'] }) => {
  if (status === 'completed') return <CheckCircle size={14} className="text-emerald-500" />
  if (status === 'partial') return <AlertCircle size={14} className="text-amber-500" />
  return <XCircle size={14} className="text-red-400" />
}

const statusVariant: Record<FocusSession['completionStatus'], 'success' | 'warning' | 'danger'> = {
  completed: 'success',
  partial: 'warning',
  abandoned: 'danger',
}

export function DayDetail({ date, sessions, tasks }: DayDetailProps) {
  const taskMap = new Map(tasks.map((t) => [t.id, t]))
  const totalFocus = sessions.reduce((sum, s) => sum + s.actualFocusSecs, 0)

  if (sessions.length === 0) {
    return (
      <Card className="text-center py-8">
        <Clock size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <p className="text-sm text-slate-500 dark:text-slate-400">No sessions on this day</p>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          {format(parseISO(date), 'EEEE, MMMM d')}
        </h3>
        <Badge variant="info">{formatDuration(Math.round(totalFocus / 60))} total</Badge>
      </div>

      {sessions.map((s) => {
        const task = s.taskId ? taskMap.get(s.taskId) : null
        return (
          <Card key={s.id} className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <StatusIcon status={s.completionStatus} />
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {s.endTime && ` – ${new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                </span>
                {task && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
                    style={{ backgroundColor: task.color }}
                  >
                    {task.title}
                  </span>
                )}
              </div>
              <Badge variant={statusVariant[s.completionStatus]} size="sm">
                {s.completionPercentage}%
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs text-slate-500 dark:text-slate-400">
              <div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Focus</span>
                <p>{formatDuration(Math.round(s.actualFocusSecs / 60))}</p>
              </div>
              <div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Planned</span>
                <p>{formatSeconds(s.plannedDurationSecs)}</p>
              </div>
              <div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Breaks</span>
                <p>{s.breaks.length}</p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
