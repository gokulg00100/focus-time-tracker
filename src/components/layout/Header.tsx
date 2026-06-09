import { ThemeToggle } from '../ui/ThemeToggle'

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      <ThemeToggle />
    </header>
  )
}
