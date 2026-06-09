import { useState, useEffect } from 'react'
import { useSettingsStore } from '../store/settingsStore'

export function useTheme() {
  const { settings, updateTheme, updateAccentTheme } = useSettingsStore()
  const { theme, accentTheme = 'classic' } = settings

  // Track system dark-mode preference reactively
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const isDark = theme === 'dark' || (theme === 'system' && systemDark)

  // ── Apply dark / light class ─────────────────────────────────────────────
  useEffect(() => {
    const root = document.documentElement
    if (isDark) root.classList.add('dark')
    else root.classList.remove('dark')
  }, [isDark])

  // ── Apply accent theme class ─────────────────────────────────────────────
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('theme-f1', 'theme-fifa')
    if (accentTheme === 'f1')   root.classList.add('theme-f1')
    if (accentTheme === 'fifa') root.classList.add('theme-fifa')
  }, [accentTheme])

  const cycleTheme = () => {
    if (theme === 'light') updateTheme('dark')
    else if (theme === 'dark') updateTheme('system')
    else updateTheme('light')
  }

  return { theme, accentTheme, isDark, updateTheme, updateAccentTheme, cycleTheme }
}
