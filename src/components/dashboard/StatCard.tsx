import { ReactNode } from 'react'
import { Card } from '../ui/Card'
import { clsx } from 'clsx'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  accent?: 'primary' | 'success' | 'warning' | 'danger'
  className?: string
}

const accents = {
  primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
  success: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
  warning: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  danger: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
}

export function StatCard({ title, value, subtitle, icon, trend, trendValue, accent = 'primary', className }: StatCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendColor = trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-slate-400'

  return (
    <Card className={clsx('flex flex-col gap-3', className)}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        {icon && (
          <div className={clsx('flex items-center justify-center w-9 h-9 rounded-xl', accents[accent])}>
            {icon}
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{value}</p>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {trend && trendValue && (
        <div className={clsx('flex items-center gap-1 text-xs font-medium', trendColor)}>
          <TrendIcon size={12} />
          {trendValue}
        </div>
      )}
    </Card>
  )
}
