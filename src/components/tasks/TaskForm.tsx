import { useState, useEffect } from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import type { Task } from '../../types'

const COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
  '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#64748b',
]

interface TaskFormProps {
  initial?: Task
  onSave: (title: string, description: string, color: string) => void
  onCancel: () => void
}

export function TaskForm({ initial, onSave, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [color, setColor] = useState(initial?.color ?? COLORS[0])
  const [error, setError] = useState('')

  useEffect(() => {
    if (initial) {
      setTitle(initial.title)
      setDescription(initial.description)
      setColor(initial.color)
    }
  }, [initial])

  const handleSubmit = () => {
    if (!title.trim()) {
      setError('Task title is required')
      return
    }
    onSave(title.trim(), description.trim(), color)
  }

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Task Title"
        value={title}
        onChange={(e) => { setTitle(e.target.value); setError('') }}
        placeholder="e.g. Study React, Write report..."
        error={error}
        autoFocus
      />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details about this task..."
          rows={3}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Color</label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className="w-7 h-7 rounded-full transition-all duration-150 hover:scale-110"
              style={{ backgroundColor: c, outline: color === c ? `2px solid ${c}` : 'none', outlineOffset: '2px' }}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>{initial ? 'Update Task' : 'Create Task'}</Button>
      </div>
    </div>
  )
}
