import { useEffect } from 'react'
import { useSettingsStore } from '../store/settingsStore'

export function useTheme() {
  const { settings, updateTheme, updateAccentTheme } = useSettingsStore()
  const { theme, accentTheme = 'classic' } = settings

  // ── Dark / light mode ────────────────────────────────────────────────────
  useEffect(() => {
    const root = document.documentElement
    const applyDark = (isDark: boolean) => {
      if (isDark) root.classList.add('dark')
      else root.classList.remove('dark')
    }

    if (theme === 'dark') {
      applyDark(true)
    } else if (theme === 'light') {
      applyDark(false)
    } else {
      // system
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      applyDark(mq.matches)
      const handler = (e: MediaQueryListEvent) => applyDark(e.matches)
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [theme])

  // ── Accent theme (CSS variable swap via class on <html>) ─────────────────
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('theme-f1', 'theme-fifa')
    if (accentTheme === 'f1') root.classList.add('theme-f1')
    else if (accentTheme === 'fifa') root.classList.add('theme-fifa')
    // 'classic' → no extra class; uses :root defaults
  }, [accentTheme])

  const cycleTheme = () => {
    if (theme === 'light') updateTheme('dark')
    else if (theme === 'dark') updateTheme('system')
    else updateTheme('light')
  }

  return { theme, accentTheme, updateTheme, updateAccentTheme, cycleTheme }
}
