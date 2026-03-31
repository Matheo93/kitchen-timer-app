'use client'

/**
 * useHaptics — wraps navigator.vibrate for mobile haptic feedback.
 * Gracefully degrades when the Vibration API is not available.
 */
export function useHaptics() {
  function vibrate(pattern: number | number[]) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern)
      } catch {
        // Vibration API not available or permission denied — silent fail
      }
    }
  }

  return {
    /** Short tap (30ms) — button press feedback */
    tap: () => vibrate(30),
    /** Step complete — two pulses */
    stepComplete: () => vibrate([60, 40, 60]),
    /** Recipe finished — celebratory triple pulse */
    finish: () => vibrate([80, 50, 80, 50, 120]),
    /** Warning — urgent single buzz */
    warning: () => vibrate(200),
  }
}
