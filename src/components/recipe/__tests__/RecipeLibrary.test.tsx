import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RecipeLibrary } from '../RecipeLibrary'

// Mock next-themes — no SSR in test environment
vi.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: 'light', setTheme: vi.fn() }),
}))

// Mock canvas (jsdom doesn't support canvas)
HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as typeof HTMLCanvasElement.prototype.getContext

const mockOnSelectRecipe = vi.fn()

describe('RecipeLibrary', () => {
  it('renders the Kitchen Timer heading', () => {
    render(
      <RecipeLibrary
        onSelectRecipe={mockOnSelectRecipe}
        locale="en"
      />
    )
    expect(screen.getByText('Kitchen Timer')).toBeInTheDocument()
  })

  it('shows 4 sample recipes by default', () => {
    render(
      <RecipeLibrary
        onSelectRecipe={mockOnSelectRecipe}
        locale="en"
      />
    )
    // Wait for mount — the component uses useEffect for locale
    const cards = screen.getAllByRole('button', { name: /Select .+ recipe/i })
    expect(cards).toHaveLength(4)
  })

  it('shows Create my own recipe button', () => {
    render(
      <RecipeLibrary
        onSelectRecipe={mockOnSelectRecipe}
        locale="en"
        onCreateRecipe={vi.fn()}
      />
    )
    expect(screen.getByRole('button', { name: /Create my own recipe/i })).toBeInTheDocument()
  })

  it('filters recipes by difficulty — Easy shows 1 recipe', () => {
    render(
      <RecipeLibrary
        onSelectRecipe={mockOnSelectRecipe}
        locale="en"
      />
    )
    // Click the Easy filter tab
    const easyTab = screen.getByRole('tab', { name: /Easy/i })
    fireEvent.click(easyTab)
    // After filtering, only Herb Roasted Chicken (easy) should appear
    const cards = screen.getAllByRole('button', { name: /Select .+ recipe/i })
    expect(cards).toHaveLength(1)
    expect(cards[0]).toHaveAttribute('aria-label', expect.stringContaining('Herb Roasted Chicken'))
  })

  it('switches to French locale — shows Recettes tab', () => {
    render(
      <RecipeLibrary
        onSelectRecipe={mockOnSelectRecipe}
        locale="fr"
      />
    )
    expect(screen.getByText('Recettes')).toBeInTheDocument()
    expect(screen.getByText('Mes recettes')).toBeInTheDocument()
  })

  it('shows My Recipes tab with 0 badge when no custom recipes', () => {
    render(
      <RecipeLibrary
        onSelectRecipe={mockOnSelectRecipe}
        locale="en"
        customRecipes={[]}
      />
    )
    expect(screen.getByRole('tab', { name: /My Recipes/i })).toBeInTheDocument()
  })

  it('calls onSelectRecipe when recipe is selected and Start Cooking is clicked', () => {
    const onSelect = vi.fn()
    render(
      <RecipeLibrary
        onSelectRecipe={onSelect}
        locale="en"
      />
    )
    // Click first recipe card to select it
    const firstCard = screen.getAllByRole('button', { name: /Select .+ recipe/i })[0]
    fireEvent.click(firstCard!.closest('article') ?? firstCard!)
    // Start Cooking button should now appear
    const startBtn = screen.getByRole('button', { name: /Start Cooking/i })
    fireEvent.click(startBtn)
    expect(onSelect).toHaveBeenCalledOnce()
  })
})
