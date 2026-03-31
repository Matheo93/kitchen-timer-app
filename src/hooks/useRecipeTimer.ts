'use client'

import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react'
import type { Recipe, TimerState } from '@/types/recipe'

interface TimerHookReturn {
  currentStepIndex: number
  stepTimeRemaining: number
  totalTimeElapsed: number
  timerState: TimerState
  stepProgress: number
  totalProgress: number
  start: () => void
  pause: () => void
  resume: () => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
  skipToStep: (index: number) => void
}

export function useRecipeTimer(recipe: Recipe | null): TimerHookReturn {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  // stepTimeRemaining in milliseconds for accuracy
  const [stepTimeMs, setStepTimeMs] = useState(0)
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0)
  const [timerState, setTimerState] = useState<TimerState>('idle')

  const rafRef = useRef<number>(0)
  const lastTickRef = useRef<number>(0)
  const stateRef = useRef(timerState)
  const stepIdxRef = useRef(currentStepIndex)
  const stepTimeMsRef = useRef(stepTimeMs)
  const totalElapsedRef = useRef(totalTimeElapsed)
  const recipeRef = useRef(recipe)

  // Keep refs in sync — useLayoutEffect runs synchronously after paint, before next RAF tick
  useLayoutEffect(() => {
    stateRef.current = timerState
    stepIdxRef.current = currentStepIndex
    stepTimeMsRef.current = stepTimeMs
    totalElapsedRef.current = totalTimeElapsed
    recipeRef.current = recipe
  })

  // Initialize when recipe changes
  useEffect(() => {
    if (!recipe) return
    const initialMs = (recipe.steps[0]?.durationSeconds ?? 0) * 1000
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentStepIndex(0)
    setStepTimeMs(initialMs)
    setTotalTimeElapsed(0)
    setTimerState('idle')
  }, [recipe])

  // RAF-based accurate timer
  useEffect(() => {
    if (timerState !== 'running') {
      cancelAnimationFrame(rafRef.current)
      return
    }

    lastTickRef.current = performance.now()

    function tick(now: number) {
      const delta = now - lastTickRef.current
      lastTickRef.current = now

      const currentRecipe = recipeRef.current
      if (!currentRecipe) return

      setStepTimeMs((prev) => {
        const next = prev - delta
        if (next <= 0) {
          // Advance step
          const nextIdx = stepIdxRef.current + 1
          if (nextIdx >= currentRecipe.steps.length) {
            setTimerState('completed')
            setTotalTimeElapsed((t) => t + Math.round((prev + delta) / 1000))
            return 0
          }
          setCurrentStepIndex(nextIdx)
          const nextMs = (currentRecipe.steps[nextIdx]?.durationSeconds ?? 0) * 1000
          setTotalTimeElapsed((t) => t + Math.round((prev + delta) / 1000))
          return nextMs + next // overshoot carries forward
        }
        return next
      })

      if (stateRef.current === 'running') {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [timerState])

  const start = useCallback(() => {
    if (!recipe) return
    setTimerState('running')
  }, [recipe])

  const pause = useCallback(() => {
    if (stateRef.current === 'running') {
      cancelAnimationFrame(rafRef.current)
      setTimerState('paused')
    }
  }, [])

  const resume = useCallback(() => {
    if (stateRef.current === 'paused') setTimerState('running')
  }, [])

  const nextStep = useCallback(() => {
    if (!recipe) return
    const nextIdx = stepIdxRef.current + 1
    if (nextIdx >= recipe.steps.length) {
      setTimerState('completed')
      return
    }
    setCurrentStepIndex(nextIdx)
    setStepTimeMs((recipe.steps[nextIdx]?.durationSeconds ?? 0) * 1000)
  }, [recipe])

  const prevStep = useCallback(() => {
    if (!recipe || stepIdxRef.current === 0) return
    const prevIdx = stepIdxRef.current - 1
    setCurrentStepIndex(prevIdx)
    setStepTimeMs((recipe.steps[prevIdx]?.durationSeconds ?? 0) * 1000)
  }, [recipe])

  const skipToStep = useCallback((index: number) => {
    if (!recipe || index < 0 || index >= recipe.steps.length) return
    setCurrentStepIndex(index)
    setStepTimeMs((recipe.steps[index]?.durationSeconds ?? 0) * 1000)
  }, [recipe])

  const reset = useCallback(() => {
    if (!recipe) return
    cancelAnimationFrame(rafRef.current)
    setCurrentStepIndex(0)
    setStepTimeMs((recipe.steps[0]?.durationSeconds ?? 0) * 1000)
    setTotalTimeElapsed(0)
    setTimerState('idle')
  }, [recipe])

  const currentStep = recipe?.steps[currentStepIndex]
  const stepDurationMs = (currentStep?.durationSeconds ?? 1) * 1000
  const stepTimeRemaining = Math.ceil(stepTimeMs / 1000)
  const stepProgress = currentStep
    ? Math.max(0, Math.min(1, (stepDurationMs - stepTimeMs) / stepDurationMs))
    : 0

  const totalProgress = recipe
    ? Math.max(0, Math.min(1, totalTimeElapsed / recipe.totalTimeSeconds))
    : 0

  return {
    currentStepIndex,
    stepTimeRemaining,
    totalTimeElapsed,
    timerState,
    stepProgress,
    totalProgress,
    start,
    pause,
    resume,
    nextStep,
    prevStep,
    reset,
    skipToStep,
  }
}
