import { NavLink } from 'react-router-dom'
import { Timer, LayoutDashboard, TrendingUp, Calendar, CheckSquare } from 'lucide-react'
import { clsx } from 'clsx'

const nav = [
  { to: '/', icon: Timer, label: 'Timer' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/analytics', icon: TrendingUp, label: 'Analytics' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
]

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-30 safe-area-pb">
      <div className="flex">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-slate-500 dark:text-slate-400'
              )
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
