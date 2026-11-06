// All copy for the site lives here. Facts come from the resume
// (Akash_Mhatre_Resume.docx) and the projects in ~/App; nothing is invented.

export const profile = {
  name: 'Akash Mhatre',
  fullName: 'Akash Sudhir Mhatre',
  title: 'Senior Full Stack Developer',
  subtitle: 'Vue.js Developer',
  location: 'Pune, India',
  email: 'mhatreakash2308@gmail.com',
  linkedin: 'https://www.linkedin.com/in/akash-sudhir-mhatre/',
  github: 'https://github.com/Akashmhatredev',
  resume: '/Akash-Mhatre-Resume.pdf',
  status: 'Open to senior full-stack roles',
  years: '4+',
}

export const hero = {
  kicker: 'Inside the mind of',
  name: ['Akash', 'Mhatre'],
  spread: ['Full Stack', 'Developer'],
  line: 'Building digital experiences that solve real problems.',
  tags: ['Vue.js', 'Python', 'SaaS', 'Engineering'],
  scroll: 'Scroll to explore my world',
}

export const hello = {
  big: "Hi, I'm Akash.",
  lines: [
    "I'm a Full Stack Developer who enjoys turning complex problems into scalable applications and intuitive experiences.",
    'I work across frontend, backend, databases, APIs and cloud infrastructure.',
    'From interactive dashboards to enterprise SaaS platforms, I enjoy building products that make a difference.',
  ],
}

export const mind = {
  small: 'My engineering mind',
  big: 'From pixels to production.',
  lines: [
    'An idea becomes an interface.',
    'An interface becomes an application.',
    'An application becomes a system.',
  ],
  pipeline: [
    { id: 'idea', label: 'Idea', tech: 'a problem worth solving', glyph: 'spark' },
    { id: 'design', label: 'Design', tech: 'flows · states · tokens', glyph: 'frame' },
    { id: 'frontend', label: 'Frontend', tech: 'Vue 3 · Quasar', glyph: 'vue' },
    { id: 'backend', label: 'Backend', tech: 'Flask · REST APIs', glyph: 'flask' },
    { id: 'database', label: 'Database', tech: 'PostgreSQL', glyph: 'db' },
    { id: 'deploy', label: 'Deployment', tech: 'Docker · AWS · Nginx', glyph: 'cloud' },
  ],
  snippet: [
    { t: 'kw', v: 'const' }, { t: 'id', v: ' system ' }, { t: 'op', v: '= ' }, { t: 'fn', v: 'compose' }, { t: 'op', v: '(' },
    { t: 'nl' },
    { t: 'id', v: '  idea' }, { t: 'op', v: ', ' }, { t: 'id', v: 'design' }, { t: 'op', v: ', ' }, { t: 'id', v: 'frontend' }, { t: 'op', v: ',' },
    { t: 'nl' },
    { t: 'id', v: '  backend' }, { t: 'op', v: ', ' }, { t: 'id', v: 'database' }, { t: 'op', v: ', ' }, { t: 'id', v: 'deploy' },
    { t: 'nl' },
    { t: 'op', v: ')' },
    { t: 'nl' },
    { t: 'kw', v: 'await' }, { t: 'id', v: ' system' }, { t: 'op', v: '.' }, { t: 'fn', v: 'ship' }, { t: 'op', v: '()' }, { t: 'cm', v: '  // 200 OK' },
  ],
}

