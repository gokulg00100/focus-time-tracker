import type { FocusSession, Goals } from '../types'
import { getConsistencyScore } from './streak'

export function calculateFocusScore(
  sessions: FocusSession[],
  goals: Goals,
  currentStreak: number,
  longestStreak: number
): number {
  if (sessions.length === 0) return 0

  // Completion score (0–30): % of sessions that are completed
  const completed = sessions.filter((s) => s.completionStatus === 'completed').length
  const completionRatio = sessions.length > 0 ? completed / sessions.length : 0
  const completionScore = completionRatio * 30

  // Streak score (0–25): current streak relative to longest
  const streakRatio = longestStreak > 0 ? Math.min(currentStreak / longestStreak, 1) : (currentStreak > 0 ? 1 : 0)
  const streakScore = streakRatio * 25

  // Goal score (0–25): check if daily/weekly goals are being met recently
  const today = new Date()
  const todayKey = today.toISOString().slice(0, 10)
  const todaySessions = sessions.filter((s) => s.date === todayKey)
  const todayMins = todaySessions.reduce((sum, s) => sum + s.actualFocusSecs, 0) / 60
  const goalRatio = goals.dailyMins > 0 ? Math.min(todayMins / goals.dailyMins, 1) : 0
  const goalScore = goalRatio * 25

  // Consistency score (0–20): how consistent over last 30 days
  const consistency = getConsistencyScore(sessions, 30) / 100
  const consistencyScore = consistency * 20

  return Math.round(completionScore + streakScore + goalScore + consistencyScore)
}

export function getFocusScoreLabel(score: number): string {
  if (score >= 90) return 'Exceptional'
  if (score >= 75) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 45) return 'Average'
  if (score >= 30) return 'Improving'
  if (score >= 15) return 'Beginner'
  return 'Just Starting'
}

export function getFocusScoreColor(score: number): string {
  if (score >= 80) return '#10b981'
  if (score >= 60) return '#6366f1'
  if (score >= 40) return '#f59e0b'
  return '#ef4444'
}
