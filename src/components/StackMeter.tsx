import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import styles from './StackMeter.module.css'

type Props = {
  name: string
  level: number
  delay?: number
  segments?: number
}

export function StackMeter({
  name,
  level,
  delay = 0,
  segments = 20,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })
  const reduced = useReducedMotion()
  const filled = Math.round((level / 100) * segments)
  const [lit, setLit] = useState(reduced ? filled : 0)
  const [pct, setPct] = useState(reduced ? level : 0)
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    if (!inView) return

    let raf = 0
    let start = 0
    const duration = reduced ? 0 : 1100
    const wait = reduced ? 0 : delay * 1000
    let armed = false

    const frame = (ts: number) => {
      if (!start) start = ts
      const elapsed = ts - start
      if (!armed && !reduced) {
        armed = true
        setScanning(true)
      }
      if (elapsed < wait) {
        raf = requestAnimationFrame(frame)
        return
      }
      const t = duration === 0 ? 1 : Math.min(1, (elapsed - wait) / duration)
      // Fast start, slow finish (ease-out expo)
      const eased =
        t >= 1 ? 1 : t === 0 ? 0 : 1 - Math.pow(2, -10 * t)
      setLit(Math.round(eased * filled))
      setPct(Math.round(eased * level))
      if (t < 1) {
        raf = requestAnimationFrame(frame)
      } else {
        setScanning(false)
      }
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduced, filled, level, delay])

  return (
    <div className={styles.meter} ref={ref}>
      <div className={styles.meter__head}>
        <span className={styles.meter__name}>
          <span className={styles.meter__prompt}>›</span> {name}
        </span>
        <span className={styles.meter__pct}>
          {String(pct).padStart(3, '0')}
          <span className={styles.meter__unit}>%</span>
        </span>
      </div>
      <div
        className={styles.meter__ascii}
        role="meter"
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={name}
      >
        [
        {Array.from({ length: segments }, (_, i) => (
          <span
            key={i}
            className={i < lit ? styles.meter__blockOn : styles.meter__blockOff}
            data-head={scanning && i === lit - 1 ? 'true' : undefined}
          >
            {i < lit ? '█' : '░'}
          </span>
        ))}
        ]
      </div>
    </div>
  )
}
