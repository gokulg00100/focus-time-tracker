import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Settings, UserCircle2, ChevronDown, Shield, type LucideIcon } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { clsx } from 'clsx'

function Avatar({ photoURL, displayName, size = 32 }: { photoURL: string | null; displayName: string | null; size?: number }) {
  const initials = displayName
    ? displayName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={displayName ?? 'User'}
        width={size}
        height={size}
        className="rounded-full object-cover ring-2 ring-primary-400/50"
        style={{ width: size, height: size }}
        referrerPolicy="no-referrer"
      />
    )
  }

  return (
    <div
      className="rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold ring-2 ring-primary-400/50"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  )
}

export function UserMenu() {
  const { user, signOut } = useAuthStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!user) return null

  const displayName = user.isAnonymous ? 'Guest' : (user.displayName ?? 'User')
  const subtitle = user.isAnonymous ? 'Local guest account' : (user.email ?? '')

  const handleSignOut = async () => {
    setOpen(false)
    await signOut()
  }

  const handleSettings = () => {
    setOpen(false)
    navigate('/settings')
  }

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          'flex items-center gap-2 px-2 py-1.5 rounded-xl transition-colors duration-150',
          'hover:bg-slate-100 dark:hover:bg-slate-800',
          open && 'bg-slate-100 dark:bg-slate-800'
        )}
      >
        <Avatar photoURL={user.photoURL} displayName={displayName} size={28} />
        <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[120px] truncate">
          {displayName}
        </span>
        <ChevronDown
          size={14}
          className={clsx(
            'text-slate-400 transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 animate-scale-in overflow-hidden">
          {/* Profile header */}
          <div className="flex items-center gap-3 px-4 py-4 bg-slate-50 dark:bg-slate-750 border-b border-slate-100 dark:border-slate-700">
            <Avatar photoURL={user.photoURL} displayName={displayName} size={40} />
            <div className="min-w-0">
              <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{displayName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{subtitle}</p>
              {user.isAnonymous && (
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-full">
                  <Shield size={10} />
                  Guest
                </span>
              )}
            </div>
          </div>

          {/* Menu items */}
          <div className="p-1.5">
            <MenuItem icon={Settings} label="Settings" onClick={handleSettings} />
            <div className="my-1 h-px bg-slate-100 dark:bg-slate-700" />
            <MenuItem icon={LogOut} label="Sign out" onClick={handleSignOut} danger />
          </div>
        </div>
      )}
    </div>
  )
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: LucideIcon
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150',
        danger
          ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
      )}
    >
      <Icon size={15} className={danger ? 'text-red-500' : 'text-slate-400'} />
      {label}
    </button>
  )
}
