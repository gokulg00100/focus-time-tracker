/**
 * Premium glass header.
 *
 * Visual treatment:
 *  • Glassmorphism: semi-transparent + saturated backdrop blur
 *  • Sticky top with elevated z-index
 *  • Subtle bottom border that fades with the glass effect
 *  • Title + optional subtitle on the left
 *  • Theme toggle + user menu on the right
 */

import { ThemeToggle } from '../ui/ThemeToggle'
import { UserMenu }    from '../auth/UserMenu'

interface HeaderProps {
  title:     string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header
      className="
        flex items-center justify-between
        px-6 py-4
        sticky top-0 z-20
        bg-white/[0.92] dark:bg-slate-950/[0.92]
        border-b border-slate-200/50 dark:border-slate-800/50
        glass-panel
      "
    >
      {/* Left: page title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
