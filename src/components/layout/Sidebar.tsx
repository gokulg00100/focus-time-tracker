/**
 * Premium sidebar navigation.
 *
 * Visual treatment:
 *  • Glassmorphism: semi-transparent surface + saturated backdrop blur
 *  • Active item: solid accent-500 pill with theme-matching glow
 *  • Inactive items: flat, minimal hover
 *  • Logo: accent-coloured subtitle
 *  • Bottom: keyboard shortcuts with glass pill style
 */

import { NavLink }   from 'react-router-dom'
import {
  Timer, LayoutDashboard, BarChart2, TrendingUp,
  Calendar, CheckSquare, Settings, Palette,
} from 'lucide-react'
import { AppLogo } from '../ui/AppLogo'
import { clsx }     from 'clsx'

const NAV = [
  { to: '/',               icon: Timer,          label: 'Timer'      },
  { to: '/dashboard',      icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/statistics',     icon: BarChart2,       label: 'Statistics' },
  { to: '/analytics',      icon: TrendingUp,      label: 'Analytics'  },
  { to: '/calendar',       icon: Calendar,        label: 'Calendar'   },
  { to: '/tasks',          icon: CheckSquare,     label: 'Tasks'      },
  { to: '/settings',       icon: Settings,        label: 'Settings'   },
  { to: '/theme-settings', icon: Palette,         label: 'Themes'     },
]

export function Sidebar() {
  return (
    <aside
      className={clsx(
        'hidden md:flex flex-col w-64 min-h-screen',
        'fixed left-0 top-0 bottom-0 z-30',
        'px-4 py-6',
        // Glassmorphism: semi-transparent + backdrop blur + vendor prefix
        'bg-white/[0.97] dark:bg-slate-950/[0.97]',
        'border-r border-slate-200/60 dark:border-slate-800/60',
        'glass-panel',
      )}
    >

      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="relative flex-shrink-0">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-500 rounded-xl shadow-glow">
            <AppLogo size={22} variant="white" id="sidebar" />
          </div>
          {/* Glow pulse ring */}
          <div className="absolute inset-0 rounded-xl bg-primary-500 opacity-20 animate-ping [animation-duration:3s]"/>
        </div>
        <div>
          <div className="font-bold text-slate-900 dark:text-white text-[15px] leading-tight tracking-tight">
            Focus
          </div>
          <div className="text-[11px] font-semibold text-primary-500 tracking-wide">
            Time Tracker
          </div>
        </div>
      </div>

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <nav className="flex-1 space-y-0.5">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                'transition-all duration-150',
                isActive
                  ? 'bg-primary-500 text-white shadow-glow'
                  : [
                    'text-slate-600 dark:text-slate-400',
                    'hover:bg-slate-100/80 dark:hover:bg-slate-800/80',
                    'hover:text-slate-900 dark:hover:text-slate-100',
                  ]
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={17}
                  className={isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}
                />
                <span className={isActive ? 'font-semibold' : ''}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Keyboard shortcuts ───────────────────────────────────────────── */}
      <div className="mt-4 px-3 py-3 bg-primary-500/[0.07] dark:bg-primary-500/[0.1] rounded-xl border border-primary-500/10">
        <p className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 tracking-wide uppercase mb-2">
          Shortcuts
        </p>
        <div className="space-y-1.5">
          {[
            { label: 'Start / Pause', key: 'Space' },
            { label: 'Stop',         key: 'Esc'   },
            { label: 'Reset',        key: 'R'     },
          ].map(({ label, key }) => (
            <div key={key} className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 dark:text-slate-400">{label}</span>
              <kbd className="
                px-1.5 py-0.5 rounded-md text-[10px] font-semibold
                bg-white dark:bg-slate-800
                text-slate-600 dark:text-slate-300
                border border-slate-200 dark:border-slate-700
                shadow-sm
              ">
                {key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
