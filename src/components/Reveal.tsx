import { useInView } from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'
import { useLocale } from '../i18n/context'
import { useReducedMotion } from '../hooks/useReducedMotion'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
  /** Higher = faster typing. Default 1. */
  speed?: number
  /** parallel types all text nodes at once (much snappier for dense blocks). */
  mode?: 'sequential' | 'parallel'
}

const CARET = '▌'

function collectTextNodes(root: HTMLElement) {
  const nodes: Text[] = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) {
        return NodeFilter.FILTER_REJECT
      }
      const parent = (node as Text).parentElement
      if (!parent) return NodeFilter.FILTER_REJECT
      const tag = parent.tagName
      if (tag === 'SCRIPT' || tag === 'STYLE') return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })

  let current = walker.nextNode()
  while (current) {
    nodes.push(current as Text)
    current = walker.nextNode()
  }
  return nodes
}

function msPerChar(length: number, speed: number) {
  const base = Math.max(3, Math.min(12, 380 / Math.max(length, 10)))
  return base / Math.max(speed, 0.5)
}

function typeNode(
  node: Text,
  original: string,
  startAt: number,
  now: number,
  speed: number,
  showCaret: boolean,
) {
  if (now < startAt) {
    node.nodeValue = ''
    return false
  }

  const charMs = msPerChar(original.length, speed)
  const typed = Math.min(
    original.length,
    Math.floor((now - startAt) / charMs),
  )
  const done = typed >= original.length
  const caret =
    !done && showCaret && Math.floor(now / 320) % 2 === 0 ? CARET : ''
  node.nodeValue = original.slice(0, typed) + caret
  return done
}

export function Reveal({
  children,
  className,
  delay = 0,
  speed = 1.6,
  mode = 'sequential',
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const sourceRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { once: true, margin: '-12% 0px' })
  const reduced = useReducedMotion()
  const { locale } = useLocale()
  const playedFor = useRef<string | null>(null)

  useEffect(() => {
    playedFor.current = null
    const stage = stageRef.current
    const source = sourceRef.current
    if (stage) {
      stage.innerHTML = ''
      stage.hidden = true
    }
    if (source) source.hidden = false
  }, [locale])

  useEffect(() => {
    const source = sourceRef.current
    const stage = stageRef.current
    if (!source || !stage) return

    const playKey = `${locale}:${delay}:${speed}:${mode}`
    if (playedFor.current === playKey) return
    if (!inView) return

    if (reduced) {
      playedFor.current = playKey
      source.hidden = false
      stage.hidden = true
      stage.innerHTML = ''
      return
    }

    stage.innerHTML = source.innerHTML
    stage.hidden = false
    source.hidden = true

    const nodes = collectTextNodes(stage)
    const map = new Map<Text, string>()
    for (const node of nodes) {
      map.set(node, node.nodeValue ?? '')
      node.nodeValue = ''
    }

    const schedule: { node: Text; original: string; startAt: number }[] = []
    let cursor = delay * 1000

    if (mode === 'parallel') {
      for (const [node, original] of map) {
        schedule.push({ node, original, startAt: cursor })
      }
    } else {
      for (const [node, original] of map) {
        schedule.push({ node, original, startAt: cursor })
        cursor += original.length * msPerChar(original.length, speed) + 28
      }
    }

    let raf = 0
    let startedAt = 0
    let cancelled = false

    const frame = (ts: number) => {
      if (cancelled) return
      if (!startedAt) startedAt = ts
      const now = ts - startedAt

      let allDone = true
      let activeIndex = -1

      for (let i = 0; i < schedule.length; i++) {
        const item = schedule[i]
        const done = typeNode(
          item.node,
          item.original,
          item.startAt,
          now,
          speed,
          false,
        )
        if (!done) {
          allDone = false
          if (activeIndex < 0) activeIndex = i
        }
      }

      if (activeIndex >= 0) {
        const item = schedule[activeIndex]
        typeNode(item.node, item.original, item.startAt, now, speed, true)
      }

      if (allDone) {
        for (const [node, original] of map) {
          node.nodeValue = original
        }
        source.hidden = false
        stage.hidden = true
        stage.innerHTML = ''
        playedFor.current = playKey
        return
      }

      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      if (playedFor.current !== playKey) {
        source.hidden = false
        stage.hidden = true
        stage.innerHTML = ''
      }
    }
  }, [inView, reduced, delay, locale, speed, mode])

  return (
    <div ref={rootRef} className={className}>
      <div ref={sourceRef}>{children}</div>
      <div ref={stageRef} hidden aria-hidden="true" />
    </div>
  )
}
