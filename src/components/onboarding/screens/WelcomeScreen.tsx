import { Timer, BarChart3, Target, Flame } from 'lucide-react'

const FEATURES = [
  {
    icon:  Timer,
    label: 'Smart Timer',
    desc:  'From 25 min sprints to 24-hour deep work',
    color: 'bg-violet-50 dark:bg-violet-500/10',
    iconColor: 'text-violet-500',
  },
  {
    icon:  BarChart3,
    label: 'Rich Analytics',
    desc:  'Heatmaps, charts and focus scores',
    color: 'bg-sky-50 dark:bg-sky-500/10',
    iconColor: 'text-sky-500',
  },
  {
    icon:  Target,
    label: 'Daily Goals',
    desc:  'Set targets and watch yourself hit them',
    color: 'bg-emerald-50 dark:bg-emerald-500/10',
    iconColor: 'text-emerald-500',
  },
  {
    icon:  Flame,
    label: 'Streaks',
    desc:  'Build momentum day after day',
    color: 'bg-orange-50 dark:bg-orange-500/10',
    iconColor: 'text-orange-500',
  },
]

export function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center text-center px-6 py-8">

      {/* Animated logo */}
      <div className="relative mb-7 mt-2">
        <div className="w-24 h-24 rounded-3xl bg-primary-500 flex items-center justify-center shadow-glow animate-float">
          <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12 text-white">
            <path d="M13 10V3L4 14h7v7l9-11h-7z"
              stroke="currentColor" strokeWidth={2}
              strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </div>
        {/* Outer ring pulse */}
        <div className="absolute inset-0 w-24 h-24 rounded-3xl bg-primary-500/20 animate-ping" />
      </div>

      {/* Copy */}
      <div className="mb-2 text-sm font-semibold text-primary-500 uppercase tracking-widest">
        Hello there 👋
      </div>
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">
        Welcome to<br />
        <span className="text-primary-500">Focus Tracker</span>
      </h1>
      <p className="text-slate-500 dark:text-slate-400 text-base mb-10 max-w-xs leading-relaxed">
        Track time, build habits, and celebrate every win — all in one place.
      </p>

      {/* Feature cards */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {FEATURES.map(({ icon: Icon, label, desc, color, iconColor }, i) => (
          <div
            key={label}
            className={`${color} border border-slate-100 dark:border-white/5 rounded-2xl p-4 text-left shadow-sm animate-slide-up`}
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
          >
            <Icon className={`w-5 h-5 ${iconColor} mb-2`} />
            <div className="text-slate-800 dark:text-slate-200 text-sm font-semibold">
              {label}
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 leading-snug">
              {desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
