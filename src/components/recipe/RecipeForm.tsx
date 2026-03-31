'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { z } from 'zod'
import type { Recipe, RecipeStep } from '@/types/recipe'
import type { Locale } from '@/lib/locale'
import { prettyRecipeDuration } from '@/lib/recipes'
import { RecipeFormAtmosphere } from './RecipeFormAtmosphere'

// Zod schema for form validation
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

type RecipeFormData = z.infer<typeof RecipeFormSchema>
type FieldErrors = Partial<Record<string, string>>

interface RecipeFormProps {
  onSave: (recipe: Recipe) => void
  onCancel: () => void
  locale: Locale
  initialRecipe?: Recipe
}

const STEP_EMOJIS = ['🔥', '🧅', '🥄', '🍳', '⏱️', '🧂', '🫕', '🥘', '🌿', '🧄', '🥩', '🍲']

function makeId(): string {
  return `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function buildRecipeFromForm(data: RecipeFormData): Recipe {
  const steps: RecipeStep[] = data.steps.map((s, i) => ({
    id: `step-${i + 1}`,
    title: s.title,
    description: s.description,
    durationSeconds: s.durationMinutes * 60,
    emoji: s.emoji ?? '',
  }))

  return {
    id: makeId(),
    title: data.title,
    description: data.description,
    difficulty: 'medium' as const,
    servings: 4,
    cuisine: 'custom',
    totalTimeSeconds: steps.reduce((acc, s) => acc + s.durationSeconds, 0),
    steps,
  }
}

const defaultStep = (): { title: string; description: string; durationMinutes: number; emoji: string } => ({
  title: '',
  description: '',
  durationMinutes: 5,
  emoji: '',
})

export function RecipeForm({ onSave, onCancel, locale, initialRecipe }: RecipeFormProps) {
  const isEditing = !!initialRecipe

  const [title, setTitle] = useState(initialRecipe?.title ?? '')
  const [description, setDescription] = useState(initialRecipe?.description ?? '')
  const [steps, setSteps] = useState(
    initialRecipe?.steps.map((s) => ({
      title: s.title,
      description: s.description,
      durationMinutes: Math.round(s.durationSeconds / 60) || 1,
      emoji: s.emoji ?? '',
    })) ?? [defaultStep(), defaultStep()]
  )
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState(false)

  // Live total cook time preview
  const totalSeconds = useMemo(
    () => steps.reduce((sum, s) => sum + (Number(s.durationMinutes) || 0) * 60, 0),
    [steps]
  )

  function validate(): boolean {
    const result = RecipeFormSchema.safeParse({
      title,
      description,
      steps,
    })
    if (result.success) {
      setErrors({})
      return true
    }
    const newErrors: FieldErrors = {}
    result.error.issues.forEach((issue) => {
      const key = issue.path.join('.')
      newErrors[key] = issue.message
    })
    setErrors(newErrors)
    return false
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    if (!validate()) return
    const recipe = buildRecipeFromForm({ title, description, steps })
    // Preserve original ID when editing
    onSave(isEditing && initialRecipe ? { ...recipe, id: initialRecipe.id } : recipe)
  }

  function addStep() {
    if (steps.length >= 12) return
    setSteps((prev) => [...prev, defaultStep()])
  }

  function removeStep(index: number) {
    if (steps.length <= 2) return
    setSteps((prev) => prev.filter((_, i) => i !== index))
  }

  function updateStep(index: number, field: string, value: string | number) {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    )
  }

  function getError(path: string): string | undefined {
    return submitted ? errors[path] : undefined
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 32 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-900"
    >
      {/* Ambient kitchen atmosphere — flour dust / ember particles */}
      <RecipeFormAtmosphere />
      {/* Header */}
      <header className="sticky top-0 z-10 bg-amber-50/90 dark:bg-stone-900/90 backdrop-blur-sm border-b border-amber-100 dark:border-stone-800 px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <button
            onClick={onCancel}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label={locale === 'fr' ? 'Annuler' : 'Cancel'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h1 className="font-bold text-stone-800 text-base dark:text-stone-100">
            {isEditing
              ? (locale === 'fr' ? 'Modifier la recette' : 'Edit recipe')
              : (locale === 'fr' ? 'Créer une recette' : 'Create a recipe')}
          </h1>
        </div>
      </header>

      {/* Visual step progress arc — encodes recipe completeness */}
      <div className="max-w-xl mx-auto px-4 pt-4 flex items-center gap-3" aria-hidden="true">
        <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
          {/* Background stone circle */}
          <circle cx="22" cy="22" r="18" fill="none" stroke="rgb(231 229 228)" strokeWidth="3" />
          {/* Amber arc encoding step count */}
          <circle
            cx="22" cy="22" r="18"
            fill="none"
            stroke="rgb(245 158 11)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${Math.min(steps.length / 12, 1) * 113} 113`}
            transform="rotate(-90 22 22)"
            style={{ transition: 'stroke-dasharray 0.4s ease' }}
          />
          {/* Center: step count */}
          <text x="22" y="26" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(217 119 6)">{steps.length}</text>
        </svg>
        {/* Cook time radial display */}
        {totalSeconds > 0 && (
          <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
            <circle cx="22" cy="22" r="18" fill="none" stroke="rgb(231 229 228)" strokeWidth="3" />
            <circle
              cx="22" cy="22" r="18"
              fill="none"
              stroke="rgb(234 88 12)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${Math.min(totalSeconds / 7200, 1) * 113} 113`}
              transform="rotate(-90 22 22)"
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
            <path d="M22 14 L22 22 L27 26" stroke="rgb(234 88 12)" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        )}
        <div className="text-xs text-stone-400 leading-tight">
          <div>{locale === 'fr' ? 'étapes' : 'steps'}</div>
          {totalSeconds > 0 && <div>{prettyRecipeDuration(totalSeconds)}</div>}
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="max-w-xl mx-auto px-4 py-4 pb-28 space-y-6">
        {/* Recipe basics */}
        <section className="bg-white dark:bg-stone-800 rounded-2xl p-5 shadow-sm border border-amber-100 dark:border-stone-700 space-y-4">
          <h2 className="font-semibold text-stone-700 text-sm uppercase tracking-wide">
            {locale === 'fr' ? 'Informations' : 'Recipe info'}
          </h2>

          <div>
            <label htmlFor="recipe-title" className="block text-sm font-medium text-stone-700 mb-1">
              {locale === 'fr' ? 'Nom de la recette' : 'Recipe name'}
            </label>
            <input
              id="recipe-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={locale === 'fr' ? 'ex. Risotto aux champignons' : 'e.g. Mushroom Risotto'}
              className={`w-full px-4 py-3 rounded-xl border text-stone-800 bg-amber-50/50 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 text-base ${
                getError('title') ? 'border-red-400' : 'border-amber-200'
              }`}
              aria-describedby={getError('title') ? 'recipe-title-error' : undefined}
            />
            {getError('title') && (
              <p id="recipe-title-error" className="mt-1 text-xs text-red-500" role="alert">
                {getError('title')}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="recipe-desc" className="block text-sm font-medium text-stone-700 mb-1">
              {locale === 'fr' ? 'Description' : 'Description'}
            </label>
            <textarea
              id="recipe-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder={locale === 'fr' ? 'Courte description de la recette...' : 'Brief description of the recipe...'}
              className={`w-full px-4 py-3 rounded-xl border text-stone-800 bg-amber-50/50 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 text-base resize-none ${
                getError('description') ? 'border-red-400' : 'border-amber-200'
              }`}
              aria-describedby={getError('description') ? 'recipe-desc-error' : undefined}
            />
            {getError('description') && (
              <p id="recipe-desc-error" className="mt-1 text-xs text-red-500" role="alert">
                {getError('description')}
              </p>
            )}
          </div>
        </section>

        {/* Steps */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-stone-700 dark:text-stone-300 text-sm uppercase tracking-wide">
              {locale === 'fr' ? `Étapes (${steps.length})` : `Steps (${steps.length})`}
            </h2>
            <div className="flex items-center gap-2">
              {/* Live total time preview */}
              {totalSeconds > 0 && (
                <motion.span
                  key={totalSeconds}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full flex items-center gap-1"
                  aria-live="polite"
                  aria-atomic="true"
                  aria-label={`Total cook time: ${prettyRecipeDuration(totalSeconds)}`}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {prettyRecipeDuration(totalSeconds)}
                </motion.span>
              )}
              {getError('steps') && (
                <p className="text-xs text-red-500" role="alert">{getError('steps')}</p>
              )}
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -12 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="bg-white dark:bg-stone-800 rounded-2xl p-5 shadow-sm border border-amber-100 dark:border-stone-700 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                    {locale === 'fr' ? `Étape ${index + 1}` : `Step ${index + 1}`}
                  </span>
                  <div className="flex items-center gap-2">
                    {/* Emoji picker — simple inline buttons */}
                    <div className="flex gap-1 flex-wrap max-w-[160px]">
                      {STEP_EMOJIS.slice(0, 6).map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => updateStep(index, 'emoji', step.emoji === em ? '' : em)}
                          className={`w-7 h-7 rounded-lg text-base flex items-center justify-center transition-all ${
                            step.emoji === em
                              ? 'bg-amber-400 ring-2 ring-amber-600'
                              : 'bg-amber-50 hover:bg-amber-100'
                          }`}
                          aria-label={`Set emoji ${em}`}
                          aria-pressed={step.emoji === em}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                    {steps.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label={locale === 'fr' ? `Supprimer étape ${index + 1}` : `Remove step ${index + 1}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateStep(index, 'title', e.target.value)}
                    placeholder={locale === 'fr' ? 'Titre de l\'étape...' : 'Step title...'}
                    className={`w-full px-3 py-2.5 rounded-xl border text-stone-800 bg-amber-50/50 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm ${
                      getError(`steps.${index}.title`) ? 'border-red-400' : 'border-amber-200'
                    }`}
                    aria-label={locale === 'fr' ? `Titre étape ${index + 1}` : `Step ${index + 1} title`}
                  />
                  {getError(`steps.${index}.title`) && (
                    <p className="mt-0.5 text-xs text-red-500" role="alert">{getError(`steps.${index}.title`)}</p>
                  )}
                </div>

                <div>
                  <textarea
                    value={step.description}
                    onChange={(e) => updateStep(index, 'description', e.target.value)}
                    rows={2}
                    placeholder={locale === 'fr' ? 'Instructions pour cette étape...' : 'Instructions for this step...'}
                    className={`w-full px-3 py-2.5 rounded-xl border text-stone-800 bg-amber-50/50 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm resize-none ${
                      getError(`steps.${index}.description`) ? 'border-red-400' : 'border-amber-200'
                    }`}
                    aria-label={locale === 'fr' ? `Instructions étape ${index + 1}` : `Step ${index + 1} instructions`}
                  />
                  {getError(`steps.${index}.description`) && (
                    <p className="mt-0.5 text-xs text-red-500" role="alert">{getError(`steps.${index}.description`)}</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-sm text-stone-600 shrink-0">
                    {locale === 'fr' ? 'Durée' : 'Duration'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={360}
                    value={step.durationMinutes}
                    onChange={(e) => updateStep(index, 'durationMinutes', Number(e.target.value))}
                    className={`w-20 px-3 py-2 rounded-xl border text-stone-800 bg-amber-50/50 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm text-center ${
                      getError(`steps.${index}.durationMinutes`) ? 'border-red-400' : 'border-amber-200'
                    }`}
                    aria-label={locale === 'fr' ? `Durée étape ${index + 1} en minutes` : `Step ${index + 1} duration in minutes`}
                  />
                  <span className="text-sm text-stone-500">
                    {locale === 'fr' ? 'min' : 'min'}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {steps.length < 12 && (
            <motion.button
              type="button"
              onClick={addStep}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-amber-300 text-amber-600 font-medium text-sm hover:bg-amber-50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 flex items-center justify-center gap-2"
              aria-label={locale === 'fr' ? 'Ajouter une étape' : 'Add a step'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              {locale === 'fr' ? 'Ajouter une étape' : 'Add a step'}
            </motion.button>
          )}
        </section>
      </form>

      {/* Sticky save button */}
      <div className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-amber-50 dark:from-stone-900 to-transparent">
        <div className="max-w-xl mx-auto">
          <motion.button
            type="submit"
            form="recipe-form-implicit"
            onClick={handleSubmit}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-2xl shadow-xl transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {isEditing
              ? (locale === 'fr' ? 'Enregistrer' : 'Save changes')
              : (locale === 'fr' ? 'Créer la recette' : 'Create recipe')}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
