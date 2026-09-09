import type { Messages } from './types'

export const pt: Messages = {
  meta: {
    description:
      'Engenheiro de Software | Desenvolvimento Full-Cycle | APIs, Microsserviços, Bancos de Dados | TypeScript/JavaScript, Java, Rust | AWS | React',
  },
  nav: {
    about: 'sobre',
    projects: 'projetos',
    experience: 'experiência',
    recommendations: 'recs',
    contact: 'contato',
    aria: 'Principal',
  },
  hero: {
    meta: ['engenheiro de software', 'full-cycle', 'hefler.dev'],
    headline: 'Engenheiro full-cycle. Backend primeiro.',
    support:
      'APIs, microsserviços e infraestrutura cloud com TypeScript, Node.js, Rust e React.',
    ctaProjects: './projetos',
    ctaContact: './contato',
    boot: [
      'boot › kernel ok',
      'boot › apis online',
      'boot › infra ready',
      'boot › hefler.dev',
    ],
  },
  about: {
    label: '01 — sobre',
    title: 'Sobre mim',
    greeting: 'Olá, eu sou',
    roleLine:
      'Engenheiro de Software — Backend — Full Stack & Full Cycle — APIs, Microsserviços, Cloud (AWS, Node.js, TS/JS, Rust, React)',
    intro:
      'Engenheiro de Software com experiência prática em stacks amplas e especializadas:',
    points: [
      {
        title: 'Engenheiro de Software:',
        body: 'mais de 4 anos trabalhando, colaborando e gerenciando times e projetos.',
      },
      {
        title: 'Full Cycle e Full Stack:',
        body: 'capaz de criar aplicações de ponta a ponta.',
      },
      {
        title: 'Foco em Back End:',
        body: 'especializado em projetar servidores organizados, escaláveis, de alta performance e alta disponibilidade (APIs), serviços distribuídos (microsserviços), estratégias sólidas de testes, pipelines de CI/CD e infraestrutura resiliente (cloud, Unix).',
      },
    ],
    stacksTitle: 'Stacks',
    toolsTitle: 'Ferramentas & Skills',
    stacks: [
      { name: 'Backend', level: 100 },
      { name: 'Frontend', level: 75 },
      { name: 'DevOps / Cloud', level: 100 },
      { name: 'Mobile', level: 100 },
    ],
    tools: [
      'Node.js / Express.js',
      'MongoDB & PostgreSQL',
      'Microsserviços & Arquitetura de Sistemas',
      'Terraform / Infrastructure as Code',
      'Administração Linux / Unix',
      'AWS (EC2, S3, Lambda, RDS, DynamoDB, VPC)',
      'Docker & Kubernetes',
      'Nginx / Reverse Proxy & Load Balancing',
      'CI/CD (GitHub Actions, Jenkins)',
      'Observabilidade (CloudWatch, Prometheus, Grafana)',
      'Networking, DNS & TLS',
      'React & React Native',
    ],
  },
  projects: {
    label: '02 — projetos',
    title: 'Trabalhos selecionados',
    subtitle:
      'Sistemas backend, microsserviços e infraestrutura em produção.',
    private: 'privado',
    live: 'live →',
    github: 'github →',
    items: [
      {
        id: 'ghs',
        name: 'GHS Platform',
        tools: ['Node.js', 'MongoDB', 'AWS', 'Docker', 'API Development'],
        image: '/images/ghs.png',
        summary:
          'Liderei o desenvolvimento backend de ponta a ponta — arquitetura de banco, endpoints REST, deploy em AWS EC2 + Docker — com foco em performance, escalabilidade e segurança.',
        link: 'https://app.stangsfb.com/',
      },
      {
        id: 'rp1',
        name: 'RP1 Message Dispatch System',
        tools: ['Node.js', 'TypeScript', 'MongoDB', 'Redis', 'Microservices'],
        image: '/images/rp1.jpeg',
        summary:
          'Microsserviço de mensageria de alto throughput com subprocessos, clustering e Redis — índices MongoDB otimizados para 100M+ registros. Projeto privado.',
        link: 'https://callprofitrocket.com/rocket-bookings/',
        private: true,
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
          'Plataforma de geração e segmentação de audiências em arquitetura de microsserviços (Node.js, Java, Redis, RabbitMQ) na AWS com Docker/Kubernetes. Projeto privado.',
        private: true,
      },
      {
        id: 'watchtower',
        name: 'Watchtower',
        tools: ['Node.js', 'SSH', 'Monitoring', 'Docker', 'Remote Management'],
        image:
          'https://github.com/user-attachments/assets/2c638a5b-8087-4294-90db-5c0627ed7bb6',
        summary:
          'Ferramenta de monitoramento e administração remota via SSH — métricas em tempo real (CPU, memória, disco, processos), execução remota de comandos, deploy containerizado.',
        github: 'https://github.com/heflerdev/watchtower',
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
        image: '/images/coverbadger.png',
        summary:
          'Manutenção e evoluções de backend — estabilidade de APIs, otimização MongoDB/Redis, features em microsserviços, deploys AWS + Docker + Kubernetes.',
        link: 'https://coverbadger.com/',
      },
    ],
  },
  experience: {
    label: '03 — experiência',
    title: 'Linha do tempo',
    work: 'trabalho',
    education: 'formação',
    present: 'atual',
    items: [
      {
        title: 'Back End Developer, Good Software Dev, Texas, Estados Unidos',
        from: '2022',
        to: 'present',
        kind: 'work',
        description:
          'Planejamento, desenvolvimento e manutenção de software e microsserviços, com forte foco em TypeScript/JavaScript. Envolvido em todo o ciclo de vida da aplicação, da arquitetura ao deploy e suporte contínuo. Experiência em gestão de servidores e liderança de times. Análise e otimização de performance, incluindo diagnóstico e melhoria de bancos NoSQL, especialmente MongoDB.',
      },
      {
        title: 'Full Stack Developer, Fidelizou.me, Rio Grande do Sul, Brasil',
        from: '2022',
        to: '2022',
        kind: 'work',
        description:
          'Desenvolvimento de interfaces, troubleshooting de código em produção via AWS, backend com Node.js e frontend com Vue.js. Mentoria de colegas, revisão de pull requests e atualização de código legado.',
      },
      {
        title: 'Software Developer, Orulo, Brasil',
        from: '2021',
        to: '2022',
        kind: 'work',
        description:
          'Planejamento e desenvolvimento de interfaces, code reviews e modernização de codebases legadas alinhadas aos padrões atuais.',
      },
      {
        title: 'Auxiliar Técnico Eletrônico, Konnel Tec, Brasil',
        from: '2019',
        to: '2020',
        kind: 'work',
        description:
          'Reparo de dispositivos eletrônicos, logística e inventário de componentes, testes e diagnósticos em placas de circuito.',
      },
      {
        title:
          'Auxiliar de Analista de Processos, Grupo Fallgatter, Cachoeirinha, Brasil',
        from: '2018',
        to: '2019',
        kind: 'work',
        description:
          'Monitoramento e melhoria de processos produtivos por meio de coleta e análise de dados, implementando métodos operacionais otimizados.',
      },
      {
        title:
          'Bacharelado, CNEC - Campanha Nacional de Escolas da Comunidade',
        from: '2024',
        to: '2026',
        kind: 'education',
        description: 'Bacharelado em Análise e Desenvolvimento de Sistemas.',
      },
      {
        title: 'Certificado, Microverse',
        from: '2019',
        to: '2020',
        kind: 'education',
        description:
          'Certificação em Engenharia de Software, com foco em desenvolvimento colaborativo remoto e full-stack.',
      },
      {
        title: 'Curso Técnico, Escola Técnica José Cézar de Mesquita',
        from: '2018',
        to: '2020',
        kind: 'education',
        description: 'Formação técnica em Automação Industrial.',
      },
    ],
  },
  recommendations: {
    label: '04 — recomendações',
    title: 'De colaboradores',
    source: 'Fonte:',
    items: [
      {
        name: 'Fabiano Frank',
        role: 'Full Stack Engineer | JavaScript, React, Ruby, Rails and SQL',
        context:
          'Colega de Henrique desde 15 de fev. de 2024 — React Developer na Good Software Dev',
        quote:
          'É com prazer que recomendo Henrique Figueiredo Hefler, um Backend Software Engineer distinto com expertise em DevOps, com quem tive o privilégio de trabalhar na GSD - Good Software Dev. No ritmo dinâmico do desenvolvimento de software, Henrique demonstra compromisso excepcional com a excelência e profundo domínio de tecnologias backend. Sua capacidade de entregar soluções robustas e escaláveis é admirável, e vi de perto como ele enfrenta desafios complexos com facilidade. Além do domínio técnico, Henrique é colaborativo e comunicativo. Posso atestar sua confiabilidade, adaptabilidade e compromisso em entregar resultados excepcionais.',
      },
      {
        name: 'Mariana Revilla Lérida',
        role: 'Full-stack Developer | .NET MVC | React | Remote work enthusiast',
        context: 'Colega de Henrique desde 18 de out. de 2023',
        quote:
          'Henrique Hefler é um engenheiro DevOps brilhante que resolve qualquer problema com facilidade e eficiência. Tive o prazer de trabalhar com ele por sete meses na Good Software Dev, onde era responsável por automatizar pipelines de deploy de containers Docker. Demonstrou grande expertise em servidores e máquinas virtuais, sempre atualizado com as melhores práticas. Melhorou performance, confiabilidade e segurança das aplicações com CI/CD, monitoramento e testes. Recomendo fortemente Henrique para qualquer papel DevOps que exija criatividade, inovação e excelência.',
      },
      {
        name: 'Saadat Ali',
        role: 'Back-End Developer @GoodSoftwareDev | TypeScript, Nest.js, Next.js | PostgreSQL, MongoDB, Ruby on Rails, Mocha, Redis, RabbitMQ, AWS',
        context: 'Colega de Henrique desde 14 de out. de 2023',
        quote:
          'Trabalhar com o Hefler no último ano foi uma das melhores experiências da minha carreira, e recomendo-o para qualquer vaga de Backend e especialmente DevOps. Sua natureza calma nutre uma atitude positiva no time, e sua vontade de entregar o melhor produto o torna extremamente confiável. Fiquei impressionado: várias vezes pedi para implantar tecnologias novas, nas quais ele não tinha experiência, e ele passou dias e noites entregando tudo com perfeição dentro do prazo.',
      },
      {
        name: 'Jeferson Domingues',
        role: 'Supervisor de produção',
        context: 'Gestão de Henrique em 20 de fev. de 2020',
        quote:
          'Colaborador com vasto conhecimento em informática, boas relações em equipe e focado em suas demandas.',
      },
    ],
  },
  contact: {
    label: '05 — contato',
    title: 'Fale comigo',
    lead: 'Estou sempre aberto a novas oportunidades, colaborações e projetos interessantes. Entre em contato por qualquer canal abaixo.',
    email: 'email',
    whatsapp: 'whatsapp',
    linkedin: 'linkedin',
    github: 'github',
    cta: 'enviar email →',
  },
}
