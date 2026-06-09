/**
 * GoalScreen — daily focus goal setup.
 *
 * Shows six preset durations (30 min → 8 hr), derives weekly and monthly
 * projections automatically, and gives a motivational message tied to the
 * selection. Designed to fit within the viewport on desktop without scrolling.
 */

import { useSettingsStore } from '../../../store/settingsStore'

// ── Presets ───────────────────────────────────────────────────────────────────

const PRESETS = [
  { label: '30 min', mins:  30 },
  { label: '1 hr',   mins:  60 },
  { label: '2 hrs',  mins: 120 },
  { label: '4 hrs',  mins: 240 },
  { label: '6 hrs',  mins: 360 },
  { label: '8 hrs',  mins: 480 },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtMins(m: number): string {
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60), r = m % 60
  return r === 0 ? `${h} hr` : `${h} hr ${r} min`
}

function motivation(daily: number): string {
  if (daily <= 30)  return "A great start — consistency beats intensity every time! 🌱"
  if (daily <= 60)  return "Building a solid habit — one focused hour a day adds up fast! 💪"
  if (daily <= 120) return "Ambitious and totally achievable. You've got this! 🚀"
  if (daily <= 240) return "Seriously dedicated — that's impressive commitment! ⚡"
  if (daily <= 360) return "Professional-level focus. You're building something great! 🎯"
  return "Elite focus mode activated. True champion level! 🏆"
}

// ── Component ─────────────────────────────────────────────────────────────────

export function GoalScreen() {
  const { settings, updateGoals } = useSettingsStore()
  const daily = settings.goals.dailyMins

  const select = (mins: number) =>
    updateGoals({
      dailyMins:   mins,
      weeklyMins:  mins * 5,
      monthlyMins: mins * 20,
    })

  return (
    <div className="flex flex-col items-center px-5 py-8 max-w-lg mx-auto w-full">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🎯</div>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 leading-tight">
          Set your daily goal.
        </h2>
        <p className="text-slate-500 text-base max-w-xs mx-auto">
          How much focused work would you like to do each day?
          You can change this any time.
        </p>
      </div>

      {/* ── Preset grid (3 × 2) ──────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2.5 w-full mb-5">
        {PRESETS.map(({ label, mins }) => {
          const active = daily === mins
          return (
            <button
              key={mins}
              onClick={() => select(mins)}
              className="py-3.5 rounded-2xl text-sm font-semibold
                         transition-all duration-150 border-2 hover:scale-[1.03] active:scale-[0.97]
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
              style={
                active
                  ? {
                      backgroundColor: 'rgb(var(--p-500))',
                      borderColor:     'rgb(var(--p-500))',
                      color:           '#ffffff',
                      boxShadow:       '0 4px 14px rgb(var(--p-500) / 0.35)',
                      transform:       'scale(1.05)',
                    }
                  : {
                      backgroundColor: '#ffffff',
                      borderColor:     '#e2e8f0',
                      color:           '#475569',
                    }
              }
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* ── Derived projections ──────────────────────────────────────── */}
      <div className="w-full space-y-2 mb-6">
        {[
          { label: 'Weekly goal',  value: fmtMins(daily * 5),  icon: '📅' },
          { label: 'Monthly goal', value: fmtMins(daily * 20), icon: '📈' },
        ].map(({ label, value, icon }) => (
          <div
            key={label}
            className="flex items-center justify-between bg-white
                       border border-slate-100 rounded-2xl px-4 py-3 shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">{icon}</span>
              <span className="text-slate-500 text-sm">{label}</span>
            </div>
            <span className="text-slate-900 font-semibold text-sm">{value}</span>
          </div>
        ))}
      </div>

      {/* ── Motivation card ──────────────────────────────────────────── */}
      <div
        className="rounded-2xl px-5 py-4 w-full text-center border"
        style={{
          backgroundColor: 'rgb(var(--p-500) / 0.07)',
          borderColor:     'rgb(var(--p-500) / 0.18)',
        }}
      >
        <p
          className="text-sm leading-relaxed font-medium"
          style={{ color: 'rgb(var(--p-700))' }}
        >
          {motivation(daily)}
        </p>
      </div>
    </div>
  )
}
