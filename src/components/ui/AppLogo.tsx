/**
 * AppLogo — the Focus Timer brand mark.
 *
 * Shape: partial ring (300° arc) with an upward chevron at the top and a
 * centre dot. Matches the brand identity sheet.
 *
 * Variants:
 *   'gradient' — indigo gradient stroke/fill (use on white/light backgrounds)
 *   'white'    — all white (use on coloured/dark backgrounds)
 */

interface AppLogoProps {
  size?: number
  variant?: 'gradient' | 'white'
  /** Optional id suffix to avoid duplicate SVG gradient IDs on a single page */
  id?: string
}

export function AppLogo({ size = 32, variant = 'gradient', id = 'a' }: AppLogoProps) {
  const gradId = `ftLogo_${id}`
  const color = variant === 'white' ? 'white' : `url(#${gradId})`

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      aria-label="Focus Timer logo"
    >
      {variant === 'gradient' && (
        <defs>
          <linearGradient id={gradId} x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
        </defs>
      )}

      {/*
        Ring arc (300°) + chevron at the top, drawn as one closed path.
        Centre (50,57), radius 31.
        Arc endpoints at 300° and 240° (SVG: 0°=right, 90°=down):
          300°: (65.5, 30.2)   240°: (34.5, 30.2)
        Chevron peak: (50, 10)
        Path: start at upper-right arc-end → large clockwise arc → upper-left
              arc-end → line up to peak → Z closes back to upper-right.
      */}
      <path
        d="M 65.5,30.2 A 31,31 0 1 1 34.5,30.2 L 50,10 Z"
        stroke={color}
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Centre dot */}
      <circle cx="50" cy="57" r="5.5" fill={color} />
    </svg>
  )
}