// Technologies as keycaps. `use` is the one-line "how I use it".
export const stack = [
  {
    group: 'Frontend',
    keys: [
      { k: 'Vue.js 3', use: 'My main frontend. Composition API, Pinia stores and reusable component systems in CRM and SaaS modules, both learning platforms and this site.', w: 2 },
      { k: 'JavaScript', use: 'ES6+ everywhere on the front end and in Node tooling. Plain ES modules, kept strict about structure without TypeScript.', w: 2 },
      { k: 'Quasar', use: 'CRUD-heavy enterprise screens at Incentius: tables, forms and dialogs across the Navigator CRM and Alzain modules.' },
      { k: 'HTML5', use: 'Semantic markup, native dialogs and forms; both course apps pass axe WCAG 2.1 AA checks in CI.' },
      { k: 'CSS3', use: 'Custom properties, grid, clamp()-based fluid type and prefers-reduced-motion fallbacks. No framework needed for most of my sites.' },
      { k: 'Tailwind', use: 'Utility styling in Portfolio V2 (Tailwind 3), SQL Rush and Pocket Artillery (Tailwind 4).' },
      { k: 'GSAP', use: 'Timelines and ScrollTrigger drive this site and the scroll journey in Portfolio V2.' },
      { k: 'Lottie', use: 'Lightweight vector animation for product UI states.' },
      { k: 'Capacitor', use: 'Wrapping Vue apps as mobile builds.' },
    ],
  },
  {
    group: 'Backend',
    keys: [
      { k: 'Python', use: 'Flask services, data transformation and scripting. Also the subject of my Python Learning Platform, which runs CPython 3.14 in the browser.', w: 2 },
      { k: 'Flask', use: 'REST APIs behind the Navigator CRM and the Alzain SaaS platform, including its configurable approval workflow engine.' },
      { k: 'Node.js', use: 'Build tooling, the GitHub profile art generator, Next.js apps and test runners.' },
      { k: 'Django', use: 'Earlier full-stack work: relational modelling and admin-heavy applications.' },
      { k: 'REST APIs', use: 'Resource design, auth and response shaping. Optimising API handling cut CRM dashboard loads by 30–50%.' },
      { k: 'WebSockets', use: 'Realtime rooms in Cartoon Clash (Cloudflare Durable Objects) and live table subscriptions in Pocket Artillery (SpacetimeDB).' },
    ],
  },
  {
    group: 'Databases',
    keys: [
      { k: 'PostgreSQL', use: 'System of record for the CRM and SaaS platforms. In SQL Rush the whole game engine lives in SECURITY DEFINER functions behind RLS.', w: 2 },
      { k: 'MySQL', use: 'Relational schemas for earlier applications.' },
      { k: 'MongoDB', use: 'Document storage for the Fanztar creator platform.' },
      { k: 'Redis', use: 'Caching and job queues behind dashboards and workflow automation.' },
      { k: 'Supabase', use: 'Auth, Postgres, Realtime and RLS for SQL Rush leaderboards and Cartoon Clash accounts.' },
    ],
  },
  {
    group: 'Cloud & DevOps',
    keys: [
      { k: 'AWS EC2', use: 'Hosting Flask and Node services, with S3 for assets.' },
      { k: 'Docker', use: 'Reproducible environments for services and the SpacetimeDB module build.' },
      { k: 'CI/CD', use: 'GitHub Actions regenerate my profile cards every 12 hours; Vercel builds every front end from main.' },
      { k: 'Linux', use: 'Ubuntu servers: packages, logs, systemd and uptime.' },
      { k: 'PM2', use: 'Process management for Node and Flask services in production.' },
      { k: 'Nginx', use: 'Reverse proxy, TLS termination and static caching in front of app servers.' },
      { k: 'Cloudflare', use: 'Workers and Durable Objects run the authoritative online rooms for Cartoon Clash.' },
    ],
  },
  {
    group: 'Data Engineering',
    keys: [
      { k: 'Databricks', use: 'Bronze → Silver → Gold lakehouse pipelines for healthcare and AI-alert datasets of 10M+ records.', w: 2 },
      { k: 'Medallion ETL', use: 'Raw ingest, conformed and de-duplicated Silver, business-ready Gold models. Processing latency down 60–80%.' },
      { k: 'PySpark', use: 'Spark SQL jobs with automated validation that cut manual data prep by about 70%.' },
      { k: 'SQL', use: 'Query optimisation, window functions and RPCs. I wrote and validated a 400-question SQL bank against real Postgres.' },
      { k: 'Data modeling', use: 'Dimensional models, SCD handling and MDM for enterprise reporting.' },
    ],
  },
]

