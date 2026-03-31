import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// Re-define the schemas here for isolated testing
const RecipeStepFormSchema = z.object({
  title: z.string().min(2, 'Step title must be at least 2 characters').max(80),
  description: z.string().min(5, 'Description must be at least 5 characters').max(500),
  durationMinutes: z.number().min(1, 'Minimum 1 minute').max(360, 'Maximum 6 hours'),
  emoji: z.string().max(2).optional(),
})

const RecipeFormSchema = z.object({
  title: z.string().min(2, 'Recipe name must be at least 2 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(400),
  steps: z.array(RecipeStepFormSchema).min(2, 'At least 2 steps required').max(12),
})

describe('RecipeForm Zod validation', () => {
  it('validates a valid recipe form', () => {
    const valid = {
      title: 'My Pasta',
      description: 'A simple pasta dish for weeknights.',
      steps: [
        { title: 'Boil water', description: 'Bring a large pot of salted water to boil', durationMinutes: 10 },
        { title: 'Cook pasta', description: 'Add pasta and cook according to package directions', durationMinutes: 8 },
      ],
    }
    const result = RecipeFormSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('rejects recipe with title too short', () => {
    const invalid = {
      title: 'A',
      description: 'A description that is long enough.',
      steps: [
        { title: 'Step one', description: 'Description one is long enough', durationMinutes: 5 },
        { title: 'Step two', description: 'Description two is long enough', durationMinutes: 5 },
      ],
    }
    const result = RecipeFormSchema.safeParse(invalid)
    expect(result.success).toBe(false)
    if (!result.success) {
      const titleError = result.error.issues.find(e => e.path[0] === 'title')
      expect(titleError?.message).toBe('Recipe name must be at least 2 characters')
    }
  })

  it('rejects recipe with description too short', () => {
    const invalid = {
      title: 'Valid Title',
      description: 'Too short',
      steps: [
        { title: 'Step one', description: 'Description one', durationMinutes: 5 },
        { title: 'Step two', description: 'Description two', durationMinutes: 5 },
      ],
    }
    const result = RecipeFormSchema.safeParse(invalid)
    expect(result.success).toBe(false)
    if (!result.success) {
      const descError = result.error.issues.find(e => e.path[0] === 'description')
      expect(descError?.message).toBe('Description must be at least 10 characters')
    }
  })

  it('rejects recipe with only 1 step', () => {
    const invalid = {
      title: 'Valid Title',
      description: 'A description that is long enough.',
      steps: [
        { title: 'Step one', description: 'Description one is long', durationMinutes: 5 },
      ],
    }
    const result = RecipeFormSchema.safeParse(invalid)
    expect(result.success).toBe(false)
    if (!result.success) {
      const stepsError = result.error.issues.find(e => e.path[0] === 'steps')
      expect(stepsError?.message).toBe('At least 2 steps required')
    }
  })

  it('rejects step with duration below minimum', () => {
    const invalid = {
      title: 'Valid Title',
      description: 'A description that is long enough.',
      steps: [
        { title: 'Step one', description: 'Description one is long', durationMinutes: 0 },
        { title: 'Step two', description: 'Description two is long', durationMinutes: 5 },
      ],
    }
    const result = RecipeFormSchema.safeParse(invalid)
    expect(result.success).toBe(false)
    if (!result.success) {
      // Path is ['steps', 0, 'durationMinutes'] — index 2 is the field name
      const durationError = result.error.issues.find(e => e.path.includes('durationMinutes'))
      expect(durationError?.message).toBe('Minimum 1 minute')
    }
  })

  it('accepts step with emoji', () => {
    const valid = {
      title: 'My Pasta',
      description: 'A simple pasta dish for weeknights.',
      steps: [
        { title: 'Boil water', description: 'Bring a large pot to a rolling boil', durationMinutes: 10, emoji: '🔥' },
        { title: 'Cook pasta', description: 'Add pasta and cook until al dente', durationMinutes: 8 },
      ],
    }
    const result = RecipeFormSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('rejects step title that is too short', () => {
    const invalid = {
      title: 'Valid Title',
      description: 'A description that is long enough.',
      steps: [
        { title: 'A', description: 'Description one is long enough', durationMinutes: 5 },
        { title: 'Step two', description: 'Description two is long', durationMinutes: 5 },
      ],
    }
    const result = RecipeFormSchema.safeParse(invalid)
    expect(result.success).toBe(false)
    if (!result.success) {
      // e.path = ['steps', 0, 'title']
      const stepTitleError = result.error.issues.find(e =>
        e.path[0] === 'steps' && e.path[2] === 'title'
      )
      expect(stepTitleError).toBeDefined()
    }
  })
})
