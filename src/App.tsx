/**
 * App — root component.
 *
 * User flow:
 *   LandingPage  →  AuthPage  →  OnboardingFlow  →  Main app
 *
 * First-time visitors see the landing page and understand the product before
 * being asked to sign in. Returning logged-in users skip straight to the app.
 */

import { useEffect, useState } from 'react'
import { AppLogo } from './components/ui/AppLogo'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout }              from './components/layout/Layout'
import { LandingPage }         from './pages/LandingPage'
import { AuthPage }            from './components/auth/AuthPage'
import { OnboardingFlow }      from './components/onboarding/OnboardingFlow'
import { TimerPage }           from './pages/TimerPage'
import { DashboardPage }       from './pages/DashboardPage'
import { StatisticsPage }      from './pages/StatisticsPage'
import { AnalyticsPage }       from './pages/AnalyticsPage'
import { CalendarPage }        from './pages/CalendarPage'
import { TasksPage }           from './pages/TasksPage'
import { SettingsPage }        from './pages/SettingsPage'
import { ThemeSettingsPage }   from './pages/ThemeSettingsPage'
import { useTheme }            from './hooks/useTheme'
import { useAuthStore, initAuthListener } from './store/authStore'
import { hasCompletedOnboarding, markOnboardingComplete } from './store/onboardingStore'

/** Applies the user's saved theme to <html> on mount and keeps it in sync. */
function ThemeInitializer() {
  useTheme()
  return null
}

// ── Landing-page "seen" state ──────────────────────────────────────────────
// Persisted to sessionStorage so it resets between browser sessions but
// survives in-page React re-renders / hot-reloads during development.
const LANDING_KEY = 'ftt-landing-seen'

function AuthGate() {
  const { user, initialized } = useAuthStore()

  // Track whether the landing page has been shown in this session.
  const [landingSeen, setLandingSeen] = useState(() => {
    // Skip landing page for already-authenticated users so they land
    // straight in the app without the extra click.
    if (useAuthStore.getState().user) return true
    return sessionStorage.getItem(LANDING_KEY) === '1'
  })

  // ── Onboarding status ────────────────────────────────────────────────────
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
            <AppLogo size={24} variant="white" id="loading" />
          </div>
          <div className="animate-spin w-6 h-6 border-2 border-primary-400 border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  // ── Landing page (first visit, not yet signed in) ─────────────────────────
  if (!landingSeen && !user) {
    return (
      <LandingPage
        onGetStarted={() => {
          sessionStorage.setItem(LANDING_KEY, '1')
          setLandingSeen(true)
        }}
      />
    )
  }

  // ── Not signed in → auth ─────────────────────────────────────────────────
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
        <Route path="/"           element={<TimerPage />}        />
        <Route path="/dashboard"  element={<DashboardPage />}    />
        <Route path="/statistics" element={<StatisticsPage />}   />
        <Route path="/analytics"  element={<AnalyticsPage />}    />
        <Route path="/calendar"   element={<CalendarPage />}     />
        <Route path="/tasks"      element={<TasksPage />}        />
        <Route path="/settings"       element={<SettingsPage />}       />
        <Route path="/theme-settings" element={<ThemeSettingsPage />}  />
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
