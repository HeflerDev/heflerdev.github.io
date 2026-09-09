import { useState } from 'react'
import { useLocale } from '../i18n/context'
import { Reveal } from './Reveal'
import styles from './Experience.module.css'

const PREVIEW_WORK = 2

export function Experience() {
  const { t } = useLocale()
  const { experience } = t
  const [expanded, setExpanded] = useState(false)

  const work = experience.items.filter((item) => item.kind === 'work')
  const education = experience.items.filter((item) => item.kind === 'education')
  const previewWork = work.slice(0, PREVIEW_WORK)
  const visible = expanded ? experience.items : previewWork

  return (
    <section className="section" id="experience">
      <Reveal>
        <p className="section-label">{experience.label}</p>
        <h2 className="section-title">{experience.title}</h2>
      </Reveal>

      <Reveal delay={0.06}>
        <p className={styles.filters}>
          <span data-active="true">
            {experience.work} ({work.length})
          </span>
          <span>
            {experience.education} ({education.length})
          </span>
        </p>
      </Reveal>

      <div className={styles.track}>
        {visible.map((item, i) => (
          <Reveal key={`${item.title}-${item.from}`} delay={i * 0.04}>
            <article className={styles.item}>
              <p className={styles.when}>
                {item.from} —{' '}
                {item.to === 'present' ? experience.present : item.to}
                <span className={styles.kind}>
                  {' '}
                  ·{' '}
                  {item.kind === 'work'
                    ? experience.work
                    : experience.education}
                </span>
              </p>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.desc}>{item.description}</p>
            </article>
          </Reveal>
        ))}
      </div>

      {work.length > PREVIEW_WORK ? (
        <div className={styles.more}>
          <button
            type="button"
            className={styles.more__btn}
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {expanded ? experience.seeLess : experience.seeMore}
          </button>
        </div>
      ) : null}
    </section>
  )
}
