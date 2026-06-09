import { useState, useEffect, useCallback } from 'react'
import { getAllSessions, saveSession, deleteSession, getSessionsByDate } from '../services/db'
import { useAuthStore } from '../store/authStore'
import type { FocusSession } from '../types'

export function useSessions() {
  const [sessions, setSessions] = useState<FocusSession[]>([])
  const [loading, setLoading] = useState(true)
  const uid = useAuthStore((s) => s.user?.uid)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAllSessions()
      setSessions(data.sort((a, b) => b.startTime - a.startTime))
    } finally {
      setLoading(false)
    }
  }, [])

  // Reload whenever the logged-in user changes
  useEffect(() => {
    load()
  }, [load, uid])

  const addSession = useCallback(
    async (session: FocusSession) => {
      await saveSession(session)
      await load()
    },
    [load]
  )

  const removeSession = useCallback(
    async (id: string) => {
      await deleteSession(id)
      setSessions((prev) => prev.filter((s) => s.id !== id))
    },
    []
  )

  const getByDate = useCallback(async (date: string) => {
    return getSessionsByDate(date)
  }, [])

  return { sessions, loading, reload: load, addSession, removeSession, getByDate }
}
