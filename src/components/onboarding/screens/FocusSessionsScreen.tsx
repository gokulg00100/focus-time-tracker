const STEPS = [
  { icon: '▶', label: 'Start',    color: 'bg-primary-500', text: 'text-white' },
  { icon: '⏱', label: 'Focus',    color: 'bg-primary-100 dark:bg-primary-900/40', text: 'text-primary-600 dark:text-primary-300' },
  { icon: '☕', label: 'Break',   color: 'bg-amber-100 dark:bg-amber-900/30',   text: 'text-amber-600 dark:text-amber-300' },
  { icon: '✅', label: 'Complete', color: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-300' },
]

const FEATURES = [
  'Custom durations from 25 min to 24 hours',
  'Smart auto-break system with reminders',
  'Assign tasks and track time per project',
  'Keyboard shortcuts for unbroken flow',
]

export function FocusSessionsScreen() {
  return (
    <div className="flex flex-col items-center px-6 py-8">

      <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-2">
        Master Your Focus
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-8 max-w-xs leading-relaxed">
        Sessions built for deep work — start, focus, rest, repeat.
      </p>

      {/* Timer illustration */}
      <div className="mb-8">
        <svg viewBox="0 0 180 180" width="180" height="180" aria-hidden>
          {/* Outer glow */}
          <circle cx="90" cy="90" r="75"
            fill="none"
            className="stroke-slate-100 dark:stroke-slate-800"
            strokeWidth="14"
          />
          {/* Progress arc — 75 % filled */}
          <circle cx="90" cy="90" r="75"
            fill="none"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="471.2"
            strokeDashoffset="118"
            transform="rotate(-90 90 90)"
            style={{
              stroke: 'rgb(var(--p-500))',
              filter: 'drop-shadow(0 0 6px rgb(var(--p-500) / 0.4))',
            }}
          />
          {/* Centre */}
          <text x="90" y="84" textAnchor="middle" fontSize="28" fontWeight="700"
            fontFamily="Inter,system-ui,sans-serif" className="fill-slate-900 dark:fill-white"
            style={{ fill: 'var(--tw-fill, currentColor)' }}
          />
          {/* Use two separate texts so fill colour works via SVG presentation attrs */}
          <text x="90" y="86" textAnchor="middle" fontSize="26" fontWeight="700"
            fontFamily="Inter,system-ui,sans-serif" fill="currentColor"
            className="text-slate-900 dark:text-white" style={{ fill: 'inherit' }}
          >
            25:00
          </text>
          <text x="90" y="106" textAnchor="middle" fontSize="11" fontWeight="600"
            letterSpacing="3" fontFamily="Inter,system-ui,sans-serif"
            style={{ fill: 'rgb(var(--p-500))' }}
          >
            FOCUS
          </text>
        </svg>
      </div>

      {/* Session-flow steps */}
      <div className="flex items-center gap-1 mb-8 w-full max-w-xs">
        {STEPS.map((s, i) => (
          <div key={s.label} className="flex items-center gap-1 flex-1 min-w-0">
            <div className={`${s.color} ${s.text} rounded-xl px-2 py-1.5 text-center w-full`}>
              <div className="text-base leading-none">{s.icon}</div>
              <div className="text-xs font-medium mt-0.5 truncate">{s.label}</div>
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-3 h-0.5 flex-shrink-0 bg-slate-200 dark:bg-slate-700 rounded-full" />
            )}
          </div>
        ))}
      </div>

      {/* Feature list */}
      <div className="space-y-2.5 w-full max-w-sm">
        {FEATURES.map((f, i) => (
          <div
            key={i}
            className="flex items-start gap-3 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/40 rounded-xl px-4 py-3 shadow-sm animate-slide-up"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
          >
            <div className="mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{ backgroundColor: 'rgb(var(--p-500) / 0.15)' }}>
              <svg viewBox="0 0 12 12" className="w-3 h-3" style={{ color: 'rgb(var(--p-500))' }}>
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth={1.5}
                  strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <span className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{f}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
