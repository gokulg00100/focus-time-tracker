import { format, parseISO, startOfWeek, startOfMonth } from 'date-fns'
import type { FocusSession, DailyData, WeeklyData, MonthlyData, HeatmapDay } from '../types'
import { getDateKey } from './time'

export function groupByDate(sessions: FocusSession[]): Map<string, FocusSession[]> {
  const map = new Map<string, FocusSession[]>()
  for (const s of sessions) {
    const arr = map.get(s.date) ?? []
    arr.push(s)
    map.set(s.date, arr)
  }
  return map
}

export function getDailyData(sessions: FocusSession[], days = 30): DailyData[] {
  const map = groupByDate(sessions)
  const result: DailyData[] = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = getDateKey(d)
    const daySessions = map.get(key) ?? []
    result.push({
      date: format(d, 'MMM d'),
      focusMins: Math.round(daySessions.reduce((sum, s) => sum + s.actualFocusSecs, 0) / 60),
      sessions: daySessions.length,
    })
  }
  return result
}

export function getWeeklyData(sessions: FocusSession[], weeks = 12): WeeklyData[] {
  const result: WeeklyData[] = []
  const today = new Date()

  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i * 7)
    const weekStart = startOfWeek(d, { weekStartsOn: 1 })
    const weekKey = format(weekStart, 'MMM d')
    const weekStartStr = getDateKey(weekStart)
    const weekSessions = sessions.filter((s) => {
      const sw = getDateKey(startOfWeek(parseISO(s.date), { weekStartsOn: 1 }))
      return sw === weekStartStr
    })
    result.push({
      week: weekKey,
      focusMins: Math.round(weekSessions.reduce((sum, s) => sum + s.actualFocusSecs, 0) / 60),
      sessions: weekSessions.length,
    })
  }
  return result
}

export function getMonthlyData(sessions: FocusSession[], months = 12): MonthlyData[] {
  const result: MonthlyData[] = []
  const today = new Date()

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const monthKey = format(d, 'MMM yyyy')
    const monthStartStr = getDateKey(startOfMonth(d))
    const monthSessions = sessions.filter((s) => {
      const sm = getDateKey(startOfMonth(parseISO(s.date)))
      return sm === monthStartStr
    })
    result.push({
      month: monthKey,
      focusMins: Math.round(monthSessions.reduce((sum, s) => sum + s.actualFocusSecs, 0) / 60),
      sessions: monthSessions.length,
    })
  }
  return result
}

export function getHeatmapData(sessions: FocusSession[], year?: number): HeatmapDay[] {
  const y = year ?? new Date().getFullYear()
  const map = groupByDate(sessions)
  const result: HeatmapDay[] = []

  const start = new Date(y, 0, 1)
  const end = new Date(y, 11, 31)
  const curr = new Date(start)

  // Calculate max for scaling
  let maxMins = 0
  map.forEach((daySessions) => {
    const mins = daySessions.reduce((sum, s) => sum + s.actualFocusSecs, 0) / 60
    if (mins > maxMins) maxMins = mins
  })

  while (curr <= end) {
    const key = getDateKey(curr)
    const daySessions = map.get(key) ?? []
    const mins = Math.round(daySessions.reduce((sum, s) => sum + s.actualFocusSecs, 0) / 60)
    let level: HeatmapDay['level'] = 0
    if (mins > 0) {
      const ratio = mins / Math.max(maxMins, 1)
      if (ratio < 0.25) level = 1
      else if (ratio < 0.5) level = 2
      else if (ratio < 0.75) level = 3
      else level = 4
    }
    result.push({ date: key, value: mins, level })
    curr.setDate(curr.getDate() + 1)
  }
  return result
}

export function getMostProductiveDay(sessions: FocusSession[]): string {
  const map = groupByDate(sessions)
  let maxMins = 0
  let bestDay = '—'
  map.forEach((daySessions, date) => {
    const mins = daySessions.reduce((sum, s) => sum + s.actualFocusSecs, 0) / 60
    if (mins > maxMins) {
      maxMins = mins
      bestDay = format(parseISO(date), 'EEEE, MMM d')
    }
  })
  return bestDay
}

export function getMostProductiveWeek(sessions: FocusSession[]): string {
  const weekMap = new Map<string, number>()
  for (const s of sessions) {
    const weekStart = getDateKey(startOfWeek(parseISO(s.date), { weekStartsOn: 1 }))
    weekMap.set(weekStart, (weekMap.get(weekStart) ?? 0) + s.actualFocusSecs)
  }
  let maxMins = 0
  let bestWeek = '—'
  weekMap.forEach((secs, week) => {
    if (secs > maxMins) {
      maxMins = secs
      bestWeek = `Week of ${format(parseISO(week), 'MMM d')}`
    }
  })
  return bestWeek
}

export function getMostProductiveMonth(sessions: FocusSession[]): string {
  const monthMap = new Map<string, number>()
  for (const s of sessions) {
    const monthKey = format(parseISO(s.date), 'yyyy-MM')
    monthMap.set(monthKey, (monthMap.get(monthKey) ?? 0) + s.actualFocusSecs)
  }
  let maxMins = 0
  let bestMonth = '—'
  monthMap.forEach((secs, month) => {
    if (secs > maxMins) {
      maxMins = secs
      bestMonth = format(parseISO(month + '-01'), 'MMMM yyyy')
    }
  })
  return bestMonth
}
