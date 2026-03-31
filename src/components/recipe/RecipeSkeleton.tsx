'use client'

/**
 * RecipeSkeleton — shimmer placeholder cards for the recipe library loading state.
 * Matches the layout of RecipeCard to prevent layout shift.
 */
export function RecipeCardSkeleton() {
  return (
    <div
      className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100 animate-pulse"
      aria-hidden="true"
    >
      <div className="space-y-3">
        {/* Title shimmer */}
        <div className="h-5 bg-amber-100 rounded-lg w-3/4" />
        {/* Description shimmer */}
        <div className="h-3.5 bg-amber-50 rounded-lg w-full" />
        <div className="h-3.5 bg-amber-50 rounded-lg w-4/5" />
        {/* Meta row shimmer */}
        <div className="flex items-center gap-3 pt-1">
          <div className="h-5 bg-amber-100 rounded-full w-14" />
          <div className="h-4 bg-amber-50 rounded w-16" />
          <div className="h-4 bg-amber-50 rounded w-20" />
          <div className="h-4 bg-amber-50 rounded w-16" />
        </div>
      </div>
    </div>
  )
}

export function RecipeLibrarySkeleton() {
  return (
    <div className="space-y-3" aria-label="Loading recipes" aria-busy="true">
      {[1, 2, 3, 4].map((i) => (
        <RecipeCardSkeleton key={i} />
      ))}
    </div>
  )
}
