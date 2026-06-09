import { Timer, BarChart3, Target, Flame } from 'lucide-react'

const FEATURES = [
  { icon: Timer,    label: 'Smart Timer',  desc: 'Custom durations' },
  { icon: BarChart3, label: 'Analytics',   desc: 'Track progress'   },
  { icon: Target,   label: 'Goals',        desc: 'Daily targets'    },
  { icon: Flame,    label: 'Streaks',      desc: 'Stay consistent'  },
]

export function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center text-center px-6 py-8">
      {/* Animated logo */}
      <div className="relative mb-8 mt-4">
        <div className="w-24 h-24 rounded-3xl bg-primary-500 flex items-center justify-center shadow-glow animate-float">
          <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12 text-white">
            <path
              d="M13 10V3L4 14h7v7l9-11h-7z"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {/* Outer ring pulse */}
        <div className="absolute inset-0 w-24 h-24 rounded-3xl bg-primary-500/20 animate-ping" />
      </div>

      <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
        Welcome to<br />
        <span className="text-primary-400">Focus Tracker</span>
      </h1>

      <p className="text-slate-400 text-base mb-10 max-w-xs leading-relaxed">
        Your personal productivity companion for deep, intentional work.
      </p>

      {/* Feature chips grid */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {FEATURES.map(({ icon: Icon, label, desc }, i) => (
          <div
            key={label}
            className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 text-left animate-slide-up"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
          >
            <Icon className="w-5 h-5 text-primary-400 mb-2" />
            <div className="text-white text-sm font-semibold">{label}</div>
            <div className="text-slate-500 text-xs mt-0.5">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
