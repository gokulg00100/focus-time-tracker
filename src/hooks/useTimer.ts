import { useEffect, useCallback } from 'react'
import { useTimerStore, getElapsedFocusSecs, getBreakElapsedSecs } from '../store/timerStore'
import { saveSession } from '../services/db'
import { useSettingsStore } from '../store/settingsStore'
import {
  notifySessionStarted,
  notifyBreakStarted,
  notifyBreakEnded,
  notifySessionCompleted,
} from '../services/notifications'

export function useTimer() {
  const store = useTimerStore()
  const { settings } = useSettingsStore()

  // Run tick every second
  useEffect(() => {
    const id = setInterval(() => {
      store.tick()
    }, 1000)
    return () => clearInterval(id)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Persist completed / stopped sessions to DB
  const saveCurrentSession = useCallback(
    async (status: 'completed' | 'partial' | 'abandoned') => {
      const s = useTimerStore.getState()
      if (!s.currentSessionId || !s.sessionDate) return

      const now = Date.now()
      const elapsedFocus = getElapsedFocusSecs(s)
      const completion = Math.min((elapsedFocus / s.plannedDurationSecs) * 100, 100)

      await saveSession({
        id: s.currentSessionId,
        date: s.sessionDate,
        startTime: (s.sessionStartTime ?? 0) * 1000,
        endTime: now,
        plannedDurationSecs: s.plannedDurationSecs,
        actualFocusSecs: Math.round(elapsedFocus),
        breakSecs: Math.round(s.accumulatedBreakSecs),
        completionStatus: status,
        completionPercentage: Math.round(completion),
        taskId: s.selectedTaskId ?? undefined,
        breaks: s.breaks,
      })
    },
    []
  )

  // Watch for session completion
  useEffect(() => {
    if (store.status === 'completed') {
      saveCurrentSession('completed')
      if (settings.notificationsEnabled) {
        notifySessionCompleted(Math.round(store.accumulatedFocusSecs / 60))
      }
    }
  }, [store.status]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleStart = useCallback(() => {
    store.start()
    if (settings.notificationsEnabled) {
      notifySessionStarted(Math.round(store.plannedDurationSecs / 60))
    }
  }, [store, settings])

  const handleStop = useCallback(async () => {
    await saveCurrentSession('abandoned')
    store.stop()
  }, [store, saveCurrentSession])

  const handlePause = useCallback(() => store.pause(), [store])
  const handleResume = useCallback(() => store.resume(), [store])
  const handleReset = useCallback(() => store.reset(), [store])

  const handleSkipBreak = useCallback(() => {
    store.skipBreak()
    if (settings.notificationsEnabled) notifyBreakEnded()
  }, [store, settings])

  const handleExtendBreak = useCallback(
    (extraMins: number) => store.extendBreak(extraMins * 60),
    [store]
  )

  // Notify when break starts
  useEffect(() => {
    if (store.status === 'break' && settings.notificationsEnabled) {
      notifyBreakStarted(Math.round(store.currentBreakPlannedSecs / 60))
    }
  }, [store.status]) // eslint-disable-line react-hooks/exhaustive-deps

  // Computed values
  const elapsedFocusSecs = getElapsedFocusSecs(store)
  const breakElapsedSecs = getBreakElapsedSecs(store)
  const remainingFocusSecs = Math.max(store.plannedDurationSecs - elapsedFocusSecs, 0)
  const progress = store.plannedDurationSecs > 0 ? elapsedFocusSecs / store.plannedDurationSecs : 0
  const breakRemaining = Math.max(store.currentBreakPlannedSecs - breakElapsedSecs, 0)
  const breakProgress =
    store.currentBreakPlannedSecs > 0
      ? breakElapsedSecs / store.currentBreakPlannedSecs
      : 0

  return {
    status: store.status,
    plannedDurationSecs: store.plannedDurationSecs,
    elapsedFocusSecs,
    remainingFocusSecs,
    progress: Math.min(progress, 1),
    breakElapsedSecs,
    breakRemaining,
    breakProgress: Math.min(breakProgress, 1),
    breaksCount: store.breaks.length,
    selectedTaskId: store.selectedTaskId,

    handleStart,
    handlePause,
    handleResume,
    handleStop,
    handleReset,
    handleSkipBreak,
    handleExtendBreak,

    setDuration: store.setDuration,
    setSelectedTask: store.setSelectedTask,
    setBreakConfig: store.setBreakConfig,
  }
}
