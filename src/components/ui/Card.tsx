import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: boolean
  hoverable?: boolean
  onClick?: () => void
}

export function Card({ children, className, padding = true, hoverable, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm',
        padding && 'p-5',
        hoverable && 'cursor-pointer hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200',
        className
      )}
    >
      {children}
    </div>
  )
}
