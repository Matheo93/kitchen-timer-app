'use client'

import { useCallback, useRef } from 'react'

export function useStepCompleteSound() {
  const audioCtxRef = useRef<AudioContext | null>(null)

  function getCtx(): AudioContext | null {
    try {
      if (typeof window === 'undefined') return null
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioContext()
      }
      return audioCtxRef.current
    } catch {
      return null
    }
  }

  /**
   * playTick — a soft high-pitched tick for the last 3 seconds of a step.
   * @param urgency 1 (3s left) → 3 (1s left). Higher = more prominent.
   */
  const playTick = useCallback((urgency: 1 | 2 | 3 = 1) => {
    const ctx = getCtx()
    if (!ctx) return
    try {
      const freq = urgency === 1 ? 880 : urgency === 2 ? 1047 : 1319 // A5, C6, E6
      const volume = urgency === 1 ? 0.06 : urgency === 2 ? 0.09 : 0.12
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'triangle'
      osc.frequency.value = freq
      const t = ctx.currentTime
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(volume, t + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
      osc.start(t)
      osc.stop(t + 0.12)
    } catch {
      // silent fail
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * playComplete — gentle two-tone chime C5→E5 when a step completes.
   */
  const playComplete = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    try {
      // Gentle two-tone chime
      const frequencies = [523.25, 659.25] // C5, E5
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.type = 'sine'
        osc.frequency.value = freq
        const startTime = ctx.currentTime + i * 0.15
        gain.gain.setValueAtTime(0, startTime)
        gain.gain.linearRampToValueAtTime(0.18, startTime + 0.04)
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6)
        osc.start(startTime)
        osc.stop(startTime + 0.6)
      })
    } catch {
      // Audio not available — silent fail
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * playFinish — victory C-E-G chord when the entire recipe is complete.
   */
  const playFinish = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    try {
      // Victory chord C5-E5-G5 with staggered entry
      const frequencies = [523.25, 659.25, 783.99]
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.type = 'sine'
        osc.frequency.value = freq
        const startTime = ctx.currentTime + i * 0.1
        gain.gain.setValueAtTime(0, startTime)
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05)
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2)
        osc.start(startTime)
        osc.stop(startTime + 1.2)
      })
    } catch {
      // Audio not available — silent fail
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { playTick, playComplete, playFinish }
}
