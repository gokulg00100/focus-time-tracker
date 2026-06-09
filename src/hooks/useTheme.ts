import { useState, useEffect } from 'react'
import { useSettingsStore } from '../store/settingsStore'
import { THEMES, getTokens } from '../config/themes'

export function useTheme() {
  const { settings, updateTheme, updateAccentTheme } = useSettingsStore()
  const { theme, accentTheme = 'classic' } = settings

  // ── Track system dark-mode preference reactively ─────────────────────────
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const h = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  const isDark = theme === 'dark' || (theme === 'system' && systemDark)

  // ── Apply dark / light class to <html> ───────────────────────────────────
  useEffect(() => {
    const root = document.documentElement
    if (isDark) root.classList.add('dark')
    else root.classList.remove('dark')
  }, [isDark])

  // ── Swap CSS custom properties + accent class ────────────────────────────
  useEffect(() => {
    const root = document.documentElement
    const def = THEMES[accentTheme]

    // Primary colour scale → CSS custom properties (--p-50 … --p-950)
    const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
    def.primaryScale.forEach((rgb, i) => {
      root.style.setProperty(`--p-${shades[i]}`, rgb)
    })

    // Theme class (for any remaining CSS selectors that still use it)
    root.classList.remove('theme-f1', 'theme-football')
    if (accentTheme === 'f1')       root.classList.add('theme-f1')
    if (accentTheme === 'football') root.classList.add('theme-football')
  }, [accentTheme])

  // ── Theme background on <body> ───────────────────────────────────────────
  useEffect(() => {
    const def = THEMES[accentTheme]
    document.body.style.background = isDark
      ? def.backgrounds.dark
      : def.backgrounds.light
  }, [isDark, accentTheme])

  // ── Semantic token CSS custom properties ─────────────────────────────────
  // Exposes --clr-* vars for any CSS / Tailwind `[var(--clr-*)]` usage.
  useEffect(() => {
    const root = document.documentElement
    const tok  = getTokens(THEMES[accentTheme], isDark)
    root.style.setProperty('--clr-surface',          tok.surface)
    root.style.setProperty('--clr-text-primary',     tok.textPrimary)
    root.style.setProperty('--clr-text-secondary',   tok.textSecondary)
    root.style.setProperty('--clr-timer-text',       tok.timerText)
    root.style.setProperty('--clr-timer-ring',       tok.timerRing)
    root.style.setProperty('--clr-timer-track',      tok.timerTrack)
  }, [isDark, accentTheme])

  const cycleTheme = () => {
    if (theme === 'light') updateTheme('dark')
    else if (theme === 'dark') updateTheme('system')
    else updateTheme('light')
  }

  return { theme, accentTheme, isDark, updateTheme, updateAccentTheme, cycleTheme }
}
