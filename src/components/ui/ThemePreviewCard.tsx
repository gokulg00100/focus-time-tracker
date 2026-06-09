import { Check } from 'lucide-react'
import type { AccentTheme } from '../../types'

// ── Static accent hex values (needed for SVG attribute rendering) ────────────
const ACCENT_HEX: Record<AccentTheme, string> = {
  classic: '#6366f1',
  f1:      '#e10600',
  fifa:    '#22c55e',
}

/** Convert #rrggbb → "r, g, b" string for use inside rgba() */
function hexRgb(hex: string): string {
  const n = parseInt(hex.replace('#', ''), 16)
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
}

// ── Mini SVG app mockup ──────────────────────────────────────────────────────
function MiniPreview({ accent, isDark }: { accent: string; isDark: boolean }) {
  const bg      = isDark ? '#0f172a' : '#ffffff'
  const sidebar = isDark ? '#1e293b' : '#f1f5f9'
  const navDim  = isDark ? '#334155' : '#cbd5e1'
  const ringBg  = isDark ? '#1e293b' : '#e2e8f0'
  const text    = isDark ? '#f1f5f9' : '#1e293b'

  // Timer ring geometry  (viewBox 140×90)
  // Circle centre: x=87, y=52  r=21  → circumference ≈ 131.9
  // Showing ~75 % progress: dashoffset = 131.9 × 0.25 ≈ 33
  return (
    <svg viewBox="0 0 140 90" width="100%" style={{ display: 'block' }} aria-hidden>
      {/* ── Base ── */}
      <rect width="140" height="90" fill={bg} />

      {/* ── Header ── */}
      <rect width="140" height="15" fill={accent} />
      {/* Title pill */}
      <rect x="8" y="5" width="38" height="5" rx="2.5" fill="rgba(255,255,255,0.75)" />
      {/* Avatar circles */}
      <circle cx="120" cy="7.5" r="4" fill="rgba(255,255,255,0.45)" />
      <circle cx="131" cy="7.5" r="4" fill="rgba(255,255,255,0.45)" />

      {/* ── Sidebar ── */}
      <rect x="0" y="15" width="30" height="75" fill={sidebar} />
      {[22, 32, 42, 52, 62].map((y, i) => (
        <rect key={y} x="5" y={y} width={i === 0 ? 20 : 16} height="4" rx="2"
          fill={i === 0 ? accent : navDim}
          opacity={i === 0 ? 1 : 0.6}
        />
      ))}

      {/* ── Timer ring ── */}
      {/* Track */}
      <circle cx="87" cy="52" r="21" fill="none" stroke={ringBg} strokeWidth="5" />
      {/* Progress arc */}
      <circle cx="87" cy="52" r="21" fill="none" stroke={accent} strokeWidth="5"
        strokeDasharray="131.9" strokeDashoffset="33"
        transform="rotate(-90 87 52)" strokeLinecap="round"
      />
      {/* Inner fill (creates ring effect) */}
      <circle cx="87" cy="52" r="16" fill={bg} />
      {/* Time */}
      <text x="87" y="50.5" textAnchor="middle" fill={text}
        fontSize="6.5" fontWeight="700" fontFamily="Inter,system-ui,sans-serif">
        25:00
      </text>
      {/* Label */}
      <text x="87" y="59" textAnchor="middle" fill={accent}
        fontSize="4" fontWeight="600" fontFamily="Inter,system-ui,sans-serif" letterSpacing="0.8">
        FOCUS
      </text>

      {/* ── Start button ── */}
      <rect x="62" y="80" width="50" height="7" rx="3.5" fill={accent} opacity="0.9" />
      <rect x="74" y="82.5" width="26" height="2" rx="1" fill="rgba(255,255,255,0.75)" />
    </svg>
  )
}

// ── Public component ─────────────────────────────────────────────────────────
interface ThemePreviewCardProps {
  id:         AccentTheme
  label:      string
  emoji:      string
  isDark:     boolean
  isSelected: boolean
  onClick:    () => void
}

export function ThemePreviewCard({
  id, label, emoji, isDark, isSelected, onClick,
}: ThemePreviewCardProps) {
  const accent = ACCENT_HEX[id]
  const rgb    = hexRgb(accent)

  return (
    <button
      onClick={onClick}
      className="flex flex-col gap-2 p-2 rounded-2xl border-2 transition-all duration-200 w-full text-left hover:scale-[1.02] active:scale-[0.98]"
      style={{
        borderColor:     isSelected ? accent : isDark ? '#334155' : '#e2e8f0',
        backgroundColor: isSelected ? `rgba(${rgb}, 0.07)` : 'transparent',
        boxShadow:       isSelected ? `0 0 0 4px rgba(${rgb}, 0.15)` : undefined,
      }}
    >
      {/* Preview mockup */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          boxShadow: isDark
            ? '0 2px 8px rgba(0,0,0,0.5)'
            : '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <MiniPreview accent={accent} isDark={isDark} />
      </div>

      {/* Label row */}
      <div className="flex items-center justify-between px-0.5">
        <span className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          {emoji}&nbsp;{label}
        </span>
        {isSelected && (
          <span
            className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: accent }}
          >
            <Check className="w-2.5 h-2.5 text-white" />
          </span>
        )}
      </div>
    </button>
  )
}
