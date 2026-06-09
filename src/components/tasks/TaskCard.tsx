import { Pencil, Trash2, Clock, CheckCircle } from 'lucide-react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { formatDuration } from '../../utils/time'
import type { Task } from '../../types'
import { clsx } from 'clsx'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggleComplete: (id: string) => void
  isTimerTask?: boolean
  onAssignToTimer?: (id: string) => void
}

export function TaskCard({ task, onEdit, onDelete, onToggleComplete, isTimerTask, onAssignToTimer }: TaskCardProps) {
  return (
    <Card
      className={clsx(
        'flex flex-col gap-3 transition-all duration-200',
        task.completed && 'opacity-60'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button
            onClick={() => onToggleComplete(task.id)}
            className="mt-0.5 flex-shrink-0"
          >
            <CheckCircle
              size={18}
              className={task.completed ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600 hover:text-emerald-400 transition-colors'}
            />
          </button>
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: task.color }}
              />
              <span
                className={clsx(
                  'font-medium text-slate-900 dark:text-white text-sm',
                  task.completed && 'line-through'
                )}
              >
                {task.title}
              </span>
            </div>
            {task.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{task.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {onAssignToTimer && !task.completed && (
            <Button
              variant={isTimerTask ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onAssignToTimer(task.id)}
              title="Assign to timer"
              className="text-xs"
            >
              {isTimerTask ? 'Active' : 'Focus'}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
            <Pencil size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <Clock size={12} />
          <span>{formatDuration(Math.round(task.totalFocusSecs / 60))}</span>
        </div>
        <span>·</span>
        <span>{task.sessionIds.length} sessions</span>
        {task.completed && <Badge variant="success" size="sm">Completed</Badge>}
      </div>
    </Card>
  )
}
