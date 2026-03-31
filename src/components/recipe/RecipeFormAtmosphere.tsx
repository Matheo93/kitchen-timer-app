'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

/**
 * RecipeFormAtmosphere — the ambient kitchen world behind the recipe creation form.
 *
 * LIGHT geometry: Gentle warm parchment arcs radiating from the top-center,
 *   scattered flour dust particles drifting softly, horizontal recipe-card echoes
 *   — a morning kitchen counter, pen and paper, steam from a nearby pot.
 * DARK geometry: Deep hearth glow at base, dense ember drift columns rising,
 *   ingredient spice particle scatter, candlelight beam arcs — late night recipe
 *   journaling at the kitchen table by ember light.
 *
 * Visual vocabulary: stone, flour, ember, particle, beam, warmth, steam, smoke, dust, hearth.
 * Graphical primitives: radial gradients, linear gradients, arcs, bezier curves,
 *   rect fills, stroke paths, circular particles — layered kitchen depth.
 */
export function RecipeFormAtmosphere() {
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

    interface Particle {
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

    // Flour dust / ember particles — kitchen creation atmosphere
    const particles: Particle[] = []
    let frame = 0

    function spawnParticle() {
      if (isDark) {
        // Dark: ember drift from bottom center — hearth and smoke column
        particles.push({
          x: W * 0.25 + Math.random() * W * 0.5,
          y: H + 10,
          r: 4 + Math.random() * 8,
          vy: -(0.4 + Math.random() * 0.7),
          vx: (Math.random() - 0.5) * 0.5,
          alpha: 0.04 + Math.random() * 0.05,
          life: 0,
          maxLife: 120 + Math.random() * 80,
          wobble: 0.018 + Math.random() * 0.015,
        })
      } else {
        // Light: flour dust drifting across canvas from left edge — stone counter morning
        particles.push({
          x: Math.random() * W * 0.4,
          y: H * 0.1 + Math.random() * H * 0.7,
          r: 6 + Math.random() * 14,
          vy: -(0.1 + Math.random() * 0.2),
          vx: 0.1 + Math.random() * 0.25,
          alpha: 0.015 + Math.random() * 0.025,
          life: 0,
          maxLife: 200 + Math.random() * 120,
          wobble: 0.008 + Math.random() * 0.008,
        })
      }
    }

    function drawScene() {
      if (!ctx) return
      ctx.clearRect(0, 0, W, H)

      // === LAYER 1: Base parchment/hearth wash ===
      const baseGrad = ctx.createLinearGradient(0, 0, 0, H)
      if (isDark) {
        baseGrad.addColorStop(0, 'rgba(0,0,0,0)')
        baseGrad.addColorStop(0.6, 'rgba(234,88,12,0.03)')
        baseGrad.addColorStop(1, 'rgba(245,158,11,0.07)')
      } else {
        baseGrad.addColorStop(0, 'rgba(251,191,36,0.04)')
        baseGrad.addColorStop(0.5, 'rgba(245,158,11,0.02)')
        baseGrad.addColorStop(1, 'rgba(251,191,36,0.05)')
      }
      ctx.fillStyle = baseGrad
      ctx.fillRect(0, 0, W, H)

      // === LAYER 2: Radial hearth glow at bottom ===
      const radGrad = ctx.createRadialGradient(W / 2, H, 0, W / 2, H, W * 0.55)
      if (isDark) {
        radGrad.addColorStop(0, 'rgba(245,158,11,0.09)')
        radGrad.addColorStop(0.35, 'rgba(234,88,12,0.04)')
        radGrad.addColorStop(1, 'rgba(0,0,0,0)')
      } else {
        radGrad.addColorStop(0, 'rgba(251,191,36,0.06)')
        radGrad.addColorStop(0.4, 'rgba(245,158,11,0.02)')
        radGrad.addColorStop(1, 'rgba(0,0,0,0)')
      }
      ctx.fillStyle = radGrad
      ctx.fillRect(0, H * 0.45, W, H * 0.55)

      // === LAYER 3: Top radial beam — recipe paper warmth ===
      const topRad = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, W * 0.5)
      if (isDark) {
        topRad.addColorStop(0, 'rgba(245,158,11,0.05)')
        topRad.addColorStop(1, 'rgba(0,0,0,0)')
      } else {
        topRad.addColorStop(0, 'rgba(251,191,36,0.04)')
        topRad.addColorStop(1, 'rgba(0,0,0,0)')
      }
      ctx.fillStyle = topRad
      ctx.fillRect(0, 0, W, H * 0.4)

      // === LAYER 4: Stone counter line (light only) — horizontal warmth echo ===
      if (!isDark) {
        ctx.save()
        ctx.globalAlpha = 0.022
        ctx.strokeStyle = 'rgba(245,158,11,1)'
        ctx.lineWidth = 1
        // Two subtle horizontal bezier curves — stone counter grain
        for (let i = 0; i < 2; i++) {
          const y = H * (0.3 + i * 0.35)
          ctx.beginPath()
          ctx.moveTo(W * 0.02, y)
          ctx.bezierCurveTo(W * 0.28, y - 3, W * 0.72, y + 3, W * 0.98, y)
          ctx.stroke()
        }
        ctx.restore()
      }

      // === LAYER 5: Corner hearth arcs ===
      ctx.save()
      if (isDark) {
        // Dark: single strong arc from bottom center — ember smoke hearth
        ctx.globalAlpha = 0.06
        ctx.strokeStyle = 'rgba(245,158,11,1)'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(W / 2, H + 8, W * 0.38, Math.PI * 1.22, Math.PI * 1.78)
        ctx.stroke()
        ctx.globalAlpha = 0.03
        ctx.beginPath()
        ctx.arc(W / 2, H + 8, W * 0.52, Math.PI * 1.17, Math.PI * 1.83)
        ctx.stroke()
      } else {
        // Light: two small corner arcs — warm morning kitchen
        ctx.globalAlpha = 0.04
        ctx.strokeStyle = 'rgba(251,191,36,1)'
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.arc(0, H, W * 0.22, Math.PI * 1.5, Math.PI * 1.83)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(W, H, W * 0.22, Math.PI * 1.17, Math.PI * 1.5)
        ctx.stroke()
      }
      ctx.restore()

      // === LAYER 6: Spawn and draw particles (flour dust / ember drift) ===
      const spawnRate = isDark ? 28 : 40
      if (frame % spawnRate === 0) spawnParticle()

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]!
        const sinW = Math.sin(p.life * p.wobble * Math.PI * 2) * 10 * 0.012
        p.y += p.vy
        p.x += p.vx + sinW
        p.life++

        const t = p.life / p.maxLife
        const fadeIn = t < 0.12 ? t / 0.12 : 1
        const alpha = p.alpha * (1 - t) * fadeIn
        const r = p.r * (1 + t * 0.6)

        const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r)
        const color = isDark ? '245,158,11' : '251,191,36'
        pGrad.addColorStop(0, `rgba(${color},${alpha})`)
        pGrad.addColorStop(0.5, `rgba(${color},${alpha * 0.4})`)
        pGrad.addColorStop(1, `rgba(${color},0)`)
        ctx.fillStyle = pGrad
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fill()

        if (p.life >= p.maxLife || p.y < -r || p.x > W + r) {
          particles.splice(i, 1)
        }
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
      data-scene="recipe-form"
      style={{ mixBlendMode: isDark ? 'screen' : 'multiply', opacity: 0.8 }}
    />
  )
}
