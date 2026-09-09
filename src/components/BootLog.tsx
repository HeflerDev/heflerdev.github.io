import { useEffect, useState } from 'react'
import { useLocale } from '../i18n/context'
import { useReducedMotion } from '../hooks/useReducedMotion'
import styles from './BootLog.module.css'

type Props = {
  enabled?: boolean
  /** When set, replaces the default boot sequence (instant, no typewriter). */
  lines?: string[]
}

export function BootLog({ enabled = true, lines: override }: Props) {
  const { t } = useLocale()
  const reduced = useReducedMotion()
  const defaultLines = t.hero.boot
  const lines = override ?? defaultLines
  const animated = !override
  const [visible, setVisible] = useState(
    reduced || !animated ? lines.length : 0,
  )

  useEffect(() => {
    if (!enabled) return
    if (!animated || reduced) {
      setVisible(lines.length)
      return
    }

    setVisible(0)
    let i = 0
    let timer = 0
    const tick = () => {
      i += 1
      setVisible(i)
      if (i < lines.length) {
        timer = window.setTimeout(tick, 280)
      }
    }
    timer = window.setTimeout(tick, 180)
    return () => window.clearTimeout(timer)
  }, [enabled, reduced, animated, lines.join('\0')])

  if (!enabled) return null

  return (
    <div className={styles.log} aria-hidden="true">
      {lines.slice(0, visible).map((line, idx) => (
        <p key={`${idx}-${line}`} className={styles.log__line}>
          <span className={styles.log__prompt}>$</span> {line}
        </p>
      ))}
      {animated && visible < lines.length ? (
        <p className={styles.log__line}>
          <span className={styles.log__prompt}>$</span>
          <span className={styles.log__caret}>▌</span>
        </p>
      ) : null}
    </div>
  )
}
