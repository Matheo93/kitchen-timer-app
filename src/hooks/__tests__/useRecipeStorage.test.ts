import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRecipeStorage } from '@/hooks/useRecipeStorage'
import type { Recipe } from '@/types/recipe'

// A minimal valid recipe for testing
const makeRecipe = (id: string): Recipe => ({
  id,
  title: 'Test Recipe',
  description: 'A test recipe description for unit testing.',
  difficulty: 'easy',
  servings: 2,
  cuisine: 'test',
  totalTimeSeconds: 600,
  steps: [
    {
      id: 'step-1',
      title: 'Step one',
      description: 'Do the first thing here',
      durationSeconds: 300,
      emoji: '🔥',
    },
    {
      id: 'step-2',
      title: 'Step two',
      description: 'Do the second thing here',
      durationSeconds: 300,
    },
  ],
})

describe('useRecipeStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with empty array', () => {
    const { result } = renderHook(() => useRecipeStorage())
    expect(result.current.recipes).toEqual([])
  })

  it('addRecipe stores a valid recipe', () => {
    const { result } = renderHook(() => useRecipeStorage())
    act(() => {
      result.current.addRecipe(makeRecipe('r1'))
    })
    expect(result.current.recipes).toHaveLength(1)
    expect(result.current.recipes[0].id).toBe('r1')
  })

  it('deleteRecipe removes by id', () => {
    const { result } = renderHook(() => useRecipeStorage())
    act(() => {
      result.current.addRecipe(makeRecipe('r1'))
      result.current.addRecipe(makeRecipe('r2'))
    })
    expect(result.current.recipes).toHaveLength(2)
    act(() => {
      result.current.deleteRecipe('r1')
    })
    expect(result.current.recipes).toHaveLength(1)
    expect(result.current.recipes[0].id).toBe('r2')
  })

  it('updateRecipe patches a recipe by id', () => {
    const { result } = renderHook(() => useRecipeStorage())
    act(() => {
      result.current.addRecipe(makeRecipe('r1'))
    })
    act(() => {
      result.current.updateRecipe('r1', { title: 'Updated Title' })
    })
    expect(result.current.recipes[0].title).toBe('Updated Title')
  })

  it('hasRecipe returns true for existing id', () => {
    const { result } = renderHook(() => useRecipeStorage())
    act(() => {
      result.current.addRecipe(makeRecipe('r1'))
    })
    expect(result.current.hasRecipe('r1')).toBe(true)
    expect(result.current.hasRecipe('r99')).toBe(false)
  })

  it('persists to localStorage on add', () => {
    const { result } = renderHook(() => useRecipeStorage())
    act(() => {
      result.current.addRecipe(makeRecipe('r1'))
    })
    const stored = localStorage.getItem('kitchen-timer-custom-recipes')
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!)
    expect(parsed).toHaveLength(1)
    expect(parsed[0].id).toBe('r1')
  })
})
