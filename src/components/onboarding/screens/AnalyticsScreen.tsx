// Bar heights as percentages (Mon–Sun preview data)
const BARS = [42, 68, 30, 85, 55, 92, 70]
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

// Heatmap sample — 5 weeks × 7 days
const HEATMAP_LEVELS = [
  [0, 1, 2, 1, 0, 0, 1],
  [2, 3, 2, 4, 3, 1, 0],
  [1, 2, 3, 2, 4, 2, 1],
  [0, 1, 2, 3, 2, 1, 2],
  [3, 4, 3, 2, 4, 3, 1],
]

const LEVEL_COLORS: Record<number, string> = {
  0: 'bg-slate-700/50',
  1: 'bg-primary-900',
  2: 'bg-primary-700',
  3: 'bg-primary-500',
  4: 'bg-primary-400',
}

const HIGHLIGHTS = [
  { emoji: '🔥', title: 'Streak Tracking', desc: 'Daily consistency' },
  { emoji: '🎯', title: 'Focus Score',     desc: 'Session quality'  },
  { emoji: '📈', title: 'Trend Analysis',  desc: 'Week over week'   },
  { emoji: '🗓️', title: 'Heatmap View',    desc: 'Activity calendar' },
]

export function AnalyticsScreen() {
  return (
    <div className="flex flex-col items-center px-6 py-8">
      <h2 className="text-3xl font-bold text-white text-center mb-2">
        Track Your Progress
      </h2>
      <p className="text-slate-400 text-center mb-8 max-w-xs">
        Insights that keep you motivated and on track
      </p>

      {/* Bar chart preview */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 mb-4 w-full max-w-sm">
        <div className="text-slate-500 text-xs font-medium mb-3">This week's focus</div>
        <div className="flex items-end gap-1.5 h-20">
          {BARS.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t"
                style={{
                  height: `${h}%`,
                  background: i === 5 ? 'rgb(var(--p-500))' : 'rgb(var(--p-700) / 0.6)',
                  transformOrigin: 'bottom',
                  animation: `barGrow 0.55s ease-out ${i * 70}ms both`,
                }}
              />
              <span className="text-slate-600 text-xs">{DAYS[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mini heatmap */}
      <div className="bg-slate-800/40 border border-slate-700/30 rounded-2xl p-3 mb-6 w-full max-w-sm">
        <div className="text-slate-500 text-xs font-medium mb-2">Activity heatmap</div>
        <div className="flex gap-1">
          {HEATMAP_LEVELS.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1 flex-1">
              {week.map((level, di) => (
                <div
                  key={di}
                  className={`w-full aspect-square rounded-sm ${LEVEL_COLORS[level]}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Feature chips */}
      <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm">
        {HIGHLIGHTS.map(({ emoji, title, desc }, i) => (
          <div
            key={title}
            className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-3 animate-scale-in"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
          >
            <div className="text-xl mb-1">{emoji}</div>
            <div className="text-white text-xs font-semibold">{title}</div>
            <div className="text-slate-500 text-xs mt-0.5">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
