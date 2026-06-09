import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, subYears, isToday, isThisWeek, isThisMonth, isThisYear } from 'date-fns'

export function formatSeconds(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = Math.floor(totalSeconds % 60)
  if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function formatDuration(totalMinutes: number): string {
  if (totalMinutes === 0) return '0m'
  const h = Math.floor(totalMinutes / 60)
  const m = Math.round(totalMinutes % 60)
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function formatDurationLong(totalMinutes: number): string {
  if (totalMinutes === 0) return '0 minutes'
  const h = Math.floor(totalMinutes / 60)
  const m = Math.round(totalMinutes % 60)
  const parts: string[] = []
  if (h > 0) parts.push(`${h} ${h === 1 ? 'hour' : 'hours'}`)
  if (m > 0) parts.push(`${m} ${m === 1 ? 'minute' : 'minutes'}`)
  return parts.join(' ')
}

export function getDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function getTodayKey(): string {
  return getDateKey(new Date())
}

export function getWeekRange(date: Date): { start: string; end: string } {
  return {
    start: getDateKey(startOfWeek(date, { weekStartsOn: 1 })),
    end: getDateKey(endOfWeek(date, { weekStartsOn: 1 })),
  }
}

export function getMonthRange(date: Date): { start: string; end: string } {
  return {
    start: getDateKey(startOfMonth(date)),
    end: getDateKey(endOfMonth(date)),
  }
}

export function getDaysInYear(year?: number): Date[] {
  const y = year ?? new Date().getFullYear()
  const start = new Date(y, 0, 1)
  const end = new Date(y, 11, 31)
  return eachDayOfInterval({ start, end })
}

export function getLast365Days(): Date[] {
  const end = new Date()
  const start = subYears(end, 1)
  return eachDayOfInterval({ start, end })
}

export function getWeeksInYear(year?: number): Date[] {
  const y = year ?? new Date().getFullYear()
  const start = startOfWeek(new Date(y, 0, 1), { weekStartsOn: 1 })
  const end = endOfWeek(new Date(y, 11, 31), { weekStartsOn: 1 })
  return eachWeekOfInterval({ start, end }, { weekStartsOn: 1 })
}

export function getMonthsInYear(year?: number): Date[] {
  const y = year ?? new Date().getFullYear()
  return eachMonthOfInterval({ start: new Date(y, 0, 1), end: new Date(y, 11, 1) })
}

export function parseDurationToSecs(input: string): number | null {
  const trimmed = input.trim().toLowerCase()
  // "2h", "1.5h", "90m", "90min", "1:30:00", "90"
  const hoursMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*h(?:ours?)?$/)
  if (hoursMatch) return Math.round(parseFloat(hoursMatch[1]) * 3600)
  const minsMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*m(?:in(?:utes?)?)?$/)
  if (minsMatch) return Math.round(parseFloat(minsMatch[1]) * 60)
  const timeMatch = trimmed.match(/^(\d+):(\d{2})(?::(\d{2}))?$/)
  if (timeMatch) {
    const h = parseInt(timeMatch[1])
    const m = parseInt(timeMatch[2])
    const s = timeMatch[3] ? parseInt(timeMatch[3]) : 0
    return h * 3600 + m * 60 + s
  }
  const plainNum = trimmed.match(/^(\d+(?:\.\d+)?)$/)
  if (plainNum) return Math.round(parseFloat(plainNum[1]) * 60)
  return null
}

export function secsToMins(secs: number): number {
  return secs / 60
}

export function minsToSecs(mins: number): number {
  return mins * 60
}

export { isToday, isThisWeek, isThisMonth, isThisYear, format }
