/**
 * Theme Settings page — accessible anytime via /theme-settings.
 *
 * Sections:
 *   1. Theme selector  — large preview cards for Classic / F1 / Football
 *   2. Appearance      — Light / Dark / System mode selector
 *   3. Timer preview   — live mini-preview of the timer style for the chosen theme
 *   4. Ambient sound   — toggle (only shown when the theme supports it)
 */

import { useState } from 'react'
import { Header }             from '../components/layout/Header'
import { ThemePreviewCard }   from '../components/ui/ThemePreviewCard'
import { useTheme }           from '../hooks/useTheme'
import { useSettingsStore }   from '../store/settingsStore'
import { THEMES }             from '../config/themes'
import type { AccentTheme }   from '../types'
import { Sun, Moon, Monitor, Volume2, VolumeX, Check, Palette } from 'lucide-react'
import { clsx } from 'clsx'

// ── Helpers ────────────────────────────────────────────────────────────────────

const ACCENT_ORDER: AccentTheme[] = ['classic', 'f1', 'football']

const MODE_OPTIONS = [
  { value: 'light',  Icon: Sun,     label: 'Light'  },
  { value: 'dark',   Icon: Moon,    label: 'Dark'   },
  { value: 'system', Icon: Monitor, label: 'System' },
] as const

// ── Tiny live timer preview ────────────────────────────────────────────────────

