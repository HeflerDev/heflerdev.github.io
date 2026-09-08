import { useLocale } from '../i18n/context'
import { Reveal } from './Reveal'
import styles from './Recommendations.module.css'

export function Recommendations() {
  const { t } = useLocale()
  const { recommendations } = t

  return (
    <section className="section" id="recommendations">
      <Reveal>
        <p className="section-label">{recommendations.label}</p>
        <h2 className="section-title">{recommendations.title}</h2>
        <p className={styles.source}>
          {recommendations.source}{' '}
          <a
            href="https://www.linkedin.com/in/heflerdev/details/recommendations/?detailScreenTabIndex=0"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </p>
      </Reveal>

      <div className={styles.grid}>
        {recommendations.items.map((rec, i) => (
          <Reveal key={rec.name} delay={i * 0.06}>
            <blockquote className={styles.card}>
              <p className={styles.name}>{rec.name}</p>
              <p className={styles.role}>{rec.role}</p>
              <p className={styles.context}>{rec.context}</p>
              <p className={styles.quote}>{rec.quote}</p>
            </blockquote>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
