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
    const nodes = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: [0.1, 0.35, 0.6] },
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
        <hr className="rule" />
        <Projects />
        <hr className="rule" />
        <Experience />
        <hr className="rule" />
        <Recommendations />
        <hr className="rule" />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
