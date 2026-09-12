import { useEffect, useRef, useState } from 'react'
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

const BEST_KEY = 'heflerdev.breakout.best'

function readBest(): number {
  try {
    const raw = localStorage.getItem(BEST_KEY)
    const n = raw ? Number.parseInt(raw, 10) : 0
    return Number.isFinite(n) && n > 0 ? n : 0
  } catch {
    return 0
  }
}

function portraitLabel(src: string) {
  const file = src.split('/').pop() ?? src
  const stem = file.replace(/\.[^.]+$/, '')
  if (stem === 'profile_pic') return 'raw'
  return stem.replace(/^perfil-|^profile_/, '')
}

function writeBest(score: number) {
  try {
    localStorage.setItem(BEST_KEY, String(score))
  } catch {
    /* ignore quota / private mode */
  }
}

export function Hero() {
  const reduced = useReducedMotion()
  const mobile = useCoarsePointer()
  const { t } = useLocale()
  const [phase, setPhase] = useState<Phase>('idle')
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [best, setBest] = useState(0)
  const [isNewBest, setIsNewBest] = useState(false)

  const [portraitIndex, setPortraitIndex] = useState(0)
  const [portraitGlitch, setPortraitGlitch] = useState(false)
  const portraits = site.author.portraits
  const portraitBoot = useRef(true)

  const gameActive = phase === 'playing' || phase === 'closing'
  const mode = phase === 'playing' ? 'breakout' : 'idle'

  useEffect(() => {
    if (reduced || portraits.length < 2) return
    const id = window.setInterval(() => {
      setPortraitIndex((i) => (i + 1) % portraits.length)
    }, 4000)
    return () => window.clearInterval(id)
  }, [reduced, portraits.length])

  useEffect(() => {
    if (portraitBoot.current) {
      portraitBoot.current = false
      return
    }
    if (reduced) return
    setPortraitGlitch(true)
    const id = window.setTimeout(() => setPortraitGlitch(false), 320)
    return () => window.clearTimeout(id)
  }, [portraitIndex, reduced])

  // Wait for fullscreen expand / collapse so the arena size is correct
  const [arenaReady, setArenaReady] = useState(true)
  const arenaBootstrapped = useRef(false)

  useEffect(() => {
    setBest(readBest())
  }, [])

  useEffect(() => {
    if (!arenaBootstrapped.current) {
      arenaBootstrapped.current = true
      return
    }
    if (phase === 'closing') {
      setArenaReady(false)
      return
    }
    setArenaReady(false)
    const delay = phase === 'playing' ? 480 : 520
    const timer = window.setTimeout(() => setArenaReady(true), delay)
    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (!gameActive) return
    const prevHtml = document.documentElement.style.overflow
    const prevBody = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.body.dataset.breakout = '1'
    window.scrollTo({ top: 0, behavior: 'instant' })
    return () => {
      document.documentElement.style.overflow = prevHtml
      document.body.style.overflow = prevBody
      delete document.body.dataset.breakout
    }
  }, [gameActive])

  useEffect(() => {
    if (phase !== 'playing' && phase !== 'closing') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (phase === 'closing') setPhase('idle')
        else {
          breakoutSfx.close()
          setPhase('idle')
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
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
    setIsNewBest(false)
    setBest(readBest())
    setPhase('playing')
  }

  const abortGame = () => {
    breakoutSfx.close()
    setPhase('idle')
  }

  const finishGame = (finalScore: number) => {
    setScore(finalScore)
    const prevBest = readBest()
    if (finalScore > prevBest) {
      writeBest(finalScore)
      setBest(finalScore)
      setIsNewBest(true)
    } else {
      setBest(prevBest)
      setIsNewBest(false)
    }
    breakoutSfx.close()
    setPhase('closing')
  }

  return (
    <>
      {gameActive ? <div className={styles.heroSpacer} aria-hidden="true" /> : null}
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
              enabled={!reduced && arenaReady && phase !== 'closing'}
              mobile={mobile}
              mode={mode}
              onScore={setScore}
              onLives={setLives}
              onPaddleHit={() => breakoutSfx.hit()}
              onChipMiss={() => breakoutSfx.miss()}
              onGameOver={finishGame}
            />
            {phase !== 'closing' ? (
              <CursorAura
                key={phase === 'playing' ? 'aura-play' : 'aura-idle'}
                enabled
                mobile={mobile}
                mode={phase === 'playing' && arenaReady ? 'breakout' : 'idle'}
              />
            ) : null}
          </>
        )}

        {phase === 'playing' ? (
          <>
            <div className={styles.hero__hits} aria-live="polite">
              <span className={styles.hero__hitsLabel}>{t.hero.hitsLabel}</span>
              <span className={styles.hero__hitsValue}>{score}</span>
            </div>
            <div
              className={styles.hero__lives}
              role="img"
              aria-label={`${t.hero.livesAria}: ${lives}`}
            >
              {[0, 1, 2].map((i) => (
                <HeartIcon key={i} filled={i < lives} />
              ))}
            </div>
          </>
        ) : null}

        {phase === 'closing' ? (
          <div className={styles.hero__result}>
            <p className={styles.hero__resultEyebrow}>{t.hero.breakoutClosed}</p>
            <p className={styles.hero__resultScore}>
              <span>{t.hero.finalScore}</span>
              <strong>{score}</strong>
            </p>
            <p className={styles.hero__resultBest}>
              <span>{t.hero.bestScore}</span>
              <strong>{best}</strong>
              {isNewBest ? (
                <em className={styles.hero__resultNew}>{t.hero.newBest}</em>
              ) : null}
            </p>
            <button
              type="button"
              className={styles.hero__resultBtn}
              onClick={() => setPhase('idle')}
            >
              {t.hero.dismissResult}
            </button>
          </div>
        ) : null}

        {phase !== 'closing' ? (
          <BootLog enabled={!reduced} lines={bootLines} />
        ) : null}

        {!reduced && phase !== 'closing' ? (
          <button
            type="button"
            className={styles.hero__bait}
            onClick={phase === 'playing' ? abortGame : startGame}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            {phase === 'playing' ? t.hero.abort : t.hero.bait}
          </button>
        ) : null}
      </div>

      <div className={styles.hero__inner} aria-hidden={gameActive}>
        <div className={styles.hero__copy}>
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

        <motion.figure
          className={styles.hero__portrait}
          data-glitch={portraitGlitch ? 'true' : undefined}
          initial={reduced ? false : { opacity: 0, x: 18, rotate: -6 }}
          animate={{ opacity: 1, x: 0, rotate: -3.5 }}
          transition={{ duration: 0.6, delay: 0.16 }}
        >
          <span className={styles.hero__portraitGlow} aria-hidden="true" />
          <div className={styles.hero__portraitStack}>
            {portraits.map((src, i) => (
              <img
                key={src}
                className={styles.hero__portraitImg}
                data-active={i === portraitIndex ? 'true' : undefined}
                src={src}
                alt={i === portraitIndex ? site.author.fullName : ''}
                width={640}
                height={800}
                decoding="async"
                aria-hidden={i === portraitIndex ? undefined : true}
              />
            ))}
          </div>
          <span className={styles.hero__portraitStatic} aria-hidden="true" />
          <span className={styles.hero__portraitSlice} aria-hidden="true" />
          <span className={styles.hero__portraitFrame} aria-hidden="true" />
          <figcaption className={styles.hero__portraitMeta} aria-hidden="true">
            <span>img/{String(portraitIndex + 1).padStart(2, '0')}</span>
            <span>{portraitLabel(portraits[portraitIndex])}</span>
          </figcaption>
        </motion.figure>
      </div>
    </section>
    </>
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
