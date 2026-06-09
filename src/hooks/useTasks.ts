import { useState, useEffect, useCallback } from 'react'
import { getAllTasks, saveTask, deleteTask } from '../services/db'
import { useAuthStore } from '../store/authStore'
import type { Task } from '../types'
import { v4 as uuidv4 } from 'uuid'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const uid = useAuthStore((s) => s.user?.uid)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAllTasks()
      setTasks(data.sort((a, b) => b.createdAt - a.createdAt))
    } finally {
      setLoading(false)
    }
  }, [])

  // Reload whenever the logged-in user changes
  useEffect(() => {
    load()
  }, [load, uid])

  const createTask = useCallback(
    async (title: string, description = '', color = '#6366f1') => {
      const task: Task = {
        id: uuidv4(),
        title,
        description,
        color,
        createdAt: Date.now(),
        totalFocusSecs: 0,
        completed: false,
        sessionIds: [],
      }
      await saveTask(task)
      setTasks((prev) => [task, ...prev])
      return task
    },
    []
  )

  const updateTask = useCallback(async (updated: Task) => {
    await saveTask(updated)
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
  }, [])

  const removeTask = useCallback(async (id: string) => {
    await deleteTask(id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toggleComplete = useCallback(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id)
      if (!task) return
      await updateTask({ ...task, completed: !task.completed })
    },
    [tasks, updateTask]
  )

  const addSessionToTask = useCallback(
    async (taskId: string, sessionId: string, focusSecs: number) => {
      const task = tasks.find((t) => t.id === taskId)
      if (!task) return
      const updated: Task = {
        ...task,
        totalFocusSecs: task.totalFocusSecs + focusSecs,
        sessionIds: [...task.sessionIds, sessionId],
      }
      await updateTask(updated)
    },
    [tasks, updateTask]
  )

  return { tasks, loading, reload: load, createTask, updateTask, removeTask, toggleComplete, addSessionToTask }
}
