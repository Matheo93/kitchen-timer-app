import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { RecipeForm } from '../RecipeForm'

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: 'light', setTheme: vi.fn() }),
}))

// Mock canvas
HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as typeof HTMLCanvasElement.prototype.getContext

// Mock framer-motion to avoid animation complexity in tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion')
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) =>
        <div {...props}>{children}</div>,
      span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement> & { children?: React.ReactNode }) =>
        <span {...props}>{children}</span>,
      button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }) =>
        <button {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  }
})

const mockOnSave = vi.fn()
const mockOnCancel = vi.fn()

describe('RecipeForm', () => {
  it('renders Create a recipe heading in English', () => {
    render(<RecipeForm onSave={mockOnSave} onCancel={mockOnCancel} locale="en" />)
    expect(screen.getByRole('heading', { name: /Create a recipe/i })).toBeInTheDocument()
  })

  it('renders Créer une recette heading in French', () => {
    render(<RecipeForm onSave={mockOnSave} onCancel={mockOnCancel} locale="fr" />)
    expect(screen.getByText(/Créer une recette/i)).toBeInTheDocument()
  })

  it('starts with 2 steps by default', () => {
    render(<RecipeForm onSave={mockOnSave} onCancel={mockOnCancel} locale="en" />)
    expect(screen.getAllByText(/Step [12]/)).toHaveLength(2)
  })

  it('adds a step when Add a step is clicked', () => {
    render(<RecipeForm onSave={mockOnSave} onCancel={mockOnCancel} locale="en" />)
    const addBtn = screen.getByRole('button', { name: /Add a step/i })
    fireEvent.click(addBtn)
    expect(screen.getAllByText(/Step [123]/)).toHaveLength(3)
  })

  it('shows validation error when submitting with empty title', async () => {
    render(<RecipeForm onSave={mockOnSave} onCancel={mockOnCancel} locale="en" />)
    const submitBtn = screen.getByRole('button', { name: /Create recipe/i })
    fireEvent.click(submitBtn)
    await waitFor(() => {
      const alerts = screen.getAllByRole('alert')
      expect(alerts.length).toBeGreaterThan(0)
    })
  })

  it('calls onCancel when Cancel is clicked', () => {
    render(<RecipeForm onSave={mockOnSave} onCancel={mockOnCancel} locale="en" />)
    const cancelBtn = screen.getByRole('button', { name: /Cancel/i })
    fireEvent.click(cancelBtn)
    expect(mockOnCancel).toHaveBeenCalledOnce()
  })

  it('renders in edit mode with initialRecipe title', () => {
    const recipe = {
      id: 'test-1',
      title: 'My Test Recipe',
      description: 'A description for testing purposes here.',
      difficulty: 'easy' as const,
      servings: 2,
      cuisine: 'test',
      totalTimeSeconds: 600,
      steps: [
        { id: 's1', title: 'Step one', description: 'Do the first thing here please', durationSeconds: 300 },
        { id: 's2', title: 'Step two', description: 'Do the second thing here now', durationSeconds: 300 },
      ],
    }
    render(<RecipeForm onSave={mockOnSave} onCancel={mockOnCancel} locale="en" initialRecipe={recipe} />)
    expect(screen.getByText(/Edit recipe/i)).toBeInTheDocument()
    const titleInput = screen.getByLabelText(/Recipe name/i) as HTMLInputElement
    expect(titleInput.value).toBe('My Test Recipe')
  })
})
