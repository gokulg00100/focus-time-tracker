const FEATURES = [
  'Custom durations from 25 min to 24 hours',
  'Smart auto-break system with reminders',
  'Task tracking & per-session history',
  'Keyboard shortcuts for unbroken flow',
]

export function FocusSessionsScreen() {
  return (
    <div className="flex flex-col items-center px-6 py-8">
      <h2 className="text-3xl font-bold text-white text-center mb-2">
        Master Your Focus
      </h2>
      <p className="text-slate-400 text-center mb-8 max-w-xs">
        Customisable sessions designed for deep work
      </p>

      {/* Animated circular timer illustration */}
      <div className="mb-10">
        <svg width="160" height="160" viewBox="0 0 160 160">
          {/* Track */}
          <circle
            cx="80" cy="80" r="68"
            fill="none"
            stroke="rgb(30 41 59)"
            strokeWidth="10"
          />
          {/* Progress arc — ~75 % filled */}
          <circle
            cx="80" cy="80" r="68"
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="427.3"
            strokeDashoffset="107"
            transform="rotate(-90 80 80)"
            style={{
              stroke: 'rgb(var(--p-500))',
              filter: 'drop-shadow(0 0 8px rgb(var(--p-500) / 0.5))',
            }}
          />
          {/* Centre text */}
          <text
            x="80" y="76"
            textAnchor="middle"
            fill="white"
            fontSize="26"
            fontWeight="700"
            fontFamily="Inter, sans-serif"
          >
            25:00
          </text>
          <text
            x="80" y="97"
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            letterSpacing="3"
            fontFamily="Inter, sans-serif"
            style={{ fill: 'rgb(var(--p-400))' }}
          >
            FOCUS
          </text>
        </svg>
      </div>

      {/* Feature list */}
      <div className="space-y-3 w-full max-w-sm">
        {FEATURES.map((feature, i) => (
          <div
            key={i}
            className="flex items-start gap-3 animate-slide-up"
            style={{ animationDelay: `${i * 70}ms`, animationFillMode: 'both' }}
          >
            <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary-500/15 border border-primary-500/30 flex items-center justify-center">
              <svg viewBox="0 0 12 12" className="w-3 h-3" style={{ color: 'rgb(var(--p-400))' }}>
                <path
                  d="M2 6l3 3 5-5"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
            <span className="text-slate-300 text-sm leading-relaxed">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
