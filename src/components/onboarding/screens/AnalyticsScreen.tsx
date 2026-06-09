// Fake weekly data for the bar chart preview
const BARS = [
  { h: 42, active: false },
  { h: 68, active: false },
  { h: 30, active: false },
  { h: 85, active: false },
  { h: 55, active: false },
  { h: 92, active: true  },  // Saturday — highlighted
  { h: 70, active: false },
]
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

// Fake 5-week activity heatmap
const HEATMAP: number[][] = [
  [0, 1, 2, 1, 0, 0, 1],
  [2, 3, 2, 4, 3, 1, 0],
  [1, 2, 3, 2, 4, 2, 1],
  [0, 1, 2, 3, 2, 1, 2],
  [3, 4, 3, 2, 4, 3, 1],
]

const LEVEL_CLASSES: Record<number, string> = {
  0: 'bg-slate-100 dark:bg-slate-800',
  1: 'bg-primary-200',
  2: 'bg-primary-400',
  3: 'bg-primary-500',
  4: 'bg-primary-600',
}

const STATS = [
  { label: 'Current Streak', value: '7 days', emoji: '🔥' },
  { label: 'Focus Score',    value: '84 / 100', emoji: '🎯' },
  { label: 'This Week',      value: '12 hr 40 m', emoji: '📈' },
  { label: 'Monthly Goal',   value: '62 % done', emoji: '🏆' },
]

export function AnalyticsScreen() {
  return (
    <div className="flex flex-col items-center px-6 py-8">

      <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-2">
        Track Your Progress
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-8 max-w-xs leading-relaxed">
        Every session is captured so you can understand and improve your habits.
      </p>

      {/* Bar chart */}
      <div className="bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/40 rounded-2xl p-4 mb-4 w-full max-w-sm shadow-sm">
        <div className="text-slate-400 text-xs font-medium mb-3">This week's focus time</div>
        <div className="flex items-end gap-1.5 h-20">
          {BARS.map(({ h, active }, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className="w-full rounded-t"
                style={{
                  height: `${h}%`,
                  background: active ? 'rgb(var(--p-500))' : 'rgb(var(--p-300) / 0.5)',
                  transformOrigin: 'bottom',
                  animation: `barGrow 0.55s ease-out ${i * 65}ms both`,
                }}
              />
              <span className="text-slate-400 dark:text-slate-600 text-xs">{DAYS[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/40 rounded-2xl p-4 mb-5 w-full max-w-sm shadow-sm">
        <div className="text-slate-400 text-xs font-medium mb-2.5">Activity heatmap</div>
        <div className="flex gap-1">
          {HEATMAP.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1 flex-1">
              {week.map((level, di) => (
                <div
                  key={di}
                  className={`w-full aspect-square rounded-sm transition-colors ${LEVEL_CLASSES[level]}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm">
        {STATS.map(({ label, value, emoji }, i) => (
          <div
            key={label}
            className="bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/40 rounded-xl p-3 shadow-sm animate-scale-in"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
          >
            <div className="text-base mb-1">{emoji}</div>
            <div className="text-slate-900 dark:text-white font-semibold text-sm">{value}</div>
            <div className="text-slate-400 text-xs mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
