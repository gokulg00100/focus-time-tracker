import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { TimerStatus, BreakConfig, BreakRecord } from '../types'
import { getDateKey } from '../utils/time'

interface TimerState {
  // Config
  plannedDurationSecs: number
  selectedTaskId: string | null
  breakConfig: BreakConfig | null

  // Status
  status: TimerStatus
  displayTick: number

  // Timestamps (stored as seconds for serialisation safety)
  sessionStartTime: number | null // Date.now() / 1000 when session started
  lastResumeTime: number | null // Date.now() / 1000 when last resumed
  accumulatedFocusSecs: number // focus secs before current run period
  accumulatedBreakSecs: number

  // Break tracking
  focusSecsUntilNextBreak: number // counts down as focus accumulates
  currentBreakStartTime: number | null
  currentBreakPlannedSecs: number
  breaks: BreakRecord[]

  // Session ID for DB
  currentSessionId: string | null
  sessionDate: string | null

  // Actions
  setDuration: (secs: number) => void
  setSelectedTask: (id: string | null) => void
  setBreakConfig: (cfg: BreakConfig | null) => void
  start: () => void
  pause: () => void
  resume: () => void
  stop: () => void
  reset: () => void
  triggerBreak: () => void
  skipBreak: () => void
  extendBreak: (extraSecs: number) => void
  endBreak: (skipped?: boolean) => void
  complete: () => void
  tick: () => void
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      plannedDurationSecs: 1800, // 30 min default
      selectedTaskId: null,
      breakConfig: null,
      status: 'idle',
      displayTick: 0,
      sessionStartTime: null,
      lastResumeTime: null,
      accumulatedFocusSecs: 0,
      accumulatedBreakSecs: 0,
      focusSecsUntilNextBreak: Infinity,
      currentBreakStartTime: null,
      currentBreakPlannedSecs: 0,
      breaks: [],
      currentSessionId: null,
      sessionDate: null,

      setDuration: (secs) => set({ plannedDurationSecs: secs }),
      setSelectedTask: (id) => set({ selectedTaskId: id }),
      setBreakConfig: (cfg) =>
        set({ breakConfig: cfg, focusSecsUntilNextBreak: cfg ? cfg.intervalMins * 60 : Infinity }),

      start: () => {
        const now = Date.now() / 1000
        const s = get()
        set({
          status: 'running',
          sessionStartTime: now,
          lastResumeTime: now,
          accumulatedFocusSecs: 0,
          accumulatedBreakSecs: 0,
          focusSecsUntilNextBreak: s.breakConfig ? s.breakConfig.intervalMins * 60 : Infinity,
          currentBreakStartTime: null,
          breaks: [],
          currentSessionId: uuidv4(),
          sessionDate: getDateKey(new Date()),
          displayTick: 0,
        })
      },

      pause: () => {
        const now = Date.now() / 1000
        const s = get()
        if (s.status !== 'running') return
        const runSecs = now - (s.lastResumeTime ?? now)
        set({
          status: 'paused',
          accumulatedFocusSecs: s.accumulatedFocusSecs + runSecs,
          focusSecsUntilNextBreak: s.focusSecsUntilNextBreak - runSecs,
          lastResumeTime: null,
        })
      },

      resume: () => {
        const s = get()
        if (s.status !== 'paused') return
        set({ status: 'running', lastResumeTime: Date.now() / 1000 })
      },

      stop: () => {
        const s = get()
        if (s.status === 'idle') return
        const now = Date.now() / 1000
        let totalFocus = s.accumulatedFocusSecs
        if (s.status === 'running' && s.lastResumeTime) {
          totalFocus += now - s.lastResumeTime
        }
        set({
          status: 'idle',
          accumulatedFocusSecs: totalFocus,
          lastResumeTime: null,
          currentBreakStartTime: null,
          displayTick: 0,
        })
      },

      reset: () =>
        set({
          status: 'idle',
          sessionStartTime: null,
          lastResumeTime: null,
          accumulatedFocusSecs: 0,
          accumulatedBreakSecs: 0,
          focusSecsUntilNextBreak: Infinity,
          currentBreakStartTime: null,
          currentBreakPlannedSecs: 0,
          breaks: [],
          currentSessionId: null,
          sessionDate: null,
          displayTick: 0,
        }),

