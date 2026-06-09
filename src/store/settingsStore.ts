import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserSettings, BreakConfig, Goals, AccentTheme } from '../types'

const DEFAULT_SETTINGS: UserSettings = {
  breakConfig: {
    intervalMins: 60,
    durationMins: 5,
    autoResume: true,
  },
  goals: {
    dailyMins: 120,
    weeklyMins: 600,
    monthlyMins: 2400,
  },
  theme: 'light',
  accentTheme: 'classic',
  notificationsEnabled: true,
  soundEnabled: true,
}

interface SettingsState {
  settings: UserSettings
  updateBreakConfig: (config: BreakConfig | null) => void
  updateGoals: (goals: Goals) => void
  updateTheme: (theme: UserSettings['theme']) => void
  updateAccentTheme: (accentTheme: AccentTheme) => void
  updateNotifications: (enabled: boolean) => void
  updateSound: (enabled: boolean) => void
  resetSettings: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      updateBreakConfig: (config) =>
        set((s) => ({ settings: { ...s.settings, breakConfig: config } })),
      updateGoals: (goals) =>
        set((s) => ({ settings: { ...s.settings, goals } })),
      updateTheme: (theme) =>
        set((s) => ({ settings: { ...s.settings, theme } })),
      updateAccentTheme: (accentTheme) =>
        set((s) => ({ settings: { ...s.settings, accentTheme } })),
      updateNotifications: (enabled) =>
        set((s) => ({ settings: { ...s.settings, notificationsEnabled: enabled } })),
      updateSound: (enabled) =>
        set((s) => ({ settings: { ...s.settings, soundEnabled: enabled } })),
      resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
    }),
    { name: 'focus-tracker-settings' }
  )
)
