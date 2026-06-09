import { subDays, parseISO, differenceInCalendarDays } from 'date-fns'
import { getDateKey } from './time'
import type { FocusSession } from '../types'

function getUniqueDatesWithFocus(sessions: FocusSession[]): Set<string> {
  const dates = new Set<string>()
  for (const s of sessions) {
    if (s.actualFocusSecs > 0) dates.add(s.date)
  }
  return dates
}

export function calculateCurrentStreak(sessions: FocusSession[]): number {
  const dates = getUniqueDatesWithFocus(sessions)
  if (dates.size === 0) return 0

  let streak = 0
  let checkDate = new Date()

  // If today has no data, start from yesterday
  if (!dates.has(getDateKey(checkDate))) {
    checkDate = subDays(checkDate, 1)
  }

  while (dates.has(getDateKey(checkDate))) {
    streak++
    checkDate = subDays(checkDate, 1)
  }

  return streak
}

export function calculateLongestStreak(sessions: FocusSession[]): number {
  const dates = getUniqueDatesWithFocus(sessions)
  if (dates.size === 0) return 0

  const sortedDates = Array.from(dates)
    .map((d) => parseISO(d))
    .sort((a, b) => a.getTime() - b.getTime())

  let longest = 1
  let current = 1

  for (let i = 1; i < sortedDates.length; i++) {
    const diff = differenceInCalendarDays(sortedDates[i], sortedDates[i - 1])
    if (diff === 1) {
      current++
      longest = Math.max(longest, current)
    } else {
      current = 1
    }
  }

  return longest
}

export function getConsistencyScore(sessions: FocusSession[], days: number): number {
  const today = new Date()
  const activeDays = new Set<string>()
  for (const s of sessions) {
    if (s.actualFocusSecs > 0) activeDays.add(s.date)
  }

  let count = 0
  for (let i = 0; i < days; i++) {
    const d = subDays(today, i)
    if (activeDays.has(getDateKey(d))) count++
  }

  return Math.round((count / days) * 100)
}
