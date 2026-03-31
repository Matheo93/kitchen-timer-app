import { describe, it, expect } from 'vitest'
import { MESSAGES } from '@/lib/locale'

describe('MESSAGES locale dictionary', () => {
  it('has EN and FR locales', () => {
    expect(MESSAGES.en).toBeDefined()
    expect(MESSAGES.fr).toBeDefined()
  })

  it('EN cooking messages are defined', () => {
    const t = MESSAGES.en
    expect(t.cooking.step).toBe('Step')
    expect(t.cooking.of).toBe('of')
    expect(t.cooking.recipeComplete).toBe('Recipe complete!')
    expect(t.cooking.cookAgain).toBe('Cook again')
    expect(t.cooking.readyWhenYouAre).toBe('Ready when you are')
    expect(t.cooking.paused).toBe('Paused')
    expect(t.cooking.cooking).toBe('Cooking...')
    expect(t.cooking.allSteps).toBe('All steps')
  })

  it('FR cooking messages are defined', () => {
    const t = MESSAGES.fr
    expect(t.cooking.step).toBe('Étape')
    expect(t.cooking.of).toBe('sur')
    expect(t.cooking.recipeComplete).toBe('Recette terminée !')
    expect(t.cooking.cookAgain).toBe('Recuire')
    expect(t.cooking.readyWhenYouAre).toBe('Prêt quand vous voulez')
    expect(t.cooking.paused).toBe('En pause')
    expect(t.cooking.cooking).toBe('En cuisson...')
  })

  it('both locales have identical message keys', () => {
    const enKeys = Object.keys(MESSAGES.en).sort()
    const frKeys = Object.keys(MESSAGES.fr).sort()
    expect(enKeys).toEqual(frKeys)
  })

  it('EN library filter labels are present', () => {
    const t = MESSAGES.en.library
    expect(t.filter.all).toBe('All')
    expect(t.filter.easy).toBe('Easy')
    expect(t.filter.medium).toBe('Medium')
    expect(t.filter.hard).toBe('Advanced')
  })

  it('FR library filter labels are present', () => {
    const t = MESSAGES.fr.library
    expect(t.filter.all).toBe('Tous')
    expect(t.filter.easy).toBe('Facile')
    expect(t.filter.medium).toBe('Moyen')
    expect(t.filter.hard).toBe('Avancé')
  })
})
