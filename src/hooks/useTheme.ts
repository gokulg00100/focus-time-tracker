import { useEffect } from 'react'
import { useSettingsStore } from '../store/settingsStore'

export function useTheme() {
  const { settings, updateTheme } = useSettingsStore()
  const { theme } = settings

  useEffect(() => {
    const root = document.documentElement
    const applyTheme = (isDark: boolean) => {
      if (isDark) root.classList.add('dark')
      else root.classList.remove('dark')
    }

    if (theme === 'dark') {
      applyTheme(true)
    } else if (theme === 'light') {
      applyTheme(false)
    } else {
      // system
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      applyTheme(mq.matches)
      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches)
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [theme])

  const cycleTheme = () => {
    if (theme === 'light') updateTheme('dark')
    else if (theme === 'dark') updateTheme('system')
    else updateTheme('light')
  }

  return { theme, updateTheme, cycleTheme }
}
