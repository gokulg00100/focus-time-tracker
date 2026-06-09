import { useEffect } from 'react'
import type { TimerStatus } from '../types'

interface ShortcutHandlers {
  status: TimerStatus
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
  onReset: () => void
  onSkipBreak: () => void
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          if (handlers.status === 'idle') handlers.onStart()
          else if (handlers.status === 'running') handlers.onPause()
          else if (handlers.status === 'paused') handlers.onResume()
          break
        case 'Escape':
          e.preventDefault()
          if (handlers.status !== 'idle') handlers.onStop()
          break
        case 'KeyR':
          if (e.ctrlKey || e.metaKey) break // don't intercept ctrl+R
          e.preventDefault()
          handlers.onReset()
          break
        case 'KeyB':
          if (handlers.status === 'break') {
            e.preventDefault()
            handlers.onSkipBreak()
          }
          break
      }
    }

    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [handlers])
}
