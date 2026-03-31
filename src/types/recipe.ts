import { z } from 'zod'

export const RecipeStepSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  durationSeconds: z.number().int().positive(),
  emoji: z.string().optional(),
})

export const RecipeSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  servings: z.number().int().positive(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  cuisine: z.string().min(1),
  steps: z.array(RecipeStepSchema).min(1),
  totalTimeSeconds: z.number().int().positive(),
})

export type RecipeStep = z.infer<typeof RecipeStepSchema>
export type Recipe = z.infer<typeof RecipeSchema>

export type TimerState = 'idle' | 'running' | 'paused' | 'completed'

export interface CookingSession {
  recipe: Recipe
  currentStepIndex: number
  stepTimeRemaining: number
  totalTimeElapsed: number
  timerState: TimerState
}
