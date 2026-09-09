import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useLocale } from '../i18n/context'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { Reveal } from './Reveal'
import styles from './Projects.module.css'

type Project = {
  id: string
  name: string
  tools: string[]
  image: string
  summary: string
  link?: string
  github?: string
  private?: boolean
}

export function Projects() {
  const { t } = useLocale()
  const { projects } = t
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)

  const total = projects.items.length
  const safeIndex = total === 0 ? 0 : ((index % total) + total) % total

  const go = (dir: -1 | 1) => {
    setIndex((i) => (i + dir + total) % total)
  }

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

      {expanded ? (
        <div className={styles.list}>
          {projects.items.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              labels={projects}
            />
          ))}
        </div>
      ) : (
        <div className={styles.carousel} aria-roledescription="carousel">
          <div className={styles.carousel__track}>
            <AnimatePresence mode="wait">
              <motion.div
                key={projects.items[safeIndex]?.id ?? safeIndex}
                initial={reduced ? false : { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduced ? undefined : { opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {projects.items[safeIndex] ? (
                  <ProjectCard
                    project={projects.items[safeIndex]}
                    index={safeIndex}
                    labels={projects}
                    featured
                  />
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={styles.carousel__controls}>
            <button
              type="button"
              className={styles.carousel__nav}
              onClick={() => go(-1)}
              aria-label={projects.prev}
            >
              ← {projects.prev}
            </button>

            <div
              className={styles.carousel__dots}
              role="tablist"
              aria-label={projects.carouselAria}
            >
              {projects.items.map((project, i) => (
                <button
                  key={project.id}
                  type="button"
                  className={styles.carousel__dot}
                  data-active={i === safeIndex ? 'true' : undefined}
                  aria-label={`${i + 1} / ${total}`}
                  aria-selected={i === safeIndex}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>

            <button
              type="button"
              className={styles.carousel__nav}
              onClick={() => go(1)}
              aria-label={projects.next}
            >
              {projects.next} →
            </button>
          </div>
        </div>
      )}

      <div className={styles.more}>
        <button
          type="button"
          className={styles.more__btn}
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? projects.seeLess : projects.seeMore}
        </button>
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  index,
  labels,
  featured = false,
}: {
  project: Project
  index: number
  labels: {
    private: string
    live: string
    github: string
  }
  featured?: boolean
}) {
  return (
    <article
      className={`${styles.item}${featured ? ` ${styles.itemFeatured}` : ''}`}
    >
      <div className={styles.thumbFrame}>
        <img
          className={styles.thumb}
          src={project.image}
          alt=""
          loading="lazy"
        />
      </div>
      <div>
        <p className={styles.index}>
          {String(index + 1).padStart(2, '0')}
          {project.private ? (
            <span className={styles.private}>
              {' '}
              — {labels.private}
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
              {labels.live}
            </a>
          ) : null}
          {project.github ? (
            <a href={project.github} target="_blank" rel="noreferrer">
              {labels.github}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}
