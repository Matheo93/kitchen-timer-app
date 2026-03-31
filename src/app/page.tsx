'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Recipe } from '@/types/recipe'
import { RecipeLibrary } from '@/components/recipe/RecipeLibrary'
import { CookingView } from '@/components/timer/CookingView'
import { RecipeForm } from '@/components/recipe/RecipeForm'
import { KitchenFallback } from '@/components/KitchenFallback'
import { type Locale, getStoredLocale } from '@/lib/locale'
import { useRecipeStorage } from '@/hooks/useRecipeStorage'

type AppView = 'library' | 'cooking' | 'create' | 'edit'

export default function HomePage() {
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null)
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const [view, setView] = useState<AppView>('library')
  const [locale, setLocale] = useState<Locale>('en')
  const { recipes: customRecipes, addRecipe, updateRecipe, deleteRecipe } = useRecipeStorage()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocale(getStoredLocale())
  }, [])

  function handleSelectRecipe(recipe: Recipe) {
    setActiveRecipe(recipe)
    setView('cooking')
  }

  function handleSaveCustomRecipe(recipe: Recipe) {
    addRecipe(recipe)
    setActiveRecipe(recipe)
    setView('cooking')
  }

  function handleUpdateRecipe(recipe: Recipe) {
    updateRecipe(recipe.id, recipe)
    setEditingRecipe(null)
    setView('library')
  }

  function handleBack() {
    setActiveRecipe(null)
    setEditingRecipe(null)
    setView('library')
  }

  function handleEditRecipe(recipe: Recipe) {
    setEditingRecipe(recipe)
    setView('edit')
  }

  return (
    <KitchenFallback>
      <AnimatePresence mode="wait">
        {view === 'library' && (
          <motion.div
            key="library"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <RecipeLibrary
              onSelectRecipe={handleSelectRecipe}
              onCreateRecipe={() => setView('create')}
              onEditRecipe={handleEditRecipe}
              onDeleteRecipe={deleteRecipe}
              customRecipes={customRecipes}
              locale={locale}
              onLocaleChange={setLocale}
            />
          </motion.div>
        )}

        {view === 'cooking' && activeRecipe && (
          <motion.div
            key="cooking"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <CookingView
              recipe={activeRecipe}
              onBack={handleBack}
              locale={locale}
            />
          </motion.div>
        )}

        {view === 'create' && (
          <motion.div
            key="create"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <RecipeForm
              onSave={handleSaveCustomRecipe}
              onCancel={handleBack}
              locale={locale}
            />
          </motion.div>
        )}

        {view === 'edit' && editingRecipe && (
          <motion.div
            key="edit"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <RecipeForm
              initialRecipe={editingRecipe}
              onSave={handleUpdateRecipe}
              onCancel={handleBack}
              locale={locale}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </KitchenFallback>
  )
}
