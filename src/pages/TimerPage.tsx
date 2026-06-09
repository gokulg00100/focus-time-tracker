import { useState } from 'react'
import { Header } from '../components/layout/Header'
import { ThemeTimerDisplay } from '../components/timer/ThemeTimerDisplay'
import { TimerControls } from '../components/timer/TimerControls'
import { DurationPicker } from '../components/timer/DurationPicker'
import { BreakOverlay } from '../components/timer/BreakOverlay'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { useTimer } from '../hooks/useTimer'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { useTasks } from '../hooks/useTasks'
import { useSettingsStore } from '../store/settingsStore'
import { useAmbientSound } from '../hooks/useAmbientSound'
import { useTheme } from '../hooks/useTheme'
import { THEMES } from '../config/themes'
import { formatDuration } from '../utils/time'
import { Clock, Coffee, Target, ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'

export function TimerPage() {
  const timer = useTimer()
  const { tasks } = useTasks()
  const { settings } = useSettingsStore()
  const { accentTheme } = useTheme()
  const [showBreakConfig, setShowBreakConfig] = useState(false)

  // Ambient sound — plays only while the focus timer is running
  const themeDef = THEMES[accentTheme]
  useAmbientSound({
    synthType:    themeDef.sound.synthType,
    enabled:      settings.ambientSoundEnabled ?? false,
    timerRunning: timer.status === 'running',
  })

  const canEdit = timer.status === 'idle' || timer.status === 'completed'

  useKeyboardShortcuts({
    status: timer.status,
    onStart: timer.handleStart,
    onPause: timer.handlePause,
    onResume: timer.handleResume,
    onStop: timer.handleStop,
    onReset: timer.handleReset,
    onSkipBreak: timer.handleSkipBreak,
  })

  const activeTasks = tasks.filter((t) => !t.completed)

  return (
    <div className="flex flex-col">
      <Header
        title="Focus Timer"
        subtitle={timer.status !== 'idle' ? `Session in progress` : 'Ready to focus'}
      />

      <div className="flex-1 flex flex-col items-center gap-6 px-4 py-8 max-w-2xl mx-auto w-full">
        {/* Timer or Break */}
        {timer.status === 'break' ? (
          <BreakOverlay
            breakRemaining={timer.breakRemaining}
            breakProgress={timer.breakProgress}
            plannedDurationSecs={timer.plannedDurationSecs}
            onSkip={timer.handleSkipBreak}
            onExtend={timer.handleExtendBreak}
          />
        ) : (
          <ThemeTimerDisplay
            status={timer.status}
            remainingFocusSecs={timer.remainingFocusSecs}
            elapsedFocusSecs={timer.elapsedFocusSecs}
            progress={timer.progress}
            breakRemaining={timer.breakRemaining}
            breakProgress={timer.breakProgress}
            plannedDurationSecs={timer.plannedDurationSecs}
            accentTheme={accentTheme}
          />
        )}

        {/* Controls */}
        {timer.status !== 'break' && (
          <TimerControls
            status={timer.status}
            onStart={timer.handleStart}
            onPause={timer.handlePause}
            onResume={timer.handleResume}
            onStop={timer.handleStop}
            onReset={timer.handleReset}
          />
        )}

        {/* Session meta */}
        {timer.status !== 'idle' && timer.status !== 'completed' && (
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Badge variant="info">
              <Clock size={10} className="mr-1" />
              {timer.breaksCount} {timer.breaksCount === 1 ? 'break' : 'breaks'} taken
            </Badge>
            {settings.breakConfig && (
              <Badge variant="default">
                <Coffee size={10} className="mr-1" />
                Break every {settings.breakConfig.intervalMins}m
              </Badge>
            )}
          </div>
        )}

        {/* Duration Picker */}
        {canEdit && (
          <Card className="w-full">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">Session Duration</h3>
            <DurationPicker
              value={timer.plannedDurationSecs}
              onChange={timer.setDuration}
              disabled={!canEdit}
            />
          </Card>
        )}

        {/* Task selector */}
        {canEdit && activeTasks.length > 0 && (
          <Card className="w-full">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm flex items-center gap-2">
              <Target size={16} className="text-primary-500" />
              Focus Task (optional)
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => timer.setSelectedTask(null)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  !timer.selectedTaskId
                    ? 'bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                )}
              >
                None
              </button>
              {activeTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => timer.setSelectedTask(task.id)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5',
                    timer.selectedTaskId === task.id
                      ? 'text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  )}
                  style={timer.selectedTaskId === task.id ? { backgroundColor: task.color } : {}}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: timer.selectedTaskId === task.id ? 'white' : task.color }}
                  />
                  {task.title}
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Break config summary */}
        {canEdit && (
          <Card className="w-full">
            <button
              className="flex items-center justify-between w-full"
              onClick={() => setShowBreakConfig((v) => !v)}
            >
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Coffee size={16} className="text-emerald-500" />
                Break Configuration
              </h3>
              <div className="flex items-center gap-2">
                {settings.breakConfig ? (
                  <Badge variant="success" size="sm">
                    Every {settings.breakConfig.intervalMins}m → {settings.breakConfig.durationMins}m break
                  </Badge>
                ) : (
                  <Badge variant="default" size="sm">No breaks</Badge>
                )}
                <ChevronDown size={14} className={clsx('text-slate-400 transition-transform', showBreakConfig && 'rotate-180')} />
              </div>
            </button>
            {showBreakConfig && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <BreakConfigSelector />
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}

function BreakConfigSelector() {
  const { settings, updateBreakConfig } = useSettingsStore()
  const { setBreakConfig } = useTimer()

  const PRESETS = [
    { label: 'None', config: null },
    { label: '25m focus → 5m break', config: { intervalMins: 25, durationMins: 5, autoResume: true } },
    { label: '45m focus → 10m break', config: { intervalMins: 45, durationMins: 10, autoResume: true } },
    { label: '60m focus → 5m break', config: { intervalMins: 60, durationMins: 5, autoResume: true } },
    { label: '90m focus → 10m break', config: { intervalMins: 90, durationMins: 10, autoResume: true } },
    { label: '120m focus → 15m break', config: { intervalMins: 120, durationMins: 15, autoResume: true } },
  ]

  const handleSelect = (cfg: typeof PRESETS[0]['config']) => {
    updateBreakConfig(cfg)
    setBreakConfig(cfg)
  }

  const currentKey = settings.breakConfig
    ? `${settings.breakConfig.intervalMins}-${settings.breakConfig.durationMins}`
    : 'none'

  return (
    <div className="flex flex-wrap gap-2">
      {PRESETS.map((p) => {
        const key = p.config ? `${p.config.intervalMins}-${p.config.durationMins}` : 'none'
        return (
          <button
            key={key}
            onClick={() => handleSelect(p.config)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              currentKey === key
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-primary-100 dark:hover:bg-primary-900/30'
            )}
          >
            {p.label}
          </button>
        )
      })}
    </div>
  )
}
