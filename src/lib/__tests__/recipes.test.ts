import { describe, it, expect } from 'vitest'
import { SAMPLE_RECIPES, renderElapsedLabel, prettyRecipeDuration } from '../recipes'
import { RecipeSchema } from '@/types/recipe'

describe('renderElapsedLabel', () => {
  it('formats seconds correctly', () => {
    expect(renderElapsedLabel(65)).toBe('1:05')
    expect(renderElapsedLabel(3600)).toBe('1:00:00')
    expect(renderElapsedLabel(3665)).toBe('1:01:05')
    expect(renderElapsedLabel(0)).toBe('0:00')
    expect(renderElapsedLabel(-1)).toBe('0:00')
    expect(renderElapsedLabel(59)).toBe('0:59')
  })
})

describe('prettyRecipeDuration', () => {
  it('formats duration correctly', () => {
    expect(prettyRecipeDuration(60)).toBe('1 min')
    expect(prettyRecipeDuration(3600)).toBe('1h')
    expect(prettyRecipeDuration(3660)).toBe('1h 1min')
    expect(prettyRecipeDuration(5400)).toBe('1h 30min')
    expect(prettyRecipeDuration(30)).toBe('30s')
  })
})

describe('SAMPLE_RECIPES', () => {
  it('has at least 4 recipes', () => {
    expect(SAMPLE_RECIPES.length).toBeGreaterThanOrEqual(4)
  })

  it('each recipe passes Zod validation', () => {
    SAMPLE_RECIPES.forEach((recipe) => {
      const result = RecipeSchema.safeParse(recipe)
      expect(result.success, `Recipe "${recipe.title}" failed validation: ${JSON.stringify(result)}`).toBe(true)
    })
  })

  it('each recipe has at least 2 steps', () => {
    SAMPLE_RECIPES.forEach((recipe) => {
      expect(recipe.steps.length).toBeGreaterThanOrEqual(2)
    })
  })

  it('each recipe step has a positive duration', () => {
    SAMPLE_RECIPES.forEach((recipe) => {
      recipe.steps.forEach((step) => {
        expect(step.durationSeconds).toBeGreaterThan(0)
      })
    })
  })

  it('recipe difficulty is valid', () => {
    const validDifficulties = ['easy', 'medium', 'hard']
    SAMPLE_RECIPES.forEach((recipe) => {
      expect(validDifficulties).toContain(recipe.difficulty)
    })
  })
})
