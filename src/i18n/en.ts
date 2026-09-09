import type { Messages } from './types'

export const en: Messages = {
  meta: {
    description:
      'Software Engineer | Full-Cycle Development | APIs, Microservices, Databases | TypeScript/JavaScript, Java, Rust | AWS | React',
  },
  nav: {
    about: 'about',
    projects: 'projects',
    experience: 'experience',
    recommendations: 'recs',
    contact: 'contact',
    aria: 'Primary',
  },
  hero: {
    meta: ['software engineer', 'full-cycle', 'hefler.dev'],
    headline: 'Full-cycle engineer. Backend-first.',
    support:
      'APIs, microservices, and cloud infrastructure in TypeScript, Node.js, Rust, and React.',
    ctaProjects: './projects',
    ctaContact: './contact',
    boot: [
      'boot › kernel ok',
      'boot › apis online',
      'boot › infra ready',
      'boot › hefler.dev',
    ],
    bait: 'do not press this button',
    abort: 'abort session',
    breakoutInit: 'breakout › session started',
    breakoutHud: (score) => `breakout › hits ${score}`,
    breakoutClosed: 'breakout › terminal closed',
    livesAria: 'Lives remaining',
    hitsLabel: 'hits',
    finalScore: 'score',
    bestScore: 'best',
    newBest: 'new best',
    dismissResult: 'close terminal',
  },
  about: {
    label: '01 — about',
    title: 'About Me',
    greeting: 'Hi, I am',
    roleLine:
      'Software Engineer — Backend Developer — Full Stack & Full Cycle — APIs, Microservices, Cloud (AWS, Node.js, TS/JS, Rust, React)',
    intro:
      'Software Engineer with hands-on experience across broad and specialized stacks:',
    points: [
      {
        title: 'Software Engineer:',
        body: '4+ years working, collaborating, and managing teams and projects.',
      },
      {
        title: 'Full Cycle and Full Stack:',
        body: 'Able to create applications end-to-end.',
      },
      {
        title: 'Back End Focused:',
        body: 'Specialized in designing organized, scalable, high-performance, highly available servers (APIs), distributed services (microservices), robust testing strategies, CI/CD pipelines, and resilient infrastructure (cloud, Unix).',
      },
    ],
    stacksTitle: 'Stacks',
    toolsTitle: 'Tools & Skills',
    stacks: [
      { name: 'Backend', level: 100 },
      { name: 'Frontend', level: 75 },
      { name: 'DevOps / Cloud', level: 100 },
      { name: 'Mobile', level: 100 },
    ],
    tools: [
      'Node.js / Express.js',
      'MongoDB & PostgreSQL',
      'Microservices & System Architecture',
      'Terraform / Infrastructure as Code',
      'Linux / Unix Administration',
      'AWS (EC2, S3, Lambda, RDS, DynamoDB, VPC)',
      'Docker & Kubernetes',
      'Nginx / Reverse Proxy & Load Balancing',
      'CI/CD (GitHub Actions, Jenkins)',
      'Observability (CloudWatch, Prometheus, Grafana)',
      'Networking, DNS & TLS',
      'React & React Native',
    ],
  },
  projects: {
    label: '02 — projects',
    title: 'Selected work',
    subtitle:
      'Backend systems, microservices, and infrastructure shipped in production.',
    private: 'private',
    live: 'live →',
    github: 'github →',
    seeMore: 'see more work',
    seeLess: 'show less',
    prev: 'previous',
    next: 'next',
    carouselAria: 'Projects carousel',
    items: [
      {
        id: 'sgc',
        name: 'SGC + PDV',
        tools: ['Java', 'ERP', 'PDV', 'NFC-e', 'NF-e', 'TEF'],
        image: '/images/sgc.png',
        summary:
          'Full retail platform: back-office (SGC) for catalogs, inventory, billing, finance, and tax documents, plus a POS synced to the back-office with NFC-e/NF-e, card payments (TEF), and offline/local operation. I currently work on this project as Developer and Tech Lead.',
        private: true,
      },
      {
        id: 'portal-suporte',
        name: 'Support Portal',
        tools: ['Java', 'TypeScript', 'React', 'RBAC', 'Kanban'],
        image: '/images/portal-suporte.png',
        summary:
          'Internal ERP admin panel that combines employee records, RBAC permissions, a Kanban board, customer registry, and ticket management in a single platform.',
        private: true,
      },
      {
        id: 'cover-badger',
        name: 'Cover Badger',
        tools: [
          'JavaScript',
          'Node.js',
          'MongoDB',
          'AWS',
          'Docker',
          'Kubernetes',
          'Redis',
          'API Development',
        ],
        image: '/images/coverbadger.jpg',
        summary:
          'Backend maintenance and enhancements — API stability, MongoDB/Redis optimization, microservices features, AWS + Docker + Kubernetes deployments.',
        link: 'https://coverbadger.com/',
      },
      {
        id: 'ghs',
        name: 'GHS Platform',
        tools: ['Node.js', 'MongoDB', 'AWS', 'Docker', 'API Development'],
        image: '/images/ghs.png',
        summary:
          'Led end-to-end backend API development — database architecture, RESTful endpoints, AWS EC2 + Docker deployment — with a focus on performance, scalability, and security.',
        link: 'https://app.stangsfb.com/',
      },
      {
        id: 'audience-lab',
        name: 'Audience Lab',
        tools: [
          'Node.js',
          'JavaScript',
          'AWS',
          'Docker',
          'Microservices',
          'Java',
        ],
        image: '/images/audiencelab.jpeg',
        summary:
          'Audience generation and segmentation platform on a microservices stack (Node.js, Java, Redis, RabbitMQ) deployed on AWS with Docker/Kubernetes. Private project.',
        private: true,
      },
      {
        id: 'watchtower',
        name: 'Watchtower',
        tools: ['Node.js', 'SSH', 'Monitoring', 'Docker', 'Remote Management'],
        image:
          'https://github.com/user-attachments/assets/2c638a5b-8087-4294-90db-5c0627ed7bb6',
        summary:
          'Remote SSH monitoring and admin tool — real-time metrics (CPU, memory, disk, processes), remote command execution, Dockerized deployment.',
        github: 'https://github.com/heflerdev/watchtower',
      },
      {
        id: 'rp1',
        name: 'RP1 Message Dispatch System',
        tools: ['Node.js', 'TypeScript', 'MongoDB', 'Redis', 'Microservices'],
        image: '/images/rp1.jpeg',
        summary:
          'High-throughput message microservice using subprocesses, clustering, and Redis — optimized MongoDB indexes for 100M+ records. Private project.',
        link: 'https://callprofitrocket.com/rocket-bookings/',
        private: true,
      },
    ],
  },
  experience: {
    label: '03 — experience',
    title: 'Timeline',
    work: 'work',
    education: 'education',
    present: 'present',
    seeMore: 'see more experience',
    seeLess: 'show less',
    items: [
      {
        title: 'Tech Lead, Araratech, Brazil',
        from: 'Jan 2026',
        to: 'present',
        kind: 'work',
        description:
          'Technical leadership for a Java ERP with POS (PDV): architecture and engineering standards, mentoring, and delivery ownership. Drive cashier and management modules, code reviews, production stability, and alignment between product, engineering, and operations.',
      },
      {
        title: 'Back End Developer, Good Software Dev, Texas, United States',
        from: '2022',
        to: 'Dec 2025',
        kind: 'work',
        description:
          'Planning, development, and maintenance of software and microservices, with a strong focus on TypeScript/JavaScript. Involved in the entire application lifecycle, from architecture to deployment and ongoing support. Experience in server management and leading project teams. Skilled in analyzing and optimizing system performance, including diagnosing and improving NoSQL databases, especially MongoDB.',
      },
      {
        title: 'Full Stack Developer, Fidelizou.me, Rio Grande do Sul, Brazil',
        from: '2022',
        to: '2022',
        kind: 'work',
        description:
          'Developed interfaces, troubleshot production code through AWS, worked on backend systems with Node.js and frontend using Vue.js. Mentored and supervised coworkers, reviewed pull requests, and updated legacy code.',
      },
      {
        title: 'Software Developer, Orulo, Brazil',
        from: '2021',
        to: '2022',
        kind: 'work',
        description:
          'Planned and developed user interfaces, conducted code reviews, and modernized legacy codebases to align with current development standards.',
      },
      {
        title: 'Auxiliary Electronic Technician, Konnel Tec, Brazil',
        from: '2019',
        to: '2020',
        kind: 'work',
        description:
          'Repaired defective electronic devices, managed logistics and inventory of components, and performed testing and diagnostics on circuit boards.',
      },
      {
        title:
          'Auxiliary Process Analyst, Grupo Fallgatter, Cachoeirinha, Brazil',
        from: '2018',
        to: '2019',
        kind: 'work',
        description:
          'Monitored and improved production processes by collecting and analyzing data, and implementing optimized operational methods.',
      },
      {
        title:
          "Bachelor's Degree, CNEC - Campanha Nacional de Escolas da Comunidade",
        from: '2024',
        to: '2026',
        kind: 'education',
        description: "Bachelor's degree in Computer Systems Analysis/Analyst.",
      },
      {
        title: 'Certificate, Microverse',
        from: '2019',
        to: '2020',
        kind: 'education',
        description:
          'Certification in Computer Software Engineering, with a focus on remote collaborative development and full-stack engineering.',
      },
      {
        title: 'Technical Degree, Escola Técnica José Cézar de Mesquita',
        from: '2018',
        to: '2020',
        kind: 'education',
        description: 'Technical education in Automation Engineering Technology.',
      },
    ],
  },
  recommendations: {
    label: '04 — recommendations',
    title: 'From collaborators',
    source: 'Source:',
    items: [
      {
        name: 'Fabiano Frank',
        role: 'Full Stack Engineer | JavaScript, React, Ruby, Rails and SQL',
        context:
          "Henrique's coworker from Feb 15, 2024 — React Developer at Good Software Dev",
        quote:
          'I am pleased to take a moment to express my wholehearted recommendation for Henrique Figueiredo Hefler, a distinguished Backend Software Engineer with expertise in DevOps whom I have had the privilege of working alongside at GSD - Good Software Dev. In the dynamic and fast-paced world of software development, Henrique has consistently demonstrated an unparalleled commitment to excellence and a profound understanding of backend technologies. His proficiency in crafting robust and scalable solutions is truly commendable, and I have witnessed firsthand his ability to tackle complex challenges with ease. Beyond his technical acumen, Henrique is a collaborative and communicative team player. Having worked closely with Henrique, I can confidently attest to his reliability, adaptability, and unwavering commitment to delivering exceptional results.',
      },
      {
        name: 'Mariana Revilla Lérida',
        role: 'Full-stack Developer | .NET MVC | React | Remote work enthusiast',
        context: "Henrique's coworker from Oct 18, 2023",
        quote:
          'Henrique Hefler is a brilliant DevOps engineer who can solve any problem with ease and efficiency. I had the pleasure of working with him for seven months at Good Software Dev, where he was in charge of automating the pipelines for deploying Docker containers. He showed great expertise in managing servers and virtual machines, and he was always up to date with the latest technologies and best practices. He improved the performance, reliability, and security of our applications by implementing continuous integration and delivery, monitoring, and testing tools. I highly recommend Henrique for any DevOps role that requires creativity, innovation, and excellence.',
      },
      {
        name: 'Saadat Ali',
        role: 'Back-End Developer @GoodSoftwareDev | TypeScript, Nest.js, Next.js | PostgreSQL, MongoDB, Ruby on Rails, Mocha, Redis, RabbitMQ, AWS',
        context: "Henrique's coworker from Oct 14, 2023",
        quote:
          'Working with Hefler for the last one year has been one of the very best experiences in my professional life and now I am here to recommend Hefler for any Backend and especially DevOps related jobs. His calm and composed nature nurtures a positive attitude in the team and his eagerness to deliver the best possible product makes him very reliable. I am really amazed that throughout tenure I have been asking to deploy new technologies which he was not experienced with at all and he spent days and nights deploying them to perfection within the deadline.',
      },
      {
        name: 'Jeferson Domingues',
        role: 'Production Supervisor',
        context: 'Managed Henrique Feb 20, 2020',
        quote:
          'Collaborator with vast informatics knowledge, good team relations and focused on his demands.',
      },
    ],
  },
  contact: {
    label: '05 — contact',
    title: 'Get in touch',
    lead: "I'm always open to new opportunities, collaborations, and interesting projects. Reach out through any channel below.",
    email: 'email',
    whatsapp: 'whatsapp',
    linkedin: 'linkedin',
    github: 'github',
    cta: 'send email →',
  },
}
