import { useState } from 'react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { ThemeToggle } from '../components/ui/ThemeToggle'
import { useSettingsStore } from '../store/settingsStore'
import { useSessions } from '../hooks/useSessions'
import { useTasks } from '../hooks/useTasks'
import { requestNotificationPermission } from '../services/notifications'
import { exportSessionsToCSV, exportToJSON, parseImportFile } from '../services/export'
import { importData } from '../services/db'
import type { AccentTheme } from '../types'
import {
  Bell, Download, Upload, Trash2, Moon, Target,
  Shield, CheckCircle, AlertCircle, Check
} from 'lucide-react'
import { clsx } from 'clsx'

const ACCENT_THEMES: { id: AccentTheme; name: string; emoji: string; color: string }[] = [
  { id: 'classic', name: 'Classic',   emoji: '⚡', color: '#6366f1' },
  { id: 'f1',      name: 'F1 Racing', emoji: '🏎️', color: '#e10600' },
  { id: 'fifa',    name: 'World Cup', emoji: '⚽', color: '#22c55e' },
]

export function SettingsPage() {
  const { settings, updateGoals, updateNotifications, updateSound, updateAccentTheme, resetSettings } = useSettingsStore()
  const { sessions, reload: reloadSessions } = useSessions()
  const { tasks } = useTasks()
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showResetConfirm, setShowResetConfirm] = useState(false)

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

  return (
    <div className="flex flex-col">
      <Header title="Settings" subtitle="Customize your experience" />

      <div className="flex-1 p-6 space-y-5 max-w-2xl mx-auto w-full">
        {/* Theme */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Moon size={18} className="text-primary-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Appearance</h3>
            </div>
          </div>

          {/* Light / dark */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Colour mode</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Light, dark, or follow system</p>
            </div>
            <ThemeToggle />
          </div>

          {/* Accent theme */}
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Accent theme</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Changes the primary colour across the whole app</p>
            <div className="flex gap-3">
              {ACCENT_THEMES.map(({ id, name, emoji, color }) => {
                const isActive = (settings.accentTheme ?? 'classic') === id
                return (
                  <button
                    key={id}
                    onClick={() => updateAccentTheme(id)}
                    title={name}
                    className={clsx(
                      'flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all',
                      isActive
                        ? 'border-primary-500 bg-primary-500/10 text-primary-500'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      <span
                        className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      {emoji} {name}
                    </span>
                    {isActive && <Check size={10} className="text-primary-500" />}
                  </button>
                )
              })}
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

        {/* Danger zone */}
        <Card className="border-red-200 dark:border-red-900/50">
          <div className="flex items-center gap-2 mb-3">
            <Trash2 size={18} className="text-red-500" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Reset Settings</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Reset all settings to defaults. Your session data will not be affected.
          </p>
          <Button variant="danger" size="sm" onClick={() => setShowResetConfirm(true)}>
            Reset to Defaults
          </Button>
        </Card>
      </div>

      <Modal open={showResetConfirm} onClose={() => setShowResetConfirm(false)} title="Reset Settings?" size="sm">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
          This will reset all settings to their defaults. Your session history and tasks will be preserved.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setShowResetConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleReset}>Reset Settings</Button>
        </div>
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
