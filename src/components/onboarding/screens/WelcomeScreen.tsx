/**
 * WelcomeScreen
 * ─────────────
 * Hero step of the onboarding flow.
 *
 * Sequence:
 *  1. Logo floats in immediately.
 *  2. Typewriter types "Welcome to Focus Timer" (55 ms / char, 400 ms initial delay).
 *  3. 200 ms after typewriter finishes → first tagline fades in.
 *  4. Taglines cycle every 2 s with a soft fade + rise transition.
 *  5. Feature pills slide in 800 ms after typewriter finishes.
 */

import { useState, useEffect } from 'react'
import { Zap, Timer, BarChart3, Target, Flame } from 'lucide-react'

// ── Typewriter hook ───────────────────────────────────────────────────────────

function useTypewriter(text: string, startDelay = 400, charDelay = 52) {
  const [displayed, setDisplayed] = useState('')
  const [done,      setDone]      = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let interval: ReturnType<typeof setInterval> | null = null

    const outer = setTimeout(() => {
      let i = 0
      interval = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(interval!)
          setDone(true)
        }
      }, charDelay)
    }, startDelay)

    return () => {
      clearTimeout(outer)
      if (interval) clearInterval(interval)
    }
  }, [text, startDelay, charDelay])

  return { displayed, done }
}

// ── Constants ─────────────────────────────────────────────────────────────────

const TITLE    = 'Welcome to Focus Timer'
const TAGLINES = ['Focus Better.', 'Build Consistency.', 'Achieve More.']

const PILLS = [
  { icon: Timer,    label: 'Smart Timer',    bg: '#f5f3ff', fg: '#7c3aed' },
  { icon: BarChart3,label: 'Analytics',      bg: '#eff6ff', fg: '#2563eb' },
  { icon: Target,   label: 'Daily Goals',    bg: '#f0fdf4', fg: '#16a34a' },
  { icon: Flame,    label: 'Streak Tracking',bg: '#fff7ed', fg: '#ea580c' },
]

// ── Component ─────────────────────────────────────────────────────────────────

export function WelcomeScreen() {
  const { displayed, done } = useTypewriter(TITLE)

  const [taglineIdx,  setTaglineIdx]  = useState(0)
  const [taglineShow, setTaglineShow] = useState(false)
  const [pillsShow,   setPillsShow]   = useState(false)

  // After typewriter finishes → show tagline and later pills
  useEffect(() => {
    if (!done) return
    const t1 = setTimeout(() => setTaglineShow(true),  200)
    const t2 = setTimeout(() => setPillsShow(true),    800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [done])

  // Cycle taglines every 2.2 s
  useEffect(() => {
    if (!taglineShow) return
    const id = setInterval(() => {
      setTaglineShow(false)
      setTimeout(() => {
        setTaglineIdx((i) => (i + 1) % TAGLINES.length)
        setTaglineShow(true)
      }, 320)
    }, 2200)
    return () => clearInterval(id)
  }, [taglineShow])

  return (
    <div className="flex flex-col items-center text-center px-6 py-10 max-w-lg mx-auto w-full">

      {/* ── Animated logo ─────────────────────────────────────────────── */}
      <div className="relative mb-9">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-glow animate-float"
          style={{ backgroundColor: 'rgb(var(--p-500))' }}
        >
          <Zap size={36} className="text-white" />
        </div>
        {/* Slow pulse ring */}
        <div
          className="absolute inset-0 rounded-2xl animate-ping opacity-20"
          style={{
            backgroundColor: 'rgb(var(--p-500))',
            animationDuration: '2.8s',
          }}
        />
      </div>

      {/* ── Typewriter title ──────────────────────────────────────────── */}
      <div className="mb-5 min-h-[64px] flex items-center justify-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
          {displayed}
          {!done && (
            <span
              className="inline-block w-[3px] h-9 ml-0.5 align-middle rounded-sm cursor-blink"
              style={{ backgroundColor: 'rgb(var(--p-500))' }}
            />
          )}
        </h1>
      </div>

      {/* ── Cycling tagline ───────────────────────────────────────────── */}
      <div className="h-10 flex items-center justify-center mb-10">
        <p
          className="text-2xl sm:text-3xl font-semibold"
          style={{
            color:      'rgb(var(--p-500))',
            opacity:    taglineShow ? 1 : 0,
            transform:  taglineShow ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.32s ease, transform 0.32s ease',
          }}
        >
          {TAGLINES[taglineIdx]}
        </p>
      </div>

      {/* ── Feature pills ─────────────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center justify-center gap-2"
        style={{
          opacity:    pillsShow ? 1 : 0,
          transform:  pillsShow ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.45s ease, transform 0.45s ease',
        }}
      >
        {PILLS.map(({ icon: Icon, label, bg, fg }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium"
            style={{ backgroundColor: bg, color: fg }}
          >
            <Icon size={13} />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
