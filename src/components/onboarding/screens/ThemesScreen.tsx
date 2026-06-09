/**
 * ThemesScreen — premium theme-selection step.
 *
 * Three large cards displayed in a horizontal row on md+ and stacked on mobile.
 * Each card shows:
 *   • An animated mini SVG timer preview specific to that theme
 *   • Theme name + emoji
 *   • A one-liner personality tagline
 *   • Selection border/glow and a checkmark when active
 *
 * Light/Dark/System toggle is shown below the cards.
 * Dark mode activates after the onboarding flow completes.
 */

import type { ReactNode } from 'react'
import { Sun, Moon, Monitor, Check } from 'lucide-react'
import { useSettingsStore } from '../../../store/settingsStore'
import type { AccentTheme } from '../../../types'

// ── Per-theme static data ─────────────────────────────────────────────────────

const THEME_DATA: Array<{
  id:          AccentTheme
  name:        string
  emoji:       string
  tagline:     string
  personality: string
  accent:      string          // used for border / glow / selection indicator
  mini:        ReactNode        // theme-specific animated SVG preview
}> = [
  {
    id:    'classic',
    name:  'Classic',
    emoji: '⚡',
    tagline:     'Clean and distraction-free',
    personality: 'Minimal indigo design that gets out of your way.',
    accent: '#6366f1',
    mini: (
      /* Single progress ring — fills and resets on a loop. */
      <svg viewBox="0 0 64 64" width={64} height={64} aria-hidden>
        {/* Track */}
        <circle cx="32" cy="32" r="24"
          fill="none" stroke="#e2e8f0" strokeWidth="5"
        />
        {/* Animated progress */}
        <circle cx="32" cy="32" r="24"
          fill="none" stroke="#6366f1" strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="150.8"
          className="mini-ring-classic"
          transform="rotate(-90 32 32)"
        />
        <text x="32" y="30" textAnchor="middle"
          fontSize="9" fontWeight="800" fill="#0f172a"
          fontFamily="Inter,system-ui,sans-serif">
          25:00
        </text>
        <text x="32" y="41" textAnchor="middle"
          fontSize="5.5" fill="#6366f1" letterSpacing="1.5"
          fontFamily="Inter,system-ui,sans-serif">
          FOCUS
        </text>
      </svg>
    ),
  },
  {
    id:    'f1',
    name:  'F1 Racing',
    emoji: '🏎️',
    tagline:     'Speed, energy and competition',
    personality: 'Ferrari-red speedometer — every millisecond counts.',
    accent: '#e10600',
    mini: (
      /*
       * Speedometer arc: 270° visible (gap at the bottom).
       * r=22 → full C ≈ 138.2, 270° arc ≈ 103.6, gap ≈ 34.6.
       * Both track and progress use strokeDasharray="103.6 34.6" so only
       * the top 270° shows; dashoffset animation fills the arc.
       * Rotated 135° so the arc starts at bottom-left and ends bottom-right.
       */
      <svg viewBox="0 0 64 64" width={64} height={64} aria-hidden>
        {/* Track arc */}
        <circle cx="32" cy="32" r="22"
          fill="none" stroke="#e5e7eb" strokeWidth="5.5"
          strokeLinecap="round"
          strokeDasharray="103.6 34.6"
          transform="rotate(135 32 32)"
        />
        {/* Animated progress arc */}
        <circle cx="32" cy="32" r="22"
          fill="none" stroke="#e10600" strokeWidth="5.5"
          strokeLinecap="round"
          strokeDasharray="103.6 34.6"
          className="mini-ring-f1"
          transform="rotate(135 32 32)"
        />
        <text x="32" y="29" textAnchor="middle"
          fontSize="9" fontWeight="800" fill="#0a0a0a"
          fontFamily="Inter,system-ui,sans-serif">
          25:00
        </text>
        <text x="32" y="43" textAnchor="middle"
          fontSize="5.5" fill="#e10600" letterSpacing="1.5"
          fontFamily="Inter,system-ui,sans-serif">
          RACING
        </text>
      </svg>
    ),
  },
  {
    id:    'fifa',
    name:  'World Cup',
    emoji: '⚽',
    tagline:     'Stadium atmosphere and momentum',
    personality: 'Championship green with dual-ring stadium scoreboard.',
    accent: '#22c55e',
    mini: (
      /* Dual concentric rings — outer leads, inner follows with a delay. */
      <svg viewBox="0 0 64 64" width={64} height={64} aria-hidden>
        {/* Outer track */}
        <circle cx="32" cy="32" r="26"
          fill="none" stroke="#dcfce7" strokeWidth="4"
        />
        {/* Outer progress */}
        <circle cx="32" cy="32" r="26"
          fill="none" stroke="#22c55e" strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="163.4"
          className="mini-ring-fifa-outer"
          transform="rotate(-90 32 32)"
        />
        {/* Inner track */}
        <circle cx="32" cy="32" r="17"
          fill="none" stroke="#dcfce7" strokeWidth="6.5"
        />
        {/* Inner progress (delayed) */}
        <circle cx="32" cy="32" r="17"
          fill="none" stroke="#16a34a" strokeWidth="6.5"
          strokeLinecap="round"
          strokeDasharray="106.8"
          className="mini-ring-fifa-inner"
          transform="rotate(-90 32 32)"
        />
        <text x="32" y="29" textAnchor="middle"
          fontSize="8" fontWeight="800" fill="#14532d"
          fontFamily="Inter,system-ui,sans-serif">
          25:00
        </text>
        <text x="32" y="39" textAnchor="middle"
          fontSize="5" fill="#16a34a" letterSpacing="1.5"
          fontFamily="Inter,system-ui,sans-serif">
          IN PLAY
        </text>
      </svg>
    ),
  },
]

