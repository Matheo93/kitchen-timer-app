'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Recipe } from '@/types/recipe'
import { SAMPLE_RECIPES } from '@/lib/recipes'
import { type Locale, MESSAGES, getStoredLocale } from '@/lib/locale'
import { RecipeCard } from './RecipeCard'
import { LocaleToggle } from '@/components/LocaleToggle'
import { RecipeLibrarySkeleton } from './RecipeSkeleton'
import { DarkModeToggle } from '@/components/DarkModeToggle'
import { RecipeLibraryAtmosphere } from './RecipeLibraryAtmosphere'

interface RecipeLibraryProps {
  onSelectRecipe: (recipe: Recipe) => void
  onCreateRecipe?: () => void
  onEditRecipe?: (recipe: Recipe) => void
  onDeleteRecipe?: (id: string) => void
  customRecipes?: Recipe[]
  locale?: Locale
  onLocaleChange?: (locale: Locale) => void
}

const DIFFICULTIES = ['all', 'easy', 'medium', 'hard'] as const
type FilterDifficulty = (typeof DIFFICULTIES)[number]
type LibraryTab = 'sample' | 'custom'

export function RecipeLibrary({
  onSelectRecipe,
  onCreateRecipe,
  onEditRecipe,
  onDeleteRecipe,
  customRecipes = [],
  locale: localeProp,
  onLocaleChange,
}: RecipeLibraryProps) {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterDifficulty>('all')
  const [activeTab, setActiveTab] = useState<LibraryTab>('sample')
  // Always initialize with 'en' to avoid hydration mismatch, then read from cookie after mount
  const [locale, setLocale] = useState<Locale>('en')
  const [mounted, setMounted] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocale(localeProp ?? getStoredLocale())
    setMounted(true)
  }, [localeProp])

  function handleLocaleChange(newLocale: Locale) {
    setLocale(newLocale)
    onLocaleChange?.(newLocale)
  }

  const t = MESSAGES[locale]

  const sourceRecipes = activeTab === 'sample' ? SAMPLE_RECIPES : customRecipes

  const filtered =
    filter === 'all'
      ? sourceRecipes
      : sourceRecipes.filter((r) => r.difficulty === filter)

  const selectedRecipe =
    [...SAMPLE_RECIPES, ...customRecipes].find((r) => r.id === selectedRecipeId) ?? null

  function handleSelect(recipe: Recipe) {
    setSelectedRecipeId((prev) => (prev === recipe.id ? null : recipe.id))
  }

  function handleStartCooking() {
    if (!selectedRecipe) return
    onSelectRecipe(selectedRecipe)
  }

  function handleDeleteClick(id: string) {
    setDeleteConfirmId(id)
  }

  function handleDeleteConfirm() {
    if (!deleteConfirmId) return
    onDeleteRecipe?.(deleteConfirmId)
    if (selectedRecipeId === deleteConfirmId) setSelectedRecipeId(null)
    setDeleteConfirmId(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-900 relative overflow-hidden" lang={locale}>
      {/* Ambient background scene — geometry changes with light/dark mode */}
      <RecipeLibraryAtmosphere />
      {/* Hero header */}
      <header className="relative z-10 px-4 pt-10 pb-6 max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            {/* SVG pot icon */}
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              <rect x="8" y="14" width="20" height="14" rx="3" fill="#f59e0b" />
              <rect x="6" y="12" width="24" height="4" rx="2" fill="#d97706" />
              <circle cx="18" cy="11" r="2" fill="#92400e" />
              <rect x="3" y="16" width="4" height="8" rx="2" fill="#b45309" />
              <rect x="29" y="16" width="4" height="8" rx="2" fill="#b45309" />
            </svg>
            <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">{t.app.name}</h1>
          </div>
          <div className="flex items-center gap-1">
            <DarkModeToggle />
            <LocaleToggle currentLocale={locale} onChange={handleLocaleChange} />
          </div>
        </div>
        <p className="text-stone-500 dark:text-stone-400 text-base mt-2">
          {t.app.tagline}
        </p>
      </header>

      <main className="relative z-10 max-w-xl mx-auto px-4 pb-24 space-y-4">
        {/* Library tabs: Sample recipes vs My Recipes */}
        <div
          className="flex gap-1 bg-amber-100/60 dark:bg-stone-800 rounded-2xl p-1"
          role="tablist"
          aria-label={locale === 'fr' ? 'Type de recettes' : 'Recipe collection'}
        >
          <button
            role="tab"
            aria-selected={activeTab === 'sample'}
            onClick={() => { setActiveTab('sample'); setSelectedRecipeId(null) }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 ${
              activeTab === 'sample'
                ? 'bg-white dark:bg-stone-700 text-amber-700 dark:text-amber-400 shadow-sm'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
            }`}
          >
            {locale === 'fr' ? 'Recettes' : 'Recipes'}
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'custom'}
            onClick={() => { setActiveTab('custom'); setSelectedRecipeId(null) }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 flex items-center justify-center gap-1.5 ${
              activeTab === 'custom'
                ? 'bg-white dark:bg-stone-700 text-amber-700 dark:text-amber-400 shadow-sm'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
            }`}
          >
            {locale === 'fr' ? 'Mes recettes' : 'My Recipes'}
            {customRecipes.length > 0 && (
              <span className="bg-amber-500 text-white text-xs font-bold rounded-full px-1.5 py-0 leading-5 min-w-[20px] text-center">
                {customRecipes.length}
              </span>
            )}
          </button>
        </div>

        {/* Filter tabs */}
        <nav aria-label={locale === 'fr' ? 'Filtrer par difficulté' : 'Filter recipes by difficulty'}>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" role="tablist">
            {DIFFICULTIES.map((d) => {
              const count =
                d === 'all'
                  ? sourceRecipes.length
                  : sourceRecipes.filter((r) => r.difficulty === d).length
              const label = t.library.filter[d] ?? d
              return (
                <button
                  key={d}
                  onClick={() => setFilter(d)}
                  role="tab"
                  aria-selected={filter === d}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 flex items-center gap-1.5 ${
                    filter === d
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-white dark:bg-stone-800 text-stone-500 dark:text-stone-400 hover:bg-amber-50 dark:hover:bg-stone-700 border border-amber-100 dark:border-stone-700'
                  }`}
                >
                  {label}
                  <span
                    className={`text-xs rounded-full px-1.5 py-0 leading-5 font-semibold ${
                      filter === d
                        ? 'bg-amber-400 text-white'
                        : 'bg-amber-50 dark:bg-stone-700 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* Recipe list */}
        <section
          aria-label={locale === 'fr' ? 'Liste de recettes' : 'Recipe list'}
          aria-live="polite"
        >
          {!mounted ? (
            <RecipeLibrarySkeleton />
          ) : activeTab === 'custom' && customRecipes.length === 0 ? (
            /* Empty state for My Recipes */
            <div className="text-center py-16 space-y-4">
              <div aria-hidden="true" className="flex justify-center">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                  <rect x="12" y="20" width="40" height="32" rx="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
                  <line x1="32" y1="28" x2="32" y2="44" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="24" y1="36" x2="40" y2="36" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M22 20v-4a10 10 0 0 1 20 0v4" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-stone-500 dark:text-stone-400 text-sm">
                {locale === 'fr'
                  ? 'Pas encore de recettes personnelles'
                  : 'No custom recipes yet'}
              </p>
              {onCreateRecipe && (
                <button
                  onClick={onCreateRecipe}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-2xl shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 text-sm"
                >
                  {locale === 'fr' ? 'Créer ma première recette' : 'Create my first recipe'}
                </button>
              )}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-stone-400 dark:text-stone-500" role="status">
              <p>{t.library.noRecipes}</p>
            </div>
          ) : (
            <ul className="space-y-3" role="list">
              {filtered.map((recipe) => (
                <li key={recipe.id} className="relative group">
                  <RecipeCard
                    recipe={recipe}
                    onSelect={handleSelect}
                    isSelected={selectedRecipeId === recipe.id}
                    locale={locale}
                  />
                  {/* Edit / Delete actions for custom recipes */}
                  {activeTab === 'custom' && (
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                      {onEditRecipe && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onEditRecipe(recipe)
                          }}
                          className="w-8 h-8 rounded-lg bg-white dark:bg-stone-700 border border-amber-200 dark:border-stone-600 flex items-center justify-center text-amber-600 hover:bg-amber-50 dark:hover:bg-stone-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                          aria-label={locale === 'fr' ? `Modifier ${recipe.title}` : `Edit ${recipe.title}`}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                      )}
                      {onDeleteRecipe && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteClick(recipe.id)
                          }}
                          className="w-8 h-8 rounded-lg bg-white dark:bg-stone-700 border border-red-200 dark:border-stone-600 flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-stone-600 hover:text-red-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                          aria-label={locale === 'fr' ? `Supprimer ${recipe.title}` : `Delete ${recipe.title}`}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Create recipe button — always visible */}
        {onCreateRecipe && (
          <button
            onClick={onCreateRecipe}
            className="w-full py-3.5 rounded-2xl border-2 border-dashed border-amber-300 dark:border-stone-600 text-amber-600 dark:text-amber-400 font-medium text-sm hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 flex items-center justify-center gap-2"
            aria-label={locale === 'fr' ? 'Créer ma propre recette' : 'Create my own recipe'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {locale === 'fr' ? 'Créer ma propre recette' : 'Create my own recipe'}
          </button>
        )}
      </main>

      {/* Delete confirmation dialog — animated with framer-motion */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-confirm-title"
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setDeleteConfirmId(null)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 24 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              className="relative bg-white dark:bg-stone-800 rounded-3xl p-6 shadow-2xl max-w-sm w-full space-y-4"
            >
              <h2 id="delete-confirm-title" className="font-bold text-stone-800 dark:text-stone-100 text-lg">
                {locale === 'fr' ? 'Supprimer la recette ?' : 'Delete this recipe?'}
              </h2>
              <p className="text-stone-500 dark:text-stone-400 text-sm">
                {locale === 'fr'
                  ? 'Cette action est irréversible.'
                  : 'This action cannot be undone.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-3 bg-amber-50 dark:bg-stone-700 hover:bg-amber-100 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-300 rounded-2xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  {locale === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  {locale === 'fr' ? 'Supprimer' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky start button */}
      {selectedRecipe && (
        <div className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-amber-50 dark:from-stone-900 to-transparent">
          <div className="max-w-xl mx-auto">
            <button
              onClick={handleStartCooking}
              className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-base rounded-2xl shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 flex items-center justify-center gap-2"
              aria-label={`${t.library.startCooking}: ${selectedRecipe.title}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              {t.library.startCooking} — {selectedRecipe.title}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
