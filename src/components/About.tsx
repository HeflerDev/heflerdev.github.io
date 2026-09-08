import { motion } from 'framer-motion'
import { site } from '../data/site'
import { useLocale } from '../i18n/context'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { Reveal } from './Reveal'
import styles from './About.module.css'

export function About() {
  const reduced = useReducedMotion()
  const { t } = useLocale()
  const { about } = t

  return (
    <section className="section" id="about">
      <Reveal>
        <p className="section-label">{about.label}</p>
        <h2 className="section-title">{about.title}</h2>
      </Reveal>

      <div className={styles.layout}>
        <Reveal delay={0.08}>
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

        <Reveal delay={0.14}>
          <div className={styles.panel}>
            <h3>{about.stacksTitle}</h3>
            <div className={styles.stack}>
              {about.stacks.map((s, i) => (
                <div className={styles.stack__row} key={s.name}>
                  <div className={styles.stack__meta}>
                    <span>{s.name}</span>
                    <span className="muted">{s.level}%</span>
                  </div>
                  <div className={styles.stack__bar}>
                    <motion.div
                      className={styles.stack__fill}
                      initial={reduced ? { scaleX: s.level / 100 } : { scaleX: 0 }}
                      whileInView={{ scaleX: s.level / 100 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.1 + i * 0.08 }}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <h3>{about.toolsTitle}</h3>
            <ul className={styles.tools}>
              {about.tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
