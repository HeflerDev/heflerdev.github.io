import { useEffect, useState } from 'react'
import { useLocale } from '../i18n/context'
import { useReducedMotion } from '../hooks/useReducedMotion'
import styles from './BootLog.module.css'

type Props = {
  enabled?: boolean
}

export function BootLog({ enabled = true }: Props) {
  const { t } = useLocale()
  const reduced = useReducedMotion()
  const lines = t.hero.boot
  const [visible, setVisible] = useState(reduced ? lines.length : 0)

  useEffect(() => {
    if (!enabled || reduced) return

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
  }, [enabled, reduced, lines])

  if (!enabled) return null

  return (
    <div className={styles.log} aria-hidden="true">
      {lines.slice(0, visible).map((line) => (
        <p key={line} className={styles.log__line}>
          <span className={styles.log__prompt}>$</span> {line}
        </p>
      ))}
      {visible < lines.length ? (
        <p className={styles.log__line}>
          <span className={styles.log__prompt}>$</span>
          <span className={styles.log__caret}>▌</span>
        </p>
      ) : null}
    </div>
  )
}
