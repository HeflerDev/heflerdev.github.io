import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { site } from '../data/site'
import { useLocale } from '../i18n/context'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { Reveal } from './Reveal'
import { StackMeter } from './StackMeter'
import styles from './About.module.css'

export function About() {
  const reduced = useReducedMotion()
  const { t } = useLocale()
  const { about } = t
  const panelRef = useRef<HTMLDivElement>(null)
  const panelInView = useInView(panelRef, { once: true, margin: '-10% 0px' })
  const [sysStatus, setSysStatus] = useState<'loading' | 'loaded'>('loading')

  useEffect(() => {
    if (!panelInView) return
    let raf = 0
    const wait = reduced ? 0 : 1200
    const start = performance.now()
    const tick = (now: number) => {
      if (now - start >= wait) {
        setSysStatus('loaded')
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [panelInView, reduced])

  return (
    <section className="section" id="about">
      <Reveal speed={2}>
        <p className="section-label">{about.label}</p>
        <h2 className="section-title">{about.title}</h2>
      </Reveal>

      <div className={styles.layout}>
        <Reveal delay={0.04} speed={2.2}>
          <p className={styles.bio}>
            {about.greeting} <strong>{site.author.name}</strong>.
          </p>
          <p className={styles.bio}>
            <strong>{about.roleLine}</strong>
          </p>
          <p className={`${styles.bio} muted`}>{about.intro}</p>
          <ul className={styles.list}>
            {about.points.map((point) => (
              <li key={point.title}>
                <strong>{point.title}</strong> {point.body}
              </li>
            ))}
          </ul>
        </Reveal>

        <div ref={panelRef}>
          <Reveal delay={0.02} speed={3.5} mode="parallel">
            <div className={styles.panel}>
              <div className={styles.panel__head}>
                <h3>{about.stacksTitle}</h3>
                <span
                  className={styles.panel__hint}
                  data-status={sysStatus}
                >
                  {sysStatus === 'loading' ? 'loading…' : 'loaded'}
                </span>
              </div>
              <div className={styles.stack}>
                {about.stacks.map((s, i) => (
                  <StackMeter
                    key={s.name}
                    name={s.name}
                    level={s.level}
                    delay={0.02 + i * 0.04}
                  />
                ))}
              </div>

              <div className={styles.panel__head}>
                <h3>{about.toolsTitle}</h3>
                <span className={styles.panel__hint}>modules</span>
              </div>
              <ul className={styles.tools}>
                {about.tools.map((tool, i) => (
                  <motion.li
                    key={tool}
                    className={styles.tools__item}
                    initial={reduced ? false : { opacity: 0, x: -6 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: 0.02 + i * 0.025 }}
                  >
                    <span className={styles.tools__status} aria-hidden="true">
                      ok
                    </span>
                    <span className={styles.tools__cmd}>$ load</span>
                    <span className={styles.tools__name}>{tool}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
