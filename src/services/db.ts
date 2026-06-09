import { openDB, DBSchema, IDBPDatabase } from 'idb'
import type { FocusSession, Task, UserSettings } from '../types'

interface FocusTrackerDB extends DBSchema {
  sessions: {
    key: string
    value: FocusSession
    indexes: { 'by-date': string }
  }
  tasks: {
    key: string
    value: Task
  }
  settings: {
    key: string
    value: { key: string; value: UserSettings }
  }
}

// Per-user DB namespacing —————————————————————————————————————————
// Each user (Google or anonymous) gets their own IndexedDB.
// Calling setDbUserId() is all that's needed when auth state changes.

let currentUserId = 'local'
const dbCache = new Map<string, IDBPDatabase<FocusTrackerDB>>()

/** Called by authStore whenever the Firebase user changes. */
export function setDbUserId(userId: string): void {
  currentUserId = userId
}

async function getDB(): Promise<IDBPDatabase<FocusTrackerDB>> {
  const key = currentUserId
  if (dbCache.has(key)) return dbCache.get(key)!

  const db = await openDB<FocusTrackerDB>(`focus-tracker-${key}`, 1, {
    upgrade(database) {
      const sessionStore = database.createObjectStore('sessions', { keyPath: 'id' })
      sessionStore.createIndex('by-date', 'date')
      database.createObjectStore('tasks', { keyPath: 'id' })
      database.createObjectStore('settings', { keyPath: 'key' })
    },
  })
  dbCache.set(key, db)
  return db
}

// Sessions
export async function getAllSessions(): Promise<FocusSession[]> {
  const db = await getDB()
  return db.getAll('sessions')
}

export async function getSessionsByDateRange(
  startDate: string,
  endDate: string
): Promise<FocusSession[]> {
  const db = await getDB()
  const range = IDBKeyRange.bound(startDate, endDate)
  return db.getAllFromIndex('sessions', 'by-date', range)
}

export async function getSessionsByDate(date: string): Promise<FocusSession[]> {
  const db = await getDB()
  return db.getAllFromIndex('sessions', 'by-date', date)
}

export async function saveSession(session: FocusSession): Promise<void> {
  const db = await getDB()
  await db.put('sessions', session)
}

export async function deleteSession(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('sessions', id)
}

// Tasks
export async function getAllTasks(): Promise<Task[]> {
  const db = await getDB()
  return db.getAll('tasks')
}

export async function saveTask(task: Task): Promise<void> {
  const db = await getDB()
  await db.put('tasks', task)
}

export async function deleteTask(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('tasks', id)
}

// Settings
export async function getSettings(): Promise<UserSettings | null> {
  const db = await getDB()
  const record = await db.get('settings', 'user-settings')
  return record?.value ?? null
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  const db = await getDB()
  await db.put('settings', { key: 'user-settings', value: settings })
}

// Export / Import
export async function exportAllData(): Promise<{
  sessions: FocusSession[]
  tasks: Task[]
  settings: UserSettings | null
}> {
  const [sessions, tasks, settings] = await Promise.all([
    getAllSessions(),
    getAllTasks(),
    getSettings(),
  ])
  return { sessions, tasks, settings }
}

export async function importData(data: {
  sessions?: FocusSession[]
  tasks?: Task[]
  settings?: UserSettings
}): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(['sessions', 'tasks', 'settings'], 'readwrite')
  if (data.sessions) {
    for (const s of data.sessions) await tx.objectStore('sessions').put(s)
  }
  if (data.tasks) {
    for (const t of data.tasks) await tx.objectStore('tasks').put(t)
  }
  if (data.settings) {
    await tx.objectStore('settings').put({ key: 'user-settings', value: data.settings })
  }
  await tx.done
}
