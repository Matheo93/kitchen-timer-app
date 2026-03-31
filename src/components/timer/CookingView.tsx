'use client'

import { useState, useEffect, useRef } from 'react'
// framer-motion used in RecipeLibrary delete modal; not needed here
import type { Recipe } from '@/types/recipe'
import { useRecipeTimer } from '@/hooks/useRecipeTimer'
import { useStepCompleteSound } from '@/hooks/useStepCompleteSound'
import { SteamPot } from './SteamPot'
import { TimerControls } from './TimerControls'
import { RecipeRoadmap } from './RecipeRoadmap'
import { renderElapsedLabel } from '@/lib/recipes'
import { type Locale, MESSAGES } from '@/lib/locale'
import { useHaptics } from '@/hooks/useHaptics'
import { useKitchenNotifications } from '@/hooks/useKitchenNotifications'
import { BurnerCoil } from './BurnerCoil'
import { KitchenAtmosphere } from './KitchenAtmosphere'

interface CookingViewProps {
  recipe: Recipe
  onBack: () => void
  locale?: Locale
}

export function CookingView({ recipe, onBack, locale = 'en' }: CookingViewProps) {
  const t = MESSAGES[locale]
  const {
    currentStepIndex,
    stepTimeRemaining,
    timerState,
    stepProgress,
    start,
    pause,
    resume,
    nextStep,
    prevStep,
    reset,
    skipToStep,
  } = useRecipeTimer(recipe)

  const { playComplete, playFinish } = useStepCompleteSound()
  const haptics = useHaptics()
  const { notifyStepComplete, notifyRecipeComplete } = useKitchenNotifications()
  const prevStepRef = useRef(currentStepIndex)
  const prevTimerStateRef = useRef(timerState)
  const [announcement, setAnnouncement] = useState('')
  const [isMuted, setIsMuted] = useState(false)

  // Play sounds on step change or completion
  useEffect(() => {
    if (prevStepRef.current !== currentStepIndex) {
      if (timerState !== 'idle') {
        if (!isMuted) playComplete()
        haptics.stepComplete()
        const step = recipe.steps[currentStepIndex]
        if (step) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setAnnouncement(`${t.cooking.step} ${currentStepIndex + 1}: ${step.title}`)
          notifyStepComplete(step.title, currentStepIndex + 1)
        }
      }
      prevStepRef.current = currentStepIndex
    }
  }, [currentStepIndex, timerState, playComplete, recipe.steps, isMuted, haptics, notifyStepComplete, t.cooking.step])

  useEffect(() => {
    if (prevTimerStateRef.current !== 'completed' && timerState === 'completed') {
      if (!isMuted) playFinish()
      haptics.finish()
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnnouncement(`${recipe.title} — ${t.cooking.recipeComplete}`)
      notifyRecipeComplete(recipe.title)
    }
    prevTimerStateRef.current = timerState
  }, [timerState, playFinish, recipe.title, isMuted, haptics, notifyRecipeComplete, t.cooking.recipeComplete])

  // Keyboard shortcuts
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // Don't intercept if focused on input/button
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault()
          if (timerState === 'idle') start()
          else if (timerState === 'running') pause()
          else if (timerState === 'paused') resume()
          break
        case 'ArrowRight':
        case 'l':
          e.preventDefault()
          if (timerState !== 'idle') nextStep()
          break
        case 'ArrowLeft':
        case 'j':
          e.preventDefault()
          if (timerState !== 'idle') prevStep()
          break
        case 'r':
          e.preventDefault()
          reset()
          break
        case 'Escape':
          onBack()
          break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [timerState, start, pause, resume, nextStep, prevStep, reset, onBack])

  const isComplete = timerState === 'completed'
  const isRunning = timerState === 'running'
  const isPaused = timerState === 'paused'
  const isIdle = timerState === 'idle'

  const currentStep = recipe.steps[currentStepIndex]

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-stone-50 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900">
      {/* Screen reader live region */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
      {/* Keyboard hint (desktop only) */}
      <div className="hidden lg:block fixed bottom-4 right-4 z-50 text-xs text-stone-300 space-y-0.5 text-right pointer-events-none">
        <div>Space — play/pause</div>
        <div>← → — steps</div>
        <div>R — reset &nbsp; Esc — back</div>
      </div>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-amber-50/80 dark:bg-stone-900/80 backdrop-blur-sm border-b border-amber-100 dark:border-stone-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label={locale === 'fr' ? 'Retour au choix de recette' : 'Back to recipe selection'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-stone-800 dark:text-stone-100 truncate text-sm sm:text-base">
              {recipe.title}
            </h1>
            <p className="text-xs text-stone-400" aria-live="polite" aria-atomic="true">
              {isComplete
                ? t.cooking.allStepsComplete
                : `${t.cooking.step} ${currentStepIndex + 1} ${t.cooking.of} ${recipe.steps.length}`}
            </p>
          </div>

          {/* Overall progress bar */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <div
              className="w-32 h-1.5 bg-amber-100 rounded-full overflow-hidden"
              role="progressbar"
              aria-label="Overall recipe progress"
              aria-valuemin={0}
              aria-valuemax={recipe.steps.length}
              aria-valuenow={currentStepIndex + (isComplete ? 1 : 0)}
            >
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentStepIndex + (isComplete ? 1 : 0)) / recipe.steps.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-stone-400">
              {currentStepIndex + (isComplete ? 1 : 0)}/{recipe.steps.length}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {isComplete ? (
          /* Completion screen */
          <section
            className="text-center py-16 space-y-5"
            aria-live="polite"
            aria-label="Recipe completed"
          >
            <div aria-hidden="true" className="flex justify-center">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                <circle cx="40" cy="40" r="36" fill="#d1fae5" stroke="#34d399" strokeWidth="3"/>
                <polyline points="24 40 35 52 56 28" stroke="#059669" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-emerald-700">{t.cooking.recipeComplete}</h2>
            <p className="text-stone-500 text-base">{recipe.title} {t.cooking.isReadyToServe}</p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={reset}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-medium shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
              >
                {t.cooking.cookAgain}
              </button>
              <button
                onClick={onBack}
                className="px-6 py-3 bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
              >
                {t.cooking.chooseAnother}
              </button>
            </div>
          </section>
        ) : (
          /* Main cooking layout — responsive 2-col on desktop */
          <div className="lg:grid lg:grid-cols-[320px_1fr] lg:gap-8">
            {/* Left panel: Steps overview (desktop sidebar) */}
            <aside className="hidden lg:block">
              <div className="bg-white dark:bg-stone-800 rounded-2xl p-5 shadow-sm border border-amber-100 dark:border-stone-700 sticky top-24">
                <h2 className="font-semibold text-stone-700 mb-4 text-sm uppercase tracking-wide">
                  {t.cooking.allSteps}
                </h2>
                <RecipeRoadmap
                  recipe={recipe}
                  currentStepIndex={currentStepIndex}
                  onStepClick={skipToStep}
                  isIdle={isIdle}
                />
              </div>
            </aside>

            {/* Right panel: Active timer */}
            <div className="space-y-5">
              {/* Steam pot visual wrapped in kitchen atmosphere */}
              <section
                className="flex flex-col items-center pt-2 pb-4"
                aria-label="Visual cooking timer"
              >
                <KitchenAtmosphere isRunning={isRunning} isPaused={isPaused} isComplete={false}>
                  <SteamPot
                    progress={stepProgress}
                    isRunning={isRunning}
                    isPaused={isPaused}
                    isComplete={false}
                  />
                </KitchenAtmosphere>

                {/* Screen reader timer — sr-only, visual encoded in pot + arc */}
                <div
                  aria-live="polite"
                  aria-atomic="true"
                  aria-label={renderElapsedLabel(stepTimeRemaining)}
                  className="sr-only"
                  role="timer"
                />

                {/* Visual state indicator — time encoded in arc fill and steam */}
                <div className="mt-2 text-center">
                  {/* Ambient heat arc — encodes progress as arc fill */}
                  <BurnerCoil
                    progress={stepProgress}
                    isRunning={isRunning}
                    isPaused={isPaused}
                    isIdle={isIdle}
                  />
                  <p className="text-sm text-stone-400 mt-1 h-5">
                    {isIdle ? t.cooking.readyWhenYouAre : isPaused ? t.cooking.paused : isRunning ? t.cooking.cooking : ''}
                  </p>
                </div>
              </section>

              {/* Current step info */}
              {currentStep && (
                <section
                  className="bg-white dark:bg-stone-800 rounded-2xl p-5 shadow-sm border border-amber-100 dark:border-stone-700"
                  aria-labelledby="current-step-title"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {currentStep.emoji && (
                      <span className="text-2xl" aria-hidden="true">{currentStep.emoji}</span>
                    )}
                    <div>
                      <p className="text-xs font-medium text-amber-600 uppercase tracking-wide">
                        {t.cooking.step} {currentStepIndex + 1}
                      </p>
                      <h2
                        id="current-step-title"
                        className="font-semibold text-stone-800 text-xl leading-snug"
                      >
                        {currentStep.title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-stone-600 leading-relaxed mt-2">{currentStep.description}</p>

                  {currentStepIndex < recipe.steps.length - 1 && (
                    <div className="mt-4 pt-4 border-t border-amber-50">
                      <p className="text-xs text-stone-400">
                        {t.cooking.next}:{' '}
                        <span className="text-stone-500 font-medium">
                          {recipe.steps[currentStepIndex + 1]?.emoji ?? ''}{' '}
                          {recipe.steps[currentStepIndex + 1]?.title}
                        </span>
                      </p>
                    </div>
                  )}
                </section>
              )}

              {/* Controls */}
              <section aria-label="Timer controls">
                <TimerControls
                  timerState={timerState}
                  onStart={start}
                  onPause={pause}
                  onResume={resume}
                  onNext={nextStep}
                  onPrev={prevStep}
                  onReset={reset}
                  hasPrev={currentStepIndex > 0}
                  hasNext={currentStepIndex < recipe.steps.length - 1}
                  isMuted={isMuted}
                  onToggleMute={() => setIsMuted((m) => !m)}
                />
              </section>

              {/* Mobile steps toggle */}
              <section className="lg:hidden">
                <MobileStepsList
                  recipe={recipe}
                  currentStepIndex={currentStepIndex}
                  onStepClick={skipToStep}
                  isIdle={isIdle}
                  locale={locale}
                />
              </section>

              {/* Mobile progress */}
              <div
                className="sm:hidden bg-amber-100 rounded-full h-1.5 overflow-hidden"
                role="progressbar"
                aria-label="Overall recipe progress"
                aria-valuemin={0}
                aria-valuemax={recipe.steps.length}
                aria-valuenow={currentStepIndex}
              >
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${(currentStepIndex / recipe.steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

/* Mobile steps collapsible */
function MobileStepsList({
  recipe,
  currentStepIndex,
  onStepClick,
  isIdle,
  locale = 'en',
}: {
  recipe: Recipe
  currentStepIndex: number
  onStepClick: (i: number) => void
  isIdle: boolean
  locale?: Locale
}) {
  const [open, setOpen] = useState(false)
  const t = MESSAGES[locale]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-inset"
        aria-expanded={open}
        aria-controls="mobile-steps"
      >
        <span className="font-semibold text-stone-700 text-sm">{t.cooking.allSteps}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 text-stone-400 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div id="mobile-steps" className="px-4 pb-4">
          <RecipeRoadmap
            recipe={recipe}
            currentStepIndex={currentStepIndex}
            onStepClick={onStepClick}
            isIdle={isIdle}
          />
        </div>
      )}
    </div>
  )
}

