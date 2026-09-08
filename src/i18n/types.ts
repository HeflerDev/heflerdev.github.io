export type Locale = 'en' | 'pt'

export type Messages = {
  meta: {
    description: string
  }
  nav: {
    about: string
    projects: string
    experience: string
    recommendations: string
    contact: string
    aria: string
  }
  hero: {
    meta: [string, string, string]
    headline: string
    support: string
    ctaProjects: string
    ctaContact: string
  }
  about: {
    label: string
    title: string
    greeting: string
    roleLine: string
    intro: string
    points: { title: string; body: string }[]
    stacksTitle: string
    toolsTitle: string
    stacks: { name: string; level: number }[]
    tools: string[]
  }
  projects: {
    label: string
    title: string
    subtitle: string
    private: string
    live: string
    github: string
    items: {
      id: string
      name: string
      tools: string[]
      image: string
      summary: string
      link?: string
      github?: string
      private?: boolean
    }[]
  }
  experience: {
    label: string
    title: string
    work: string
    education: string
    present: string
    items: {
      title: string
      from: string
      to: string | 'present'
      description: string
      kind: 'work' | 'education'
    }[]
  }
  recommendations: {
    label: string
    title: string
    source: string
    items: {
      name: string
      role: string
      context: string
      quote: string
    }[]
  }
  contact: {
    label: string
    title: string
    lead: string
    email: string
    whatsapp: string
    linkedin: string
    github: string
    cta: string
  }
}

export const sectionIds = [
  'about',
  'projects',
  'experience',
  'recommendations',
  'contact',
] as const
