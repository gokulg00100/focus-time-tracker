import { useState } from 'react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { ThemePreviewCard } from '../components/ui/ThemePreviewCard'
import { useSettingsStore } from '../store/settingsStore'
import { useSessions } from '../hooks/useSessions'
import { useTasks } from '../hooks/useTasks'
import { requestNotificationPermission } from '../services/notifications'
import { exportSessionsToCSV, exportToJSON, parseImportFile } from '../services/export'
import { importData, clearAllUserData } from '../services/db'
import type { AccentTheme } from '../types'
import {
  Bell, Download, Upload, Trash2, Moon, Sun, Monitor, Target,
  Shield, CheckCircle, AlertCircle
} from 'lucide-react'
import { clsx } from 'clsx'

const ACCENT_THEMES: { id: AccentTheme; label: string; emoji: string }[] = [
  { id: 'classic', label: 'Classic',   emoji: '⚡' },
  { id: 'f1',      label: 'F1 Racing', emoji: '🏎️' },
  { id: 'football', label: 'Football', emoji: '⚽' },
]

const MODE_OPTIONS = [
  { value: 'light'  as const, icon: Sun,     label: 'Light'  },
  { value: 'dark'   as const, icon: Moon,    label: 'Dark'   },
  { value: 'system' as const, icon: Monitor, label: 'System' },
]

