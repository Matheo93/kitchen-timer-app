export default function Loading() {
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col items-center justify-center gap-4"
      role="status"
      aria-label="Loading Kitchen Timer"
    >
      {/* Animated pot loader */}
      <div className="relative w-16 h-16" aria-hidden="true">
        <div className="absolute inset-0 rounded-full border-4 border-amber-200 animate-spin border-t-amber-500" />
        <div className="absolute inset-3 flex items-center justify-center text-2xl">
          🍳
        </div>
      </div>
      <p className="text-stone-400 text-sm animate-pulse">Heating up...</p>
    </div>
  )
}
