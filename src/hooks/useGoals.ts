import { useMemo } from 'react'
import type { Stats, Goals } from '../types'

export interface GoalProgress {
  daily: { current: number; target: number; percentage: number; remaining: number }
  weekly: { current: number; target: number; percentage: number; remaining: number }
  monthly: { current: number; target: number; percentage: number; remaining: number }
}

export function useGoals(stats: Stats, goals: Goals): GoalProgress {
  return useMemo(() => {
    const calc = (current: number, target: number) => ({
      current,
      target,
      percentage: target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0,
      remaining: Math.max(target - current, 0),
    })

    return {
      daily: calc(stats.todayFocusMins, goals.dailyMins),
      weekly: calc(stats.weekFocusMins, goals.weeklyMins),
      monthly: calc(stats.monthFocusMins, goals.monthlyMins),
    }
  }, [stats, goals])
}
