import { useState } from 'react'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { WelcomeScreen }         from './screens/WelcomeScreen'
import { FocusSessionsScreen }   from './screens/FocusSessionsScreen'
import { AnalyticsScreen }       from './screens/AnalyticsScreen'
import { ThemesScreen }          from './screens/ThemesScreen'
import { GoalScreen }            from './screens/GoalScreen'

const SCREENS = [
  { component: WelcomeScreen,       label: 'Welcome'   },
  { component: FocusSessionsScreen, label: 'Timer'     },
  { component: AnalyticsScreen,     label: 'Analytics' },
  { component: ThemesScreen,        label: 'Themes'    },
  { component: GoalScreen,          label: 'Goals'     },
]

interface Props {
  onComplete: () => void
}

export function OnboardingFlow({ onComplete }: Props) {
  const [step, setStep]           = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')

  const TOTAL   = SCREENS.length
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">

      {/* ── Top bar: progress + skip ───────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-sm flex items-center px-6 pt-6 pb-3 gap-4 flex-shrink-0">
        {/* Progress bar */}
        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / TOTAL) * 100}%` }}
          />
        </div>

        {/* Step counter */}
        <span className="text-slate-600 text-xs font-medium tabular-nums flex-shrink-0">
          {step + 1} / {TOTAL}
        </span>

        {/* Skip (hidden on last screen) */}
        {!isLast ? (
          <button
            onClick={onComplete}
            className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors flex-shrink-0"
          >
            Skip
          </button>
        ) : (
          <div className="w-8 flex-shrink-0" />
        )}
      </div>

      {/* ── Screen content ─────────────────────────────────────────────── */}
      {/* pb-28 leaves room for the fixed nav bar */}
      <div className="flex-1 pb-28 overflow-y-auto">
        {/* key combines step + direction so React remounts the div and
            re-triggers the CSS animation every time either changes. */}
        <div key={`${step}-${direction}`} className={animClass}>
          <div className="max-w-md mx-auto">
            <CurrentScreen />
          </div>
        </div>
      </div>

      {/* ── Bottom navigation (fixed) ──────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 safe-area-pb">
        {/* Gradient fade-out so content doesn't look clipped */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pointer-events-none" />

        <div className="relative px-6 py-4 max-w-md mx-auto flex items-center justify-between gap-4">
          {/* Back */}
          <button
            onClick={goBack}
            disabled={isFirst}
            className={[
              'flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all min-w-[80px]',
              isFirst
                ? 'text-slate-800 cursor-default'
                : 'text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95',
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
                    ? 'w-2 h-2 bg-primary-800'
                    : 'w-2 h-2 bg-slate-700',
                ].join(' ')}
              />
            ))}
          </div>

          {/* Next / Let's Go */}
          <button
            onClick={goNext}
            className={[
              'flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold',
              'transition-all active:scale-95 shadow-glow min-w-[80px] justify-center',
              'bg-primary-500 hover:bg-primary-600 text-white',
            ].join(' ')}
          >
            {isLast ? (
              <>
                <Sparkles className="w-4 h-4" />
                Let&apos;s Go!
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
