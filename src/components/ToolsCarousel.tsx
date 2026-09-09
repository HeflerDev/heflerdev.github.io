import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import styles from './About.module.css'

type Props = {
  tools: readonly string[]
  intervalMs?: number
}

const VISIBLE = 2

export function ToolsCarousel({ tools, intervalMs = 2800 }: Props) {
  const reduced = useReducedMotion()
  const pageCount = Math.max(1, Math.ceil(tools.length / VISIBLE))
  const [page, setPage] = useState(0)
  // Reset when tool list identity/length changes (e.g. locale)
  const pageSafe = page % pageCount

  useEffect(() => {
    if (reduced || pageCount <= 1) return
    const id = window.setInterval(() => {
      setPage((p) => (p + 1) % pageCount)
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [pageCount, intervalMs, reduced, tools.length])

  const start = pageSafe * VISIBLE
  const slice = tools.slice(start, start + VISIBLE)

  return (
    <div className={styles.carousel}>
      <div className={styles.carousel__viewport}>
        <AnimatePresence mode="wait">
          <motion.ul
            key={pageSafe}
            className={styles.tools}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {slice.map((tool) => (
              <li key={tool} className={styles.tools__item}>
                <span className={styles.tools__status} aria-hidden="true">
                  ok
                </span>
                <span className={styles.tools__cmd}>$ load</span>
                <span className={styles.tools__name}>{tool}</span>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>

      <div className={styles.carousel__dots} role="tablist" aria-label="Tools">
        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i}
            type="button"
            className={styles.carousel__dot}
            data-active={i === pageSafe ? 'true' : undefined}
            aria-label={`Page ${i + 1}`}
            onClick={() => setPage(i)}
          />
        ))}
      </div>
    </div>
  )
}
