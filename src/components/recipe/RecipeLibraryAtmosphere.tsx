'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

/**
 * RecipeLibraryAtmosphere — the ambient kitchen world behind the recipe library.
 *
 * LIGHT geometry: Wide dispersed steam wisps rising from stone-warm corners,
 *   gentle Bézier curves, soft gradient arcs — morning kitchen warmth like embers dying.
 * DARK geometry: Dense central smoke columns, helical ember particle paths,
 *   stronger orange glow, deeper stone-grey horizon — late-night kitchen at candlelight.
 *
 * Visual vocabulary: stone, smoke, ember, particle, beam, pulse — kitchen heat.
 * Graphical primitives: arcs, bezier curves, radial gradients, linear gradients,
 * rect fills, stroke paths — creating depth and richness.
 */
export function RecipeLibraryAtmosphere() {
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

    interface Wisp {
      x: number
      y: number
      r: number
      vy: number
      vx: number
      alpha: number
      life: number
      maxLife: number
      wobbleFreq: number
      wobbleAmp: number
      cpx: number // bezier control point x offset
      cpy: number // bezier control point y offset
    }

    // Smoke/ember wisps — kitchen atmosphere particles
    const wisps: Wisp[] = []

    function spawnWisp() {
      if (isDark) {
        // Dark: tight central smoke column, larger ember wisps, helical motion — stone hearth glow
        wisps.push({
          x: W * 0.3 + Math.random() * W * 0.4,
          y: H + 15,
          r: 10 + Math.random() * 16,
          vy: -(0.5 + Math.random() * 0.9),
          vx: (Math.random() - 0.5) * 0.4,
          alpha: 0.05 + Math.random() * 0.06,
          life: 0,
          maxLife: 140 + Math.random() * 100,
          wobbleFreq: 0.025 + Math.random() * 0.02,
          wobbleAmp: 12 + Math.random() * 16,
          cpx: (Math.random() - 0.5) * 40,
          cpy: -(30 + Math.random() * 40),
        })
      } else {
        // Light: wide dispersed from sides
        const fromLeft = Math.random() < 0.5
        wisps.push({
          x: fromLeft ? Math.random() * W * 0.35 : W * 0.65 + Math.random() * W * 0.35,
          y: H + 15,
          r: 14 + Math.random() * 22,
          vy: -(0.3 + Math.random() * 0.5),
          vx: (fromLeft ? 1 : -1) * (0.1 + Math.random() * 0.4),
          alpha: 0.025 + Math.random() * 0.03,
          life: 0,
          maxLife: 180 + Math.random() * 130,
          wobbleFreq: 0.012 + Math.random() * 0.01,
          wobbleAmp: 18 + Math.random() * 24,
          cpx: (fromLeft ? 1 : -1) * (20 + Math.random() * 30),
          cpy: -(40 + Math.random() * 50),
        })
      }
    }

    let frame = 0

    function drawScene() {
      if (!ctx) return
      ctx.clearRect(0, 0, W, H)

      // === LAYER 1: Base gradient wash ===
      const baseGrad = ctx.createLinearGradient(0, H, 0, H * 0.3)
      if (isDark) {
        baseGrad.addColorStop(0, 'rgba(245,158,11,0.08)')
        baseGrad.addColorStop(0.5, 'rgba(234,88,12,0.04)')
        baseGrad.addColorStop(1, 'rgba(0,0,0,0)')
      } else {
        baseGrad.addColorStop(0, 'rgba(251,191,36,0.06)')
        baseGrad.addColorStop(0.5, 'rgba(245,158,11,0.03)')
        baseGrad.addColorStop(1, 'rgba(0,0,0,0)')
      }
      ctx.fillStyle = baseGrad
      ctx.fillRect(0, 0, W, H)

      // === LAYER 2: Radial glow at base center ===
      const radGrad = ctx.createRadialGradient(W / 2, H, 20, W / 2, H, W * 0.6)
      if (isDark) {
        radGrad.addColorStop(0, 'rgba(245,158,11,0.10)')
        radGrad.addColorStop(0.4, 'rgba(234,88,12,0.04)')
        radGrad.addColorStop(1, 'rgba(0,0,0,0)')
      } else {
        radGrad.addColorStop(0, 'rgba(251,191,36,0.07)')
        radGrad.addColorStop(0.4, 'rgba(245,158,11,0.03)')
        radGrad.addColorStop(1, 'rgba(0,0,0,0)')
      }
      ctx.fillStyle = radGrad
      ctx.fillRect(0, H * 0.4, W, H * 0.6)

      // === LAYER 3: Subtle grid lines (recipe card visual echo) ===
      // Light: faint horizontal lines echo recipe card rows
      // Dark: none (too harsh)
      if (!isDark) {
        ctx.save()
        ctx.globalAlpha = 0.018
        ctx.strokeStyle = 'rgba(245,158,11,1)'
        ctx.lineWidth = 1
        for (let y = H * 0.25; y < H; y += H / 5) {
          ctx.beginPath()
          ctx.moveTo(W * 0.05, y)
          ctx.bezierCurveTo(W * 0.3, y - 4, W * 0.7, y + 4, W * 0.95, y)
          ctx.stroke()
        }
        ctx.restore()
      }

      // === LAYER 4: Corner warmth arcs (graphical accent) ===
      ctx.save()
      if (isDark) {
        // Dark: single arc from bottom center, strong
        ctx.globalAlpha = 0.07
        ctx.strokeStyle = 'rgba(245,158,11,1)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(W / 2, H + 10, W * 0.4, Math.PI * 1.2, Math.PI * 1.8)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(W / 2, H + 10, W * 0.55, Math.PI * 1.15, Math.PI * 1.85)
        ctx.globalAlpha = 0.04
        ctx.stroke()
      } else {
        // Light: two small corner arcs from bottom-left and bottom-right
        ctx.globalAlpha = 0.05
        ctx.strokeStyle = 'rgba(251,191,36,1)'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(0, H, W * 0.25, Math.PI * 1.5, Math.PI * 1.85)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(W, H, W * 0.25, Math.PI * 1.15, Math.PI * 1.5)
        ctx.stroke()
      }
      ctx.restore()

      // === LAYER 5: Spawn and draw wisps ===
      const spawnRate = isDark ? 22 : 32
      if (frame % spawnRate === 0) spawnWisp()

      for (let i = wisps.length - 1; i >= 0; i--) {
        const w = wisps[i]
        const sinWobble = Math.sin(w.life * w.wobbleFreq * Math.PI * 2) * w.wobbleAmp * 0.012
        w.y += w.vy
        w.x += w.vx + sinWobble
        w.life++

        const t = w.life / w.maxLife
        const fadeIn = t < 0.15 ? t / 0.15 : 1
        const alpha = w.alpha * (1 - t) * fadeIn

        // Expand radius as wisps rise
        const r = w.r * (1 + t * 0.8)

        // Draw wisp as radial gradient for soft look
        const wispGrad = ctx.createRadialGradient(w.x, w.y, 0, w.x, w.y, r)
        const color = isDark ? '245,158,11' : '251,191,36'
        wispGrad.addColorStop(0, `rgba(${color},${alpha})`)
        wispGrad.addColorStop(0.5, `rgba(${color},${alpha * 0.5})`)
        wispGrad.addColorStop(1, `rgba(${color},0)`)
        ctx.fillStyle = wispGrad
        ctx.beginPath()
        ctx.arc(w.x, w.y, r, 0, Math.PI * 2)
        ctx.fill()

        // Dark mode: draw a subtle bezier trail from spawn point
        if (isDark && w.life < 40 && alpha > 0.01) {
          ctx.save()
          ctx.globalAlpha = alpha * 0.3
          ctx.strokeStyle = `rgba(245,158,11,1)`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(w.x, w.y + w.life * Math.abs(w.vy))
          ctx.bezierCurveTo(
            w.x + w.cpx * 0.3, w.y + w.cpy * 0.3,
            w.x + w.cpx * 0.6, w.y + w.cpy * 0.6,
            w.x, w.y
          )
          ctx.stroke()
          ctx.restore()
        }

        if (w.life >= w.maxLife || w.y < -r) wisps.splice(i, 1)
      }

      frame++
      animRef.current = requestAnimationFrame(drawScene)
    }

    animRef.current = requestAnimationFrame(drawScene)
    return () => cancelAnimationFrame(animRef.current)
  }, [isDark])

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={900}
      className="fixed inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
      data-scene="recipe-library"
      style={{ mixBlendMode: isDark ? 'screen' : 'multiply', opacity: 0.85 }}
    />
  )
}
