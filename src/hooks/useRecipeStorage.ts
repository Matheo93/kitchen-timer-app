'use client'

import { useState, useEffect, useCallback } from 'react'
import { z } from 'zod'
import type { Recipe } from '@/types/recipe'
import { RecipeSchema } from '@/types/recipe'

const STORAGE_KEY = 'kitchen-timer-custom-recipes'

const StoredRecipesSchema = z.array(RecipeSchema)

function readFromStorage(): Recipe[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    const result = StoredRecipesSchema.safeParse(parsed)
    if (!result.success) {
      // Corrupted data — clear it
      window.localStorage.removeItem(STORAGE_KEY)
      return []
    }
    return result.data
  } catch {
    return []
  }
}

function writeToStorage(recipes: Recipe[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes))
  } catch {
    // Storage quota exceeded or unavailable — non-fatal
  }
}

/**
 * useRecipeStorage — CRUD for custom recipes in localStorage.
 * SSR-safe: returns empty array until mounted.
 */
export function useRecipeStorage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecipes(readFromStorage())
    setMounted(true)
  }, [])

  const addRecipe = useCallback((recipe: Recipe) => {
    const result = RecipeSchema.safeParse(recipe)
    if (!result.success) return
    setRecipes((prev) => {
      const updated = [...prev, result.data]
      writeToStorage(updated)
      return updated
    })
  }, [])

  const updateRecipe = useCallback((id: string, patch: Partial<Recipe>) => {
    setRecipes((prev) => {
      const updated = prev.map((r) => {
        if (r.id !== id) return r
        const merged = { ...r, ...patch }
        const result = RecipeSchema.safeParse(merged)
        return result.success ? result.data : r
      })
      writeToStorage(updated)
      return updated
    })
  }, [])

  const deleteRecipe = useCallback((id: string) => {
    setRecipes((prev) => {
      const updated = prev.filter((r) => r.id !== id)
      writeToStorage(updated)
      return updated
    })
  }, [])

  const hasRecipe = useCallback(
    (id: string) => recipes.some((r) => r.id === id),
    [recipes],
  )

  return { recipes, mounted, addRecipe, updateRecipe, deleteRecipe, hasRecipe }
}
