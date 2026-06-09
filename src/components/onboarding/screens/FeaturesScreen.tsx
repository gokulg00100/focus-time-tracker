/**
 * FeaturesScreen
 * ──────────────
 * Introduces the four core capabilities of Focus Timer.
 * Each card enters with a staggered slide-up animation so they feel like
 * they're arriving one by one rather than all at once.
 */

import { useState, useEffect } from 'react'
import { Timer, BarChart3, Target, Flame } from 'lucide-react'

// ── Feature data ──────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon:  Timer,
    title: 'Focus Sessions',
    desc:  'Uninterrupted time blocks that actually work — from quick 25-min sprints to full deep-work days.',
    bg:    '#f5f3ff',
    iconBg:'#ede9fe',
    fg:    '#7c3aed',
    border:'#ede9fe',
  },
  {
    icon:  BarChart3,
    title: 'Rich Analytics',
    desc:  'Beautiful charts, heatmaps, and focus scores that show exactly where your hours go.',
    bg:    '#eff6ff',
    iconBg:'#dbeafe',
    fg:    '#2563eb',
    border:'#dbeafe',
  },
  {
    icon:  Target,
    title: 'Daily Goals',
    desc:  'Set a daily focus target, track it live, and feel the satisfaction of hitting it every day.',
    bg:    '#f0fdf4',
    iconBg:'#dcfce7',
    fg:    '#16a34a',
    border:'#dcfce7',
  },
  {
    icon:  Flame,
    title: 'Streak Tracking',
    desc:  "Build a daily habit and watch your streak climb. Consistency is what champions are made of.",
    bg:    '#fff7ed',
    iconBg:'#fed7aa',
    fg:    '#ea580c',
    border:'#fed7aa',
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export function FeaturesScreen() {
  const [shown, setShown] = useState<boolean[]>(() => FEATURES.map(() => false))

  // Stagger cards in: 0 ms, 110 ms, 220 ms, 330 ms
  useEffect(() => {
    const timers = FEATURES.map((_, i) =>
      setTimeout(() => {
        setShown((prev) => {
          const next = [...prev]
          next[i] = true
          return next
        })
      }, i * 110)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="flex flex-col items-center px-5 py-8 max-w-xl mx-auto w-full">

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="text-center mb-7">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                     text-xs font-bold tracking-widest uppercase mb-3"
          style={{
            backgroundColor: 'rgb(var(--p-50))',
            color:           'rgb(var(--p-600))',
          }}
        >
          WHAT YOU GET
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 leading-tight">
          Everything you need<br className="hidden sm:block" /> to stay in flow.
        </h2>
        <p className="text-slate-500 text-base max-w-xs mx-auto">
          Built for people who take their time seriously.
        </p>
      </div>

      {/* ── 2 × 2 feature grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {FEATURES.map(({ icon: Icon, title, desc, bg, iconBg, fg, border }, i) => (
          <div
            key={title}
            className="rounded-2xl p-4 border"
            style={{
              backgroundColor: bg,
              borderColor:     border,
              opacity:         shown[i] ? 1 : 0,
              transform:       shown[i] ? 'translateY(0)' : 'translateY(18px)',
              transition:      'opacity 0.42s ease, transform 0.42s ease',
            }}
          >
            {/* Icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: iconBg }}
            >
              <Icon size={20} style={{ color: fg }} />
            </div>

            {/* Copy */}
            <div className="font-semibold text-slate-900 text-sm mb-1.5">
              {title}
            </div>
            <div className="text-slate-500 text-xs leading-relaxed">
              {desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
