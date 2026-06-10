/**
 * LandingPage — premium public-facing marketing page.
 *
 * Sections:
 *   1. Hero         — animated typewriter, parallax timer, CTA
 *   2. Product      — live interactive preview cards
 *   3. How It Works — three animated feature cards
 *   4. Analytics    — animated chart showcase
 *   5. Themes       — three theme cards with live previews
 *   6. Why Use It   — animated benefit grid
 *   7. Celebrations — celebration examples per theme
 *   8. Final CTA    — Google / Guest login
 *
 * Design philosophy:
 *   - Always light mode (no dark: variants — landing page is always bright)
 *   - CSS scroll-triggered animations via IntersectionObserver
 *   - All animations respect prefers-reduced-motion
 *   - No external image dependencies — all visuals are SVG / CSS
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { Zap, BarChart2, Target, Flame, ChevronDown, ArrowRight, Play, UserCircle2, Check } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

// ─────────────────────────────────────────────────────────────────────────────
// Utility hooks
// ─────────────────────────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function useTypewriter(words: string[], charDelay = 55, pauseMs = 1800) {
  const [text, setText] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing')

  useEffect(() => {
    const word = words[wordIdx]
    if (phase === 'typing') {
      if (text.length < word.length) {
        const t = setTimeout(() => setText(word.slice(0, text.length + 1)), charDelay)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setPhase('pausing'), pauseMs)
        return () => clearTimeout(t)
      }
    }
    if (phase === 'pausing') {
      const t = setTimeout(() => setPhase('deleting'), 300)
      return () => clearTimeout(t)
    }
    if (phase === 'deleting') {
      if (text.length > 0) {
        const t = setTimeout(() => setText(text.slice(0, -1)), charDelay * 0.5)
        return () => clearTimeout(t)
      } else {
        setWordIdx((i) => (i + 1) % words.length)
        setPhase('typing')
      }
    }
  }, [text, phase, wordIdx, words, charDelay, pauseMs])

  return text
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared SVG / visual components
// ─────────────────────────────────────────────────────────────────────────────

function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

/** Animated timer ring used in the hero section */
function HeroTimer({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const [progress, setProgress] = useState(0)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => {
      setElapsed((e) => {
        const next = (e + 1) % (25 * 60)
        setProgress(next / (25 * 60))
        return next
      })
    }, 60)
    return () => clearInterval(iv)
  }, [])

  const mins = String(Math.floor((25 * 60 - elapsed) / 60)).padStart(2, '0')
  const secs = String((25 * 60 - elapsed) % 60).padStart(2, '0')
  const r = 110
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - progress)

  // Subtle parallax tilt based on mouse position
  const tiltX = (mouseY - 0.5) * 6
  const tiltY = -(mouseX - 0.5) * 6

  return (
    <div
      className="relative select-none"
      style={{
        transform: `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        transition: 'transform 0.15s ease-out',
        willChange: 'transform',
      }}
    >
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />

      <svg viewBox="0 0 280 280" width={280} height={280} aria-hidden>
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle cx={140} cy={140} r={r} fill="none" stroke="#e2e8f0" strokeWidth={10} />

        {/* Progress arc */}
        <circle cx={140} cy={140} r={r} fill="none"
          stroke="url(#ringGrad)" strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 140 140)"
          filter="url(#glow)"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />

        {/* Inner surface */}
        <circle cx={140} cy={140} r={92} fill="white" opacity={0.9} />

        {/* Status */}
        <text x={140} y={118} textAnchor="middle" fill="#6366f1"
          fontSize="11" fontWeight="700" fontFamily="Inter,sans-serif" letterSpacing="3">
          FOCUS SESSION
        </text>

        {/* Time */}
        <text x={140} y={158} textAnchor="middle" fill="#0f172a"
          fontSize="46" fontWeight="900" fontFamily="'JetBrains Mono','Courier New',monospace">
          {mins}:{secs}
        </text>

        {/* Progress % */}
        <text x={140} y={184} textAnchor="middle" fill="#94a3b8"
          fontSize="12" fontFamily="Inter,sans-serif">
          {Math.round(progress * 100)}% complete
        </text>
      </svg>

      {/* Floating badges */}
      <div className="absolute -top-2 -right-4 bg-white rounded-2xl shadow-lg px-3 py-1.5 flex items-center gap-1.5 border border-slate-100"
        style={{ animation: 'floatBadge 3s ease-in-out infinite' }}>
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="text-xs font-semibold text-slate-700">Running</span>
      </div>
      <div className="absolute -bottom-2 -left-4 bg-white rounded-2xl shadow-lg px-3 py-1.5 flex items-center gap-1.5 border border-slate-100"
        style={{ animation: 'floatBadge 3s ease-in-out 1.5s infinite' }}>
        <Flame size={12} className="text-orange-500" />
        <span className="text-xs font-semibold text-slate-700">7 day streak</span>
      </div>
    </div>
  )
}

/** Floating particle background */
function FloatingParticles() {
  const particles = [
    { x: '8%',  y: '20%', size: 6,  delay: 0,    color: '#6366f1' },
    { x: '92%', y: '15%', size: 4,  delay: 1.2,  color: '#8b5cf6' },
    { x: '15%', y: '70%', size: 8,  delay: 0.7,  color: '#06b6d4' },
    { x: '85%', y: '65%', size: 5,  delay: 2.1,  color: '#6366f1' },
    { x: '50%', y: '8%',  size: 3,  delay: 1.8,  color: '#8b5cf6' },
    { x: '30%', y: '85%', size: 7,  delay: 0.4,  color: '#06b6d4' },
    { x: '70%', y: '82%', size: 4,  delay: 1.5,  color: '#6366f1' },
    { x: '5%',  y: '45%', size: 5,  delay: 2.5,  color: '#8b5cf6' },
    { x: '95%', y: '40%', size: 3,  delay: 0.9,  color: '#06b6d4' },
  ]
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <div key={i} className="absolute rounded-full opacity-20"
          style={{
            left: p.x, top: p.y,
            width: p.size, height: p.size,
            backgroundColor: p.color,
            animation: `particleFloat 6s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 2 — Interactive product preview
// ─────────────────────────────────────────────────────────────────────────────

function StatPreviewCard({ label, value, sub, color, delay }: {
  label: string; value: string; sub: string; color: string; delay: string
}) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.5s ease ${delay}, transform 0.5s ease ${delay}`,
      }}>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-3xl font-black" style={{ color }}>{value}</p>
      <p className="text-sm text-slate-500 mt-1">{sub}</p>
    </div>
  )
}

function MiniBarChart({ color }: { color: string }) {
  const bars = [40, 65, 45, 80, 55, 90, 70]
  const { ref, inView } = useInView()
  return (
    <div ref={ref} className="flex items-end gap-1.5 h-16">
      {bars.map((h, i) => (
        <div key={i} className="flex-1 rounded-t-sm transition-all duration-700"
          style={{
            height: inView ? `${h}%` : '4px',
            backgroundColor: color,
            opacity: inView ? (0.4 + (i / bars.length) * 0.6) : 0.2,
            transitionDelay: `${i * 60}ms`,
          }}
        />
      ))}
    </div>
  )
}

function MiniStreakRow() {
  const { ref, inView } = useInView()
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const done  = [true, true, true, true, true, false, false]
  return (
    <div ref={ref} className="flex gap-2">
      {days.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500"
            style={{
              backgroundColor: done[i]
                ? inView ? '#6366f1' : '#e2e8f0'
                : '#f1f5f9',
              transitionDelay: `${i * 80}ms`,
            }}>
            {done[i] && (
              <svg width={12} height={12} viewBox="0 0 12 12">
                <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">{d}</span>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 5 — Theme showcase cards
// ─────────────────────────────────────────────────────────────────────────────

function ThemeShowcaseCard({ theme, delay }: {
  theme: { id: string; name: string; emoji: string; tagline: string; desc: string; accent: string; bg: string; darkBg: string }
  delay: string
}) {
  const { ref, inView } = useInView()
  const [hovered, setHovered] = useState(false)
  const progress = useRef(0)
  const [displayPct, setDisplayPct] = useState(0)

  useEffect(() => {
    if (!hovered) return
    progress.current = 0
    setDisplayPct(0)
    const iv = setInterval(() => {
      progress.current = Math.min(progress.current + 2, 100)
      setDisplayPct(progress.current)
      if (progress.current >= 100) clearInterval(iv)
    }, 30)
    return () => clearInterval(iv)
  }, [hovered])

  const r = 36
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - displayPct / 100)

  return (
    <div ref={ref}
      className="rounded-3xl overflow-hidden border-2 transition-all duration-500 cursor-pointer"
      style={{
        borderColor: hovered ? theme.accent : '#e2e8f0',
        boxShadow: hovered ? `0 20px 60px ${theme.accent}25, 0 0 0 4px ${theme.accent}15` : '0 2px 12px rgba(0,0,0,0.06)',
        opacity: inView ? 1 : 0,
        transform: inView
          ? hovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)'
          : 'translateY(32px)',
        transition: `opacity 0.6s ease ${delay}, transform 0.4s cubic-bezier(0.22,1,0.36,1)`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header gradient preview */}
      <div className="h-36 flex items-center justify-center relative overflow-hidden"
        style={{ background: theme.darkBg }}>
        {/* Ambient glow */}
        <div className="absolute inset-0 opacity-30"
          style={{ background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${theme.accent}40, transparent)` }} />

        {/* Mini timer ring */}
        <div className="relative z-10">
          <svg viewBox="0 0 100 100" width={96} height={96} aria-hidden>
            <circle cx={50} cy={50} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={6} />
            <circle cx={50} cy={50} r={r} fill="none"
              stroke={theme.accent} strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={hovered ? offset : circ * 0.35}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 0.1s linear', filter: `drop-shadow(0 0 6px ${theme.accent})` }}
            />
            <text x={50} y={46} textAnchor="middle" fill="white" fontSize="11" fontWeight="900" fontFamily="monospace">
              {hovered ? String(25 - Math.floor(displayPct / 4)).padStart(2, '0') + ':00' : '25:00'}
            </text>
            <text x={50} y={60} textAnchor="middle" fill={theme.accent} fontSize="6" fontWeight="700" letterSpacing="1.5" fontFamily="Inter,sans-serif">
              {hovered ? 'RUNNING' : 'READY'}
            </text>
          </svg>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{theme.emoji}</span>
          <h3 className="text-base font-bold text-slate-900">{theme.name}</h3>
          {hovered && (
            <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: theme.accent + '18', color: theme.accent }}>
              Live preview
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500 leading-relaxed">{theme.desc}</p>
        <p className="text-xs font-semibold mt-3" style={{ color: theme.accent }}>{theme.tagline}</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 4 — Analytics showcase
// ─────────────────────────────────────────────────────────────────────────────

function AnimatedHeatmap() {
  const { ref, inView } = useInView()
  const weeks = 12
  const days  = 7
  const data = Array.from({ length: weeks * days }, (_, i) => {
    if (i > weeks * days - 14) return 0
    return Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0
  })
  const colors = ['#f1f5f9', '#bbf7d0', '#86efac', '#4ade80', '#22c55e']

  return (
    <div ref={ref}>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Focus Heatmap — Last 3 Months</p>
      <div className="flex gap-1">
        {Array.from({ length: weeks }, (_, w) => (
          <div key={w} className="flex flex-col gap-1">
            {Array.from({ length: days }, (_, d) => {
              const idx = w * days + d
              const val = data[idx]
              return (
                <div key={d} className="w-3 h-3 rounded-sm transition-all duration-500"
                  style={{
                    backgroundColor: inView ? colors[val] : '#f1f5f9',
                    transitionDelay: inView ? `${(w * days + d) * 8}ms` : '0ms',
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        <span className="text-xs text-slate-400">Less</span>
        {colors.map((c, i) => (
          <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
        ))}
        <span className="text-xs text-slate-400">More</span>
      </div>
    </div>
  )
}

function AnimatedProgressChart() {
  const { ref, inView } = useInView()
  const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']
  const values = [45, 68, 52, 78, 85, 91, 76, 95]

  return (
    <div ref={ref}>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Weekly Focus Hours</p>
      <div className="flex items-end gap-3 h-28">
        {values.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full rounded-t-lg transition-all duration-700 bg-gradient-to-t from-indigo-500 to-violet-400"
              style={{
                height: inView ? `${(v / 100) * 100}%` : '4px',
                transitionDelay: `${i * 80}ms`,
              }}
            />
            <span className="text-[10px] text-slate-400">{weeks[i]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 7 — Celebration previews
// ─────────────────────────────────────────────────────────────────────────────

function CelebPreviewCard({ title, icon, tagline, color, bg, items, delay }: {
  title: string; icon: string; tagline: string; color: string; bg: string
  items: string[]; delay: string
}) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-400"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.6s ease ${delay}, transform 0.5s ease ${delay}`,
      }}>
      <div className="h-32 flex items-center justify-center relative overflow-hidden" style={{ background: bg }}>
        <div className="absolute inset-0 opacity-20"
          style={{ background: `radial-gradient(circle at 50% 50%, ${color}60, transparent 70%)` }} />
        <div className="relative z-10 text-center">
          <div className="text-5xl mb-1">{icon}</div>
          <div className="text-white font-black text-lg tracking-wider opacity-90">{tagline}</div>
        </div>
      </div>
      <div className="bg-white p-5">
        <h3 className="font-bold text-slate-900 mb-3">{title}</h3>
        <div className="space-y-1.5">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: Props) {
  const { signInWithGoogle, signInAsGuest, loading } = useAuthStore()
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const heroRef = useRef<HTMLDivElement>(null)
  const tagline = useTypewriter(['Focus Better.', 'Build Consistency.', 'Track Progress.', 'Achieve More.'], 55, 1600)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = heroRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top)  / rect.height,
    })
  }, [])

  const THEMES_DATA = [
    {
      id: 'classic', name: 'Classic', emoji: '⚡',
      tagline: 'Clean and distraction-free.',
      desc:    'Minimal indigo design that eliminates distractions. Pure focus, beautiful simplicity.',
      accent:  '#6366f1',
      bg:      'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
      darkBg:  'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
    },
    {
      id: 'f1', name: 'F1 Racing', emoji: '🏎️',
      tagline: 'Turn productivity into a race.',
      desc:    'Ferrari-red speedometer transforms every session into a high-stakes race against the clock.',
      accent:  '#e10600',
      bg:      'linear-gradient(135deg, #0a0a0a 0%, #3b0000 100%)',
      darkBg:  'linear-gradient(135deg, #0a0a0a 0%, #1a0000 100%)',
    },
    {
      id: 'football', name: 'Football', emoji: '⚽',
      tagline: 'Score goals through consistency.',
      desc:    'Championship green stadium atmosphere. Every focus session is a goal scored for your future.',
      accent:  '#22c55e',
      bg:      'linear-gradient(135deg, #052e16 0%, #14532d 100%)',
      darkBg:  'linear-gradient(135deg, #071a0e 0%, #052e16 100%)',
    },
  ]

  const BENEFITS = [
    { icon: <Flame size={22} className="text-orange-500" />, title: 'Build Better Habits', desc: 'Daily streaks and consistency scoring keep you accountable long-term.' },
    { icon: <BarChart2 size={22} className="text-indigo-500" />, title: 'Track Real Progress', desc: 'Detailed analytics show exactly how your focus habits are evolving.' },
    { icon: <Target size={22} className="text-emerald-500" />, title: 'Stay Motivated', desc: 'Theme-aware celebrations reward every completed session with flair.' },
    { icon: <Zap size={22} className="text-violet-500" />, title: 'Focus Longer', desc: 'Smart break scheduling based on Pomodoro and Ultradian rhythm science.' },
  ]

  return (
    <>
      {/* ── Global landing-page CSS ──── */}
      <style>{`
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-18px) scale(1.1); }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 0.7; transform: scale(1.05); }
        }
        .landing-fade-in {
          animation: slideDown 0.6s ease forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>

      <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

        {/* ── Nav bar ──────────────────────────────────────────────────── */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-lg border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center shadow-sm">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">Focus Timer</span>
          </div>
          <button
            onClick={onGetStarted}
            className="flex items-center gap-1.5 bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-indigo-600 transition-colors shadow-sm"
          >
            Get Started <ArrowRight size={14} />
          </button>
        </nav>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 1 — HERO
        ═══════════════════════════════════════════════════════════════ */}
        <section
          ref={heroRef}
          onMouseMove={handleMouseMove}
          className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-6 overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #fafbff 0%, #f0f4ff 50%, #fafbff 100%)' }}
        >
          <FloatingParticles />

          {/* Gradient orbs */}
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', animation: 'pulseGlow 4s ease-in-out infinite' }} />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', animation: 'pulseGlow 4s ease-in-out 2s infinite' }} />

          <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16">

            {/* Left — copy */}
            <div className="flex-1 text-center lg:text-left landing-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-indigo-100">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Premium Focus Experience
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.05] mb-6">
                Master Your<br />
                <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
                  Focus.
                </span>
              </h1>

              {/* Typewriter tagline */}
              <div className="text-2xl sm:text-3xl font-bold text-slate-600 mb-8 h-10 flex items-center justify-center lg:justify-start gap-0">
                <span className="text-indigo-500">{tagline}</span>
                <span className="cursor-blink ml-0.5 inline-block w-0.5 h-7 bg-indigo-400 rounded-full" />
              </div>

              <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
                The focus timer that grows with you. Track sessions, build streaks, and celebrate every win with immersive theme experiences.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button
                  onClick={onGetStarted}
                  className="group flex items-center justify-center gap-2 bg-indigo-500 text-white font-semibold px-7 py-4 rounded-2xl text-base hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-200 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  Get Started
                  <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
                <a href="#how-it-works"
                  className="flex items-center justify-center gap-2 bg-white text-slate-700 font-semibold px-7 py-4 rounded-2xl text-base hover:bg-slate-50 transition-all border border-slate-200 hover:border-slate-300">
                  <Play size={15} className="text-slate-500" />
                  How it works
                </a>
              </div>

            </div>

            {/* Right — animated timer */}
            <div className="flex-shrink-0 flex justify-center">
              <HeroTimer mouseX={mousePos.x} mouseY={mousePos.y} />
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40"
            style={{ animation: 'floatBadge 2s ease-in-out infinite' }}>
            <span className="text-xs text-slate-400">Scroll to explore</span>
            <ChevronDown size={16} className="text-slate-400" />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 2 — INTERACTIVE PRODUCT PREVIEW
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-indigo-500 text-sm font-semibold uppercase tracking-widest mb-3">Live Preview</p>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">Everything you need<br/>to stay in flow.</h2>
              <p className="text-lg text-slate-500 max-w-xl mx-auto">Powerful analytics, streak tracking, and progress insights — all in one beautiful app.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatPreviewCard label="Today's Focus" value="4h 20m" sub="↑ 32% vs yesterday" color="#6366f1" delay="0ms" />
              <StatPreviewCard label="Current Streak" value="7 days" sub="Personal best!" color="#f59e0b" delay="80ms" />
              <StatPreviewCard label="This Month" value="89h" sub="Goal: 80h ✓" color="#10b981" delay="160ms" />
              <StatPreviewCard label="Focus Score" value="94" sub="Top 5%" color="#8b5cf6" delay="240ms" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Weekly chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Weekly Progress</p>
                    <p className="text-2xl font-black text-slate-900 mt-0.5">12.5 hrs</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+18%</span>
                </div>
                <MiniBarChart color="#6366f1" />
              </div>

              {/* Streak calendar */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                <div className="mb-5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">This Week</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-2xl font-black text-slate-900">5/7 days</p>
                    <Flame size={20} className="text-orange-500" />
                  </div>
                </div>
                <MiniStreakRow />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 3 — HOW IT WORKS
        ═══════════════════════════════════════════════════════════════ */}
        <section id="how-it-works" className="py-24 px-6 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-indigo-500 text-sm font-semibold uppercase tracking-widest mb-3">Simple & Powerful</p>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">How it works</h2>
              <p className="text-lg text-slate-500 max-w-xl mx-auto">Three pillars that turn daily sessions into long-term success.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: '⏱', title: 'Focus Sessions', desc: 'Set custom durations from 5 minutes to 8 hours. Smart break scheduling keeps you fresh and productive throughout the day.', color: '#6366f1', delay: '0ms' },
                { icon: '📈', title: 'Analytics', desc: 'Daily, weekly, monthly and yearly charts. Heatmaps, trend lines, and focus scores give you a complete picture of your habits.', color: '#8b5cf6', delay: '120ms' },
                { icon: '🎯', title: 'Goals & Streaks', desc: 'Set daily focus goals and track streaks. The habit loop of goal → progress → celebration makes consistency natural.', color: '#06b6d4', delay: '240ms' },
              ].map(({ icon, title, desc, color, delay }) => {
                const { ref, inView } = useInView()
                return (
                  <div key={title} ref={ref}
                    className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-400"
                    style={{
                      opacity: inView ? 1 : 0,
                      transform: inView ? 'translateY(0)' : 'translateY(32px)',
                      transition: `opacity 0.6s ease ${delay}, transform 0.5s ease ${delay}`,
                    }}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5"
                      style={{ backgroundColor: color + '15' }}>
                      {icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
                    <p className="text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 4 — ANALYTICS SHOWCASE
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-emerald-500 text-sm font-semibold uppercase tracking-widest mb-3">Data-Driven</p>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">See your progress<br/>come alive.</h2>
              <p className="text-lg text-slate-500 max-w-xl mx-auto">Rich visualisations that transform raw session data into actionable insights.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                <AnimatedProgressChart />
              </div>
              <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                <AnimatedHeatmap />
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { v: '12+', l: 'Chart types', c: '#6366f1' },
                { v: '365d', l: 'History tracked', c: '#8b5cf6' },
                { v: 'CSV', l: 'Export support', c: '#06b6d4' },
              ].map(({ v, l, c }) => {
                const { ref, inView } = useInView()
                return (
                  <div key={l} ref={ref} className="bg-slate-50 rounded-2xl p-5 text-center transition-all duration-500"
                    style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)' }}>
                    <p className="text-3xl font-black" style={{ color: c }}>{v}</p>
                    <p className="text-sm text-slate-500 mt-1">{l}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 5 — THEME SHOWCASE
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-6 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-violet-500 text-sm font-semibold uppercase tracking-widest mb-3">3 Themes</p>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">Your timer,<br/>your personality.</h2>
              <p className="text-lg text-slate-500 max-w-xl mx-auto">Hover any card to see a live animated preview. Switch themes any time from Settings.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {THEMES_DATA.map((theme, i) => (
                <ThemeShowcaseCard key={theme.id} theme={theme} delay={`${i * 120}ms`} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 6 — WHY PEOPLE USE IT
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-3">Benefits</p>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">Built for students<br/>and achievers.</h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {BENEFITS.map(({ icon, title, desc }, i) => {
                const { ref, inView } = useInView()
                return (
                  <div key={title} ref={ref}
                    className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    style={{
                      opacity: inView ? 1 : 0,
                      transform: inView ? 'translateY(0)' : 'translateY(28px)',
                      transition: `opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms`,
                    }}>
                    <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
                      {icon}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 7 — COMPLETION REWARDS PREVIEW
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-6 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-pink-500 text-sm font-semibold uppercase tracking-widest mb-3">Completion Rewards</p>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">Every session<br/>deserves a celebration.</h2>
              <p className="text-lg text-slate-500 max-w-xl mx-auto">Theme-aware completion animations that make finishing feel incredible.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <CelebPreviewCard
                title="F1 Racing"
                icon="🏁"
                tagline="SESSION COMPLETE"
                color="#e10600"
                bg="linear-gradient(135deg, #0a0a0a 0%, #3b0000 100%)"
                items={['Checkered flag sweep', 'Red & white confetti', 'Victory tagline', 'Session stats card']}
                delay="0ms"
              />
              <CelebPreviewCard
                title="Football"
                icon="⚽"
                tagline="GOAL!"
                color="#22c55e"
                bg="linear-gradient(135deg, #052e16 0%, #14532d 100%)"
                items={['Goal flash animation', 'Player celebration', 'Green & gold confetti', 'Session stats card']}
                delay="120ms"
              />
              <CelebPreviewCard
                title="Classic"
                icon="✓"
                tagline="Session Complete"
                color="#6366f1"
                bg="linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)"
                items={['Animated checkmark ring', 'Ripple ring effect', 'Elegant card reveal', 'Session stats card']}
                delay="240ms"
              />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 8 — FINAL CTA
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-28 px-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
          {/* Orbs */}
          <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 right-1/3 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)' }} />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center mx-auto mb-8 shadow-2xl"
              style={{ boxShadow: '0 0 40px rgba(99,102,241,0.4)' }}>
              <Zap size={28} className="text-white" />
            </div>

            <h2 className="text-5xl sm:text-6xl font-black text-white mb-4 tracking-tight">
              Ready to Focus?
            </h2>
            <p className="text-xl text-slate-300 mb-12 leading-relaxed">
              Start building better habits today.<br />
              No credit card required.
            </p>

            {/* Feature bullets */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-12">
              {['Free forever', 'Works offline', 'No ads', 'Privacy-first'].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                  <Check size={14} className="text-indigo-400" />
                  {f}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => signInWithGoogle()}
                disabled={loading}
                className="group flex items-center justify-center gap-3 bg-white text-slate-800 font-semibold px-8 py-4 rounded-2xl text-base hover:bg-slate-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <GoogleIcon size={20} />
                Continue with Google
              </button>
              <button
                onClick={() => signInAsGuest()}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-2xl text-base hover:bg-white/20 transition-all border border-white/20 hover:border-white/40 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <UserCircle2 size={20} />
                Continue as Guest
              </button>
            </div>

          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 bg-slate-950 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-400">Focus Timer</span>
          </div>
          <p className="text-xs text-slate-600">Built for deep work. Designed for focus.</p>
        </footer>
      </div>
    </>
  )
}
