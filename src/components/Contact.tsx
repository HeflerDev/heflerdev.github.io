import { site } from '../data/site'
import { useLocale } from '../i18n/context'
import { Reveal } from './Reveal'
import styles from './Contact.module.css'

export function Contact() {
  const { author } = site
  const { t } = useLocale()
  const { contact } = t

  return (
    <section className="section" id="contact">
      <Reveal speed={3.2} mode="parallel">
        <p className="section-label">{contact.label}</p>
        <h2 className="section-title">{contact.title}</h2>
      </Reveal>

      <Reveal delay={0.02} speed={4} mode="parallel">
        <div className={styles.block}>
          <p className={styles.lead}>{contact.lead}</p>

          <ul className={styles.channels}>
            <li>
              <span className={styles.key}>{contact.email}</span>
              <a className={styles.val} href={`mailto:${author.email}`}>
                {author.email}
              </a>
            </li>
            <li>
              <span className={styles.key}>{contact.whatsapp}</span>
              <a
                className={styles.val}
                href={`https://wa.me/${author.phoneTel.replace('+', '')}`}
                target="_blank"
                rel="noreferrer"
              >
                {author.phone}
              </a>
            </li>
            <li>
              <span className={styles.key}>{contact.linkedin}</span>
              <a
                className={styles.val}
                href={`https://www.linkedin.com/in/${author.linkedin}/`}
                target="_blank"
                rel="noreferrer"
              >
                linkedin.com/in/{author.linkedin}
              </a>
            </li>
            <li>
              <span className={styles.key}>{contact.github}</span>
              <a
                className={styles.val}
                href={`https://github.com/${author.github}`}
                target="_blank"
                rel="noreferrer"
              >
                github.com/{author.github}
              </a>
            </li>
          </ul>

          <a className="btn" href={`mailto:${author.email}`}>
            {contact.cta}
          </a>
        </div>
      </Reveal>
    </section>
  )
}
