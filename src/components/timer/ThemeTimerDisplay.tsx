/**
 * ThemeTimerDisplay
 *
 * Central dispatch for all three timer variants.
 *
 * Responsibilities:
 *   1. Resolves the correct semantic token set for the active accent + mode.
 *   2. Detects desktop breakpoint and chooses an appropriate display size.
 *   3. Passes token-derived colour props to each variant so they never rely
 *      on hardcoded or hardwired colour values.
 *
 * Timer variants:
 *   classic  → circular ring  (TimerDisplay / CircularProgress)
 *   f1       → speedometer    (F1TimerDisplay)
 *   fifa     → stadium rings  (FIFATimerDisplay)
 */

import { useState, useEffect } from 'react'
import type { TimerStatus, AccentTheme } from '../../types'
import { TimerDisplay }     from './TimerDisplay'
import { F1TimerDisplay }   from './F1TimerDisplay'
import { FIFATimerDisplay } from './FIFATimerDisplay'
import { THEMES, getTokens } from '../../config/themes'

// ── Responsive breakpoint hook ────────────────────────────────────────────────

function useIsDesktop(): boolean {
  const [v, setV] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(min-width: 768px)').matches
      : false
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const h  = (e: MediaQueryListEvent) => setV(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])
  return v
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface ThemeTimerDisplayProps {
  status:              TimerStatus
  remainingFocusSecs:  number
  elapsedFocusSecs:    number
  progress:            number
  breakRemaining:      number
  breakProgress:       number
  plannedDurationSecs: number
  accentTheme:         AccentTheme
  /** Whether the app is currently in dark mode — used for token resolution. */
  isDark:              boolean
}

// ── Responsive size config ────────────────────────────────────────────────────
// Desktop sizes are 60-65 % larger than mobile sizes.

const SIZES = {
  // CircularProgress px diameter
  circular: { mobile: 260, desktop: 430 },
  // Tailwind-compatible container widths (SVG fills the container via w-full)
  svg: {
    f1:   { mobile: 'w-[260px]', desktop: 'md:w-[430px]' },
    fifa: { mobile: 'w-[260px]', desktop: 'md:w-[430px]' },
  },
} as const

// ── Component ─────────────────────────────────────────────────────────────────

export function ThemeTimerDisplay({
  accentTheme,
  isDark,
  ...rest
}: ThemeTimerDisplayProps) {
  const isDesktop = useIsDesktop()
  const def       = THEMES[accentTheme]
  const tokens    = getTokens(def, isDark)

  switch (accentTheme) {
    case 'f1':
      return (
        <div className={`${SIZES.svg.f1.mobile} ${SIZES.svg.f1.desktop}`}>
          <F1TimerDisplay
            timerTextColor={tokens.timerText}
            timerTrackColor={tokens.timerTrack}
            accentHex={tokens.timerRing}
            {...rest}
          />
        </div>
      )

    case 'fifa':
      return (
        <div className={`${SIZES.svg.fifa.mobile} ${SIZES.svg.fifa.desktop}`}>
          <FIFATimerDisplay
            timerTextColor={tokens.timerText}
            timerTrackColor={tokens.timerTrack}
            accentHex={tokens.timerRing}
            {...rest}
          />
        </div>
      )

    case 'classic':
    default:
      return (
        <TimerDisplay
          size={isDesktop ? SIZES.circular.desktop : SIZES.circular.mobile}
          timerTextColor={tokens.timerText}
          timerRingColor={tokens.timerRing}
          timerTrackColor={tokens.timerTrack}
          {...rest}
        />
      )
  }
}
