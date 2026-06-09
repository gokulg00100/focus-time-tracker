import { useState } from 'react'
import { Header } from '../components/layout/Header'
import { TaskCard } from '../components/tasks/TaskCard'
import { TaskForm } from '../components/tasks/TaskForm'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useTasks } from '../hooks/useTasks'
import { useTimerStore } from '../store/timerStore'
import type { Task } from '../types'
import { Plus, CheckSquare, Clock } from 'lucide-react'
import { formatDuration } from '../utils/time'
import { clsx } from 'clsx'

type Filter = 'all' | 'active' | 'completed'

export function TasksPage() {
  const { tasks, loading, createTask, updateTask, removeTask, toggleComplete } = useTasks()
  const { selectedTaskId, setSelectedTask, status } = useTimerStore()
  const [showForm, setShowForm] = useState(false)
  const [editTask, setEditTask] = useState<Task | undefined>()
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = tasks.filter((t) => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const handleSave = async (title: string, description: string, color: string) => {
    if (editTask) {
      await updateTask({ ...editTask, title, description, color })
    } else {
      await createTask(title, description, color)
    }
    setShowForm(false)
    setEditTask(undefined)
  }

  const handleEdit = (task: Task) => {
    setEditTask(task)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this task? This won\'t delete associated sessions.')) {
      await removeTask(id)
    }
  }

  const handleAssignToTimer = (id: string) => {
    setSelectedTask(selectedTaskId === id ? null : id)
  }

  const totalFocusMins = tasks.reduce((sum, t) => sum + Math.round(t.totalFocusSecs / 60), 0)
  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <div className="flex flex-col">
      <Header title="Tasks" subtitle="Track time spent per task" />

      <div className="flex-1 p-6 space-y-5 max-w-3xl mx-auto w-full">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{tasks.length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Total Tasks</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-emerald-500">{completedCount}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Completed</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-primary-500">{formatDuration(totalFocusMins)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Total Focus</p>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['all', 'active', 'completed'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize',
                  filter === f
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <Button variant="primary" size="md" onClick={() => { setEditTask(undefined); setShowForm(true) }}>
            <Plus size={16} />
            New Task
          </Button>
        </div>

        {/* Task list */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="flex flex-col items-center gap-3 py-12">
            <CheckSquare size={40} className="text-slate-300 dark:text-slate-600" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {filter === 'all' ? 'No tasks yet. Create one to get started!' : `No ${filter} tasks.`}
            </p>
            {filter === 'all' && (
              <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
                <Plus size={14} />
                Create Task
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleComplete={toggleComplete}
                isTimerTask={selectedTaskId === task.id}
                onAssignToTimer={status === 'idle' || status === 'completed' ? handleAssignToTimer : undefined}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setEditTask(undefined) }}
        title={editTask ? 'Edit Task' : 'New Task'}
      >
        <TaskForm
          initial={editTask}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditTask(undefined) }}
        />
      </Modal>
    </div>
  )
}
