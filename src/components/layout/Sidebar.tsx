import { NavLink } from 'react-router-dom'
import {
  Timer,
  LayoutDashboard,
  BarChart2,
  TrendingUp,
  Calendar,
  CheckSquare,
  Settings,
  Zap,
  Palette,
} from 'lucide-react'
import { clsx } from 'clsx'

const nav = [
  { to: '/', icon: Timer, label: 'Timer' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/statistics', icon: BarChart2, label: 'Statistics' },
  { to: '/analytics', icon: TrendingUp, label: 'Analytics' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/settings',       icon: Settings, label: 'Settings' },
  { to: '/theme-settings', icon: Palette,  label: 'Themes'   },
]

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 px-4 py-6 fixed left-0 top-0 bottom-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="flex items-center justify-center w-9 h-9 bg-primary-500 rounded-xl shadow-glow">
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <div className="font-bold text-slate-900 dark:text-white text-sm leading-tight">Focus</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Time Tracker</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 px-3 py-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
        <p className="text-xs font-medium text-primary-700 dark:text-primary-400">Keyboard Shortcuts</p>
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Start/Pause</span><kbd className="bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded text-xs shadow-sm">Space</kbd>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Stop</span><kbd className="bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded text-xs shadow-sm">Esc</kbd>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Reset</span><kbd className="bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded text-xs shadow-sm">R</kbd>
          </div>
        </div>
      </div>
    </aside>
  )
}
