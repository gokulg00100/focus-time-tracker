/**
 * Centralised theme configuration.
 * Every visual, audio, and behavioural property for each theme is defined here.
 * Components import from this file instead of scattering constants.
 */

import type { AccentTheme } from '../types'

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

/** Helper: get the definition for the current accent theme from settings. */
export function getTheme(id: AccentTheme): ThemeDef {
  return THEMES[id]
}
