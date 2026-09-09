import { motion } from 'framer-motion'
import { site } from '../data/site'
import { useLocale } from '../i18n/context'
import { useCoarsePointer } from '../hooks/useCoarsePointer'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { BootLog } from './BootLog'
import { CursorAura } from './CursorAura'
import { PhysicsCanvas } from './PhysicsCanvas'
import styles from './Hero.module.css'

export function Hero() {
  const reduced = useReducedMotion()
  const mobile = useCoarsePointer()
  const { t } = useLocale()

  return (
    <section className={styles.hero} id="top" aria-label="Hero">
      <div className={styles.hero__rack}>
        {reduced ? (
          <div className={styles.hero__static} aria-hidden="true" />
        ) : (
          <>
            <PhysicsCanvas enabled mobile={mobile} />
            <CursorAura enabled mobile={mobile} />
          </>
        )}
        <BootLog enabled={!reduced} />
      </div>

      <div className={styles.hero__inner}>
        <motion.p
          className={styles.hero__meta}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t.hero.meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </motion.p>

        <motion.h1
          className={styles.hero__brand}
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08 }}
        >
          {site.brand.slice(0, -1)}
          <em>{site.brand.slice(-1)}</em>
        </motion.h1>

        <motion.h2
          className={styles.hero__headline}
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
        >
          {t.hero.headline}
        </motion.h2>

        <motion.p
          className={styles.hero__support}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.28 }}
        >
          {t.hero.support}
        </motion.p>

        <motion.div
          className={styles.hero__ctas}
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.36 }}
        >
          <a className="btn" href="#projects">
            {t.hero.ctaProjects}
          </a>
          <a className="btn btn--ghost" href="#contact">
            {t.hero.ctaContact}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
