import { useEffect, useRef } from 'react'
import styles from './CursorAura.module.css'
import type { PhysicsMode } from './PhysicsCanvas'

type Props = {
  enabled: boolean
  mobile?: boolean
  mode?: PhysicsMode
}

type Ripple = { x: number; y: number; born: number }

export function CursorAura({ enabled, mobile = false, mode = 'idle' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!enabled) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const parent = canvas.parentElement
    if (!parent) return

    const breakout = mode === 'breakout'
    let width = 0
    let height = 0
    let raf = 0
    let running = true

    const pointer = { x: 0, y: 0, active: false, touched: false }
    const cursor = { x: 0, y: 0 }
    const ripples: Ripple[] = []
    let tick = 0
    let lastRippleAt = 0

    const paddleY = () => height - (mobile ? 36 : 44)
    const paddleW = mobile ? 96 : 120

    const resize = () => {
      const rect = parent.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (!pointer.active && !pointer.touched) {
        pointer.x = width * 0.5
        pointer.y = breakout ? paddleY() : height * 0.36
        cursor.x = pointer.x
        cursor.y = pointer.y
      }
    }

    const setFromClient = (clientX: number, clientY: number) => {
      const rect = parent.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top
      const inside = x >= 0 && y >= 0 && x <= width && y <= height
      if (!inside && !breakout) {
        pointer.active = false
        return false
      }
      pointer.x = Math.max(0, Math.min(width, x))
      pointer.y = breakout ? paddleY() : y
      pointer.active = true
      return true
    }

    const spawnRipple = (x: number, y: number) => {
      ripples.push({ x, y, born: tick })
      if (ripples.length > (mobile ? 6 : 10)) ripples.shift()
      lastRippleAt = tick
    }

    const onMove = (e: MouseEvent) => {
      if (mobile && !breakout) return
      if (setFromClient(e.clientX, e.clientY) && tick - lastRippleAt > 8) {
        spawnRipple(pointer.x, breakout ? paddleY() : pointer.y)
      }
    }

    const onLeave = () => {
      if (!breakout) pointer.active = false
    }

    const onTouch = (e: TouchEvent) => {
      if (!mobile && !breakout) return
      const t = e.touches[0]
      if (!t) return
      if (e.cancelable) e.preventDefault()
      if (setFromClient(t.clientX, t.clientY)) {
        pointer.touched = true
        if (tick - lastRippleAt > 6) {
          spawnRipple(pointer.x, breakout ? paddleY() : pointer.y)
        }
      }
    }

    const onTouchEnd = (e: TouchEvent) => {
      if ((mobile || breakout) && e.cancelable) e.preventDefault()
      pointer.touched = false
      if (!breakout) pointer.active = false
    }

    const draw = () => {
      if (!running) return
      tick += 1

      if (breakout) {
        pointer.y = paddleY()
        pointer.active = true
      } else if (mobile && !pointer.touched) {
        const t = tick * 0.011
        pointer.x = width * 0.5 + Math.sin(t) * width * 0.32
        pointer.y = height * 0.34 + Math.sin(t * 1.7 + 0.8) * height * 0.2
        pointer.active = true
        if (tick - lastRippleAt > 55) {
          spawnRipple(pointer.x, pointer.y)
        }
      }

      const follow = breakout
        ? 0.35
        : mobile
          ? pointer.touched
            ? 0.32
            : 0.08
          : 0.16
      cursor.x += (pointer.x - cursor.x) * follow
      cursor.y += (pointer.y - cursor.y) * follow

      ctx.clearRect(0, 0, width, height)

      const cx = cursor.x
      const cy = breakout ? paddleY() : cursor.y
      const t = tick * 0.045
      const rowStep = mobile ? 34 : 28
      const colStep = mobile ? 18 : 14

      ctx.lineWidth = 1
      for (let y = 0; y <= height + rowStep; y += rowStep) {
        ctx.beginPath()
        let first = true
        for (let x = 0; x <= width + colStep; x += colStep) {
          const dx = x - cx
          const dy = y - cy
          const dist = Math.hypot(dx, dy)
          const influence = Math.exp(-dist * (mobile ? 0.0038 : 0.0045))
          const ambient = Math.sin(x * 0.018 + t) * (mobile ? 4.5 : 3.5)
          const mouseWave =
            Math.sin(dist * 0.035 - t * 2.2) * (mobile ? 20 : 16) * influence
          const py = y + ambient + mouseWave

          if (first) {
            ctx.moveTo(x, py)
            first = false
          } else {
            ctx.lineTo(x, py)
          }
        }
        const edgeFade = 0.1 + 0.35 * (1 - Math.abs(y / height - 0.45))
        ctx.strokeStyle = `rgba(245, 166, 35, ${0.05 + edgeFade * 0.05})`
        ctx.stroke()
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i]
        const age = tick - r.born
        const radius = age * (mobile ? 2.8 : 2.4)
        const alpha = Math.max(0, 0.4 - age * 0.007)
        if (alpha <= 0.01) {
          ripples.splice(i, 1)
          continue
        }
        ctx.beginPath()
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(245, 166, 35, ${alpha})`
        ctx.lineWidth = 1.25
        ctx.stroke()
      }

      if (breakout) {
        const half = paddleW / 2
        const px = Math.max(half + 4, Math.min(width - half - 4, cx))
        const py = paddleY()
        const glow = ctx.createRadialGradient(px, py, 0, px, py, 120)
        glow.addColorStop(0, 'rgba(245, 166, 35, 0.18)')
        glow.addColorStop(1, 'rgba(245, 166, 35, 0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(px, py, 120, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = 'rgba(245, 166, 35, 0.85)'
        ctx.strokeStyle = 'rgba(196, 132, 26, 0.9)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.roundRect(px - half, py - 7, paddleW, 14, 4)
        ctx.fill()
        ctx.stroke()
      } else {
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, mobile ? 180 : 220)
        glow.addColorStop(0, `rgba(245, 166, 35, ${mobile ? 0.16 : 0.1})`)
        glow.addColorStop(0.4, 'rgba(245, 166, 35, 0.04)')
        glow.addColorStop(1, 'rgba(245, 166, 35, 0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(cx, cy, mobile ? 180 : 220, 0, Math.PI * 2)
        ctx.fill()

        if (mobile) {
          const pulse = 5 + Math.sin(tick * 0.1) * 2
          ctx.beginPath()
          ctx.arc(cx, cy, pulse + 10, 0, Math.PI * 2)
          ctx.strokeStyle = 'rgba(245, 166, 35, 0.35)'
          ctx.lineWidth = 1
          ctx.stroke()
          ctx.fillStyle = '#f5a623'
          ctx.beginPath()
          ctx.arc(cx, cy, 2.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    parent.addEventListener('mouseleave', onLeave)
    parent.addEventListener('touchstart', onTouch, { passive: false })
    parent.addEventListener('touchmove', onTouch, { passive: false })
    parent.addEventListener('touchend', onTouchEnd, { passive: false })
    parent.addEventListener('touchcancel', onTouchEnd, { passive: false })
    raf = requestAnimationFrame(draw)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      parent.removeEventListener('mouseleave', onLeave)
      parent.removeEventListener('touchstart', onTouch)
      parent.removeEventListener('touchmove', onTouch)
      parent.removeEventListener('touchend', onTouchEnd)
      parent.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [enabled, mobile, mode])

  if (!enabled) return null

  return <canvas className={styles.aura} ref={canvasRef} aria-hidden="true" />
}
