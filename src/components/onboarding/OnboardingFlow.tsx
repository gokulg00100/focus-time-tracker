/**
 * OnboardingFlow
 * ──────────────
 * Full-screen, viewport-constrained onboarding wizard.
 *
 * Design decisions:
 *  • h-screen + overflow-hidden → no page scroll; each screen fits the viewport.
 *  • Content area is overflow-y-auto so mobile can still scroll when needed.
 *  • Always rendered in light mode: we use hardcoded light-palette classes
 *    throughout every screen so dark-mode CSS never bleeds in.
 *  • LaunchScreen owns its own CTA button; the bottom nav is hidden for it.
 *  • Soft gradient background reacts to the user's accent-theme choice via
 *    the `primary-50` CSS variable (set by useTheme in the background).
 */

import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { AppLogo } from '../ui/AppLogo'
import { WelcomeScreen }  from './screens/WelcomeScreen'
import { FeaturesScreen } from './screens/FeaturesScreen'
import { ThemesScreen }   from './screens/ThemesScreen'
import { GoalScreen }     from './screens/GoalScreen'
import { LaunchScreen }   from './screens/LaunchScreen'

// ── Screen registry ───────────────────────────────────────────────────────────

interface ScreenEntry {
  label: string
  hideNav?: boolean           // hides the bottom Back/Next bar (LaunchScreen only)
}

const SCREENS: ScreenEntry[] = [
  { label: 'Welcome'  },
  { label: 'Features' },
  { label: 'Themes'   },
  { label: 'Goals'    },
  { label: 'Launch', hideNav: true },
]

const TOTAL = SCREENS.length

// ── Component ─────────────────────────────────────────────────────────────────

interface Props { onComplete: () => void }

export function OnboardingFlow({ onComplete }: Props) {
  const [step,      setStep]      = useState(0)
  const [direction, setDirection] = useState<'fwd' | 'bwd'>('fwd')

  const isFirst    = step === 0
  const isLast     = step === TOTAL - 1
  const { hideNav } = SCREENS[step]

  function goNext() {
    if (isLast) { onComplete(); return }
    setDirection('fwd')
    setStep((s) => s + 1)
  }
  function goBack() {
    if (isFirst) return
    setDirection('bwd')
    setStep((s) => s - 1)
  }

  // Map step → screen component (only one is mounted at a time)
  function renderScreen() {
    const anim = direction === 'fwd'
      ? 'animate-slide-from-right'
      : 'animate-slide-from-left'

    const inner = (() => {
      switch (step) {
        case 0: return <WelcomeScreen />
        case 1: return <FeaturesScreen />
        case 2: return <ThemesScreen />
        case 3: return <GoalScreen />
        case 4: return <LaunchScreen onComplete={onComplete} />
        default: return null
      }
    })()

    return (
      // key forces remount → re-triggers the CSS slide animation
      <div key={`${step}-${direction}`} className={`w-full ${anim}`}>
        {inner}
      </div>
    )
  }

  return (
    /*
     * h-screen + overflow-hidden = no outer scroll.
     * The background uses primary-50 so it subtly shifts with the chosen theme
     * while staying entirely in light-mode colours.
     */
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50/40">

      {/* ── Top bar: logo · progress · skip ─────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center gap-3 px-5 pt-5 pb-3">

        {/* Mini logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center shadow-sm">
            <AppLogo size={16} variant="white" id="ob" />
          </div>
          <span className="text-sm font-bold text-slate-800 tracking-tight hidden sm:block">
            Focus Timer
          </span>
        </div>

        {/* Progress bar + counter */}
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${((step + 1) / TOTAL) * 100}%`,
                background: 'rgb(var(--p-500))',
              }}
            />
          </div>
          <span className="text-slate-400 text-xs font-medium tabular-nums flex-shrink-0 w-8 text-right">
            {step + 1}/{TOTAL}
          </span>
        </div>

        {/* Skip (hidden on last screen) */}
        {!isLast ? (
          <button
            onClick={onComplete}
            className="text-slate-400 hover:text-slate-600 text-sm font-medium
                       transition-colors px-2 py-1 rounded-lg hover:bg-slate-100 flex-shrink-0"
          >
            Skip
          </button>
        ) : (
          <div className="w-10 flex-shrink-0" />
        )}
      </div>

      {/* ── Screen content ───────────────────────────────────────────────── */}
      {/*
        overflow-y-auto keeps desktop viewport-constrained while letting
        mobile users scroll if a screen's content is taller than the phone.
        min-h-full + justify-center on the inner wrapper vertically centres
        content when it's shorter than the available area.
      */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="min-h-full flex flex-col items-center justify-center">
          {renderScreen()}
        </div>
      </div>

      {/* ── Bottom navigation (hidden for LaunchScreen) ───────────────────── */}
      {!hideNav && (
        <div className="flex-shrink-0 flex items-center justify-between
                        px-5 py-4 border-t border-slate-100">

          {/* Back */}
          <button
            onClick={goBack}
            disabled={isFirst}
            className={[
              'flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium',
              'transition-all duration-150 min-w-[76px]',
              isFirst
                ? 'opacity-0 pointer-events-none'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 active:scale-95',
            ].join(' ')}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {SCREENS.map((s, i) =>
              s.hideNav ? null : (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width:           i === step ? 24 : 8,
                    height:          8,
                    backgroundColor: i === step
                      ? 'rgb(var(--p-500))'
                      : i < step
                      ? 'rgb(var(--p-300))'
                      : '#e2e8f0',
                  }}
                />
              )
            )}
          </div>

          {/* Next */}
          <button
            onClick={goNext}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl
                       text-sm font-semibold text-white shadow-glow
                       transition-all duration-150 active:scale-95
                       min-w-[84px] justify-center"
            style={{ backgroundColor: 'rgb(var(--p-500))' }}
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
