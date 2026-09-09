import { useEffect, useState } from 'react'
import { useLocale } from '../i18n/context'
import { useTheme } from '../theme/ThemeProvider'
import styles from './ThemeToggle.module.css'

type Props = {
  variant: 'float' | 'nav'
  docked?: boolean
}

export function ThemeToggle({ variant, docked = false }: Props) {
  const { theme, toggleTheme } = useTheme()
  const { t } = useLocale()
  const next = theme === 'dark' ? 'light' : 'dark'
  const label =
    next === 'light' ? t.nav.themeToLight : t.nav.themeToDark

  if (variant === 'float') {
    return (
      <button
        type="button"
        className={styles.float}
        data-hidden={docked ? 'true' : undefined}
        onClick={toggleTheme}
        aria-label={label}
        title={label}
      >
        <span className={styles.float__eyebrow}>{t.nav.themeLabel}</span>
        <span className={styles.float__value}>
          {theme === 'dark' ? t.nav.themeDark : t.nav.themeLight}
          <span className={styles.float__arrow} aria-hidden="true">
            → {next === 'light' ? t.nav.themeLight : t.nav.themeDark}
          </span>
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      className={styles.navBtn}
      data-visible={docked ? 'true' : undefined}
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      {theme === 'dark' ? '◐' : '◑'}
      <span className={styles.navBtn__text}>
        {theme === 'dark' ? t.nav.themeDark : t.nav.themeLight}
      </span>
    </button>
  )
}

/** Tracks whether the floating theme chip should dock into the nav. */
export function useThemeDocked(threshold = 56) {
  const [docked, setDocked] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.scrollY > threshold
  })

  useEffect(() => {
    const onScroll = () => setDocked(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return docked
}
