import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout }          from './components/layout/Layout'
import { AuthPage }        from './components/auth/AuthPage'
import { OnboardingFlow }  from './components/onboarding/OnboardingFlow'
import { TimerPage }       from './pages/TimerPage'
import { DashboardPage }   from './pages/DashboardPage'
import { StatisticsPage }  from './pages/StatisticsPage'
import { AnalyticsPage }   from './pages/AnalyticsPage'
import { CalendarPage }    from './pages/CalendarPage'
import { TasksPage }       from './pages/TasksPage'
import { SettingsPage }    from './pages/SettingsPage'
import { useTheme }        from './hooks/useTheme'
import { useAuthStore, initAuthListener } from './store/authStore'
import { hasCompletedOnboarding, markOnboardingComplete } from './store/onboardingStore'

function ThemeInitializer() {
  useTheme()
  return null
}

function AuthGate() {
  const { user, initialized } = useAuthStore()

  // ── Onboarding status ────────────────────────────────────────────────────
  // Initialised synchronously from localStorage (avoids a flash for returning
  // users whose onboarding is already done).
  const [onboardingDone, setOnboardingDone] = useState(() => {
    const u = useAuthStore.getState().user
    return u ? hasCompletedOnboarding(u.uid) : false
  })

  // Re-check whenever the logged-in user changes (login / logout / guest swap)
  useEffect(() => {
    setOnboardingDone(user ? hasCompletedOnboarding(user.uid) : false)
  }, [user?.uid])

  // ── Loading ──────────────────────────────────────────────────────────────
  if (!initialized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-primary-500 flex items-center justify-center animate-pulse-slow">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
              <path
                d="M13 10V3L4 14h7v7l9-11h-7z"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="animate-spin w-6 h-6 border-2 border-primary-400 border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  // ── Not signed in ────────────────────────────────────────────────────────
  if (!user) return <AuthPage />

  // ── First-time onboarding ────────────────────────────────────────────────
  if (!onboardingDone) {
    return (
      <OnboardingFlow
        onComplete={() => {
          markOnboardingComplete(user.uid)
          setOnboardingDone(true)
        }}
      />
    )
  }

  // ── Main app ─────────────────────────────────────────────────────────────
  return (
    <Layout>
      <Routes>
        <Route path="/"           element={<TimerPage />}      />
        <Route path="/dashboard"  element={<DashboardPage />}  />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/analytics"  element={<AnalyticsPage />}  />
        <Route path="/calendar"   element={<CalendarPage />}   />
        <Route path="/tasks"      element={<TasksPage />}      />
        <Route path="/settings"   element={<SettingsPage />}   />
      </Routes>
    </Layout>
  )
}

export function App() {
  // Start Firebase auth listener exactly once for the lifetime of the app
  useEffect(() => {
    const unsubscribe = initAuthListener()
    return unsubscribe
  }, [])

  return (
    <BrowserRouter>
      <ThemeInitializer />
      <AuthGate />
    </BrowserRouter>
  )
}
