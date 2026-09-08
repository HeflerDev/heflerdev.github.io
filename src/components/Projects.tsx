import { useLocale } from '../i18n/context'
import { Reveal } from './Reveal'
import styles from './Projects.module.css'

export function Projects() {
  const { t } = useLocale()
  const { projects } = t

  return (
    <section className="section" id="projects">
      <Reveal>
        <p className="section-label">{projects.label}</p>
        <h2 className="section-title">{projects.title}</h2>
        <p
          className="muted"
          style={{ marginTop: '-0.5rem', marginBottom: '2rem' }}
        >
          {projects.subtitle}
        </p>
      </Reveal>

      <div className={styles.list}>
        {projects.items.map((project, i) => (
          <Reveal key={project.id} delay={i * 0.05}>
            <article className={styles.item}>
              <img
                className={styles.thumb}
                src={project.image}
                alt=""
                loading="lazy"
              />
              <div>
                <p className={styles.index}>
                  {String(i + 1).padStart(2, '0')}
                  {project.private ? (
                    <span className={styles.private}>
                      {' '}
                      — {projects.private}
                    </span>
                  ) : null}
                </p>
                <h3 className={styles.name}>{project.name}</h3>
                <p className={styles.summary}>{project.summary}</p>
                <ul className={styles.tags}>
                  {project.tools.map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
                <div className={styles.links}>
                  {project.link ? (
                    <a href={project.link} target="_blank" rel="noreferrer">
                      {projects.live}
                    </a>
                  ) : null}
                  {project.github ? (
                    <a href={project.github} target="_blank" rel="noreferrer">
                      {projects.github}
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
