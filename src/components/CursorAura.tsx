import { useEffect, useRef } from 'react'
import styles from './CursorAura.module.css'

type Props = {
  enabled: boolean
}

type TrailPoint = { x: number; y: number; life: number }

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

    const mouse = { x: -9999, y: -9999, inside: false }
    const cursor = { x: 0, y: 0 }
    const trail: TrailPoint[] = []
    let tick = 0

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
    }

    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.inside =
        mouse.x >= 0 && mouse.y >= 0 && mouse.x <= width && mouse.y <= height
    }

    const onLeave = () => {
      mouse.inside = false
    }

    const draw = () => {
      if (!running) return
      tick += 1

      cursor.x += (mouse.x - cursor.x) * 0.18
      cursor.y += (mouse.y - cursor.y) * 0.18

      if (mouse.inside && tick % 2 === 0) {
        trail.push({ x: cursor.x, y: cursor.y, life: 1 })
        if (trail.length > 28) trail.shift()
      }

      for (const p of trail) p.life *= 0.92
      while (trail.length && trail[0].life < 0.04) trail.shift()

      ctx.clearRect(0, 0, width, height)

      if (!mouse.inside && trail.length === 0) {
        raf = requestAnimationFrame(draw)
        return
      }

      // Soft amber spotlight under cursor
      if (mouse.inside) {
        const glow = ctx.createRadialGradient(
          cursor.x,
          cursor.y,
          0,
          cursor.x,
          cursor.y,
          140,
        )
        glow.addColorStop(0, 'rgba(245, 166, 35, 0.16)')
        glow.addColorStop(0.45, 'rgba(245, 166, 35, 0.05)')
        glow.addColorStop(1, 'rgba(245, 166, 35, 0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(cursor.x, cursor.y, 140, 0, Math.PI * 2)
        ctx.fill()
      }

      // Trail polyline
      if (trail.length > 1) {
        ctx.beginPath()
        ctx.moveTo(trail[0].x, trail[0].y)
        for (let i = 1; i < trail.length; i++) {
          ctx.lineTo(trail[i].x, trail[i].y)
        }
        ctx.strokeStyle = 'rgba(245, 166, 35, 0.35)'
        ctx.lineWidth = 1.25
        ctx.stroke()

        for (const p of trail) {
          ctx.fillStyle = `rgba(245, 166, 35, ${0.55 * p.life})`
          ctx.fillRect(p.x - 1, p.y - 1, 2, 2)
        }
      }

      if (mouse.inside) {
        const x = cursor.x
        const y = cursor.y
        const pulse = 18 + Math.sin(tick * 0.08) * 2

        // Outer rotating brackets (engineer reticle)
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(tick * 0.012)
        ctx.strokeStyle = 'rgba(245, 166, 35, 0.7)'
        ctx.lineWidth = 1
        const arm = pulse + 10
        for (const [cx, cy, dx] of [
          [-arm, -arm, 1],
          [arm, -arm, -1],
          [-arm, arm, 1],
          [arm, arm, -1],
        ] as const) {
          ctx.beginPath()
          ctx.moveTo(cx, cy)
          ctx.lineTo(cx + dx * 12, cy)
          ctx.moveTo(cx, cy)
          ctx.lineTo(cx, cy + (cy < 0 ? 12 : -12))
          ctx.stroke()
        }
        ctx.restore()

        // Inner crosshair
        ctx.strokeStyle = 'rgba(232, 230, 225, 0.55)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x - 14, y)
        ctx.lineTo(x - 4, y)
        ctx.moveTo(x + 4, y)
        ctx.lineTo(x + 14, y)
        ctx.moveTo(x, y - 14)
        ctx.lineTo(x, y - 4)
        ctx.moveTo(x, y + 4)
        ctx.lineTo(x, y + 14)
        ctx.stroke()

        // Center dot
        ctx.fillStyle = '#f5a623'
        ctx.fillRect(x - 1.5, y - 1.5, 3, 3)

        // Coordinate readout
        const label = `x:${String(Math.round(mouse.x)).padStart(4, '0')}  y:${String(Math.round(mouse.y)).padStart(4, '0')}`
        ctx.font = '10px "IBM Plex Mono", monospace'
        ctx.fillStyle = 'rgba(245, 166, 35, 0.85)'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        ctx.fillText(label, x + 18, y + 16)

        // Scanning ring
        ctx.beginPath()
        ctx.arc(x, y, pulse, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(245, 166, 35, 0.35)'
        ctx.stroke()
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    cursor.x = width / 2
    cursor.y = height / 3
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
