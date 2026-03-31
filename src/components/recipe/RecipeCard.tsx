'use client'

import type { Recipe } from '@/types/recipe'
import { prettyRecipeDuration } from '@/lib/recipes'
import type { Locale } from '@/lib/locale'
import { MESSAGES } from '@/lib/locale'

interface RecipeCardProps {
  recipe: Recipe
  onSelect: (recipe: Recipe) => void
  isSelected: boolean
  locale?: Locale
}

const DIFFICULTY_COLORS = {
  easy: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
  medium: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
  hard: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400',
} as const

export function RecipeCard({ recipe, onSelect, isSelected, locale = 'en' }: RecipeCardProps) {
  const t = MESSAGES[locale].recipe
  return (
    <article
      className={`rounded-2xl p-5 cursor-pointer transition-all duration-300 focus-within:ring-2 focus-within:ring-amber-400 ${
        isSelected
          ? 'bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-400 shadow-md'
          : 'bg-white dark:bg-stone-800 border-2 border-transparent hover:border-amber-200 dark:hover:border-stone-600 hover:shadow-md shadow-sm'
      }`}
      onClick={() => onSelect(recipe)}
    >
      <button
        className="w-full text-left focus:outline-none"
        aria-pressed={isSelected}
        aria-label={`Select ${recipe.title} recipe, ${recipe.steps.length} steps, ${prettyRecipeDuration(recipe.totalTimeSeconds)}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-stone-800 dark:text-stone-100 text-lg leading-snug">{recipe.title}</h3>
            <p className="text-stone-500 dark:text-stone-400 text-sm mt-1 line-clamp-2">{recipe.description}</p>
          </div>
          {isSelected && (
            <div className="shrink-0 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${DIFFICULTY_COLORS[recipe.difficulty]}`}>
            {t[recipe.difficulty]}
          </span>
          <span className="text-xs text-stone-400 dark:text-stone-500 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {prettyRecipeDuration(recipe.totalTimeSeconds)}
          </span>
          <span className="text-xs text-stone-400 dark:text-stone-500 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {recipe.servings} {t.servings}
          </span>
          <span className="text-xs text-stone-400 dark:text-stone-500 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            {recipe.steps.length} {t.steps}
          </span>
        </div>
      </button>
    </article>
  )
}
