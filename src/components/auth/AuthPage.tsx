import { useAuthStore } from '../../store/authStore'
import { Timer, BarChart2, Target, Flame, UserCircle2 } from 'lucide-react'
import { AppLogo } from '../ui/AppLogo'
import { clsx } from 'clsx'

// Google G icon as inline SVG (no external dependency needed)
function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

const FEATURES = [
  { icon: Timer, label: 'Smart Focus Timer', desc: 'Custom durations with auto breaks' },
  { icon: BarChart2, label: 'Rich Analytics', desc: 'Heatmaps, trends & streaks' },
  { icon: Target, label: 'Goal Tracking', desc: 'Daily, weekly & monthly goals' },
  { icon: Flame, label: 'Streak System', desc: 'Build powerful habits daily' },
]

export function AuthPage() {
  const { signInWithGoogle, signInAsGuest, loading, error, clearError } = useAuthStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl shadow-glow-lg">
            <AppLogo size={36} variant="white" id="auth" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white tracking-tight">Focus Tracker</h1>
            <p className="text-primary-300 text-sm mt-1">Build deep work habits, one session at a time.</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1 text-center">
            Get started
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
            Sign in to save your focus data across sessions.
          </p>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <button onClick={clearError} className="text-xs text-red-400 hover:text-red-600 mt-1 underline">
                Dismiss
              </button>
            </div>
          )}

          {/* Google button */}
          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className={clsx(
              'w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-600',
              'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-sm',
              'hover:border-primary-400 hover:bg-slate-50 dark:hover:bg-slate-600',
              'transition-all duration-200 shadow-sm hover:shadow-md',
              'disabled:opacity-60 disabled:cursor-not-allowed'
            )}
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 text-slate-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <GoogleIcon size={18} />
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-600" />
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">or</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-600" />
          </div>

          {/* Guest button */}
          <button
            onClick={signInAsGuest}
            disabled={loading}
            className={clsx(
              'w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl',
              'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 font-medium text-sm',
              'hover:bg-slate-200 dark:hover:bg-slate-700',
              'transition-all duration-200',
              'disabled:opacity-60 disabled:cursor-not-allowed'
            )}
          >
            <UserCircle2 size={18} />
            Continue as Guest
          </button>

          <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-5 leading-relaxed">
            Guest data is stored locally on this device.<br />
            Sign in with Google to sync across devices in the future.
          </p>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-start gap-3 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl px-4 py-3"
            >
              <div className="mt-0.5 flex-shrink-0 text-primary-400">
                <Icon size={16} />
              </div>
              <div>
                <p className="text-white text-xs font-semibold">{label}</p>
                <p className="text-primary-300/70 text-[11px] leading-tight">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
