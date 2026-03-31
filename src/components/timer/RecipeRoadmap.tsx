'use client'

import type { Recipe } from '@/types/recipe'

interface RecipeRoadmapProps {
  recipe: Recipe
  currentStepIndex: number
  onStepClick: (index: number) => void
  isIdle: boolean
}

export function RecipeRoadmap({ recipe, currentStepIndex, onStepClick, isIdle }: RecipeRoadmapProps) {
  return (
    <nav aria-label="Recipe steps progress">
      <ol className="flex flex-col gap-2">
        {recipe.steps.map((step, index) => {
          const isCurrent = index === currentStepIndex
          const isCompleted = index < currentStepIndex

          return (
            <li key={step.id}>
              <button
                onClick={() => !isIdle && onStepClick(index)}
                disabled={isIdle}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 ${
                  isCurrent
                    ? 'bg-amber-50 border-2 border-amber-400 shadow-sm'
                    : isCompleted
                    ? 'bg-emerald-50 border-2 border-emerald-200 opacity-70'
                    : 'bg-white/50 border-2 border-transparent hover:border-amber-200 disabled:cursor-default'
                }`}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Step ${index + 1}: ${step.title}${isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ''}`}
              >
                <div className="flex items-center gap-3">
                  {/* Step indicator */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-400 text-white'
                        : isCurrent
                        ? 'bg-amber-500 text-white'
                        : 'bg-amber-100 text-amber-600'
                    }`}
                    aria-hidden="true"
                  >
                    {isCompleted ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Step info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {step.emoji && (
                        <span className="text-base" aria-hidden="true">{step.emoji}</span>
                      )}
                      <span
                        className={`font-medium text-sm truncate ${
                          isCurrent ? 'text-amber-900' : isCompleted ? 'text-emerald-700' : 'text-stone-500'
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                    {isCurrent && (
                      <p className="text-xs text-amber-700/70 mt-0.5 line-clamp-2">
                        {step.description}
                      </p>
                    )}
                  </div>

                  {/* Duration badge */}
                  <span
                    className={`text-xs font-mono shrink-0 px-2 py-0.5 rounded-full ${
                      isCurrent
                        ? 'bg-amber-200 text-amber-800'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    {Math.round(step.durationSeconds / 60)}m
                  </span>
                </div>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