export const experience = {
  big: '4+ years.',
  tag: 'Still shipping. Still learning.',
  role: 'Full-Stack Developer',
  company: 'Incentius',
  period: 'May 2022 – Present',
  focus: ['Enterprise B2B SaaS', 'Interactive dashboards', 'Business workflows', 'API development', 'Data engineering', 'Scalable architecture'],
  engagements: [
    {
      id: 'navigator',
      name: 'Navigator CRM Dashboard',
      team: 'Team of 7 developers',
      hash: 'a3f91c',
      stack: ['Vue 3', 'Quasar', 'Flask', 'PostgreSQL', 'ECharts'],
      points: [
        'Cut dashboard and report load times by 30–50% by optimizing SQL queries and API response handling across CRM modules serving 50–60 active business users.',
        'Reduced new-feature development effort by 25–35% by architecting reusable Vue.js component systems used across CRUD-heavy transactional modules managing 1M+ records.',
        'Sustained 99.9% uptime in production while building ECharts-based real-time analytics dashboards, collaborating directly with 10–15 client stakeholders.',
      ],
    },
    {
      id: 'alzain',
      name: 'Alzain SaaS Platform',
      team: 'Team of 5 developers',
      hash: '7b2e40',
      stack: ['Vue 3', 'Flask', 'PostgreSQL', 'Redis', 'AWS'],
      points: [
        'Cut approval turnaround time by 50–70% by designing a configurable workflow engine with digitized approval chains, used by 40–60 operational users across Finance, Inventory, Production and Management.',
        'Reduced manual accounting and reconciliation effort by 40–60% by building automation and integration processes across financial datasets of 500K–2M records.',
        'Delivered finance, stock transfer, production and inventory modules supporting daily operations at 99.9% uptime.',
      ],
    },
    {
      id: 'lakehouse',
      name: 'Databricks Lakehouse',
      team: 'Team of 2–3 engineers · client team of 15–20',
      hash: 'c04d7e',
      stack: ['Databricks', 'PySpark', 'Spark SQL', 'Azure ADLS'],
      points: [
        'Cut data processing and reporting latency by 60–80% by architecting Bronze-Silver-Gold ETL pipelines in Databricks for healthcare and AI-alert datasets containing 10M+ records.',
        'Reduced manual data prep effort by ~70% by automating transformation and validation workflows, implementing SCD-based dimensional modeling for enterprise reporting.',
        'Enabled near real-time analytics for 30–50 business and analytics users.',
      ],
    },
    {
      id: 'fanztar',
      name: 'Fanztar · Web3 creator platform',
      team: 'Team of 3–4 developers',
      hash: 'e81a55',
      stack: ['Vue.js', 'Node.js', 'MongoDB'],
      points: [
        'Supported 5,000–15,000 registered users by building NFT purchase flows, creator management tools and reward/token inventory systems.',
        'Improved platform responsiveness through frontend and backend optimizations across hundreds of thousands of transaction records.',
        'Contributed to production deployment, scheduler automation and payment/reward distribution systems.',
      ],
    },
  ],
  education: [
    { degree: 'MSc Computer Science', school: 'Pune University', years: '2021–2023', grade: 'CGPA 9.18' },
    { degree: 'BSc Computer Science', school: 'Pune University', years: '2018–2021', grade: 'CGPA 8.8' },
  ],
}

export const work = {
  small: 'Selected',
  big: 'Work',
  intro: 'Things I have built on my own time: games, learning platforms and tools. Each one is real code you can read, and most of them you can play with.',
  more: 'More on GitHub',
}

export const build = {
  big: 'How I build.',
  steps: [
    { id: 'understand', label: 'Understand', body: 'Business requirements first. Who uses it, what has to be true at the end of the day, and which numbers matter.' },
    { id: 'architect', label: 'Architect', body: 'Database design and API architecture before UI. Schemas, ownership, failure modes and the boundaries between services.' },
    { id: 'develop', label: 'Develop', body: 'Frontend implementation in Vue with reusable components, backed by typed REST contracts and small, reviewable commits.' },
    { id: 'integrate', label: 'Integrate', body: 'Wire the real systems: auth, payments, third-party data, realtime channels. The seams are where products break.' },
    { id: 'test', label: 'Test', body: 'Deterministic engine tests, database suites on PGlite, Playwright and axe runs. If it cannot be replayed, it cannot be trusted.' },
    { id: 'deploy', label: 'Deploy', body: 'Docker, Nginx, PM2 and CI/CD on AWS, or Vercel plus a Worker. Zero-downtime releases and rollback paths.' },
    { id: 'optimize', label: 'Optimize', body: 'Measure, then cut: query plans, API payloads, bundle splits and frame budgets. Load times down 30–50% is a habit, not a project.' },
  ],
}

export const about = {
  big: 'Based in Pune.',
  lines: [
    'I’m a developer who enjoys understanding how things work.',
    'I like building applications from the ground up, exploring new technologies, solving complex problems and continuously improving the way I write software.',
    'Whether it’s a business dashboard, a SaaS platform, a learning application or an interactive game, I enjoy bringing ideas to life.',
  ],
  serif: 'I care about the details that make a product feel like itself.',
  detail: 'The edge cases, the empty states, the query that runs ten thousand times a day. I like getting into the weeds, because that is where products are actually won.',
}

export const contact = {
  small: 'Contact',
  big: 'Let’s build something.',
  line: 'If you are building something that deserves to be done properly, let’s talk.',
  copied: 'Copied',
  copy: 'Copy email',
}

export const ending = {
  lines: ['Every idea starts somewhere.', 'Let’s build something extraordinary.', 'Thanks for exploring my world.'],
  exit: 'exit 0',
}

export const chapters = [
  { id: 'hello', label: 'Hello' },
  { id: 'mind', label: 'Mind' },
  { id: 'stack', label: 'Stack' },
  { id: 'years', label: 'Years' },
  { id: 'work', label: 'Work' },
  { id: 'build', label: 'Build' },
  { id: 'about', label: 'Pune' },
  { id: 'contact', label: 'Contact' },
]

export const nav = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]