// ── Mode toggle options ───────────────────────────────────────────────────────

const MODES = [
  { value: 'light'  as const, icon: Sun,     label: 'Light'  },
  { value: 'dark'   as const, icon: Moon,    label: 'Dark'   },
  { value: 'system' as const, icon: Monitor, label: 'System' },
]

// ── Component ─────────────────────────────────────────────────────────────────

export function ThemesScreen() {
  const { settings, updateTheme, updateAccentTheme } = useSettingsStore()
  const selected = settings.accentTheme ?? 'classic'
  const mode     = settings.theme       ?? 'light'

  return (
    <div className="flex flex-col items-center px-5 py-7 max-w-2xl mx-auto w-full">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="text-center mb-7">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 leading-tight">
          Pick your theme.
        </h2>
        <p className="text-slate-500 text-base max-w-sm mx-auto">
          Each theme has its own personality. You can always change it later from&nbsp;Settings.
        </p>
      </div>

      {/* ── Theme cards ────────────────────────────────────────────────── */}
      {/*
        On md+ screens: 3 columns side-by-side (fits without scrolling).
        On mobile: stacked with compact spacing.
      */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full mb-7">
        {THEME_DATA.map((t) => {
          const isActive = selected === t.id
          const hex      = t.accent

          return (
            <button
              key={t.id}
              onClick={() => updateAccentTheme(t.id)}
              className="flex flex-col items-center p-4 rounded-2xl border-2 text-left
                         transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
              style={{
                borderColor:     isActive ? hex : '#e2e8f0',
                backgroundColor: isActive ? hex + '12' : '#ffffff',
                boxShadow: isActive
                  ? `0 0 0 4px ${hex}26, 0 4px 16px ${hex}20`
                  : '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              {/* Animated mini timer */}
              <div
                className="rounded-xl flex items-center justify-center mb-3 p-2"
                style={{
                  backgroundColor: isActive ? hex + '14' : '#f8fafc',
                  border: `1.5px solid ${isActive ? hex + '30' : '#e2e8f0'}`,
                }}
              >
                {t.mini}
              </div>

              {/* Theme identity */}
              <div className="w-full">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{t.emoji}</span>
                    <span className="font-bold text-slate-900 text-sm">{t.name}</span>
                  </div>
                  {isActive && (
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: hex }}
                    >
                      <Check size={11} className="text-white" />
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-slate-700 leading-snug">
                  {t.tagline}
                </p>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                  {t.personality}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Light / Dark / System toggle ─────────────────────────────── */}
      <div className="w-full max-w-sm">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2.5 text-center">
          Colour mode
        </p>
        <div className="flex items-center gap-1.5 bg-slate-100 rounded-2xl p-1.5">
          {MODES.map(({ value, icon: Icon, label }) => {
            const active = mode === value
            return (
              <button
                key={value}
                onClick={() => updateTheme(value)}
                className={[
                  'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700',
                ].join(' ')}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            )
          })}
        </div>
        {mode === 'dark' && (
          <p className="text-center text-xs text-slate-400 mt-2">
            Dark mode activates after setup is complete.
          </p>
        )}
      </div>
    </div>
  )
}
