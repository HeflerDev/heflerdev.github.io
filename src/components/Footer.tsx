import { site } from '../data/site'
import styles from './Footer.module.css'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <p>
        <span style={{ color: 'var(--accent)' }}>$</span> echo &quot;
        {site.author.fullName} — {year}&quot;
      </p>
      <p>
        <a href={`https://github.com/${site.author.github}`}>github</a>
        {' · '}
        <a href={`https://www.linkedin.com/in/${site.author.linkedin}/`}>
          linkedin
        </a>
      </p>
    </footer>
  )
}
