import { Check } from 'lucide-react'
import { useSettingsStore } from '../../../store/settingsStore'
import type { AccentTheme } from '../../../types'

interface ThemeOption {
  id: AccentTheme
  name: string
  emoji: string
  description: string
  /** Preview swatch — hardcoded hex since CSS vars aren't resolved in JS */
  swatchColor: string
  swatchBg: string
}

const THEMES: ThemeOption[] = [
  {
    id: 'classic',
    name: 'Classic',
    emoji: '⚡',
    description: 'Clean, minimal, timeless',
    swatchColor: '#6366f1',
    swatchBg: '#1e1b4b',
  },
  {
    id: 'f1',
    name: 'F1 Racing',
    emoji: '🏎️',
    description: 'High performance energy',
    swatchColor: '#e10600',
    swatchBg: '#4a0000',
  },
  {
    id: 'fifa',
    name: 'World Cup',
    emoji: '⚽',
    description: 'Champions mindset',
    swatchColor: '#22c55e',
    swatchBg: '#052e16',
  },
]

export function ThemesScreen() {
  const { settings, updateAccentTheme } = useSettingsStore()
  const selected: AccentTheme = settings.accentTheme ?? 'classic'

  return (
    <div className="flex flex-col items-center px-6 py-8">
      <h2 className="text-3xl font-bold text-white text-center mb-2">
        Choose Your Style
      </h2>
      <p className="text-slate-400 text-center mb-8 max-w-xs">
        Pick a theme that matches your energy. It applies instantly across the whole app.
      </p>

      <div className="space-y-3 w-full max-w-sm">
        {THEMES.map((theme) => {
          const isSelected = selected === theme.id
          return (
            <button
              key={theme.id}
              onClick={() => updateAccentTheme(theme.id)}
              className={[
                'w-full flex items-center gap-4 p-4 rounded-2xl border text-left',
                'transition-all duration-200',
                isSelected
                  ? 'border-primary-500 bg-primary-500/10 shadow-glow'
                  : 'border-slate-700/50 bg-slate-800/40 hover:border-slate-600 hover:bg-slate-800/60',
              ].join(' ')}
            >
              {/* Colour swatch */}
              <div
                className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{ backgroundColor: theme.swatchBg }}
              >
                <div
                  className="w-6 h-6 rounded-lg"
                  style={{ backgroundColor: theme.swatchColor }}
                />
              </div>

              {/* Label */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold text-sm">{theme.name}</span>
                  <span>{theme.emoji}</span>
                </div>
                <p className="text-slate-400 text-xs mt-0.5">{theme.description}</p>
              </div>

              {/* Selection indicator */}
              {isSelected ? (
                <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border border-slate-600 flex-shrink-0" />
              )}
            </button>
          )
        })}
      </div>

      <p className="text-slate-600 text-xs text-center mt-6">
        You can change this anytime in Settings
      </p>
    </div>
  )
}
