'use client'

/**
 * BurnerCoil — the heated coil of the stove burner, surrounding the SteamPot.
 * Encodes step progress spatially: the coil arc fills clockwise as cooking progresses.
 * No numbers, no text — time is encoded in heat color and arc extent.
 */
interface BurnerCoilProps {
  progress: number   // 0 = not started, 1 = complete
  isRunning: boolean
  isPaused: boolean
  isIdle: boolean
}

export function BurnerCoil({ progress, isRunning, isPaused, isIdle }: BurnerCoilProps) {
  const r = 40
  const cx = 56
  const cy = 56
  const circumference = 2 * Math.PI * r
  // Arc from top, clockwise — fills as progress increases
  const dashOffset = circumference * (1 - Math.max(0, Math.min(1, progress)))
  const coilColor = isIdle ? '#e5e7eb' : isPaused ? '#fcd34d' : isRunning ? '#f59e0b' : '#6ee7b7'

  return (
    <svg
      width={112}
      height={112}
      viewBox="0 0 112 112"
      aria-hidden="true"
      className="mx-auto"
    >
      {/* Coil track — cold metal */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#fef3c7"
        strokeWidth="8"
      />
      {/* Heated coil arc — encodes elapsed step fraction */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={coilColor}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{
          transition: 'stroke-dashoffset 0.4s linear, stroke 0.3s ease',
          filter: isRunning ? 'drop-shadow(0 0 6px rgba(245,158,11,0.5))' : 'none',
        }}
      />
      {/* Heat center — pulses when running */}
      <circle
        cx={cx}
        cy={cy}
        r={isRunning ? 6 : 4}
        fill={coilColor}
        style={{ transition: 'r 0.3s ease, fill 0.3s ease' }}
      />
    </svg>
  )
}
