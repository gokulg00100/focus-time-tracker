import { useSettingsStore } from '../../../store/settingsStore'

const DAILY_PRESETS = [
  { label: '30 min', mins: 30 },
  { label: '1 hr',   mins: 60 },
  { label: '2 hrs',  mins: 120 },
  { label: '4 hrs',  mins: 240 },
  { label: '8 hrs',  mins: 480 },
]

function fmtMins(mins: number): string {
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`
}

function motivationLine(daily: number): string {
  if (daily <= 30)  return 'A great start — consistency beats intensity. 🌱'
  if (daily <= 60)  return 'Building a solid habit — you\'ve got this! 💪'
  if (daily <= 120) return 'Ambitious and achievable — let\'s do it! 🚀'
  if (daily <= 240) return 'Seriously dedicated — impressive! ⚡'
  return 'Elite focus mode activated. Champion level! 🏆'
}

export function GoalScreen() {
  const { settings, updateGoals } = useSettingsStore()
  const daily = settings.goals.dailyMins

  const select = (mins: number) => {
    updateGoals({
      dailyMins: mins,
      weeklyMins: mins * 5,
      monthlyMins: mins * 20,
    })
  }

  return (
    <div className="flex flex-col items-center px-6 py-8">
      <div className="text-5xl mb-4">🎯</div>

      <h2 className="text-3xl font-bold text-white text-center mb-2">
        Set Your First Goal
      </h2>
      <p className="text-slate-400 text-center mb-8 max-w-xs">
        How much do you want to focus each day?
      </p>

      {/* Daily presets */}
      <div className="w-full max-w-sm mb-5">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">
          Daily focus goal
        </p>
        <div className="grid grid-cols-5 gap-2">
          {DAILY_PRESETS.map(({ label, mins }) => (
            <button
              key={mins}
              onClick={() => select(mins)}
              className={[
                'py-3 rounded-xl text-xs font-semibold transition-all duration-150 border',
                daily === mins
                  ? 'bg-primary-500 border-primary-500 text-white shadow-glow scale-105'
                  : 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:border-slate-500 hover:text-white',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Auto-calculated weekly / monthly */}
      <div className="w-full max-w-sm space-y-2 mb-7">
        {[
          { label: 'Weekly goal',  value: fmtMins(daily * 5)  },
          { label: 'Monthly goal', value: fmtMins(daily * 20) },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-slate-800/40 border border-slate-700/30 rounded-xl px-4 py-3 flex justify-between items-center"
          >
            <span className="text-slate-400 text-sm">{label}</span>
            <span className="text-white font-semibold text-sm">{value}</span>
          </div>
        ))}
      </div>

      {/* Motivation banner */}
      <div className="bg-primary-500/10 border border-primary-500/20 rounded-2xl p-4 w-full max-w-sm text-center">
        <p className="text-primary-300 text-sm leading-relaxed">
          {motivationLine(daily)}
        </p>
      </div>
    </div>
  )
}
