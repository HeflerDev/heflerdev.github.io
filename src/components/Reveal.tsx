import { useInView } from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'
import { useLocale } from '../i18n/context'
import { useReducedMotion } from '../hooks/useReducedMotion'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
}

const GLYPHS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@*<>/\\|+='

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

function scrambleNode(
  node: Text,
  original: string,
  startAt: number,
  duration: number,
  now: number,
) {
  if (now < startAt) {
    let out = ''
    for (const ch of original) {
      out += /\s/.test(ch) ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]
    }
    node.nodeValue = out
    return false
  }

  const progress = Math.min(1, (now - startAt) / duration)
  const resolved = Math.floor(progress * original.length)
  let out = ''

  for (let i = 0; i < original.length; i++) {
    const ch = original[i]
    if (/\s/.test(ch)) {
      out += ch
      continue
    }
    if (i < resolved) {
      out += ch
    } else {
      out += GLYPHS[(Math.random() * GLYPHS.length) | 0]
    }
  }

  node.nodeValue = out
  return progress >= 1
}

export function Reveal({ children, className, delay = 0 }: Props) {
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

    const playKey = `${locale}:${delay}`
    if (playedFor.current === playKey) return
    if (!inView) return

    if (reduced) {
      playedFor.current = playKey
      source.hidden = false
      stage.hidden = true
      stage.innerHTML = ''
      return
    }

    // Animate on a clone so React re-renders can't clobber glyphs
    stage.innerHTML = source.innerHTML
    stage.hidden = false
    source.hidden = true

    const nodes = collectTextNodes(stage)
    const map = new Map<Text, string>()
    for (const node of nodes) {
      map.set(node, node.nodeValue ?? '')
    }

    let raf = 0
    let startedAt = 0
    const delayMs = delay * 1000
    let cancelled = false

    const frame = (ts: number) => {
      if (cancelled) return
      if (!startedAt) startedAt = ts
      const now = ts - startedAt
      let allDone = true
      let nodeIndex = 0

      for (const [node, original] of map) {
        const startAt = delayMs + nodeIndex * 50
        const duration = Math.min(1000, 320 + original.trim().length * 16)
        const done = scrambleNode(node, original, startAt, duration, now)
        if (!done) allDone = false
        nodeIndex += 1
      }

      if (allDone) {
        for (const [node, original] of map) {
          node.nodeValue = original
        }
        // Hand control back to React tree
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
  }, [inView, reduced, delay, locale])

  return (
    <div ref={rootRef} className={className}>
      <div ref={sourceRef}>{children}</div>
      <div ref={stageRef} hidden aria-hidden="true" />
    </div>
  )
}
