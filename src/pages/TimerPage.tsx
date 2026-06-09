/**
 * TimerPage
 *
 * Desktop layout: two-column flex row.
 *   Left pane  — timer + controls, vertically and horizontally centred.
 *                Timer is rendered 60-65 % larger than on mobile.
 *   Right pane — duration picker, task selector, break config (380 px fixed).
 *
 * Mobile layout: single stacked column (unchanged from original).
 */

import { useState, useEffect, useRef } from 'react'
import { Header }               from '../components/layout/Header'
import { ThemeTimerDisplay }    from '../components/timer/ThemeTimerDisplay'
import { TimerControls }        from '../components/timer/TimerControls'
import { DurationPicker }       from '../components/timer/DurationPicker'
import { BreakOverlay }         from '../components/timer/BreakOverlay'
import { Card }                 from '../components/ui/Card'
import { Badge }                from '../components/ui/Badge'
import { useTimer }             from '../hooks/useTimer'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { useTasks }             from '../hooks/useTasks'
import { useSettingsStore }     from '../store/settingsStore'
import { useAmbientSound }      from '../hooks/useAmbientSound'
import { useTheme }             from '../hooks/useTheme'
import { THEMES }               from '../config/themes'
import { CelebrationOverlay }   from '../components/celebration/CelebrationOverlay'
import type { CelebrationData } from '../components/celebration/CelebrationOverlay'
import { getAllSessions }        from '../services/db'
import { calculateCurrentStreak } from '../utils/streak'
import { getDateKey }           from '../utils/time'
import type { UserSettings, Task } from '../types'
import { Clock, Coffee, Target, ChevronDown } from 'lucide-react'
import { clsx }                 from 'clsx'

export function TimerPage() {
  const timer  = useTimer()
  const { tasks } = useTasks()
  const { settings } = useSettingsStore()
  const { accentTheme, isDark } = useTheme()
  const [showBreakConfig, setShowBreakConfig] = useState(false)

  // ── Completion celebration ────────────────────────────────────────────────
  const [celebData, setCelebData]             = useState<CelebrationData | null>(null)
  const celebTriggeredRef                     = useRef(false)

  useEffect(() => {
    // Trigger exactly once when status transitions INTO 'completed'
    if (timer.status === 'completed' && !celebTriggeredRef.current) {
      celebTriggeredRef.current = true

      // Brief delay lets useTimer's saveCurrentSession DB write finish
      let cancelled = false
      ;(async () => {
        await new Promise<void>((r) => setTimeout(r, 300))
        if (cancelled) return

        const sessions  = await getAllSessions()
        if (cancelled) return

        const today     = getDateKey(new Date())
        const todayMins = sessions
          .filter((s) => s.date === today)
          .reduce((sum, s) => sum + Math.round(s.actualFocusSecs / 60), 0)
        const streak    = calculateCurrentStreak(sessions)

        setCelebData({
          completedSecs: Math.round(timer.elapsedFocusSecs),
          streak,
          todayMins,
          goalMins: settings.goals.dailyMins,
        })
      })()

      return () => { cancelled = true }
    }

    // Clear everything when timer returns to idle (after dismiss + reset)
    if (timer.status === 'idle') {
      celebTriggeredRef.current = false
      setCelebData(null)
    }
  }, [timer.status]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCelebrationDismiss = () => {
    setCelebData(null)
    timer.handleReset()
  }
  // ─────────────────────────────────────────────────────────────────────────

  const canEdit     = timer.status === 'idle' || timer.status === 'completed'
  const activeTasks = tasks.filter((t) => !t.completed)

  useKeyboardShortcuts({
    status:      timer.status,
    onStart:     timer.handleStart,
    onPause:     timer.handlePause,
    onResume:    timer.handleResume,
    onStop:      timer.handleStop,
    onReset:     timer.handleReset,
    onSkipBreak: timer.handleSkipBreak,
  })

  // Ambient sound — plays only while the focus timer is running
  const themeDef = THEMES[accentTheme]
  useAmbientSound({
    synthType:    themeDef.sound.synthType,
    enabled:      settings.ambientSoundEnabled ?? false,
    timerRunning: timer.status === 'running',
  })

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Focus Timer"
        subtitle={timer.status !== 'idle' ? 'Session in progress' : 'Ready to focus'}
      />

      {/*
       * ── Content area ──────────────────────────────────────────────────────
       * Mobile:  flex-col   → timer pane stacks above settings pane
       * Desktop: flex-row   → timer pane | settings pane side-by-side
       * md:overflow-hidden so each pane scrolls independently on desktop.
       */}
      <div className="flex-1 flex flex-col md:flex-row md:overflow-hidden">

        {/* ── Left / top: timer pane ─────────────────────────────────────── */}
        <div className={clsx(
          // Mobile: natural flow with comfortable vertical padding
          'flex flex-col items-center gap-6 py-8 px-4',
          // Desktop: fills remaining width, centres content, subtle divider
          'md:flex-1 md:justify-center md:overflow-y-auto',
          'md:border-r border-slate-200/70 dark:border-slate-800',
        )}>
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
              isDark={isDark}
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

          {/* Session meta badges */}
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

          {/*
           * On mobile only, show the config cards inline below the timer
           * (they're hidden on desktop — see the right pane below).
           */}
          {canEdit && (
            <div className="w-full max-w-sm space-y-4 md:hidden">
              <MobileConfigCards
                timer={timer}
                settings={settings}
                activeTasks={activeTasks}
                showBreakConfig={showBreakConfig}
                setShowBreakConfig={setShowBreakConfig}
              />
            </div>
          )}
        </div>

        {/* ── Right / bottom: settings pane (desktop only) ────────────────── */}
        {canEdit && (
          <div className={clsx(
            'hidden md:flex md:flex-col md:w-[380px]',
            'md:overflow-y-auto md:px-6 md:py-8 md:gap-4',
          )}>
            <DesktopConfigCards
              timer={timer}
              settings={settings}
              activeTasks={activeTasks}
              showBreakConfig={showBreakConfig}
              setShowBreakConfig={setShowBreakConfig}
            />
          </div>
        )}
      </div>

      {/* ── Completion celebration overlay ──────────────────────────────────
          Renders above everything (z-50) when a session naturally completes. */}
      {celebData && (
        <CelebrationOverlay
          accentTheme={accentTheme}
          isDark={isDark}
          data={celebData}
          soundEnabled={settings.soundEnabled}
          onDismiss={handleCelebrationDismiss}
        />
      )}
    </div>
  )
}