function TimerStylePreview({ accentTheme, isDark }: { accentTheme: AccentTheme; isDark: boolean }) {
  const def   = THEMES[accentTheme]
  const color = isDark ? def.hex.p400 : def.hex.p500

  if (accentTheme === 'f1') {
    // Speedometer mini-arc
    const R = 38, CX = 50, CY = 56
    const ARC_LEN = (240 / 360) * 2 * Math.PI * R // ≈ 160.2
    const prog = 0.65
    return (
      <svg viewBox="0 0 100 75" className="w-full h-full" aria-hidden>
        <circle cx={CX} cy={CY} r={R} fill="none"
          stroke={isDark ? '#1c1c1c' : '#e5e7eb'} strokeWidth={5}
          strokeDasharray={`${ARC_LEN} 99999`}
          transform={`rotate(150 ${CX} ${CY})`} />
        <circle cx={CX} cy={CY} r={R} fill="none"
          stroke={color} strokeWidth={5} strokeLinecap="round"
          strokeDasharray={`${prog * ARC_LEN} 99999`}
          transform={`rotate(150 ${CX} ${CY})`}
          style={{ filter: `drop-shadow(0 0 5px ${color}88)` }} />
        <text x={CX} y={CY + 5} textAnchor="middle"
          fill={isDark ? 'white' : '#1e293b'}
          fontSize="10" fontWeight="800" fontFamily="monospace">
          25:00
        </text>
        <text x={CX} y={CY - 14} textAnchor="middle"
          fill={color} fontSize="5" fontWeight="700"
          fontFamily="Inter,sans-serif" letterSpacing="1.5">
          ON TRACK
        </text>
      </svg>
    )
  }

  if (accentTheme === 'football') {
    // Dual concentric rings
    const CX = 50, CY = 50
    const R1 = 36, R2 = 27
    const prog = 0.72
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden>
        <circle cx={CX} cy={CY} r={R1} fill="none"
          stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} strokeWidth={4} />
        <circle cx={CX} cy={CY} r={R1} fill="none"
          stroke={color} strokeWidth={4} strokeLinecap="round"
          strokeDasharray={`${prog * 2 * Math.PI * R1} 99999`}
          transform={`rotate(-90 ${CX} ${CY})`}
          style={{ filter: `drop-shadow(0 0 4px ${color}88)` }} />
        <circle cx={CX} cy={CY} r={R2} fill="none"
          stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} strokeWidth={7} />
        <circle cx={CX} cy={CY} r={R2} fill="none"
          stroke={color} strokeWidth={7} strokeLinecap="round"
          strokeDasharray={`${prog * 2 * Math.PI * R2} 99999`}
          transform={`rotate(-90 ${CX} ${CY})`}
          style={{ filter: `drop-shadow(0 0 6px ${color}88)` }} />
        <text x={CX} y={CY + 5} textAnchor="middle"
          fill={isDark ? 'white' : '#1e293b'}
          fontSize="11" fontWeight="900" fontFamily="monospace">
          25:00
        </text>
      </svg>
    )
  }

  // Classic circular ring
  const R = 32, CX = 50, CY = 50, prog = 0.60
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden>
      <circle cx={CX} cy={CY} r={R} fill="none"
        stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} strokeWidth={6} />
      <circle cx={CX} cy={CY} r={R} fill="none"
        stroke={color} strokeWidth={6} strokeLinecap="round"
        strokeDasharray={`${prog * 2 * Math.PI * R} 99999`}
        transform={`rotate(-90 ${CX} ${CY})`}
        style={{ filter: `drop-shadow(0 0 5px ${color}66)` }} />
      <text x={CX} y={CY - 5} textAnchor="middle"
        fill={isDark ? 'white' : '#1e293b'}
        fontSize="11" fontWeight="800" fontFamily="monospace">
        25:00
      </text>
      <text x={CX} y={CY + 9} textAnchor="middle"
        fill={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'}
        fontSize="6" fontFamily="Inter,sans-serif">
        Focusing
      </text>
    </svg>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function ThemeSettingsPage() {
  const { theme, accentTheme, isDark, updateTheme, updateAccentTheme } = useTheme()
  const { settings, updateAmbientSound } = useSettingsStore()

  const [selected, setSelected] = useState<AccentTheme>(accentTheme)

  const handleSelectTheme = (id: AccentTheme) => {
    setSelected(id)
    updateAccentTheme(id)
  }

  const activeDef = THEMES[selected]

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Theme Settings"
        subtitle="Customise your focus experience"
      />

      <div className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full space-y-10">

        {/* ── 1. Theme selector ──────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Palette size={18} className="text-primary-500" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Theme</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ACCENT_ORDER.map((id) => {
              const def = THEMES[id]
              return (
                <button
                  key={id}
                  onClick={() => handleSelectTheme(id)}
                  className={clsx(
                    'rounded-2xl p-4 border-2 transition-all text-left group',
                    selected === id
                      ? 'border-primary-500 shadow-glow'
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700'
                  )}
                >
                  {/* Preview card */}
                  <div className="w-full aspect-[3/2] rounded-xl overflow-hidden mb-3">
                    <ThemePreviewCard
                      id={id}
                      label={def.name}
                      emoji={def.emoji}
                      isDark={isDark}
                      isSelected={selected === id}
                      onClick={() => handleSelectTheme(id)}
                    />
                  </div>

                  {/* Name + check */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {def.emoji} {def.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {def.tagline}
                      </p>
                    </div>
                    {selected === id && (
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center shadow-glow">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* ── 2. Timer style preview ─────────────────────────────────────── */}
        <section>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Timer Style</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            {activeDef.timer.style === 'circular'    && 'Classic circular ring — clean and minimal.'}
            {activeDef.timer.style === 'speedometer' && 'Speedometer arc gauge — every second counts.'}
            {activeDef.timer.style === 'stadium'     && 'Stadium scoreboard — dual-ring intensity.'}
          </p>

          <div
            className={clsx(
              'rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex items-center justify-center',
              isDark ? 'bg-slate-900' : 'bg-white'
            )}
          >
            <div className={clsx(
              'w-36 h-36 transition-all',
              selected === 'football' ? 'w-36 h-36' : selected === 'f1' ? 'w-44 h-36' : 'w-36 h-36',
            )}>
              <TimerStylePreview accentTheme={selected} isDark={isDark} />
            </div>
          </div>
        </section>

        {/* ── 3. Appearance ──────────────────────────────────────────────── */}
        <section>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Appearance</h2>
          <div className="flex gap-2">
            {MODE_OPTIONS.map(({ value, Icon, label }) => (
              <button
                key={value}
                onClick={() => updateTheme(value)}
                className={clsx(
                  'flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium border transition-all',
                  theme === value
                    ? 'bg-primary-500 text-white border-primary-500 shadow-glow'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary-300'
                )}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* ── 4. Ambient sound ───────────────────────────────────────────── */}
        <section>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Ambient Sound</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Plays while your timer is running.
          </p>

          <div className={clsx(
            'rounded-2xl border p-4 flex items-center justify-between gap-4',
            activeDef.sound.available
              ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50'
              : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 opacity-60'
          )}>
            <div className="flex items-center gap-3">
              {settings.ambientSoundEnabled && activeDef.sound.available
                ? <Volume2  size={20} className="text-primary-500 flex-shrink-0" />
                : <VolumeX  size={20} className="text-slate-400 flex-shrink-0" />
              }
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {activeDef.sound.label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {activeDef.sound.available
                    ? activeDef.sound.description
                    : 'This theme has no ambient sound.'}
                </p>
              </div>
            </div>

            {activeDef.sound.available && (
              <button
                onClick={() => updateAmbientSound(!settings.ambientSoundEnabled)}
                className={clsx(
                  'relative w-12 h-6 rounded-full transition-colors flex-shrink-0',
                  settings.ambientSoundEnabled
                    ? 'bg-primary-500'
                    : 'bg-slate-200 dark:bg-slate-700'
                )}
                aria-label={settings.ambientSoundEnabled ? 'Disable ambient sound' : 'Enable ambient sound'}
              >
                <span className={clsx(
                  'absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all',
                  settings.ambientSoundEnabled ? 'left-7' : 'left-1'
                )} />
              </button>
            )}
          </div>
        </section>

      </div>
    </div>
  )
}
