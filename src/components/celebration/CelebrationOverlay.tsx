/**
 * CelebrationOverlay
 * ──────────────────
 * Full-screen overlay that wraps the theme-specific celebration component.
 *
 * Responsibilities:
 *   • Dispatches to the correct themed celebration based on `accentTheme`
 *   • Triggers the one-shot celebration sound on mount
 *   • Auto-dismisses after 5 s (with a visible countdown bar)
 *   • Dismisses immediately on Escape key or any click
 *   • Respects `prefers-reduced-motion` — passes `reduced` flag down
 *   • Exports the `CelebrationData` type for consumers
 *
 * Usage:
 *   <CelebrationOverlay
 *     accentTheme={accentTheme}
 *     isDark={isDark}
 *     data={celebData}
 *     soundEnabled={settings.soundEnabled}
 *     onDismiss={handleDismiss}
 *   />
 */

import { useEffect, useMemo }   from 'react'
import { ClassicCelebration }   from './ClassicCelebration'
import { F1Celebration }        from './F1Celebration'
import { FIFACelebration }      from './FIFACelebration'
import { useCelebrationSound }  from '../../hooks/useCelebrationSound'
import type { AccentTheme }     from '../../types'
import type { CelebrationData } from './CelebrationStats'

// Re-export so consumers only need to import from this one file
export type { CelebrationData }

// ── Auto-dismiss duration (ms) ────────────────────────────────────────────────
const AUTO_DISMISS_MS = 5000

// ── Accent colour for the countdown bar per theme ─────────────────────────────
const ACCENT: Record<AccentTheme, string> = {
  classic: 'rgb(var(--p-500))',
  f1:      '#e10600',
  fifa:    '#22c55e',
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  accentTheme:  AccentTheme
  isDark:       boolean
  data:         CelebrationData
  soundEnabled: boolean
  onDismiss:    () => void
}

export function CelebrationOverlay({
  accentTheme, isDark, data, soundEnabled, onDismiss,
}: Props) {

  // Detect reduced-motion once (memoised — stable for the lifetime of the overlay)
  const reduced = useMemo(
    () => typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
    []
  )

  // Play one-shot celebration sound
  const { play } = useCelebrationSound()
  useEffect(() => {
    play(accentTheme, soundEnabled)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-dismiss
  useEffect(() => {
    const t = setTimeout(onDismiss, AUTO_DISMISS_MS)
    return () => clearTimeout(t)
  }, [onDismiss])

  // Keyboard dismiss
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onDismiss() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onDismiss])

  return (
    /*
     * Click anywhere on the backdrop to dismiss.
     * Each theme component calls e.stopPropagation() on its inner card so that
     * clicking the card itself doesn't bubble up — only bare-backdrop clicks do.
     */
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Session complete celebration"
      className="fixed inset-0 z-50 celeb-backdrop"
      onClick={onDismiss}
    >

      {/* ── Theme-specific content ──────────────────────────────── */}
      {accentTheme === 'classic' && (
        <ClassicCelebration data={data} reduced={reduced} isDark={isDark} />
      )}
      {accentTheme === 'f1' && (
        <F1Celebration data={data} reduced={reduced} />
      )}
      {accentTheme === 'fifa' && (
        <FIFACelebration data={data} reduced={reduced} />
      )}

      {/* ── Auto-dismiss countdown bar ──────────────────────────── */}
      {/*
        Thin bar at the very bottom of the screen. Shrinks from full-width
        to zero over AUTO_DISMISS_MS using a CSS keyframe animation so it's
        silky-smooth at 60 fps without any JS timer.
      */}
      <div
        className="fixed bottom-0 left-0 right-0 h-[3px] pointer-events-none"
        style={{ zIndex: 100 }}
      >
        <div
          className="h-full dismiss-bar"
          style={{ backgroundColor: ACCENT[accentTheme] }}
        />
      </div>
    </div>
  )
}