export function SettingsPage() {
  const { settings, updateTheme, updateGoals, updateNotifications, updateSound, updateAccentTheme, resetSettings } = useSettingsStore()

  // Compute effective isDark so ThemePreviewCard previews stay in sync
  const isDark = settings.theme === 'dark' ||
    (settings.theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  const { sessions, reload: reloadSessions } = useSessions()
  const { tasks } = useTasks()
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showClearDataConfirm, setShowClearDataConfirm] = useState(false)
  const [clearConfirmText, setClearConfirmText] = useState('')
  const [clearStatus, setClearStatus] = useState<'idle' | 'clearing' | 'done'>('idle')

  // Goals form state
  const [daily, setDaily] = useState(String(settings.goals.dailyMins))
  const [weekly, setWeekly] = useState(String(settings.goals.weeklyMins))
  const [monthly, setMonthly] = useState(String(settings.goals.monthlyMins))
  const [goalsSaved, setGoalsSaved] = useState(false)

  const handleSaveGoals = () => {
    const d = parseInt(daily) || 0
    const w = parseInt(weekly) || 0
    const m = parseInt(monthly) || 0
    updateGoals({ dailyMins: d, weeklyMins: w, monthlyMins: m })
    setGoalsSaved(true)
    setTimeout(() => setGoalsSaved(false), 2000)
  }

  const handleRequestNotifications = async () => {
    const granted = await requestNotificationPermission()
    updateNotifications(granted)
  }

  const handleExportCSV = () => exportSessionsToCSV(sessions, tasks)
  const handleExportJSON = async () => exportToJSON({ sessions, tasks })

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const data = await parseImportFile(file)
      await importData(data)
      await reloadSessions()
      setImportStatus('success')
    } catch {
      setImportStatus('error')
    }
    setTimeout(() => setImportStatus('idle'), 3000)
    e.target.value = ''
  }

  const handleReset = () => {
    resetSettings()
    setShowResetConfirm(false)
  }

  const handleClearAllData = async () => {
    setClearStatus('clearing')
    try {
      await clearAllUserData()
      setClearStatus('done')
      // Brief pause so the user sees "Cleared!" then hard-reload to
      // flush all in-memory React state (sessions, tasks, stats).
      setTimeout(() => window.location.reload(), 1200)
    } catch {
      setClearStatus('idle')
      setShowClearDataConfirm(false)
    }
  }

  return (
    <div className="flex flex-col">
      <Header title="Settings" subtitle="Customize your experience" />

      <div className="flex-1 p-6 space-y-5 max-w-2xl mx-auto w-full">
        {/* Appearance */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <Moon size={18} className="text-primary-500" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Appearance</h3>
          </div>

          {/* Colour mode — 3-segment control */}
          <div className="mb-6">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Colour mode</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Light, dark, or follow your system setting
            </p>
            <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl p-1.5">
              {MODE_OPTIONS.map(({ value, icon: Icon, label }) => {
                const active = settings.theme === value
                return (
                  <button
                    key={value}
                    onClick={() => updateTheme(value)}
                    className={clsx(
                      'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all duration-200',
                      active
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    )}
                  >
                    <Icon size={13} />
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Accent colour — mini preview cards */}
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Accent colour</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Changes the primary colour across the whole app instantly
            </p>
            <div className="grid grid-cols-3 gap-3">
              {ACCENT_THEMES.map(({ id, label, emoji }) => (
                <ThemePreviewCard
                  key={id}
                  id={id}
                  label={label}
                  emoji={emoji}
                  isDark={isDark}
                  isSelected={(settings.accentTheme ?? 'classic') === id}
                  onClick={() => updateAccentTheme(id)}
                />
              ))}
            </div>
          </div>
        </Card>

        {/* Goals */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Target size={18} className="text-primary-500" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Focus Goals</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Daily Goal (minutes)"
              type="number"
              value={daily}
              onChange={(e) => setDaily(e.target.value)}
              min="0"
              hint="e.g. 120 for 2 hours"
            />
            <Input
              label="Weekly Goal (minutes)"
              type="number"
              value={weekly}
              onChange={(e) => setWeekly(e.target.value)}
              min="0"
              hint="e.g. 600 for 10 hours"
            />
            <Input
              label="Monthly Goal (minutes)"
              type="number"
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
              min="0"
              hint="e.g. 2400 for 40 hours"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="primary" size="sm" onClick={handleSaveGoals}>
              {goalsSaved ? <><CheckCircle size={14} /> Saved!</> : 'Save Goals'}
            </Button>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Bell size={18} className="text-primary-500" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
          </div>
          <div className="space-y-4">
            <ToggleRow
              label="Enable notifications"
              description="Get notified when sessions start, break begins, and goals are achieved"
              checked={settings.notificationsEnabled}
              onChange={(v) => {
                if (v) handleRequestNotifications()
                else updateNotifications(false)
              }}
            />
            <ToggleRow
              label="Sound effects"
              description="Play sounds for timer events"
              checked={settings.soundEnabled}
              onChange={updateSound}
            />
          </div>
          {!settings.notificationsEnabled && (
            <div className="mt-3">
              <Button variant="secondary" size="sm" onClick={handleRequestNotifications}>
                <Bell size={14} />
                Allow Notifications
              </Button>
            </div>
          )}
        </Card>

        {/* Data Management */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-primary-500" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Data Management</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            {sessions.length} sessions stored locally
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" size="sm" onClick={handleExportCSV}>
              <Download size={14} />
              Export CSV
            </Button>
            <Button variant="secondary" size="sm" onClick={handleExportJSON}>
              <Download size={14} />
              Export JSON
            </Button>
            <label className={clsx(
              'inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all',
              'bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100'
            )}>
              <Upload size={14} />
              Import Backup
              <input type="file" accept=".json" className="hidden" onChange={handleImport} />
            </label>
          </div>
          {importStatus === 'success' && (
            <p className="mt-2 text-xs text-emerald-500 flex items-center gap-1">
              <CheckCircle size={12} /> Data imported successfully
            </p>
          )}
          {importStatus === 'error' && (
            <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle size={12} /> Import failed — invalid file
            </p>
          )}
        </Card>

        {/* Danger zone — reset settings */}
        <Card className="border-red-200 dark:border-red-900/50">
          <div className="flex items-center gap-2 mb-3">
            <Trash2 size={18} className="text-red-500" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Reset Settings</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Restore all preferences (theme, goals, notifications) to their defaults.
            Your session history and tasks are not affected.
          </p>
          <Button variant="danger" size="sm" onClick={() => setShowResetConfirm(true)}>
            Reset to Defaults
          </Button>
        </Card>

        {/* Danger zone — clear all data */}
        <Card className="border-red-300 dark:border-red-800/60 bg-red-50/40 dark:bg-red-950/20">
          <div className="flex items-center gap-2 mb-3">
            <Trash2 size={18} className="text-red-600" />
            <h3 className="font-semibold text-red-700 dark:text-red-400">Clear All Data</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
            Permanently delete <strong className="text-slate-800 dark:text-slate-200">all focus sessions</strong> and{' '}
            <strong className="text-slate-800 dark:text-slate-200">all tasks</strong> from your local database.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mb-4">
            Your account and preferences are not affected. This cannot be undone.
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="danger"
              size="sm"
              onClick={() => { setClearConfirmText(''); setShowClearDataConfirm(true) }}
            >
              <Trash2 size={14} />
              Clear All Data
            </Button>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {sessions.length} session{sessions.length !== 1 ? 's' : ''} · {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            </span>
          </div>
        </Card>
      </div>

      {/* Modal — reset settings */}
      <Modal open={showResetConfirm} onClose={() => setShowResetConfirm(false)} title="Reset Settings?" size="sm">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
          This will restore all preferences to defaults. Your session history and tasks will be preserved.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setShowResetConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleReset}>Reset Settings</Button>
        </div>
      </Modal>

      {/* Modal — clear all data */}
      <Modal
        open={showClearDataConfirm}
        onClose={() => { if (clearStatus !== 'clearing') setShowClearDataConfirm(false) }}
        title="Clear All Data?"
        size="sm"
      >
        {clearStatus === 'done' ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <CheckCircle size={24} className="text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              All data cleared. Reloading…
            </p>
          </div>
        ) : (
          <>
            {/* What gets deleted */}
            <div className="rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 p-4 mb-4">
              <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide mb-2">
                Will be permanently deleted
              </p>
              <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"/>
                  All <strong>{sessions.length}</strong> focus session{sessions.length !== 1 ? 's' : ''} &amp; statistics
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"/>
                  All <strong>{tasks.length}</strong> task{tasks.length !== 1 ? 's' : ''}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"/>
                  Streaks, daily &amp; weekly history
                </li>
              </ul>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-3 font-medium">
                ✓ Your account and preferences are kept.
              </p>
            </div>

            {/* Typed confirmation */}
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Type <strong className="text-red-500 font-mono">DELETE</strong> to confirm:
            </p>
            <input
              type="text"
              value={clearConfirmText}
              onChange={(e) => setClearConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono mb-5 focus:outline-none focus:ring-2 focus:ring-red-400"
              autoComplete="off"
            />

            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => setShowClearDataConfirm(false)}
                disabled={clearStatus === 'clearing'}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleClearAllData}
                disabled={clearConfirmText !== 'DELETE' || clearStatus === 'clearing'}
              >
                {clearStatus === 'clearing' ? (
                  <><span className="animate-spin inline-block w-3 h-3 border-2 border-white/50 border-t-white rounded-full"/> Clearing…</>
                ) : (
                  <><Trash2 size={14}/> Clear All Data</>
                )}
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          checked ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'
        )}
      >
        <span
          className={clsx(
            'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  )
}
