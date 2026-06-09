import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { TimerPage } from './pages/TimerPage'
import { DashboardPage } from './pages/DashboardPage'
import { StatisticsPage } from './pages/StatisticsPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { CalendarPage } from './pages/CalendarPage'
import { TasksPage } from './pages/TasksPage'
import { SettingsPage } from './pages/SettingsPage'
import { useTheme } from './hooks/useTheme'

function ThemeInitializer() {
  useTheme() // applies theme on mount
  return null
}

export function App() {
  return (
    <BrowserRouter>
      <ThemeInitializer />
      <Layout>
        <Routes>
          <Route path="/" element={<TimerPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
