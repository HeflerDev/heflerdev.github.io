import { useEffect, useRef } from 'react'
import styles from './CursorAura.module.css'

type Props = {
  enabled: boolean
}

type Ripple = { x: number; y: number; born: number }

export function CursorAura({ enabled }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!enabled) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const parent = canvas.parentElement
    if (!parent) return

    let width = 0
    let height = 0
    let raf = 0
    let running = true

    const mouse = { x: 0, y: 0, inside: false, moved: false }
    const cursor = { x: 0, y: 0 }
    const ripples: Ripple[] = []
    let tick = 0
    let lastRippleAt = 0

    const resize = () => {
      const rect = parent.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (!mouse.moved) {
        mouse.x = width * 0.55
        mouse.y = height * 0.35
        cursor.x = mouse.x
        cursor.y = mouse.y
      }
    }

    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.inside =
        mouse.x >= 0 && mouse.y >= 0 && mouse.x <= width && mouse.y <= height
      mouse.moved = true

      if (mouse.inside && tick - lastRippleAt > 8) {
        ripples.push({ x: mouse.x, y: mouse.y, born: tick })
        if (ripples.length > 10) ripples.shift()
        lastRippleAt = tick
      }
    }

    const onLeave = () => {
      mouse.inside = false
    }

    const draw = () => {
      if (!running) return
      tick += 1

      cursor.x += (mouse.x - cursor.x) * 0.16
      cursor.y += (mouse.y - cursor.y) * 0.16

      ctx.clearRect(0, 0, width, height)

      const cx = cursor.x
      const cy = cursor.y
      const t = tick * 0.045

      const rowStep = 28
      const colStep = 14
      ctx.lineWidth = 1

      for (let y = 0; y <= height + rowStep; y += rowStep) {
        ctx.beginPath()
        let first = true
        for (let x = 0; x <= width + colStep; x += colStep) {
          const dx = x - cx
          const dy = y - cy
          const dist = Math.hypot(dx, dy)
          const influence = Math.exp(-dist * 0.0045)
          const ambient = Math.sin(x * 0.018 + t) * 3.5
          const mouseWave = Math.sin(dist * 0.035 - t * 2.2) * 16 * influence
          const py = y + ambient + mouseWave

          if (first) {
            ctx.moveTo(x, py)
            first = false
          } else {
            ctx.lineTo(x, py)
          }
        }
        const edgeFade = 0.1 + 0.35 * (1 - Math.abs(y / height - 0.45))
        ctx.strokeStyle = `rgba(245, 166, 35, ${0.045 + edgeFade * 0.04})`
        ctx.stroke()
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i]
        const age = tick - r.born
        const radius = age * 2.4
        const alpha = Math.max(0, 0.35 - age * 0.008)
        if (alpha <= 0.01) {
          ripples.splice(i, 1)
          continue
        }
        ctx.beginPath()
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(245, 166, 35, ${alpha})`
        ctx.lineWidth = 1.25
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(r.x, r.y, radius * 0.55, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(232, 230, 225, ${alpha * 0.35})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      if (mouse.inside || mouse.moved) {
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 220)
        glow.addColorStop(0, 'rgba(245, 166, 35, 0.1)')
        glow.addColorStop(0.4, 'rgba(245, 166, 35, 0.03)')
        glow.addColorStop(1, 'rgba(245, 166, 35, 0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(cx, cy, 220, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    parent.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(draw)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      parent.removeEventListener('mouseleave', onLeave)
    }
  }, [enabled])

  if (!enabled) return null

  return <canvas className={styles.aura} ref={canvasRef} aria-hidden="true" />
}
