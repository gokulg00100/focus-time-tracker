import { useMemo } from 'react'
import type { FocusSession, Stats, Goals } from '../types'
import { calculateCurrentStreak, calculateLongestStreak, getConsistencyScore } from '../utils/streak'
import { calculateFocusScore } from '../utils/focusScore'
import { getMostProductiveDay, getMostProductiveWeek, getMostProductiveMonth } from '../utils/stats'
import { getDateKey } from '../utils/time'
import { startOfWeek, startOfMonth, startOfYear, isAfter, parseISO } from 'date-fns'

export function useStats(sessions: FocusSession[], goals: Goals): Stats {
  return useMemo(() => {
    if (sessions.length === 0) {
      return {
        todayFocusMins: 0,
        weekFocusMins: 0,
        monthFocusMins: 0,
        yearFocusMins: 0,
        lifetimeFocusMins: 0,
        completedSessions: 0,
        totalSessions: 0,
        currentStreak: 0,
        longestStreak: 0,
        averageDailyFocusMins: 0,
        averageSessionMins: 0,
        mostProductiveDay: '—',
        mostProductiveWeek: '—',
        mostProductiveMonth: '—',
        totalBreaksTaken: 0,
        focusScore: 0,
        weeklyConsistencyScore: 0,
        monthlyConsistencyScore: 0,
      }
    }

    const now = new Date()
    const todayKey = getDateKey(now)
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    const monthStart = startOfMonth(now)
    const yearStart = startOfYear(now)

    const inRange = (s: FocusSession, start: Date) =>
      isAfter(parseISO(s.date), start) || s.date === getDateKey(start)

    const todaySessions = sessions.filter((s) => s.date === todayKey)
    const weekSessions = sessions.filter((s) => inRange(s, weekStart))
    const monthSessions = sessions.filter((s) => inRange(s, monthStart))
    const yearSessions = sessions.filter((s) => inRange(s, yearStart))

    const sumFocusMins = (arr: FocusSession[]) =>
      Math.round(arr.reduce((sum, s) => sum + s.actualFocusSecs, 0) / 60)

    const lifetimeMins = sumFocusMins(sessions)

    // Average daily (over days that have data)
    const uniqueDays = new Set(sessions.map((s) => s.date)).size
    const avgDaily = uniqueDays > 0 ? lifetimeMins / uniqueDays : 0

    const completedSessions = sessions.filter((s) => s.completionStatus === 'completed').length
    const totalBreaks = sessions.reduce((sum, s) => sum + s.breaks.length, 0)
    const avgSession = sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + s.actualFocusSecs, 0) / sessions.length / 60)
      : 0

    const currentStreak = calculateCurrentStreak(sessions)
    const longestStreak = calculateLongestStreak(sessions)
    const focusScore = calculateFocusScore(sessions, goals, currentStreak, longestStreak)

    return {
      todayFocusMins: sumFocusMins(todaySessions),
      weekFocusMins: sumFocusMins(weekSessions),
      monthFocusMins: sumFocusMins(monthSessions),
      yearFocusMins: sumFocusMins(yearSessions),
      lifetimeFocusMins: lifetimeMins,
      completedSessions,
      totalSessions: sessions.length,
      currentStreak,
      longestStreak,
      averageDailyFocusMins: Math.round(avgDaily),
      averageSessionMins: avgSession,
      mostProductiveDay: getMostProductiveDay(sessions),
      mostProductiveWeek: getMostProductiveWeek(sessions),
      mostProductiveMonth: getMostProductiveMonth(sessions),
      totalBreaksTaken: totalBreaks,
      focusScore,
      weeklyConsistencyScore: getConsistencyScore(sessions, 7),
      monthlyConsistencyScore: getConsistencyScore(sessions, 30),
    }
  }, [sessions, goals])
}
