'use client'

import { useEffect } from 'react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Kitchen Timer page error:', error)
  }, [error])

  return (
    <div
      role="alert"
      className="min-h-screen bg-amber-50 flex flex-col items-center justify-center text-center p-8 gap-4"
    >
      <span className="text-5xl" aria-hidden="true">🍳</span>
      <h1 className="text-2xl font-bold text-stone-800">Something went wrong</h1>
      <p className="text-stone-500 max-w-sm">
        The kitchen timer encountered an unexpected error. Try again or refresh the page.
      </p>
      <div className="flex gap-3 mt-2">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-amber-500 text-white rounded-full font-medium hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition-colors"
        >
          Try again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-white border border-amber-200 text-amber-700 rounded-full font-medium hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>
  )
}
