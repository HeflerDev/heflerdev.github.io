import { useLocale } from '../i18n/context'
import { sectionIds } from '../i18n/types'
import styles from './Nav.module.css'

type Props = {
  activeId?: string
}

export function Nav({ activeId }: Props) {
  const { locale, setLocale, t } = useLocale()

  const labels: Record<(typeof sectionIds)[number], string> = {
    about: t.nav.about,
    projects: t.nav.projects,
    experience: t.nav.experience,
    recommendations: t.nav.recommendations,
    contact: t.nav.contact,
  }

  return (
    <nav className={styles.nav} aria-label={t.nav.aria} data-site-nav>
      <a className={styles.nav__brand} href="#top">
        heflerdev.github.io
      </a>
      <div className={styles.nav__right}>
        <ul className={styles.nav__links}>
          {sectionIds.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={activeId === id ? 'true' : undefined}
              >
                {labels[id]}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.nav__lang} role="group" aria-label="Language">
          <button
            type="button"
            className={styles.nav__langBtn}
            data-active={locale === 'pt' ? 'true' : undefined}
            onClick={() => setLocale('pt')}
          >
            PT
          </button>
          <span className={styles.nav__langSep} aria-hidden="true">
            /
          </span>
          <button
            type="button"
            className={styles.nav__langBtn}
            data-active={locale === 'en' ? 'true' : undefined}
            onClick={() => setLocale('en')}
          >
            EN
          </button>
        </div>
      </div>
    </nav>
  )
}
