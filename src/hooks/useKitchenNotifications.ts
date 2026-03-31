'use client'

import { useEffect, useCallback } from 'react'

/**
 * useKitchenNotifications — push notifications for step completion.
 * Requests permission on first use and sends notifications when steps complete.
 * Gracefully degrades when Notifications API is unavailable.
 *
 * Also registers the service worker for offline support.
 */
export function useKitchenNotifications() {
  // Register service worker on mount
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW registration failed — non-fatal, app still works online
    })
  }, [])

  const notifyStepComplete = useCallback(async (stepTitle: string, stepNumber: number) => {
    if (typeof Notification === 'undefined') return
    if (Notification.permission === 'denied') return

    if (Notification.permission === 'default') {
      const perm = await Notification.requestPermission().catch(() => 'denied')
      if (perm !== 'granted') return
    }

    try {
      new Notification(`Step ${stepNumber} complete`, {
        body: stepTitle,
        icon: '/manifest.json',
        tag: 'step-complete',
        requireInteraction: false,
        silent: true, // We already play sound + haptic
      })
    } catch {
      // Notification creation failed — non-fatal
    }
  }, [])

  const notifyRecipeComplete = useCallback(async (recipeTitle: string) => {
    if (typeof Notification === 'undefined') return
    if (Notification.permission === 'denied') return

    if (Notification.permission === 'default') {
      const perm = await Notification.requestPermission().catch(() => 'denied')
      if (perm !== 'granted') return
    }

    try {
      new Notification('Recipe complete!', {
        body: `${recipeTitle} is ready to serve.`,
        icon: '/manifest.json',
        tag: 'recipe-complete',
        requireInteraction: true,
      })
    } catch {
      // Notification creation failed — non-fatal
    }
  }, [])

  return { notifyStepComplete, notifyRecipeComplete }
}
