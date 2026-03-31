'use client'

import { useCallback, useRef } from 'react'

export function useStepCompleteSound() {
  const audioCtxRef = useRef<AudioContext | null>(null)

  const playComplete = useCallback(() => {
    try {
      if (typeof window === 'undefined') return
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioContext()
      }
      const ctx = audioCtxRef.current

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
  }, [])

  const playFinish = useCallback(() => {
    try {
      if (typeof window === 'undefined') return
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioContext()
      }
      const ctx = audioCtxRef.current

      // Victory chord C-E-G
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
  }, [])

  return { playComplete, playFinish }
}
