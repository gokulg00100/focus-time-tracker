import { useState } from 'react'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { WelcomeScreen }         from './screens/WelcomeScreen'
import { FocusSessionsScreen }   from './screens/FocusSessionsScreen'
import { AnalyticsScreen }       from './screens/AnalyticsScreen'
import { ThemesScreen }          from './screens/ThemesScreen'
import { GoalScreen }            from './screens/GoalScreen'

const SCREENS = [
  { component: WelcomeScreen,       title: 'Welcome'   },
  { component: FocusSessionsScreen, title: 'Timer'     },
  { component: AnalyticsScreen,     title: 'Analytics' },
  { component: ThemesScreen,        title: 'Themes'    },
  { component: GoalScreen,          title: 'Goals'     },
]

const TOTAL = SCREENS.length

interface Props { onComplete: () => void }

export function OnboardingFlow({ onComplete }: Props) {
  const [step,      setStep]      = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')

  const isFirst = step === 0
  const isLast  = step === TOTAL - 1

  const goNext = () => {
    if (isLast) { onComplete(); return }
    setDirection('forward')
    setStep((s) => s + 1)
  }
  const goBack = () => {
    if (isFirst) return
    setDirection('backward')
    setStep((s) => s - 1)
  }

  const { component: CurrentScreen } = SCREENS[step]
  const animClass = direction === 'forward'
    ? 'animate-slide-from-right'
    : 'animate-slide-from-left'

  return (
    // Light mode: white → primary-50 → white gradient
    // Dark mode: slate-950 gradient (applied instantly when user picks Dark on screen 4)
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-primary-50/30 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

      {/* ── Progress bar + skip ──────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 flex items-center gap-4 px-6 pt-6 pb-3
                      bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm
                      border-b border-slate-100/60 dark:border-slate-800/40">
        {/* Bar */}
        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / TOTAL) * 100}%` }}
          />
        </div>
        {/* Counter */}
        <span className="text-slate-400 text-xs font-medium tabular-nums flex-shrink-0">
          {step + 1}&thinsp;/&thinsp;{TOTAL}
        </span>
        {/* Skip */}
        {!isLast ? (
          <button
            onClick={onComplete}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300
                       text-sm font-medium transition-colors flex-shrink-0"
          >
            Skip
          </button>
        ) : (
          <div className="w-8 flex-shrink-0" />
        )}
      </div>

      {/* ── Screen content ───────────────────────────────────────────────── */}
      {/* pb-28 leaves room for the fixed navigation bar */}
      <div className="flex-1 pb-28">
        {/*
          Unique key = step + direction forces a remount on every navigation,
          re-triggering the CSS animation from scratch.
        */}
        <div key={`${step}-${direction}`} className={animClass}>
          <div className="max-w-md mx-auto">
            <CurrentScreen />
          </div>
        </div>
      </div>

      {/* ── Fixed bottom navigation ──────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 safe-area-pb pointer-events-none">
        {/* Gradient "fade out" so content doesn't look abruptly clipped */}
        <div className="absolute inset-0 bg-gradient-to-t
          from-white dark:from-slate-950
          via-white/95 dark:via-slate-950/95
          to-transparent pointer-events-none"
        />
        <div className="relative px-6 py-4 max-w-md mx-auto flex items-center justify-between gap-4 pointer-events-auto">

          {/* Back */}
          <button
            onClick={goBack}
            disabled={isFirst}
            className={[
              'flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all min-w-[80px]',
              isFirst
                ? 'text-transparent cursor-default'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95',
            ].join(' ')}
          >
            {!isFirst && <ArrowLeft className="w-4 h-4" />}
            {!isFirst && 'Back'}
          </button>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {SCREENS.map((_, i) => (
              <div
                key={i}
                className={[
                  'rounded-full transition-all duration-300',
                  i === step
                    ? 'w-6 h-2 bg-primary-500'
                    : i < step
                    ? 'w-2 h-2 bg-primary-300 dark:bg-primary-800'
                    : 'w-2 h-2 bg-slate-200 dark:bg-slate-700',
                ].join(' ')}
              />
            ))}
          </div>

          {/* Next / Let's Go */}
          <button
            onClick={goNext}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold
                       bg-primary-500 hover:bg-primary-600 text-white shadow-glow
                       transition-all active:scale-95 min-w-[90px] justify-center"
          >
            {isLast ? (
              <><Sparkles className="w-4 h-4" /> Let&apos;s Go!</>
            ) : (
              <>Next <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
