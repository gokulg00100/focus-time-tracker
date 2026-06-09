/**
 * Centralised theme configuration.
 * Every visual, audio, and behavioural property for each theme is defined here.
 * Components import from this file instead of scattering constants.
 */

import type { AccentTheme } from '../types'

// ─── Theme token interface ────────────────────────────────────────────────────

/**
 * Semantic colour tokens for one mode (light or dark).
 * Every value is a plain hex string so it can be used directly in SVG
 * `fill`/`stroke` attributes, inline `style` props, and CSS custom properties.
 *
 * WCAG compliance target:
 *   timerText vs background  ≥ 7 : 1  (AAA for normal text, far above AA for
 *                                       large text) — verified per theme below.
 */
export interface ThemeTokens {
  /** Full CSS `background` value for the page (may include gradients). */
  background: string
  /** Solid colour for cards / panels. */
  surface: string
  /** Primary accent — used for interactive elements, active rings, etc. */
  primary: string
  /** Secondary accent — lighter hover / subsidiary elements. */
  secondary: string
  /** High-contrast body text. */
  textPrimary: string
  /** Medium-contrast muted text. */
  textSecondary: string
  /**
   * Colour for the large timer digits.
   * Must pass WCAG AA (4.5 : 1) against `background`; ideally AAA (7 : 1).
   */
  timerText: string
  /** Progress-arc fill colour (may differ from `primary` for dark mode). */
  timerRing: string
  /** Subtle background arc behind the progress arc. */
  timerTrack: string
}

// ─── Sub-type interfaces ──────────────────────────────────────────────────────

export type TimerStyle = 'circular' | 'speedometer' | 'stadium'

export interface ThemeTimerConfig {
  style: TimerStyle
  /** Stroke width for the progress ring / arc (px) */
  strokeWidth: number
  /** Enable the drop-shadow glow filter on the progress arc */
  glow: boolean
}

export type AnimationStyle = 'gentle' | 'racing' | 'stadium'

export interface ThemeAnimConfig {
  style: AnimationStyle
  /** Pulsing glow ring around the timer in idle state */
  idlePulse: boolean
  /** Decorative background particle / pattern animation */
  bgMotion: boolean
}

export type SynthType = 'engine' | 'tick' | 'none'

export interface ThemeSoundConfig {
  available: boolean
  synthType: SynthType
  label: string
  description: string
}

// ─── Full theme definition ────────────────────────────────────────────────────

export interface ThemeDef {
  id: AccentTheme
  name: string
  tagline: string
  emoji: string

  /**
   * RGB channel triplets (no #) for the CSS custom property scale.
   * Index order: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
   */
  primaryScale: readonly string[]

  /** Hex colours used in static SVG / JS contexts (can't read CSS vars there) */
  hex: {
    p500: string   // primary active
    p400: string   // lighter accent
    p600: string   // darker accent
    p900: string   // deep background accent
    trail: string  // subtle ring track
  }

  /** Full CSS `background` declarations (gradient + colour) */
  backgrounds: {
    light: string
    dark: string
  }

  /**
   * Semantic colour tokens — one set for light mode, one for dark.
   * Use `getTokens(def, isDark)` to resolve to the correct set.
   */
  tokens: {
    light: ThemeTokens
    dark: ThemeTokens
  }

  timer: ThemeTimerConfig
  animations: ThemeAnimConfig
  sound: ThemeSoundConfig
}

// ─── Theme definitions ────────────────────────────────────────────────────────

