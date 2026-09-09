import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { site } from '../data/site'
import { useLocale } from '../i18n/context'
import { useCoarsePointer } from '../hooks/useCoarsePointer'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { BootLog } from './BootLog'
import { CursorAura } from './CursorAura'
import { PhysicsCanvas } from './PhysicsCanvas'
import styles from './Hero.module.css'

type Phase = 'idle' | 'playing' | 'closing'

export function Hero() {
  const reduced = useReducedMotion()
  const mobile = useCoarsePointer()
  const { t } = useLocale()
  const [phase, setPhase] = useState<Phase>('idle')
  const [score, setScore] = useState(0)

  const gameActive = phase === 'playing' || phase === 'closing'
  const mode = phase === 'idle' ? 'idle' : 'breakout'

  useEffect(() => {
    if (!gameActive) return
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = prev
    }
  }, [gameActive])

  useEffect(() => {
    if (phase !== 'playing') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPhase('idle')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase])

  useEffect(() => {
    if (phase !== 'closing') return
    const timer = window.setTimeout(() => setPhase('idle'), 1400)
    return () => window.clearTimeout(timer)
  }, [phase])

  const bootLines =
    phase === 'playing'
      ? [t.hero.breakoutInit, t.hero.breakoutScore(score)]
      : phase === 'closing'
        ? [t.hero.breakoutScore(score), t.hero.breakoutClosed]
        : undefined

  const startGame = () => {
    setScore(0)
    setPhase('playing')
  }

  const abortGame = () => setPhase('idle')

  return (
    <section
      className={`${styles.hero}${gameActive ? ` ${styles.heroGame}` : ''}`}
      id="top"
      aria-label="Hero"
    >
      <div className={styles.hero__rack}>
        {reduced ? (
          <div className={styles.hero__static} aria-hidden="true" />
        ) : (
          <>
            <PhysicsCanvas
              key={mode}
              enabled
              mobile={mobile}
              mode={mode}
              onScore={setScore}
              onGameOver={(finalScore) => {
                setScore(finalScore)
                setPhase('closing')
              }}
            />
            <CursorAura enabled mobile={mobile} mode={mode} />
          </>
        )}
        <BootLog enabled={!reduced} lines={bootLines} />
        {!reduced ? (
          <button
            type="button"
            className={styles.hero__bait}
            onClick={phase === 'playing' ? abortGame : startGame}
            disabled={phase === 'closing'}
          >
            {phase === 'playing' || phase === 'closing'
              ? t.hero.abort
              : t.hero.bait}
          </button>
        ) : null}
      </div>

      <div className={styles.hero__inner} aria-hidden={gameActive}>
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
