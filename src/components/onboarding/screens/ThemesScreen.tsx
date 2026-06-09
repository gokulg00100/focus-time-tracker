import { Sun, Moon } from 'lucide-react'
import { useSettingsStore } from '../../../store/settingsStore'
import { ThemePreviewCard } from '../../ui/ThemePreviewCard'
import type { AccentTheme } from '../../../types'

const THEMES: { id: AccentTheme; label: string; emoji: string }[] = [
  { id: 'classic', label: 'Classic',   emoji: '⚡' },
  { id: 'f1',      label: 'F1 Racing', emoji: '🏎️' },
  { id: 'fifa',    label: 'World Cup', emoji: '⚽' },
]

export function ThemesScreen() {
  const { settings, updateTheme, updateAccentTheme } = useSettingsStore()
  const isDark   = settings.theme === 'dark'
  const selected = settings.accentTheme ?? 'classic'

  return (
    <div className="flex flex-col items-center px-6 py-8">

      <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-2">
        Make It Yours
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-8 max-w-xs leading-relaxed">
        Choose your look and feel — changes apply instantly and you can tweak them anytime.
      </p>

      {/* ── Light / Dark toggle ─────────────────────────────────────────── */}
      <div className="mb-7 w-full max-w-sm">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Colour mode
        </p>
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl p-1.5">
          {[
            { mode: 'light' as const, icon: Sun,  label: 'Light' },
            { mode: 'dark'  as const, icon: Moon, label: 'Dark'  },
          ].map(({ mode, icon: Icon, label }) => {
            const active = settings.theme === mode
            return (
              <button
                key={mode}
                onClick={() => updateTheme(mode)}
                className={[
                  'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300',
                ].join(' ')}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Accent colour ───────────────────────────────────────────────── */}
      <div className="w-full max-w-sm">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Accent colour
        </p>
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map((t) => (
            <ThemePreviewCard
              key={t.id}
              id={t.id}
              label={t.label}
              emoji={t.emoji}
              isDark={isDark}
              isSelected={selected === t.id}
              onClick={() => updateAccentTheme(t.id)}
            />
          ))}
        </div>
      </div>

      <p className="text-slate-400 dark:text-slate-600 text-xs text-center mt-6">
        All settings can be changed later in Settings&nbsp;→&nbsp;Appearance
      </p>
    </div>
  )
}
