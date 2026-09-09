import { useEffect, useRef } from 'react'
import Matter from 'matter-js'
import { physicsLabels } from '../data/site'
import styles from './PhysicsCanvas.module.css'

export type PhysicsMode = 'idle' | 'breakout'

type Props = {
  enabled: boolean
  mobile?: boolean
  mode?: PhysicsMode
  onScore?: (score: number) => void
  onLives?: (lives: number) => void
  onGameOver?: (score: number) => void
  onPaddleHit?: () => void
  onChipMiss?: () => void
}

type ChipMeta = {
  body: Matter.Body
  text: string
  accent: boolean
  alive: boolean
}

function measureChipWidth(text: string, mobile: boolean) {
  const scale = mobile ? 6.2 : 7.2
  return Math.max(mobile ? 52 : 64, (mobile ? 22 : 28) + text.length * scale)
}

export function PhysicsCanvas({
  enabled,
  mobile = false,
  mode = 'idle',
  onScore,
  onLives,
  onGameOver,
  onPaddleHit,
  onChipMiss,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const onScoreRef = useRef(onScore)
  const onLivesRef = useRef(onLives)
  const onGameOverRef = useRef(onGameOver)
  const onPaddleHitRef = useRef(onPaddleHit)
  const onChipMissRef = useRef(onChipMiss)
  onScoreRef.current = onScore
  onLivesRef.current = onLives
  onGameOverRef.current = onGameOver
  onPaddleHitRef.current = onPaddleHit
  onChipMissRef.current = onChipMiss

  useEffect(() => {
    if (!enabled || !hostRef.current) return

    const host = hostRef.current
    const { Engine, Render, Runner, Bodies, Body, Composite, Events } = Matter
    const breakout = mode === 'breakout'

    const gravityStart = mobile ? 0.08 : 0.1
    const gravityEnd = mobile ? 0.72 : 0.88

    const engine = Engine.create({
      gravity: {
        x: 0,
        y: breakout ? gravityStart : mobile ? 0.18 : 0.22,
      },
    })
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
    const chipH = mobile ? 24 : 28
    const getFloorY = () => (breakout ? height - 8 : height + 24)
    const paddleW = mobile ? 96 : 120
    const getPaddleY = () => height - (mobile ? 36 : 44)

    const floor = Bodies.rectangle(width / 2, getFloorY(), width + 200, 40, {
      ...wallOpts,
      label: 'floor',
      isSensor: breakout,
    })
    const left = Bodies.rectangle(-30, height / 2, 60, height + 200, wallOpts)
    const right = Bodies.rectangle(width + 30, height / 2, 60, height + 200, wallOpts)
    const ceiling = Bodies.rectangle(width / 2, -40, width + 200, 80, wallOpts)

    let paddle: Matter.Body | null = null
    if (breakout) {
      paddle = Bodies.rectangle(width / 2, getPaddleY(), paddleW, 14, {
        isStatic: true,
        label: 'paddle',
        chamfer: { radius: 4 },
        render: { visible: false },
      })
    }

    const labels = mobile ? physicsLabels.slice(0, 6) : [...physicsLabels]
    const gap = mobile ? 8 : 14

    const airForElapsed = (elapsedSec: number) => {
      if (!breakout) return mobile ? 0.016 : 0.012
      // High drag early (slow fall), less later
      const a0 = mobile ? 0.045 : 0.038
      const a1 = mobile ? 0.008 : 0.005
      return a0 + (a1 - a0) * Math.min(1, elapsedSec / 45)
    }

    const makeChip = (
      text: string,
      x: number,
      y: number,
      accent: boolean,
      elapsedSec = 0,
    ): ChipMeta => {
      const chipW = measureChipWidth(text, mobile)
      const body = Bodies.rectangle(x, y, chipW, chipH, {
        chamfer: { radius: 2 },
        restitution: breakout ? 0.9 : 0.65,
        friction: breakout ? 0.01 : 0.04,
        frictionAir: airForElapsed(elapsedSec),
        density: mobile ? 0.001 : 0.0012,
        label: 'chip',
        render: {
          fillStyle: accent ? '#f5a623' : '#1a2026',
          strokeStyle: accent ? '#c4841a' : 'rgba(232,230,225,0.28)',
          lineWidth: 1,
        },
      })
      return { body, text, accent, alive: true }
    }

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
        return makeChip(text, x, y, accent)
      })
    }

    const mid = Math.ceil(labels.length / 2)
    const spawnY = mobile ? 18 : 22
    let chipMeta: ChipMeta[] = breakout
      ? []
      : [
          ...placeRow(labels.slice(0, mid), spawnY, 0),
          ...placeRow(labels.slice(mid), spawnY + chipH + 10, mid),
        ]

    Composite.add(engine.world, [
      floor,
      left,
      right,
      ceiling,
      ...(paddle ? [paddle] : []),
      ...chipMeta.map((c) => c.body),
    ])

    const pointer = { x: width / 2, y: height / 3, down: breakout }
    const auto = { x: width / 2, y: height * 0.35, tick: 0 }
    let score = 0
    let lives = 3
    let ended = false
    let nextLabelIndex = 0
    let lastDropAt = 0
    const startedAt = performance.now()
    const scoredHits = new WeakSet<Matter.Body>()

    const setPointerFromClient = (clientX: number, clientY: number) => {
      const rect = host.getBoundingClientRect()
      pointer.x = clientX - rect.left
      pointer.y = clientY - rect.top
      pointer.down = true
    }

    const onMove = (e: MouseEvent) => {
      if (mobile && !breakout) return
      const rect = host.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.down = true
    }

    const onPointerLeave = () => {
      if (!mobile && !breakout) pointer.down = false
    }

    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      e.preventDefault()
      setPointerFromClient(t.clientX, t.clientY)
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault()
      if (!breakout) pointer.down = false
    }

    const endGame = () => {
      if (ended) return
      ended = true
      onGameOverRef.current?.(score)
    }

    const bumpScore = () => {
      score += 1
      onScoreRef.current?.(score)
    }

    const loseLife = (chipBody: Matter.Body) => {
      const chip = chipMeta.find((c) => c.body === chipBody && c.alive)
      if (!chip) return
      chip.alive = false
      Composite.remove(engine.world, chip.body)
      onChipMissRef.current?.()
      lives -= 1
      onLivesRef.current?.(lives)
      if (lives <= 0) endGame()
    }

    const dropChip = (elapsedSec: number) => {
      if (ended) return
      const text = labels[nextLabelIndex % labels.length]
      const accent = nextLabelIndex % 3 === 0
      nextLabelIndex += 1
      const x = width * (0.18 + Math.random() * 0.64)
      const chip = makeChip(text, x, spawnY + Math.random() * 8, accent, elapsedSec)
      chipMeta.push(chip)
      Composite.add(engine.world, chip.body)
      Body.setVelocity(chip.body, {
        x: (Math.random() - 0.5) * (0.8 + Math.min(2, elapsedSec * 0.03)),
        y: 0.2 + Math.random() * 0.4,
      })
    }

    if (breakout) {
      onLivesRef.current?.(lives)
      dropChip(0)
      lastDropAt = performance.now()

      Events.on(engine, 'collisionStart', (event) => {
        if (ended) return
        for (const pair of event.pairs) {
          const labelsPair = [pair.bodyA.label, pair.bodyB.label]
          const chipBody =
            pair.bodyA.label === 'chip'
              ? pair.bodyA
              : pair.bodyB.label === 'chip'
                ? pair.bodyB
                : null
          if (!chipBody) continue

          if (labelsPair.includes('floor')) {
            loseLife(chipBody)
            continue
          }

          if (labelsPair.includes('paddle')) {
            if (scoredHits.has(chipBody)) continue
            scoredHits.add(chipBody)
            window.setTimeout(() => scoredHits.delete(chipBody), 280)
            bumpScore()
            onPaddleHitRef.current?.()
            // Launch chip high — angle from hit offset on paddle
            const offset = (chipBody.position.x - pointer.x) / (paddleW * 0.5)
            const vx = offset * 6 + chipBody.velocity.x * 0.25
            const vy = -(18 + Math.random() * 5)
            Body.setVelocity(chipBody, { x: vx, y: vy })
            Body.setAngularVelocity(chipBody, offset * 0.25)
          }
        }
      })
    }

    Events.on(engine, 'beforeUpdate', () => {
      if (breakout && paddle) {
        const half = paddleW / 2
        const x = Math.max(half + 4, Math.min(width - half - 4, pointer.x))
        Body.setPosition(paddle, { x, y: getPaddleY() })
        return
      }

      auto.tick += 1
      const t = auto.tick * 0.015
      auto.x = width * 0.5 + Math.sin(t) * width * 0.28
      auto.y = height * 0.45 + Math.cos(t * 1.35) * height * 0.2

      const sources = pointer.down
        ? [
            {
              x: pointer.x,
              y: pointer.y,
              radius: mobile ? 220 : 180,
              strength: mobile ? 0.0042 : 0.003,
            },
          ]
        : mobile
          ? [{ x: auto.x, y: auto.y, radius: 150, strength: 0.0011 }]
          : [{ x: auto.x, y: auto.y, radius: 120, strength: 0.0007 }]

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

    if (breakout) {
      Events.on(engine, 'afterUpdate', () => {
        if (ended) return
        const now = performance.now()
        const elapsed = (now - startedAt) / 1000

        engine.gravity.y =
          gravityStart + (gravityEnd - gravityStart) * Math.min(1, elapsed / 50)

        const air = airForElapsed(elapsed)
        for (const chip of chipMeta) {
          if (chip.alive) chip.body.frictionAir = air
        }

        // First chip already dropped; next ones arrive slowly, then faster
        const intervalMs = Math.max(2200, 5500 - elapsed * 55)
        const aliveCount = chipMeta.filter((c) => c.alive).length
        const maxConcurrent = Math.min(
          labels.length,
          1 + Math.floor(elapsed / 6),
        )
        if (
          aliveCount < maxConcurrent &&
          now - lastDropAt >= intervalMs
        ) {
          lastDropAt = now
          dropChip(elapsed)
        }

        for (const chip of chipMeta) {
          if (chip.alive && chip.body.position.y > height + 50) {
            loseLife(chip.body)
          }
        }
      })
    }

    Events.on(render, 'afterRender', () => {
      const ctx = render.context
      const pr = (render.options.pixelRatio as number) || 1
      ctx.setTransform(pr, 0, 0, pr, 0, 0)
      ctx.font = `600 ${mobile ? 10 : 11}px "IBM Plex Mono", monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (const { body, text, accent, alive } of chipMeta) {
        if (!alive) continue
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
      Body.setPosition(floor, { x: width / 2, y: getFloorY() })
      Body.setPosition(left, { x: -30, y: height / 2 })
      Body.setPosition(right, { x: width + 30, y: height / 2 })
      Body.setPosition(ceiling, { x: width / 2, y: -40 })
      if (paddle) {
        Body.setPosition(paddle, {
          x: Math.max(paddleW / 2, Math.min(width - paddleW / 2, pointer.x)),
          y: getPaddleY(),
        })
      }
    }

    requestAnimationFrame(onResize)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize', onResize)
    host.addEventListener('mouseleave', onPointerLeave)
    host.addEventListener('touchstart', onTouch, { passive: false })
    host.addEventListener('touchmove', onTouch, { passive: false })
    host.addEventListener('touchend', onTouchEnd, { passive: false })
    host.addEventListener('touchcancel', onTouchEnd, { passive: false })

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      host.removeEventListener('mouseleave', onPointerLeave)
      host.removeEventListener('touchstart', onTouch)
      host.removeEventListener('touchmove', onTouch)
      host.removeEventListener('touchend', onTouchEnd)
      host.removeEventListener('touchcancel', onTouchEnd)
      Runner.stop(runner)
      Render.stop(render)
      Composite.clear(engine.world, false)
      Engine.clear(engine)
      if (render.canvas.parentNode) {
        render.canvas.remove()
      }
      render.textures = {}
    }
  }, [enabled, mobile, mode])

  if (!enabled) return null

  const playSurface = mobile || mode === 'breakout'

  return (
    <div
      className={`${styles.canvas}${playSurface ? ` ${styles.canvasPlay}` : ''}`}
      ref={hostRef}
      data-play-surface={playSurface ? 'true' : undefined}
      aria-hidden="true"
    />
  )
}

function ctxSafeSetTransform(ctx: CanvasRenderingContext2D, pr: number) {
  ctx.setTransform(pr, 0, 0, pr, 0, 0)
}
