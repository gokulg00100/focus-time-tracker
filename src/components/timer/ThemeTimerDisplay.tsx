/**
 * ThemeTimerDisplay — renders the correct timer variant for the active accent theme.
 *
 * Classic  → standard circular ring  (TimerDisplay / CircularProgress)
 * F1       → speedometer arc gauge   (F1TimerDisplay)
 * FIFA     → stadium dual-ring       (FIFATimerDisplay)
 *
 * All three share the same prop interface so this wrapper is a simple switch.
 */

import type { TimerStatus, AccentTheme } from '../../types'
import { TimerDisplay }    from './TimerDisplay'
import { F1TimerDisplay }  from './F1TimerDisplay'
import { FIFATimerDisplay } from './FIFATimerDisplay'
import { THEMES }          from '../../config/themes'

interface ThemeTimerDisplayProps {
  status:              TimerStatus
  remainingFocusSecs:  number
  elapsedFocusSecs:    number
  progress:            number
  breakRemaining:      number
  breakProgress:       number
  plannedDurationSecs: number
  accentTheme:         AccentTheme
}

export function ThemeTimerDisplay({
  accentTheme,
  ...rest
}: ThemeTimerDisplayProps) {
  const def        = THEMES[accentTheme]
  const accentHex  = def.hex.p500

  switch (accentTheme) {
    case 'f1':
      return (
        <F1TimerDisplay
          accentHex={accentHex}
          {...rest}
        />
      )

    case 'fifa':
      return (
        <FIFATimerDisplay
          accentHex={accentHex}
          {...rest}
        />
      )

    case 'classic':
    default:
      return (
        <TimerDisplay {...rest} />
      )
  }
}
