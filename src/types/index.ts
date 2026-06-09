export type TimerStatus = 'idle' | 'running' | 'paused' | 'break' | 'completed'

export interface BreakRecord {
  startTime: number
  endTime: number
  durationSecs: number
  skipped: boolean
}

export interface FocusSession {
  id: string
  date: string // YYYY-MM-DD
  startTime: number // Unix ms
  endTime: number | null
  plannedDurationSecs: number
  actualFocusSecs: number
  breakSecs: number
  completionStatus: 'completed' | 'partial' | 'abandoned'
  completionPercentage: number
  taskId?: string
  breaks: BreakRecord[]
}

export interface Task {
  id: string
  title: string
  description: string
  color: string
  createdAt: number
  totalFocusSecs: number
  completed: boolean
  sessionIds: string[]
}

export interface BreakConfig {
  intervalMins: number // focus minutes before break
  durationMins: number // break duration in minutes
  autoResume: boolean
}

export interface Goals {
  dailyMins: number
  weeklyMins: number
  monthlyMins: number
}

export interface UserSettings {
  breakConfig: BreakConfig | null
  goals: Goals
  theme: 'light' | 'dark' | 'system'
  notificationsEnabled: boolean
  soundEnabled: boolean
}

export interface DailyData {
  date: string
  focusMins: number
  sessions: number
}

export interface WeeklyData {
  week: string
  focusMins: number
  sessions: number
}

export interface MonthlyData {
  month: string
  focusMins: number
  sessions: number
}

export interface HeatmapDay {
  date: string
  value: number // minutes
  level: 0 | 1 | 2 | 3 | 4
}

export interface Stats {
  todayFocusMins: number
  weekFocusMins: number
  monthFocusMins: number
  yearFocusMins: number
  lifetimeFocusMins: number
  completedSessions: number
  totalSessions: number
  currentStreak: number
  longestStreak: number
  averageDailyFocusMins: number
  averageSessionMins: number
  mostProductiveDay: string
  mostProductiveWeek: string
  mostProductiveMonth: string
  totalBreaksTaken: number
  focusScore: number
  weeklyConsistencyScore: number
  monthlyConsistencyScore: number
}
