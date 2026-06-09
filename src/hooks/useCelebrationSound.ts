/**
 * useCelebrationSound
 * ───────────────────
 * Synthesises a one-shot celebration sound effect for each theme using the
 * Web Audio API — no audio files required.
 *
 *   F1      → Rising sawtooth engine rev (800 Hz → 3200 Hz + second peak)
 *   FIFA    → White-noise crowd roar through a bandpass filter
 *   Classic → Soft A-major arpeggio chime (A4 → C#5 → E5)
 *
 * Falls back silently if:
 *   • `enabled` is false (user's sound toggle is off)
 *   • AudioContext creation fails (blocked, or server-side env)
 *   • `prefers-reduced-motion` is set (no audio in silent mode)
 */

import { useRef } from 'react'
import type { AccentTheme } from '../types'

export function useCelebrationSound() {
  const ctxRef = useRef<AudioContext | null>(null)

  /** Call once on the frame the celebration mounts. */
  function play(theme: AccentTheme, enabled: boolean): void {
    if (!enabled) return
    // Respect reduced-motion (audio is often tied to animation intent)
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    } catch { /* ignore */ }

    try {
      if (!ctxRef.current || ctxRef.current.state === 'closed') {
        ctxRef.current = new (
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        )()
      }
      const ctx = ctxRef.current
      if (ctx.state === 'suspended') ctx.resume()

      if (theme === 'f1')   playF1Rev(ctx)
      else if (theme === 'fifa') playFIFACheer(ctx)
      else                       playClassicChime(ctx)
    } catch {
      // Silently ignore — audio is an enhancement, not a requirement
    }
  }

  return { play }
}

// ── F1 engine rev ─────────────────────────────────────────────────────────────
// Two-stage rev: primary sweep 800→3200 Hz, then a second peak at 3000→4500 Hz

function playF1Rev(ctx: AudioContext): void {
  const t = ctx.currentTime

  const master = ctx.createGain()
  master.gain.setValueAtTime(0, t)
  master.gain.linearRampToValueAtTime(0.14, t + 0.04)
  master.gain.setValueAtTime(0.14, t + 0.60)
  master.gain.linearRampToValueAtTime(0, t + 0.90)
  master.connect(ctx.destination)

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(1400, t)
  filter.frequency.linearRampToValueAtTime(6000, t + 0.65)
  filter.connect(master)

  // Primary rev sweep
  const osc1 = ctx.createOscillator()
  osc1.type = 'sawtooth'
  osc1.frequency.setValueAtTime(800, t)
  osc1.frequency.exponentialRampToValueAtTime(3200, t + 0.65)
  osc1.connect(filter)
  osc1.start(t)
  osc1.stop(t + 0.95)

  // Second peak (delayed, simulates gear-shift moment)
  const gain2 = ctx.createGain()
  gain2.gain.setValueAtTime(0, t + 0.70)
  gain2.gain.linearRampToValueAtTime(0.11, t + 0.75)
  gain2.gain.linearRampToValueAtTime(0, t + 1.30)
  gain2.connect(ctx.destination)

  const osc2 = ctx.createOscillator()
  osc2.type = 'sawtooth'
  osc2.frequency.setValueAtTime(3000, t + 0.70)
  osc2.frequency.exponentialRampToValueAtTime(4500, t + 1.20)
  osc2.connect(filter)
  osc2.connect(gain2)
  osc2.start(t + 0.70)
  osc2.stop(t + 1.35)
}

// ── FIFA stadium crowd cheer ──────────────────────────────────────────────────
// White noise + bandpass filter = crowd-texture roar

function playFIFACheer(ctx: AudioContext): void {
  const t        = ctx.currentTime
  const duration = 2.5

  const bufferSize = Math.floor(ctx.sampleRate * duration)
  const buffer     = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data       = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.8
  }

  const source = ctx.createBufferSource()
  source.buffer = buffer

  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.setValueAtTime(700, t)
  bp.Q.setValueAtTime(0.35, t)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(0.18, t + 0.35)
  gain.gain.setValueAtTime(0.18, t + 1.40)
  gain.gain.linearRampToValueAtTime(0, t + duration)

  source.connect(bp)
  bp.connect(gain)
  gain.connect(ctx.destination)
  source.start(t)
}

// ── Classic success chime ─────────────────────────────────────────────────────
// A-major arpeggio: A4 (440 Hz) → C#5 (554 Hz) → E5 (659 Hz)

function playClassicChime(ctx: AudioContext): void {
  const notes = [440, 554.4, 659.3]

  notes.forEach((freq, i) => {
    const startT = ctx.currentTime + i * 0.13
    const osc    = ctx.createOscillator()
    const gain   = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, startT)

    gain.gain.setValueAtTime(0, startT)
    gain.gain.linearRampToValueAtTime(0.11, startT + 0.018)
    gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.9)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(startT)
    osc.stop(startT + 1.0)
  })
}