export const THEMES: Record<AccentTheme, ThemeDef> = {
  // ── Classic ──────────────────────────────────────────────────────────────
  classic: {
    id: 'classic',
    name: 'Classic',
    tagline: 'Clean, focused, timeless.',
    emoji: '⚡',

    primaryScale: [
      '238 242 255', // 50
      '224 231 255', // 100
      '199 210 254', // 200
      '165 180 252', // 300
      '129 140 248', // 400
      '99 102 241',  // 500
      '79 70 229',   // 600
      '67 56 202',   // 700
      '55 48 163',   // 800
      '49 46 129',   // 900
      '30 27 75',    // 950
    ],
    hex: {
      p500: '#6366f1',
      p400: '#818cf8',
      p600: '#4f46e5',
      p900: '#312e81',
      trail: '#1e293b',
    },

    backgrounds: {
      light: '#f8fafc',
      dark:  '#0f172a',
    },

    // Contrast ratios (timerText vs background):
    //   Light: #0f172a on #f8fafc  ≈ 17 : 1 (AAA ✓)
    //   Dark:  #f1f5f9 on #0f172a  ≈ 16 : 1 (AAA ✓)
    tokens: {
      light: {
        background:    '#f8fafc',
        surface:       '#ffffff',
        primary:       '#6366f1',
        secondary:     '#818cf8',
        textPrimary:   '#0f172a',
        textSecondary: '#64748b',
        timerText:     '#0f172a',
        timerRing:     '#6366f1',
        timerTrack:    '#e2e8f0',
      },
      dark: {
        background:    '#0f172a',
        surface:       '#1e293b',
        primary:       '#818cf8',
        secondary:     '#6366f1',
        textPrimary:   '#f1f5f9',
        textSecondary: '#94a3b8',
        timerText:     '#f1f5f9',
        timerRing:     '#818cf8',
        timerTrack:    '#334155',
      },
    },

    timer: {
      style: 'circular',
      strokeWidth: 10,
      glow: true,
    },
    animations: {
      style: 'gentle',
      idlePulse: true,
      bgMotion: false,
    },
    sound: {
      available: true,
      synthType: 'tick',
      label: 'Metronome tick',
      description: 'A soft, rhythmic tick every second to keep you in flow.',
    },
  },

  // ── F1 Racing ─────────────────────────────────────────────────────────────
  f1: {
    id: 'f1',
    name: 'F1 Racing',
    tagline: 'Every millisecond counts.',
    emoji: '🏎️',

    primaryScale: [
      '255 244 244', // 50
      '255 222 222', // 100
      '255 188 188', // 200
      '255 145 145', // 300
      '255 94 94',   // 400
      '225 6 0',     // 500  ← Ferrari red
      '197 0 0',     // 600
      '162 0 0',     // 700
      '130 0 0',     // 800
      '100 0 0',     // 900
      '65 0 0',      // 950
    ],
    hex: {
      p500: '#e10600',
      p400: '#ff5e5e',
      p600: '#c50000',
      p900: '#640000',
      trail: '#1a0000',
    },

    backgrounds: {
      light: [
        'radial-gradient(ellipse 90% 50% at 50% -5%, rgba(225,6,0,0.07) 0%, transparent 60%)',
        '#fafafa',
      ].join(', '),
      dark: [
        'radial-gradient(ellipse 80% 45% at 50% 0%, rgba(225,6,0,0.14) 0%, transparent 65%)',
        'radial-gradient(ellipse 40% 25% at 90% 55%, rgba(225,6,0,0.06) 0%, transparent 50%)',
        // Carbon-fibre diagonal weave
        'repeating-linear-gradient(-45deg, transparent 0px, transparent 11px, rgba(255,255,255,0.012) 11px, rgba(255,255,255,0.012) 12px)',
        'repeating-linear-gradient( 45deg, transparent 0px, transparent 11px, rgba(255,255,255,0.012) 11px, rgba(255,255,255,0.012) 12px)',
        '#0a0a0a',
      ].join(', '),
    },

    // Contrast ratios (timerText vs background):
    //   Light: #0a0a0a on #fafafa  ≈ 20 : 1 (AAA ✓)
    //   Dark:  #ffffff on #0a0a0a  = 21 : 1 (AAA ✓)
    tokens: {
      light: {
        background:    '#fafafa',
        surface:       '#ffffff',
        primary:       '#e10600',
        secondary:     '#ff5e5e',
        textPrimary:   '#0a0a0a',
        textSecondary: '#525252',
        timerText:     '#0a0a0a',   // near-black on near-white
        timerRing:     '#e10600',
        timerTrack:    '#e5e7eb',
      },
      dark: {
        background:    '#0a0a0a',
        surface:       '#161616',
        primary:       '#e10600',
        secondary:     '#ff5e5e',
        textPrimary:   '#ffffff',
        textSecondary: '#a0a0a0',
        timerText:     '#ffffff',   // white on near-black (F1 spec)
        timerRing:     '#e10600',
        timerTrack:    '#2a0000',
      },
    },

    timer: {
      style: 'speedometer',
      strokeWidth: 14,
      glow: true,
    },
    animations: {
      style: 'racing',
      idlePulse: true,
      bgMotion: true,
    },
    sound: {
      available: true,
      synthType: 'engine',
      label: 'Engine hum',
      description: 'A low-frequency engine idle that fades in as you focus.',
    },
  },

  // ── FIFA World Cup ────────────────────────────────────────────────────────
  fifa: {
    id: 'fifa',
    name: 'World Cup',
    tagline: 'Champions are made in training.',
    emoji: '⚽',

    primaryScale: [
      '240 253 244', // 50
      '220 252 231', // 100
      '187 247 208', // 200
      '134 239 172', // 300
      '74 222 128',  // 400
      '34 197 94',   // 500  ← championship green
      '22 163 74',   // 600
      '21 128 61',   // 700
      '22 101 52',   // 800
      '20 83 45',    // 900
      '5 46 22',     // 950
    ],
    hex: {
      p500: '#22c55e',
      p400: '#4ade80',
      p600: '#16a34a',
      p900: '#14532d',
      trail: '#052e16',
    },

    backgrounds: {
      light: [
        'radial-gradient(ellipse 100% 40% at 50% -5%, rgba(34,197,94,0.07) 0%, transparent 55%)',
        // Alternating pitch stripes
        'repeating-linear-gradient(0deg, rgba(34,197,94,0.025) 0px, rgba(34,197,94,0.025) 60px, transparent 60px, transparent 120px)',
        '#f7fff9',
      ].join(', '),
      dark: [
        'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(34,197,94,0.12) 0%, transparent 55%)',
        'radial-gradient(ellipse 50% 30% at 10% 60%, rgba(34,197,94,0.05) 0%, transparent 50%)',
        // Pitch stripe pattern
        'repeating-linear-gradient(0deg, rgba(34,197,94,0.025) 0px, rgba(34,197,94,0.025) 60px, rgba(21,128,61,0.03) 60px, rgba(21,128,61,0.03) 120px)',
        '#071a0e',
      ].join(', '),
    },

    // Contrast ratios (timerText vs background):
    //   Light: #14532d on #f7fff9  ≈ 11 : 1 (AAA ✓) — dark green on near-white
    //   Dark:  #f0fdf4 on #071a0e  ≈ 17 : 1 (AAA ✓) — near-white on very dark green
    tokens: {
      light: {
        background:    '#f7fff9',
        surface:       '#ffffff',
        primary:       '#22c55e',
        secondary:     '#4ade80',
        textPrimary:   '#14532d',
        textSecondary: '#166534',
        timerText:     '#14532d',   // dark forest-green on light bg (FIFA spec)
        timerRing:     '#22c55e',
        timerTrack:    '#bbf7d0',
      },
      dark: {
        background:    '#071a0e',
        surface:       '#0d2818',
        primary:       '#4ade80',
        secondary:     '#22c55e',
        textPrimary:   '#f0fdf4',
        textSecondary: '#86efac',
        timerText:     '#f0fdf4',
        timerRing:     '#4ade80',
        timerTrack:    '#14532d',
      },
    },

    timer: {
      style: 'stadium',
      strokeWidth: 16,
      glow: true,
    },
    animations: {
      style: 'stadium',
      idlePulse: true,
      bgMotion: true,
    },
    sound: {
      available: false,
      synthType: 'none',
      label: 'No ambient sound',
      description: 'Stay in the zone with silence.',
    },
  },
}

/** Return the full theme definition for an accent id. */
export function getTheme(id: AccentTheme): ThemeDef {
  return THEMES[id]
}

/**
 * Resolve the correct token set for the active light / dark mode.
 *
 * @example
 * const tokens = getTokens(THEMES['f1'], isDark)
 * // tokens.timerText → '#ffffff' in dark mode, '#0a0a0a' in light mode
 */
export function getTokens(def: ThemeDef, isDark: boolean): ThemeTokens {
  return isDark ? def.tokens.dark : def.tokens.light
}
