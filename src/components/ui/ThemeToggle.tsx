import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { clsx } from 'clsx'

export function ThemeToggle() {
  const { theme, updateTheme } = useTheme()

  const options = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ]

  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl p-1">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => updateTheme(value)}
          title={label}
          className={clsx(
            'flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200',
            theme === value
              ? 'bg-white dark:bg-slate-600 shadow-sm text-primary-600 dark:text-primary-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          )}
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  )
}
