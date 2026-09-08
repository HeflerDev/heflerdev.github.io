import { useEffect, useRef } from 'react'
import Matter from 'matter-js'
import { physicsLabels } from '../data/site'
import styles from './PhysicsCanvas.module.css'

type Props = {
  enabled: boolean
}

function measureChipWidth(text: string) {
  return Math.max(64, 28 + text.length * 7.2)
}

export function PhysicsCanvas({ enabled }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled || !hostRef.current) return

    const host = hostRef.current
    const { Engine, Render, Runner, Bodies, Body, Composite, Events } = Matter

    const engine = Engine.create({ gravity: { x: 0, y: 0.22 } })
    let width = host.clientWidth
    let height = host.clientHeight
    const ratio = Math.min(window.devicePixelRatio || 1, 2)

    const render = Render.create({
      element: host,
      engine,
      options: {
        width,
        height,
        background: 'transparent',
        wireframes: false,
        pixelRatio: ratio,
      },
    })

    const wallOpts = { isStatic: true, render: { visible: false } }

    const floor = Bodies.rectangle(width / 2, height + 30, width + 200, 60, wallOpts)
    const left = Bodies.rectangle(-30, height / 2, 60, height + 200, wallOpts)
    const right = Bodies.rectangle(width + 30, height / 2, 60, height + 200, wallOpts)
    const ceiling = Bodies.rectangle(width / 2, -40, width + 200, 80, wallOpts)

    const count = physicsLabels.length
    const widths = physicsLabels.map(measureChipWidth)
    const gap = 14
    const totalWidth =
      widths.reduce((sum, chipW) => sum + chipW, 0) + gap * (count - 1)
    let cursorX = width / 2 - totalWidth / 2

    const chipMeta = physicsLabels.map((text, i) => {
      const chipW = widths[i]
      const chipH = 28
      const x = cursorX + chipW / 2
      cursorX += chipW + gap
      const y = 36 + (i % 2) * 18
      const accent = i % 3 === 0
      const body = Bodies.rectangle(x, y, chipW, chipH, {
        chamfer: { radius: 2 },
        restitution: 0.65,
        friction: 0.04,
        frictionAir: 0.012,
        density: 0.0012,
        render: {
          fillStyle: accent ? '#f5a623' : '#1a2026',
          strokeStyle: accent ? '#c4841a' : 'rgba(232,230,225,0.28)',
          lineWidth: 1,
        },
      })
      return { body, text, accent }
    })

    Composite.add(engine.world, [
      floor,
      left,
      right,
      ceiling,
      ...chipMeta.map((c) => c.body),
    ])

    const mouse = { x: width / 2, y: height / 3 }
    const onMove = (e: MouseEvent) => {
      const rect = host.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    window.addEventListener('mousemove', onMove)

    Events.on(engine, 'beforeUpdate', () => {
      for (const { body } of chipMeta) {
        const dx = body.position.x - mouse.x
        const dy = body.position.y - mouse.y
        const dist = Math.hypot(dx, dy)
        const radius = 220
        if (dist < radius && dist > 0.001) {
          // Strong shove — enough to lift chips off the floor
          const strength = 0.0028 * (1 - dist / radius) ** 2
          const nx = dx / dist
          const ny = dy / dist
          Body.applyForce(body, body.position, {
            x: nx * strength * body.mass,
            y: ny * strength * body.mass,
          })
        }
      }
    })

    Events.on(render, 'afterRender', () => {
      const ctx = render.context
      const pr = (render.options.pixelRatio as number) || 1
      ctx.setTransform(pr, 0, 0, pr, 0, 0)
      ctx.font = '600 11px "IBM Plex Mono", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (const { body, text, accent } of chipMeta) {
        ctx.fillStyle = accent ? '#0b0d0f' : '#e8e6e1'
        ctx.save()
        ctx.translate(body.position.x, body.position.y)
        ctx.rotate(body.angle)
        ctx.fillText(text, 0, 0.5)
        ctx.restore()
      }
    })

    const runner = Runner.create()
    Render.run(render)
    Runner.run(runner, engine)

    const onResize = () => {
      width = host.clientWidth
      height = host.clientHeight
      const pr = (render.options.pixelRatio as number) || 1
      render.canvas.width = width * pr
      render.canvas.height = height * pr
      render.canvas.style.width = `${width}px`
      render.canvas.style.height = `${height}px`
      render.options.width = width
      render.options.height = height
      render.bounds.max.x = width
      render.bounds.max.y = height
      ctxSafeSetTransform(render.context, pr)
      Body.setPosition(floor, { x: width / 2, y: height + 30 })
      Body.setPosition(left, { x: -30, y: height / 2 })
      Body.setPosition(right, { x: width + 30, y: height / 2 })
      Body.setPosition(ceiling, { x: width / 2, y: -40 })
    }

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      Runner.stop(runner)
      Render.stop(render)
      Composite.clear(engine.world, false)
      Engine.clear(engine)
      if (render.canvas.parentNode) {
        render.canvas.remove()
      }
      render.textures = {}
    }
  }, [enabled])

  if (!enabled) return null

  return <div className={styles.canvas} ref={hostRef} aria-hidden="true" />
}

function ctxSafeSetTransform(ctx: CanvasRenderingContext2D, pr: number) {
  ctx.setTransform(pr, 0, 0, pr, 0, 0)
}
