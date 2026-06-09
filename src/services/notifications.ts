export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export function showNotification(title: string, body: string): void {
  if (!('Notification' in window)) return
  if (Notification.permission !== 'granted') return
  try {
    new Notification(title, {
      body,
      icon: '/icons/icon-192.svg',
      badge: '/icons/icon-192.svg',
    })
  } catch {
    // ignore
  }
}

export function notifySessionStarted(durationMins: number): void {
  showNotification(
    '🎯 Focus Session Started',
    `${durationMins} minute focus session has begun. Stay focused!`
  )
}

export function notifyBreakStarted(durationMins: number): void {
  showNotification(
    '☕ Break Time!',
    `Take a ${durationMins} minute break. You've earned it!`
  )
}

export function notifyBreakEnded(): void {
  showNotification('⏰ Break Over', 'Time to get back to work. Let\'s focus!')
}

export function notifySessionCompleted(focusMins: number): void {
  showNotification(
    '✅ Session Complete!',
    `Great work! You focused for ${focusMins} minutes.`
  )
}

export function notifyGoalAchieved(goalType: string): void {
  showNotification(
    '🏆 Goal Achieved!',
    `You've hit your ${goalType} focus goal. Amazing work!`
  )
}