      triggerBreak: () => {
        const now = Date.now() / 1000
        const s = get()
        const runSecs = s.lastResumeTime ? now - s.lastResumeTime : 0
        const totalFocus = s.accumulatedFocusSecs + runSecs
        const breakSecs = (s.breakConfig?.durationMins ?? 5) * 60
        set({
          status: 'break',
          accumulatedFocusSecs: totalFocus,
          lastResumeTime: null,
          currentBreakStartTime: now,
          currentBreakPlannedSecs: breakSecs,
          focusSecsUntilNextBreak: s.breakConfig ? s.breakConfig.intervalMins * 60 : Infinity,
        })
      },

      endBreak: (skipped = false) => {
        const now = Date.now() / 1000
        const s = get()
        const breakStart = s.currentBreakStartTime ?? now
        const breakDuration = now - breakStart
        const record: BreakRecord = {
          startTime: breakStart * 1000,
          endTime: now * 1000,
          durationSecs: Math.round(breakDuration),
          skipped,
        }
        set({
          status: 'running',
          lastResumeTime: now,
          accumulatedBreakSecs: s.accumulatedBreakSecs + breakDuration,
          currentBreakStartTime: null,
          breaks: [...s.breaks, record],
        })
      },

      skipBreak: () => get().endBreak(true),

      extendBreak: (extraSecs) =>
        set((s) => ({ currentBreakPlannedSecs: s.currentBreakPlannedSecs + extraSecs })),

      complete: () => {
        const now = Date.now() / 1000
        const s = get()
        let totalFocus = s.accumulatedFocusSecs
        if (s.status === 'running' && s.lastResumeTime) {
          totalFocus += now - s.lastResumeTime
        }
        set({
          status: 'completed',
          accumulatedFocusSecs: totalFocus,
          lastResumeTime: null,
          displayTick: 0,
        })
      },

      tick: () => {
        const s = get()
        if (s.status !== 'running' && s.status !== 'break') return

        const now = Date.now() / 1000

        if (s.status === 'running') {
          const runSecs = s.lastResumeTime ? now - s.lastResumeTime : 0
          const totalFocus = s.accumulatedFocusSecs + runSecs
          const remaining = s.plannedDurationSecs - totalFocus

          if (remaining <= 0) {
            get().complete()
            return
          }

          const timeUntilBreak = s.focusSecsUntilNextBreak - runSecs
          if (s.breakConfig && timeUntilBreak <= 0) {
            get().triggerBreak()
            return
          }
        } else if (s.status === 'break') {
          const breakElapsed = s.currentBreakStartTime ? now - s.currentBreakStartTime : 0
          if (breakElapsed >= s.currentBreakPlannedSecs) {
            get().endBreak(false)
            return
          }
        }

        set((st) => ({ displayTick: st.displayTick + 1 }))
      },
    }),
    {
      name: 'focus-tracker-timer',
      partialize: (s) => ({
        plannedDurationSecs: s.plannedDurationSecs,
        selectedTaskId: s.selectedTaskId,
        breakConfig: s.breakConfig,
        status: s.status,
        sessionStartTime: s.sessionStartTime,
        lastResumeTime: s.lastResumeTime,
        accumulatedFocusSecs: s.accumulatedFocusSecs,
        accumulatedBreakSecs: s.accumulatedBreakSecs,
        focusSecsUntilNextBreak: s.focusSecsUntilNextBreak,
        currentBreakStartTime: s.currentBreakStartTime,
        currentBreakPlannedSecs: s.currentBreakPlannedSecs,
        breaks: s.breaks,
        currentSessionId: s.currentSessionId,
        sessionDate: s.sessionDate,
      }),
    }
  )
)

// Selector helpers
export function getElapsedFocusSecs(state: TimerState): number {
  if (state.status === 'running' && state.lastResumeTime) {
    return state.accumulatedFocusSecs + (Date.now() / 1000 - state.lastResumeTime)
  }
  return state.accumulatedFocusSecs
}

export function getBreakElapsedSecs(state: TimerState): number {
  if (state.status === 'break' && state.currentBreakStartTime) {
    return Date.now() / 1000 - state.currentBreakStartTime
  }
  return 0
}
