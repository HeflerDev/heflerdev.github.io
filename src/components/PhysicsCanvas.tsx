import { useEffect, useRef } from 'react'
import Matter from 'matter-js'
import { physicsLabels } from '../data/site'
import styles from './PhysicsCanvas.module.css'

type Props = {
  enabled: boolean
  mobile?: boolean
}

function measureChipWidth(text: string, mobile: boolean) {
  const scale = mobile ? 6.2 : 7.2
  return Math.max(mobile ? 52 : 64, (mobile ? 22 : 28) + text.length * scale)
}

export function PhysicsCanvas({ enabled, mobile = false }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled || !hostRef.current) return

    const host = hostRef.current
    const { Engine, Render, Runner, Bodies, Body, Composite, Events } = Matter

    const engine = Engine.create({ gravity: { x: 0, y: mobile ? 0.18 : 0.22 } })
    let width = host.clientWidth
    let height = host.clientHeight
    const ratio = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)

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

    const labels = mobile ? physicsLabels.slice(0, 6) : [...physicsLabels]
    const chipH = mobile ? 24 : 28
    const gap = mobile ? 8 : 14

    const placeRow = (
      rowLabels: readonly string[],
      y: number,
      startIndex: number,
    ) => {
      const widths = rowLabels.map((text) => measureChipWidth(text, mobile))
      const totalWidth =
        widths.reduce((sum, w) => sum + w, 0) + gap * Math.max(0, rowLabels.length - 1)
      let cursorX = width / 2 - totalWidth / 2

      return rowLabels.map((text, i) => {
        const chipW = widths[i]
        const x = cursorX + chipW / 2
        cursorX += chipW + gap
        const accent = (startIndex + i) % 3 === 0
        const body = Bodies.rectangle(x, y, chipW, chipH, {
          chamfer: { radius: 2 },
          restitution: 0.65,
          friction: 0.04,
          frictionAir: mobile ? 0.016 : 0.012,
          density: mobile ? 0.001 : 0.0012,
          render: {
            fillStyle: accent ? '#f5a623' : '#1a2026',
            strokeStyle: accent ? '#c4841a' : 'rgba(232,230,225,0.28)',
            lineWidth: 1,
          },
        })
        return { body, text, accent }
      })
    }

    // Wrap into two centered rows on narrow screens
    const mid = Math.ceil(labels.length / 2)
    const needWrap = mobile || width < 720
    const chipMeta = needWrap
      ? [
          ...placeRow(labels.slice(0, mid), 28, 0),
          ...placeRow(labels.slice(mid), 28 + chipH + 10, mid),
        ]
      : placeRow(labels, 36, 0)

    Composite.add(engine.world, [
      floor,
      left,
      right,
      ceiling,
      ...chipMeta.map((c) => c.body),
    ])

    const pointer = { x: width / 2, y: height / 3, down: false }
    const auto = { x: width / 2, y: height * 0.35, tick: 0 }

    const setPointerFromClient = (clientX: number, clientY: number) => {
      const rect = host.getBoundingClientRect()
      if (clientY < rect.top || clientY > rect.bottom) {
        pointer.down = false
        return
      }
      pointer.x = clientX - rect.left
      pointer.y = clientY - rect.top
      pointer.down = true
    }

    const onMove = (e: MouseEvent) => {
      const rect = host.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.down = true
    }

    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      setPointerFromClient(t.clientX, t.clientY)
    }

    const onTouchEnd = () => {
      pointer.down = false
    }

    Events.on(engine, 'beforeUpdate', () => {
      auto.tick += 1
      if (mobile) {
        const t = auto.tick * 0.015
        auto.x = width * 0.5 + Math.sin(t) * width * 0.3
        auto.y = height * 0.4 + Math.cos(t * 1.35) * height * 0.16
      }

      const sources = mobile
        ? pointer.down
          ? [{ x: pointer.x, y: pointer.y, radius: 200, strength: 0.0032 }]
          : [{ x: auto.x, y: auto.y, radius: 150, strength: 0.0011 }]
        : [{ x: pointer.x, y: pointer.y, radius: 220, strength: 0.0028 }]

      for (const { body } of chipMeta) {
        for (const src of sources) {
          const dx = body.position.x - src.x
          const dy = body.position.y - src.y
          const dist = Math.hypot(dx, dy)
          if (dist < src.radius && dist > 0.001) {
            const force = src.strength * (1 - dist / src.radius) ** 2
            Body.applyForce(body, body.position, {
              x: (dx / dist) * force * body.mass,
              y: (dy / dist) * force * body.mass,
            })
          }
        }
      }
    })

    Events.on(render, 'afterRender', () => {
      const ctx = render.context
      const pr = (render.options.pixelRatio as number) || 1
      ctx.setTransform(pr, 0, 0, pr, 0, 0)
      ctx.font = `600 ${mobile ? 10 : 11}px "IBM Plex Mono", monospace`
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

    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize', onResize)
    window.addEventListener('touchstart', onTouch, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('touchcancel', onTouchEnd)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
      Runner.stop(runner)
      Render.stop(render)
      Composite.clear(engine.world, false)
      Engine.clear(engine)
      if (render.canvas.parentNode) {
        render.canvas.remove()
      }
      render.textures = {}
    }
  }, [enabled, mobile])

  if (!enabled) return null

  return <div className={styles.canvas} ref={hostRef} aria-hidden="true" />
}

function ctxSafeSetTransform(ctx: CanvasRenderingContext2D, pr: number) {
  ctx.setTransform(pr, 0, 0, pr, 0, 0)
}
