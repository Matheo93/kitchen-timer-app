import { test, expect } from '@playwright/test'

test.describe('Recipe Library', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('shows recipe library with 4 recipes', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Kitchen Timer|Minuteur Cuisine/i })).toBeVisible()
    // Should have 4 recipe cards (li elements inside ul[role=list])
    const cards = page.locator('ul[role="list"] li')
    await expect(cards).toHaveCount(4)
  })

  test('can filter recipes by difficulty', async ({ page }) => {
    // Click "Easy" filter tab
    await page.getByRole('tab', { name: /Easy|Facile/i }).click()
    // Should show fewer recipes
    const cards = page.locator('ul[role="list"] li')
    await expect(cards).toHaveCount(1)
  })

  test('shows create recipe button', async ({ page }) => {
    const createBtn = page.getByRole('button', { name: /Create my own recipe|Créer ma propre recette/i })
    await expect(createBtn).toBeVisible()
  })

  test('can switch to French locale', async ({ page }) => {
    const frBtn = page.getByRole('button', { name: 'FR' })
    await frBtn.click()
    await expect(page.getByText(/Minuteur Cuisine/)).toBeVisible()
  })

  test('can select a recipe and see start cooking button', async ({ page }) => {
    // Click first recipe card
    const firstCard = page.locator('ul[role="list"] li').first()
    await firstCard.click()
    // Start cooking button should appear (contains "Commencer" or "Start Cooking")
    const startBtn = page.locator('button').filter({ hasText: /Commencer|Start Cooking/i }).first()
    await expect(startBtn).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Complete Cook Flow', () => {
  test('select recipe → start timer → pause → reset → back', async ({ page }) => {
    await page.goto('/')
    // Select Herb Roasted Chicken (easy)
    const chickenCard = page.locator('ul[role="list"] li').filter({ hasText: 'Herb Roasted Chicken' })
    await chickenCard.click()
    // Start cooking button should appear
    const startBtn = page.locator('button').filter({ hasText: /Commencer|Start Cooking/i }).first()
    await expect(startBtn).toBeVisible({ timeout: 5000 })
    await startBtn.click()
    // Cooking view: step info should show
    await expect(page.locator('section[aria-label="Timer controls"]')).toBeVisible({ timeout: 5000 })
    // Find play button and start timer
    const playBtn = page.locator('button[aria-label*="Start"]').first()
    await playBtn.click()
    // Paused via keyboard Space
    await page.keyboard.press('Space')
    // Back via keyboard Escape
    await page.keyboard.press('Escape')
    await expect(page.getByRole('heading', { name: /Kitchen Timer|Minuteur Cuisine/i })).toBeVisible({ timeout: 5000 })
  })

  test('dark mode toggle works', async ({ page }) => {
    await page.goto('/')
    // Dark mode toggle button
    const darkBtn = page.getByRole('button', { name: /Switch to dark mode|Switch to light mode/i })
    await darkBtn.click()
    // html should have class 'dark'
    await expect(page.locator('html')).toHaveClass(/dark/, { timeout: 2000 })
    // Toggle back
    const lightBtn = page.getByRole('button', { name: /Switch to light mode/i })
    await lightBtn.click()
    await expect(page.locator('html')).not.toHaveClass(/dark/, { timeout: 2000 })
  })
})

test.describe('Recipe Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Create my own recipe|Créer ma propre recette/i }).click()
  })

  test('shows recipe creation form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Create a recipe|Créer une recette/i })).toBeVisible()
    // Should have recipe name input
    await expect(page.locator('#recipe-title')).toBeVisible()
    // Should have description textarea
    await expect(page.locator('#recipe-desc')).toBeVisible()
  })

  test('shows validation errors on empty submit', async ({ page }) => {
    // Click save without filling form
    await page.getByRole('button', { name: /Create recipe|Créer la recette/i }).click()
    // Validation error should appear
    await expect(page.getByRole('alert').first()).toBeVisible()
  })

  test('can go back to recipe library', async ({ page }) => {
    const backBtn = page.getByRole('button', { name: /Cancel|Annuler/i })
    await backBtn.click()
    await expect(page.getByRole('heading', { name: /Kitchen Timer|Minuteur Cuisine/i })).toBeVisible()
  })
})
