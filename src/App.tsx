import { useEffect, useState } from 'react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Experience } from './components/Experience'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Projects } from './components/Projects'
import { Recommendations } from './components/Recommendations'
import { sectionIds } from './i18n/types'

export default function App() {
  const [activeId, setActiveId] = useState<string | undefined>()

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  useEffect(() => {
    const nodes = ['top', ...sectionIds]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const id = visible[0]?.target.id
        if (id && id !== 'top') setActiveId(id)
        if (id === 'top') setActiveId(undefined)
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0.15, 0.4, 0.65] },
    )

    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Nav activeId={activeId} />
      <main>
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Recommendations />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
