import { useSettingsStore } from '../../../store/settingsStore'

const PRESETS = [
  { label: '30 min', mins: 30 },
  { label: '1 hr',   mins: 60 },
  { label: '2 hrs',  mins: 120 },
  { label: '4 hrs',  mins: 240 },
  { label: '8 hrs',  mins: 480 },
]

function fmtMins(m: number): string {
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60), r = m % 60
  return r === 0 ? `${h} hr` : `${h} hr ${r} min`
}

function motivation(daily: number): string {
  if (daily <= 30)  return "A great start — consistency beats intensity! 🌱"
  if (daily <= 60)  return "Building a solid habit — you've got this! 💪"
  if (daily <= 120) return "Ambitious and totally achievable. Let's do it! 🚀"
  if (daily <= 240) return "Seriously dedicated — that's impressive! ⚡"
  return "Elite focus mode activated. Champion level! 🏆"
}

export function GoalScreen() {
  const { settings, updateGoals } = useSettingsStore()
  const daily = settings.goals.dailyMins

  const select = (mins: number) =>
    updateGoals({ dailyMins: mins, weeklyMins: mins * 5, monthlyMins: mins * 20 })

  return (
    <div className="flex flex-col items-center px-6 py-8">

      <div className="text-5xl mb-4">🎯</div>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-2">
        Set Your First Goal
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-8 max-w-xs leading-relaxed">
        How much do you want to focus each day? You can adjust this any time.
      </p>

      {/* Daily presets */}
      <div className="w-full max-w-sm mb-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Daily focus goal
        </p>
        <div className="grid grid-cols-5 gap-2">
          {PRESETS.map(({ label, mins }) => (
            <button
              key={mins}
              onClick={() => select(mins)}
              className={[
                'py-3 rounded-xl text-xs font-semibold transition-all duration-150 border',
                daily === mins
                  ? 'bg-primary-500 border-primary-500 text-white shadow-glow scale-105'
                  : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:border-primary-300 dark:hover:border-slate-500',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Derived goals */}
      <div className="w-full max-w-sm space-y-2 mb-7">
        {[
          { label: 'Weekly goal',  value: fmtMins(daily * 5)  },
          { label: 'Monthly goal', value: fmtMins(daily * 20) },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/40 rounded-xl px-4 py-3 flex justify-between items-center shadow-sm"
          >
            <span className="text-slate-500 dark:text-slate-400 text-sm">{label}</span>
            <span className="text-slate-900 dark:text-white font-semibold text-sm">{value}</span>
          </div>
        ))}
      </div>

      {/* Motivation */}
      <div
        className="rounded-2xl p-4 w-full max-w-sm text-center border"
        style={{
          backgroundColor: 'rgb(var(--p-500) / 0.08)',
          borderColor: 'rgb(var(--p-500) / 0.2)',
        }}
      >
        <p className="text-sm leading-relaxed" style={{ color: 'rgb(var(--p-600))' }}>
          {motivation(daily)}
        </p>
      </div>
    </div>
  )
}
