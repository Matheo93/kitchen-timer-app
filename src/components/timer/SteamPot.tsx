'use client'

import { useEffect, useRef, useMemo } from 'react'

// Deterministic pseudo-random from a seed — avoids Math.random() in render
function seededRand(seed: number): number {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

interface SteamPotProps {
  progress: number // 0 = not started, 1 = complete
  isRunning: boolean
  isPaused: boolean
  isComplete: boolean
}

interface SteamWisp {
  x: number
  startY: number
  amplitude: number
  frequency: number
  speed: number
  opacity: number
  phase: number
  width: number
}

export function SteamPot({ progress, isRunning, isPaused, isComplete }: SteamPotProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const timeRef = useRef<number>(0)

  // Generate stable steam wisps — use deterministic seededRand to avoid Math.random in render
  const steamWisps = useMemo<SteamWisp[]>(() => {
    // More steam = earlier in cooking (high intensity = early stage)
    const intensity = 1 - progress
    const count = Math.max(0, Math.round(2 + intensity * 6))

    return Array.from({ length: count }, (_, i) => ({
      x: 80 + (i / (count - 1 || 1)) * 140,
      startY: 60,
      amplitude: 8 + seededRand(i * 7 + 1) * 12,
      frequency: 0.015 + seededRand(i * 7 + 2) * 0.01,
      speed: 0.4 + seededRand(i * 7 + 3) * 0.3,
      opacity: 0.3 + seededRand(i * 7 + 4) * 0.4,
      phase: seededRand(i * 7 + 5) * Math.PI * 2,
      width: 3 + seededRand(i * 7 + 6) * 4,
    }))
  }, [progress])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height

    function drawFrame(time: number) {
      if (!ctx || !canvas) return
      timeRef.current = time
      ctx.clearRect(0, 0, W, H)

      // ---- Background warmth glow ----
      if (isRunning && !isPaused) {
        const grd = ctx.createRadialGradient(W / 2, H, 10, W / 2, H, 120)
        grd.addColorStop(0, 'rgba(251, 191, 36, 0.12)')
        grd.addColorStop(1, 'rgba(251, 191, 36, 0)')
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, W, H)
      }

      // ---- Pot body ----
      const potX = 60
      const potY = 120
      const potW = 180
      const potH = 90
      const potColor = isComplete ? '#6ee7b7' : '#d97706'
      const potDark = isComplete ? '#059669' : '#92400e'

      // Pot shadow
      ctx.save()
      ctx.shadowColor = 'rgba(0,0,0,0.2)'
      ctx.shadowBlur = 15
      ctx.shadowOffsetY = 6

      // Pot body (rounded trapezoid)
      ctx.beginPath()
      ctx.moveTo(potX + 10, potY)
      ctx.lineTo(potX + potW - 10, potY)
      ctx.quadraticCurveTo(potX + potW + 5, potY, potX + potW, potY + 10)
      ctx.lineTo(potX + potW - 5, potY + potH)
      ctx.quadraticCurveTo(potX + potW - 5, potY + potH + 5, potX + potW - 15, potY + potH + 5)
      ctx.lineTo(potX + 15, potY + potH + 5)
      ctx.quadraticCurveTo(potX + 5, potY + potH + 5, potX + 5, potY + potH)
      ctx.lineTo(potX, potY + 10)
      ctx.quadraticCurveTo(potX - 5, potY, potX + 10, potY)
      ctx.closePath()

      const potGrd = ctx.createLinearGradient(potX, potY, potX + potW, potY + potH)
      potGrd.addColorStop(0, potColor)
      potGrd.addColorStop(0.4, '#fbbf24')
      potGrd.addColorStop(1, potDark)
      ctx.fillStyle = potGrd
      ctx.fill()
      ctx.restore()

      // Pot texture — subtle spice dots
      if (!isComplete) {
        ctx.save()
        ctx.globalAlpha = 0.15
        for (let i = 0; i < 6; i++) {
          const dotX = potX + 30 + i * 25
          const dotY = potY + 40 + (i % 2) * 20
          ctx.beginPath()
          ctx.arc(dotX, dotY, 2, 0, Math.PI * 2)
          ctx.fillStyle = '#7c2d12'
          ctx.fill()
        }
        ctx.restore()
      }

      // ---- Lid ----
      const lidY = potY - 18 + (isRunning && !isPaused ? Math.sin(time * 0.002) * 2 : 0)
      const lidW = potW + 10
      const lidX = potX - 5

      ctx.save()
      ctx.shadowColor = 'rgba(0,0,0,0.15)'
      ctx.shadowBlur = 8

      // Lid body
      ctx.beginPath()
      ctx.moveTo(lidX, lidY + 12)
      ctx.quadraticCurveTo(lidX, lidY, lidX + 10, lidY)
      ctx.lineTo(lidX + lidW - 10, lidY)
      ctx.quadraticCurveTo(lidX + lidW, lidY, lidX + lidW, lidY + 12)
      ctx.lineTo(lidX + lidW, lidY + 18)
      ctx.lineTo(lidX, lidY + 18)
      ctx.closePath()

      const lidGrd = ctx.createLinearGradient(lidX, lidY, lidX + lidW, lidY + 18)
      lidGrd.addColorStop(0, isComplete ? '#a7f3d0' : '#fbbf24')
      lidGrd.addColorStop(1, isComplete ? '#34d399' : '#d97706')
      ctx.fillStyle = lidGrd
      ctx.fill()
      ctx.restore()

      // Lid knob
      ctx.save()
      ctx.shadowColor = 'rgba(0,0,0,0.2)'
      ctx.shadowBlur = 4
      ctx.beginPath()
      ctx.arc(W / 2, lidY - 6, 8, 0, Math.PI * 2)
      ctx.fillStyle = isComplete ? '#059669' : '#92400e'
      ctx.fill()
      ctx.restore()

      // ---- Handles ----
      ctx.save()
      ctx.lineWidth = 8
      ctx.lineCap = 'round'
      ctx.strokeStyle = potDark

      // Left handle
      ctx.beginPath()
      ctx.moveTo(potX, potY + 30)
      ctx.quadraticCurveTo(potX - 20, potY + 30, potX - 25, potY + 50)
      ctx.quadraticCurveTo(potX - 20, potY + 70, potX, potY + 70)
      ctx.stroke()

      // Right handle
      ctx.beginPath()
      ctx.moveTo(potX + potW, potY + 30)
      ctx.quadraticCurveTo(potX + potW + 20, potY + 30, potX + potW + 25, potY + 50)
      ctx.quadraticCurveTo(potX + potW + 20, potY + 70, potX + potW, potY + 70)
      ctx.stroke()
      ctx.restore()

      // ---- Progress fill (glowing contents visible through lid gap) ----
      if (progress > 0) {
        ctx.save()
        ctx.globalAlpha = 0.6
        const fillH = (potH - 10) * Math.min(progress, 1)
        const fillY = potY + potH - fillH
        const fillGrd = ctx.createLinearGradient(0, fillY, 0, potY + potH)
        fillGrd.addColorStop(0, isComplete ? 'rgba(110,231,183,0.8)' : 'rgba(251,191,36,0.6)')
        fillGrd.addColorStop(1, isComplete ? 'rgba(16,185,129,0.9)' : 'rgba(217,119,6,0.8)')
        ctx.fillStyle = fillGrd
        ctx.beginPath()
        ctx.rect(potX + 5, fillY, potW - 10, fillH)
        ctx.fill()
        ctx.restore()
      }

      // ---- Steam wisps ----
      if ((isRunning || isPaused) && !isComplete && steamWisps.length > 0) {
        ctx.save()
        ctx.lineCap = 'round'

        steamWisps.forEach((wisp) => {
          const baseOpacity = isPaused ? wisp.opacity * 0.3 : wisp.opacity
          const wispProgress = ((time * wisp.speed * 0.001) % 1)
          const wispY = wisp.startY - wispProgress * 80
          const fade = wispProgress < 0.3 ? wispProgress / 0.3 : (1 - wispProgress) / 0.7

          ctx.globalAlpha = baseOpacity * fade
          ctx.strokeStyle = 'rgba(255,255,255,0.9)'
          ctx.lineWidth = wisp.width * (1 - wispProgress * 0.5)

          ctx.beginPath()
          ctx.moveTo(wisp.x, wisp.startY)

          for (let py = wisp.startY; py > wispY; py -= 4) {
            const xOffset = Math.sin(py * wisp.frequency + wisp.phase + time * 0.001) * wisp.amplitude
            ctx.lineTo(wisp.x + xOffset, py)
          }
          ctx.stroke()
        })

        ctx.restore()
      }

      // ---- Completion burst ----
      if (isComplete) {
        ctx.save()
        ctx.font = 'bold 24px serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#059669'
        ctx.fillText('✓', W / 2, potY - 40)
        ctx.restore()
      }

      if (isRunning && !isComplete) {
        animationRef.current = requestAnimationFrame(drawFrame)
      } else {
        // Draw static frame
        cancelAnimationFrame(animationRef.current)
      }
    }

    cancelAnimationFrame(animationRef.current)
    animationRef.current = requestAnimationFrame(drawFrame)

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [isRunning, isPaused, isComplete, steamWisps, progress])

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={260}
      className="w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[420px] mx-auto"
      style={{ imageRendering: 'auto' }}
      role="img"
      aria-label={`Cooking pot: ${Math.round(progress * 100)}% of current step completed. ${isComplete ? 'Recipe done.' : isRunning ? 'Timer running.' : isPaused ? 'Paused.' : 'Ready to start.'}`}
    />
  )
}
