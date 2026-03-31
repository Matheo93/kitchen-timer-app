'use client'

export type Locale = 'en' | 'fr'

const LOCALE_KEY = 'locale'

export function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  const stored = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${LOCALE_KEY}=`))
    ?.split('=')[1]
  return (stored === 'fr' ? 'fr' : 'en') as Locale
}

export function setStoredLocale(locale: Locale): void {
  if (typeof window === 'undefined') return
  document.cookie = `${LOCALE_KEY}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`
}

// Client-side translation — simple key lookup
export type Messages = {
  app: { name: string; tagline: string }
  library: {
    title: string
    filter: Record<string, string>
    noRecipes: string
    startCooking: string
  }
  cooking: {
    step: string
    of: string
    total: string
    allStepsComplete: string
    readyWhenYouAre: string
    paused: string
    cooking: string
    next: string
    allSteps: string
    hideSteps: string
    reset: string
    cookAgain: string
    chooseAnother: string
    recipeComplete: string
    isReadyToServe: string
  }
  recipe: {
    servings: string
    steps: string
    easy: string
    medium: string
    hard: string
  }
}

const EN_MESSAGES: Messages = {
  app: {
    name: 'Kitchen Timer',
    tagline: 'Step-by-step cooking with a visual timer for every stage.',
  },
  library: {
    title: 'Kitchen Timer',
    filter: { all: 'All', easy: 'Easy', medium: 'Medium', hard: 'Advanced' },
    noRecipes: 'No recipes found for this difficulty.',
    startCooking: 'Start Cooking',
  },
  cooking: {
    step: 'Step',
    of: 'of',
    total: 'total',
    allStepsComplete: 'All steps complete!',
    readyWhenYouAre: 'Ready when you are',
    paused: 'Paused',
    cooking: 'Cooking...',
    next: 'Next',
    allSteps: 'All steps',
    hideSteps: 'Hide steps',
    reset: 'Reset',
    cookAgain: 'Cook again',
    chooseAnother: 'Choose another recipe',
    recipeComplete: 'Recipe complete!',
    isReadyToServe: 'is ready to serve.',
  },
  recipe: {
    servings: 'servings',
    steps: 'steps',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Advanced',
  },
}

const FR_MESSAGES: Messages = {
  app: {
    name: 'Minuteur Cuisine',
    tagline: 'Cuisine pas-à-pas avec un minuteur visuel pour chaque étape.',
  },
  library: {
    title: 'Minuteur Cuisine',
    filter: { all: 'Tous', easy: 'Facile', medium: 'Moyen', hard: 'Avancé' },
    noRecipes: 'Aucune recette pour cette difficulté.',
    startCooking: 'Commencer',
  },
  cooking: {
    step: 'Étape',
    of: 'sur',
    total: 'total',
    allStepsComplete: 'Toutes les étapes terminées !',
    readyWhenYouAre: 'Prêt quand vous voulez',
    paused: 'En pause',
    cooking: 'En cuisson...',
    next: 'Suivant',
    allSteps: 'Toutes les étapes',
    hideSteps: 'Masquer',
    reset: 'Réinitialiser',
    cookAgain: 'Recuire',
    chooseAnother: 'Choisir une autre recette',
    recipeComplete: 'Recette terminée !',
    isReadyToServe: 'est prêt à servir.',
  },
  recipe: {
    servings: 'portions',
    steps: 'étapes',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Avancé',
  },
}

export const MESSAGES: Record<Locale, Messages> = {
  en: EN_MESSAGES,
  fr: FR_MESSAGES,
}
