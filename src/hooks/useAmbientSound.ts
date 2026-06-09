/**
 * useAmbientSound — Web Audio API ambient sound for theme immersion.
 *
 * Supported synth types:
 *   'engine' (F1) — sawtooth oscillator at ~80 Hz with a slow LFO on gain,
 *                   simulating a parked race-car idle.
 *   'tick'   (Classic) — brief sine burst every second, like a soft metronome.
 *   'none'   (FIFA) — silent; hook is a no-op.
 *
 * Sound plays only when:
 *   - `timerRunning` is true
 *   - `ambientSoundEnabled` is true in settings
 *   - The SynthType for the current accent theme is not 'none'
 */

import { useEffect, useRef } from 'react'
import type { SynthType } from '../config/themes'

interface UseAmbientSoundOptions {
  synthType:     SynthType
  enabled:       boolean   // from settings.ambientSoundEnabled
  timerRunning:  boolean
}

export function useAmbientSound({ synthType, enabled, timerRunning }: UseAmbientSoundOptions) {
  const ctxRef    = useRef<AudioContext | null>(null)
  const stopRef   = useRef<(() => void) | null>(null)
  const tickRef   = useRef<ReturnType<typeof setInterval> | null>(null)

  const shouldPlay = enabled && timerRunning && synthType !== 'none'

  useEffect(() => {
    if (!shouldPlay) {
      // Stop whatever is playing
      stopRef.current?.()
      stopRef.current = null
      if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null }
      return
    }

    // Lazily create AudioContext (browsers block creation before user gesture;
    // the timer start button IS a user gesture so we're safe here).
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      try {
        ctxRef.current = new (window.AudioContext || (window as never as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      } catch {
        return // audio not available (e.g. server-side render / test env)
      }
    }

    const ctx = ctxRef.current
    if (ctx.state === 'suspended') ctx.resume()

    if (synthType === 'engine') {
      stopRef.current = startEngine(ctx)
    } else if (synthType === 'tick') {
      stopRef.current = startTick(ctx, tickRef)
    }

    return () => {
      stopRef.current?.()
      stopRef.current = null
      if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldPlay, synthType])

  // Clean up AudioContext on unmount
  useEffect(() => {
    return () => {
      stopRef.current?.()
      if (tickRef.current) clearInterval(tickRef.current)
      ctxRef.current?.close()
    }
  }, [])
}

// ─── Engine hum (F1) ─────────────────────────────────────────────────────────

function startEngine(ctx: AudioContext): () => void {
  const masterGain = ctx.createGain()
  masterGain.gain.setValueAtTime(0, ctx.currentTime)
  masterGain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 1.5) // fade in
  masterGain.connect(ctx.destination)

  // Primary saw oscillator — engine fundamental
  const osc1 = ctx.createOscillator()
  osc1.type = 'sawtooth'
  osc1.frequency.setValueAtTime(80, ctx.currentTime)

  // Second oscillator one octave up — harmonic richness
  const osc2 = ctx.createOscillator()
  osc2.type = 'sawtooth'
  osc2.frequency.setValueAtTime(160, ctx.currentTime)

  // Low-pass filter — tame the harshness
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(400, ctx.currentTime)
  filter.Q.setValueAtTime(2, ctx.currentTime)

  // Very slow LFO on master gain (0.12 Hz) — idle lurch
  const lfo = ctx.createOscillator()
  lfo.type = 'sine'
  lfo.frequency.setValueAtTime(0.12, ctx.currentTime)
  const lfoGain = ctx.createGain()
  lfoGain.gain.setValueAtTime(0.015, ctx.currentTime)
  lfo.connect(lfoGain)
  lfoGain.connect(masterGain.gain)

  osc1.connect(filter)
  osc2.connect(filter)
  filter.connect(masterGain)

  osc1.start(); osc2.start(); lfo.start()

  return () => {
    const t = ctx.currentTime
    masterGain.gain.linearRampToValueAtTime(0, t + 0.4)
    setTimeout(() => {
      try { osc1.stop(); osc2.stop(); lfo.stop() } catch { /* already stopped */ }
    }, 500)
  }
}

// ─── Metronome tick (Classic) ─────────────────────────────────────────────────

function startTick(ctx: AudioContext, tickRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>): () => void {
  let stopped = false

  const playTick = () => {
    if (stopped || ctx.state === 'closed') return
    const t = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, t)

    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.08, t + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.12)
  }

  // Align to the next full second, then tick every 1000 ms
  const msUntilNextSec = 1000 - (Date.now() % 1000)
  const timeout = setTimeout(() => {
    if (!stopped) {
      playTick()
      tickRef.current = setInterval(() => { if (!stopped) playTick() }, 1000)
    }
  }, msUntilNextSec)

  return () => {
    stopped = true
    clearTimeout(timeout)
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null }
  }
}
