import type { FocusSession, Task } from '../types'
import { formatDuration, getDateKey } from '../utils/time'

export function exportSessionsToCSV(sessions: FocusSession[], tasks: Task[]): void {
  const taskMap = new Map(tasks.map((t) => [t.id, t.title]))
  const headers = [
    'Date',
    'Start Time',
    'End Time',
    'Planned Duration',
    'Actual Focus',
    'Break Duration',
    'Completion %',
    'Status',
    'Task',
  ]
  const rows = sessions.map((s) => [
    s.date,
    new Date(s.startTime).toLocaleTimeString(),
    s.endTime ? new Date(s.endTime).toLocaleTimeString() : '',
    formatDuration(Math.round(s.plannedDurationSecs / 60)),
    formatDuration(Math.round(s.actualFocusSecs / 60)),
    formatDuration(Math.round(s.breakSecs / 60)),
    `${Math.round(s.completionPercentage)}%`,
    s.completionStatus,
    s.taskId ? (taskMap.get(s.taskId) ?? '') : '',
  ])

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  downloadFile(csv, `focus-sessions-${getDateKey(new Date())}.csv`, 'text/csv')
}

export function exportToJSON(data: {
  sessions: FocusSession[]
  tasks: Task[]
}): void {
  const json = JSON.stringify(data, null, 2)
  downloadFile(
    json,
    `focus-tracker-backup-${getDateKey(new Date())}.json`,
    'application/json'
  )
}

export function parseImportFile(file: File): Promise<{
  sessions?: FocusSession[]
  tasks?: Task[]
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        resolve(data)
      } catch {
        reject(new Error('Invalid JSON file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
