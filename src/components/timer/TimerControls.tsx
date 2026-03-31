'use client'

import type { TimerState } from '@/types/recipe'

interface TimerControlsProps {
  timerState: TimerState
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onNext: () => void
  onPrev: () => void
  onReset: () => void
  hasPrev: boolean
  hasNext: boolean
  isMuted?: boolean
  onToggleMute?: () => void
}

export function TimerControls({
  timerState,
  onStart,
  onPause,
  onResume,
  onNext,
  onPrev,
  onReset,
  hasPrev,
  hasNext,
  isMuted = false,
  onToggleMute,
}: TimerControlsProps) {
  const isIdle = timerState === 'idle'
  const isRunning = timerState === 'running'
  const isPaused = timerState === 'paused'
  const isComplete = timerState === 'completed'

  return (
    <div className="flex flex-col items-center gap-4" role="group" aria-label="Timer controls">
      {/* Main action button row */}
      <div className="flex items-center gap-3">
        {/* Prev step */}
        <button
          onClick={onPrev}
          disabled={!hasPrev || isIdle}
          className="w-11 h-11 rounded-full flex items-center justify-center bg-amber-100 text-amber-700 hover:bg-amber-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
          aria-label="Previous step (J)"
          aria-keyshortcuts="j ArrowLeft"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Play / Pause / Resume */}
        {isIdle && (
          <button
            onClick={onStart}
            className="w-16 h-16 rounded-full flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
            aria-label="Start cooking (Space)"
            aria-keyshortcuts="Space k"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </button>
        )}

        {isRunning && (
          <button
            onClick={onPause}
            className="w-16 h-16 rounded-full flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
            aria-label="Pause timer (Space)"
            aria-keyshortcuts="Space k"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          </button>
        )}

        {isPaused && (
          <button
            onClick={onResume}
            className="w-16 h-16 rounded-full flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white shadow-lg animate-pulse hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
            aria-label="Resume timer (Space)"
            aria-keyshortcuts="Space k"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </button>
        )}

        {isComplete && (
          <button
            onClick={onReset}
            className="w-16 h-16 rounded-full flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
            aria-label="Cook again"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-3.1" />
            </svg>
          </button>
        )}

        {/* Next step */}
        <button
          onClick={onNext}
          disabled={!hasNext || isIdle}
          className="w-11 h-11 rounded-full flex items-center justify-center bg-amber-100 text-amber-700 hover:bg-amber-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
          aria-label="Next step (L)"
          aria-keyshortcuts="l ArrowRight"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Secondary controls row */}
      <div className="flex items-center gap-4">
        {/* Reset link */}
        {!isIdle && !isComplete && (
          <button
            onClick={onReset}
            className="text-sm text-amber-600/60 hover:text-amber-600 underline underline-offset-2 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 rounded"
            aria-label="Reset timer and start over (R)"
            aria-keyshortcuts="r"
          >
            Reset
          </button>
        )}

        {/* Mute toggle — WCAG 1.4.2 */}
        {onToggleMute && !isIdle && !isComplete && (
          <button
            onClick={onToggleMute}
            className={`text-sm flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 ${
              isMuted
                ? 'bg-stone-100 text-stone-400 hover:bg-stone-200'
                : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
            }`}
            aria-label={isMuted ? 'Unmute audio notifications' : 'Mute audio notifications'}
            aria-pressed={isMuted}
          >
            {isMuted ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
                <span>Sound off</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
                <span>Sound on</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
