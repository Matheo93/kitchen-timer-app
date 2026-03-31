'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class KitchenFallback extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('Kitchen Timer error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div
          role="alert"
          className="min-h-screen bg-amber-50 flex flex-col items-center justify-center text-center p-8 gap-4"
        >
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
            <rect x="14" y="24" width="28" height="18" rx="4" fill="#fbbf24"/>
            <rect x="10" y="20" width="36" height="6" rx="2" fill="#d97706"/>
            <rect x="4" y="24" width="6" height="10" rx="2" fill="#b45309"/>
            <rect x="46" y="24" width="6" height="10" rx="2" fill="#b45309"/>
          </svg>
          <h1 className="text-2xl font-bold text-stone-800">Something went wrong</h1>
          <p className="text-stone-500 max-w-sm">
            The kitchen timer encountered an unexpected error. Try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-amber-500 text-white rounded-full font-medium hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition-colors"
          >
            Refresh
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 text-left max-w-lg">
              <summary className="text-xs text-stone-400 cursor-pointer">Error details</summary>
              <pre className="mt-2 text-xs text-red-700 bg-red-50 rounded-lg p-3 overflow-auto">
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
