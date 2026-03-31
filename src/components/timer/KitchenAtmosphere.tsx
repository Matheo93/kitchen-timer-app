'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

/**
 * KitchenAtmosphere — the ambient visual environment surrounding the SteamPot.
 * Renders a canvas with warm kitchen steam wisps, ember particles, and ambient
 * gradient that breathes with the cooking state.
 *
 * LIGHT MODE geometry: Small dispersed embers, wide spread, airy ceiling gradient.
 * DARK MODE geometry: Dense rising columns, tight helical paths, deeper gradient horizon.
 * The SteamPot sits INSIDE this atmosphere, like a pot in a warm kitchen.
 */
interface KitchenAtmosphereProps {
  isRunning: boolean
  isPaused: boolean
  isComplete: boolean
  children: React.ReactNode
}

export function KitchenAtmosphere({ isRunning, isPaused, isComplete, children }: KitchenAtmosphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height

    interface Ember {
      x: number
      y: number
      r: number
      vy: number
      vx: number
      alpha: number
      life: number
      maxLife: number
      wobble: number
    }

    const embers: Ember[] = []

    function spawnEmber() {
      // DARK: tight column spawn (center-biased), larger particles, helical drift
      // LIGHT: wide dispersed spawn, small particles, gentle drift
      const xSpread = isDark ? 0.3 : 0.6
      const xOrigin = isDark ? W * 0.35 : W * 0.2
      const maxLife = isDark
        ? 80 + Math.random() * 60   // longer lived in dark
        : 50 + Math.random() * 80

      embers.push({
        x: xOrigin + Math.random() * W * xSpread,
        y: H,
        r: isDark
          ? 2.5 + Math.random() * 3  // larger in dark
          : 1.5 + Math.random() * 2,
        vy: isDark
          ? -(0.8 + Math.random() * 1.6)  // faster rise in dark
          : -(0.6 + Math.random() * 1.2),
        vx: isDark
          ? (Math.random() - 0.5) * 0.4  // less horizontal scatter in dark
          : (Math.random() - 0.5) * 0.8,
        alpha: isDark
          ? 0.6 + Math.random() * 0.35  // more opaque in dark
          : 0.4 + Math.random() * 0.4,
        life: 0,
        maxLife,
        wobble: (Math.random() - 0.5) * 0.08,  // helical wobble frequency
      })
    }

    let frame = 0

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, W, H)

      // DARK MODE: Deep horizon gradient — gradient fills more of the canvas,
      //            creates the feeling of a warm light source at the base
      // LIGHT MODE: Airy ceiling gradient — light and dispersed
      const gradient = ctx.createLinearGradient(0, H, 0, isDark ? H * 0.1 : 0)

      if (isComplete) {
        if (isDark) {
          gradient.addColorStop(0, 'rgba(52,211,153,0.28)')
          gradient.addColorStop(0.5, 'rgba(52,211,153,0.12)')
          gradient.addColorStop(1, 'rgba(52,211,153,0)')
        } else {
          gradient.addColorStop(0, 'rgba(209,250,229,0.18)')
          gradient.addColorStop(1, 'rgba(209,250,229,0)')
        }
      } else if (isRunning) {
        if (isDark) {
          gradient.addColorStop(0, 'rgba(245,158,11,0.32)')
          gradient.addColorStop(0.4, 'rgba(234,88,12,0.14)')
          gradient.addColorStop(1, 'rgba(0,0,0,0)')
        } else {
          gradient.addColorStop(0, 'rgba(251,191,36,0.15)')
          gradient.addColorStop(0.5, 'rgba(245,158,11,0.06)')
          gradient.addColorStop(1, 'rgba(0,0,0,0)')
        }
      } else if (isPaused) {
        if (isDark) {
          gradient.addColorStop(0, 'rgba(252,211,77,0.20)')
          gradient.addColorStop(1, 'rgba(0,0,0,0)')
        } else {
          gradient.addColorStop(0, 'rgba(252,211,77,0.10)')
          gradient.addColorStop(1, 'rgba(0,0,0,0)')
        }
      } else {
        if (isDark) {
          gradient.addColorStop(0, 'rgba(120,113,108,0.14)')  // warmer stone in dark
          gradient.addColorStop(1, 'rgba(0,0,0,0)')
        } else {
          gradient.addColorStop(0, 'rgba(214,211,209,0.08)')
          gradient.addColorStop(1, 'rgba(0,0,0,0)')
        }
      }

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, W, H)

      // Spawn rate: dark mode = denser (more particles)
      const spawnInterval = isDark
        ? (isRunning ? 3 : isPaused ? 7 : 14)
        : (isRunning ? 5 : isPaused ? 12 : 22)

      if (frame % spawnInterval === 0) {
        spawnEmber()
        if (isDark && isRunning) spawnEmber() // double spawn in dark + running
      }

      // Update and draw embers
      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i]
        // Dark mode: helical path (sinusoidal x movement)
        if (isDark) {
          e.x += e.vx + Math.sin(e.life * e.wobble * Math.PI) * 0.5
        } else {
          e.x += e.vx
        }
        e.y += e.vy
        e.life++

        const t = e.life / e.maxLife
        const alpha = e.alpha * (1 - t) * (t < 0.1 ? t * 10 : 1)

        ctx.beginPath()
        ctx.arc(e.x, e.y, e.r * (1 - t * 0.4), 0, Math.PI * 2)

        if (isComplete) {
          ctx.fillStyle = isDark
            ? `rgba(52,211,153,${alpha})`
            : `rgba(52,211,153,${alpha * 0.8})`
        } else if (isRunning) {
          ctx.fillStyle = isDark
            ? `rgba(251,146,60,${alpha})`   // orange-red in dark
            : `rgba(245,158,11,${alpha})`   // amber in light
        } else if (isPaused) {
          ctx.fillStyle = isDark
            ? `rgba(252,211,77,${alpha * 0.9})`
            : `rgba(252,211,77,${alpha * 0.7})`
        } else {
          ctx.fillStyle = isDark
            ? `rgba(168,162,158,${alpha * 0.6})`
            : `rgba(214,211,209,${alpha})`
        }
        ctx.fill()

        if (e.life >= e.maxLife) embers.splice(i, 1)
      }

      frame++
      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [isRunning, isPaused, isComplete, isDark])

  return (
    <div className="relative" aria-hidden={true} data-atmosphere="kitchen">
      <canvas
        ref={canvasRef}
        width={300}
        height={180}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
        style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
