/**
 * AppLogo — Focus Timer brand mark.
 *
 * Geometry (100×100 viewBox):
 *   Ring: centre (50,57), radius 32, 300° arc (60° gap centred at 12 o'clock)
 *   Arc endpoints: SVG 300° → (66, 29.3)  SVG 240° → (34, 29.3)
 *   Chevron: both endpoints meet at peak (50, 7)
 *   Centre dot: cx 50, cy 57, r 5.5
 *
 * Variants:
 *   'gradient' — indigo #818CF8 → #4F46E5 (light backgrounds)
 *   'white'    — solid white (coloured/dark backgrounds)
 */

interface AppLogoProps {
  size?: number
  variant?: 'gradient' | 'white'
  id?: string
}

export function AppLogo({ size = 32, variant = 'gradient', id = 'a' }: AppLogoProps) {
  const gid = `ftg_${id}`
  const paint = variant === 'white' ? 'white' : `url(#${gid})`

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} fill="none" aria-label="Focus Timer">
      {variant === 'gradient' && (
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M66,29.3 A32,32 0 1 1 34,29.3 L50,7 Z"
        stroke={paint}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="57" r="5.5" fill={paint} />
    </svg>
  )
}