// ─── Shared config card content ───────────────────────────────────────────────
// Same data, two rendering contexts: inline (mobile) and sidebar (desktop).

interface ConfigCardsProps {
  timer:               ReturnType<typeof useTimer>
  settings:            UserSettings
  activeTasks:         Task[]
  showBreakConfig:     boolean
  setShowBreakConfig:  React.Dispatch<React.SetStateAction<boolean>>
}

function MobileConfigCards({ timer, settings, activeTasks, showBreakConfig, setShowBreakConfig }: ConfigCardsProps) {
  return (
    <>
      <Card>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">
          Session Duration
        </h3>
        <DurationPicker
          value={timer.plannedDurationSecs}
          onChange={timer.setDuration}
          disabled={false}
        />
      </Card>

      {activeTasks.length > 0 && (
        <TaskSelectorCard timer={timer} activeTasks={activeTasks} />
      )}

      <BreakConfigCard
        settings={settings}
        timer={timer}
        showBreakConfig={showBreakConfig}
        setShowBreakConfig={setShowBreakConfig}
      />
    </>
  )
}

function DesktopConfigCards({ timer, settings, activeTasks, showBreakConfig, setShowBreakConfig }: ConfigCardsProps) {
  return (
    <>
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
          Session Duration
        </h2>
        <Card>
          <DurationPicker
            value={timer.plannedDurationSecs}
            onChange={timer.setDuration}
            disabled={false}
          />
        </Card>
      </div>

      {activeTasks.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
            Focus Task
          </h2>
          <TaskSelectorCard timer={timer} activeTasks={activeTasks} />
        </div>
      )}

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
          Break Schedule
        </h2>
        <BreakConfigCard
          settings={settings}
          timer={timer}
          showBreakConfig={showBreakConfig}
          setShowBreakConfig={setShowBreakConfig}
        />
      </div>
    </>
  )
}

// ─── Task selector card ───────────────────────────────────────────────────────

function TaskSelectorCard({
  timer,
  activeTasks,
}: {
  timer:       ReturnType<typeof useTimer>
  activeTasks: Task[]
}) {
  return (
    <Card>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm flex items-center gap-2">
        <Target size={16} className="text-primary-500" />
        Focus Task <span className="text-slate-400 dark:text-slate-500 font-normal">(optional)</span>
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
  )
}

// ─── Break config card ────────────────────────────────────────────────────────

function BreakConfigCard({
  settings,
  timer,
  showBreakConfig,
  setShowBreakConfig,
}: {
  settings:            UserSettings
  timer:               ReturnType<typeof useTimer>
  showBreakConfig:     boolean
  setShowBreakConfig:  React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <Card>
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
          <ChevronDown
            size={14}
            className={clsx('text-slate-400 transition-transform', showBreakConfig && 'rotate-180')}
          />
        </div>
      </button>
      {showBreakConfig && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <BreakConfigSelector timer={timer} settings={settings} />
        </div>
      )}
    </Card>
  )
}

// ─── Break config selector ────────────────────────────────────────────────────

function BreakConfigSelector({
  timer,
  settings,
}: {
  timer:    ReturnType<typeof useTimer>
  settings: UserSettings
}) {
  const { updateBreakConfig } = useSettingsStore()

  const PRESETS = [
    { label: 'None',                config: null },
    { label: '25m → 5m break',      config: { intervalMins: 25,  durationMins: 5,  autoResume: true } },
    { label: '45m → 10m break',     config: { intervalMins: 45,  durationMins: 10, autoResume: true } },
    { label: '60m → 5m break',      config: { intervalMins: 60,  durationMins: 5,  autoResume: true } },
    { label: '90m → 10m break',     config: { intervalMins: 90,  durationMins: 10, autoResume: true } },
    { label: '120m → 15m break',    config: { intervalMins: 120, durationMins: 15, autoResume: true } },
  ]

  const handleSelect = (cfg: typeof PRESETS[0]['config']) => {
    updateBreakConfig(cfg)
    timer.setBreakConfig(cfg)
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

