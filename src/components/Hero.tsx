import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { site } from '../data/site'
import { useLocale } from '../i18n/context'
import { useCoarsePointer } from '../hooks/useCoarsePointer'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { breakoutSfx } from '../lib/breakoutSfx'
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
  const [lives, setLives] = useState(3)

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
      ? [t.hero.breakoutInit, t.hero.breakoutHud(score)]
      : phase === 'closing'
        ? [t.hero.breakoutHud(score), t.hero.breakoutClosed]
        : undefined

  const startGame = () => {
    breakoutSfx.unlock()
    breakoutSfx.start()
    setScore(0)
    setLives(3)
    setPhase('playing')
  }

  const abortGame = () => {
    breakoutSfx.close()
    setPhase('idle')
  }

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
              onLives={setLives}
              onPaddleHit={() => breakoutSfx.hit()}
              onChipMiss={() => breakoutSfx.miss()}
              onGameOver={(finalScore) => {
                setScore(finalScore)
                breakoutSfx.close()
                setPhase('closing')
              }}
            />
            <CursorAura enabled mobile={mobile} mode={mode} />
          </>
        )}
        {gameActive ? (
          <div
            className={styles.hero__lives}
            role="img"
            aria-label={`${t.hero.livesAria}: ${lives}`}
          >
            {[0, 1, 2].map((i) => (
              <HeartIcon key={i} filled={i < lives} />
            ))}
          </div>
        ) : null}
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

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`${styles.hero__heart}${filled ? '' : ` ${styles.hero__heartEmpty}`}`}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path
        d="M12 20.2 10.45 18.8C5.4 14.25 2 11.2 2 7.45 2 4.4 4.4 2 7.4 2c1.7 0 3.35.8 4.4 2.05C12.85 2.8 14.5 2 16.2 2 19.2 2 21.6 4.4 21.6 7.45c0 3.75-3.4 6.8-8.45 11.35L12 20.2Z"
        fill="currentColor"
      />
    </svg>
  )
}
