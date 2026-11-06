// Case-study data for every project in ~/App. Facts are taken from each
// project's README, package.json, Cargo.toml and source; `year` is the year
// of the latest git commit in that folder. Keep this file free of invented
// metrics: `numbers` only holds values a README or the code states.

export const projects = [
  {
    id: 'sql-rush',
    name: 'SQL Rush',
    category: 'Competitive SQL game',
    tagline: 'Timed SQL challenges with combos, XP and live leaderboards, all scored inside Postgres.',
    status: 'live',
    overview:
      'SQL Rush is a browser game where players answer SQL questions against the clock across four difficulties and five question types, building combos, earning XP and climbing live leaderboards. It is for anyone practising SQL who wants the pressure of a game rather than a worksheet, with Classic, Endless, Practice and Daily Challenge modes and an admin panel for managing the question bank.',
    problem:
      "I wanted a SQL practice tool with real stakes: timers, streaks and a public leaderboard that cannot be faked, which meant the game logic could not live in the browser.",
    solution:
      'The whole game engine is a set of SECURITY DEFINER Postgres functions (start_game, next_question, submit_answer, end_game) behind Supabase RPC, so clients never see an answer before answering and never write a score. Next.js 15 with TypeScript renders the UI, Supabase Realtime pushes leaderboard updates, and a PGlite test suite applies the migrations in-process and checks that the SQL and TypeScript sides agree.',
    stack: ['Next.js 15', 'TypeScript', 'Tailwind CSS 4', 'shadcn/ui', 'Framer Motion', 'Supabase', 'PostgreSQL', 'PGlite'],
    features: [
      'Four modes: Classic (15 questions, 3 lives), Endless, untimed Practice and a Daily Challenge that is identical for everyone per UTC day',
      'Five question types: write SQL, multiple choice, fix the query, predict the output and a drag-and-drop query builder',
      'Combos (x2, x3, x5), a time bonus, six XP levels and threshold-based achievements that admins can add without code changes',
      'Live leaderboards (global, today, this week, high scores, daily) over Supabase Realtime',
      'Google and magic-link sign-in with PKCE, plus a dashboard with accuracy by difficulty and question type',
      'Admin panel: question CRUD, bulk upload from Excel or JSON with per-row validation, user and score management',
    ],
    architecture:
      'Next.js App Router pages live in app/(site), app/play and app/admin, with Server Actions in app/admin/actions.ts and route protection in middleware.ts. Typed data access sits in services/ over supabase-js, hooks/useGameSession drives the server-driven game loop, and lib/validation.ts and lib/scoring.ts mirror the SQL in supabase/migrations/20260925000000_init.sql. The seed bank is data/questions/{easy,medium,hard,expert}.json, regenerated into a migration by a script.',
    challenges: [
      'Keeping normalize_sql in Postgres and normalizeSql in lib/validation.ts identical; test:db compares them on about 30,000 inputs',
      'Server-clock timing that forgives 1.5 s of latency and a 120 s pause budget per run, so late answers never count',
      'Locking the schema down: RLS on every table, default anon and authenticated grants revoked, internal functions in a private schema',
      'A deterministic daily challenge: ten questions chosen on the first request of each UTC day and stored so every player gets the same set',
    ],
    decisions: [
      'Game logic as SECURITY DEFINER RPCs rather than API routes, so answers and scoring never leave Postgres and the leaderboard is trustworthy',
      'Admin access checked four times (middleware, the /admin layout, every action, RLS) so no single bypass exposes the question bank',
      "Light-only pastel claymorphism with tokens in app/globals.css; shadcn's dark: variants are left inert on purpose",
    ],
    numbers: [
      { value: '400', label: 'seed questions' },
      { value: '~170', label: 'database checks' },
      { value: '5', label: 'question types' },
    ],
    github: 'https://github.com/Akashmhatredev/SQL-RUSH',
    live: 'https://sql-rush.vercel.app',
    year: 2026,
    shotsHint:
      'The in-game question screen with the timer ring, lives and combo meter, then the live leaderboard podium and the dashboard XP bar.',
  },

  {
    id: 'cartoon-clash',
    name: 'Cartoon Clash: Legends of Childhood',
    category: 'Browser fighting game',
    tagline: 'A 2D 1v1 arcade fighter with one deterministic 60 Hz engine shared by browser and server.',
    status: 'source',
    overview:
      'Cartoon Clash is a browser 2D fighting game with eight procedurally drawn cartoon fighters, seven parallax stages, and Arcade, Local Versus, Training and Online modes. Offline play works with no server or account; online rooms run on a Cloudflare Worker, and accounts, Elo rank points and a leaderboard are optional through Supabase. It is a non-commercial fan project.',
    problem:
      'I wanted to build a complete fighting game from the ground up, including the hard part: online play where both players see the same fight and neither client can cheat.',
    solution:
      'One deterministic, allocation-free combat engine in shared/ steps the fight at a fixed 60 Hz from input bitmasks, and the same step() runs in the browser for offline play and client prediction and in a Room Durable Object as the online authority. Vue 3 and Pinia run the menus and HUD, Phaser 3 runs the FightScene, and all fighter art is vector drawn in code and rasterized into atlases at load.',
    stack: ['Vue 3', 'Pinia', 'Phaser 3', 'Vite', 'Cloudflare Workers', 'Durable Objects', 'Supabase', 'Vitest'],
    features: [
      'Eight data-driven fighters with per-move frame data, hitboxes, specials, ultimates and passives',
      'A seeded, resumable 7-bout Arcade ladder, Local Versus with keyboard or gamepads, and a Training mode with a move list',
      'Online private rooms with a 5-character code, best of 3, rematch, a ping indicator and a 20 s reconnect window',
      'Optional Supabase accounts with Elo rank points, match history and a top-100 leaderboard',
      'Seven procedurally painted parallax stages with ambient motion, plus touch controls and key rebinding',
      'A performance mode and a debug overlay showing FPS, ping and tick drift',
    ],
    architecture:
      'shared/ holds engine/engine.js, one data file per fighter in fighters/, a state-machine AI in ai/, the seeded arcade ladder and a versioned protocol.js; it uses no DOM or Node APIs. client/ is the Vue + Vite workspace with screens, Pinia stores, the Phaser FightScene, drivers and the procedural art in src/game/art. server/src/room.js is the Durable Object that runs the engine at 60 Hz and broadcasts a snapshot every 3 ticks, and supabase/schema.sql defines the cc_ tables and cc_record_match().',
    challenges: [
      'Determinism: no Math.random, Date or trig in the simulation, plain-JSON state, and PROTOCOL_VERSION bumped whenever semantics change',
      'Prediction and reconciliation in OnlineDriver.js: inputs kept in a ring buffer by frame and resimulated from each server snapshot',
      'Abuse limits on the Worker: 1 KB messages, 120 messages per second per socket, per-IP room creation limits and 10-minute idle cleanup',
      'Drawing eight recognisable fighters as vector rigs in code with no embedded artwork, animated by a damped spring per joint',
    ],
    decisions: [
      'Clients send only input bitmasks and the Durable Object decides hits, rounds and wins, so no client can declare a result',
      'A driver interface (tick(inputs) -> events) keeps LocalDriver and OnlineDriver interchangeable, leaving room for rollback later',
      'Rank points are written only by the Worker through a SECURITY DEFINER function restricted to service_role',
    ],
    numbers: [
      { value: '8', label: 'fighters' },
      { value: '7', label: 'stages' },
      { value: '60 Hz', label: 'fixed-step engine' },
    ],
    github: 'https://github.com/Akashmhatredev/Cartoon_Clash_Arena',
    live: null,
    year: 2026,
    shotsHint:
      'A mid-fight frame on a parallax stage with both health bars and meters visible, plus the character select screen showing the roster portraits.',
  },

  {
    id: 'pocket-artillery',
    name: 'Pocket Artillery',
    category: 'Turn-based artillery game',
    tagline: 'Turn-based tank duels on destructible terrain, resolved server-side by a Rust module.',
    status: 'live',
    overview:
      'Pocket Artillery is a turn-based tank duel: set an angle and power, read the wind and fire standard, cluster or mini-nuke rounds into procedurally generated terrain that every blast reshapes. It has an offline hot-seat Practice mode, a Solo mode against a robot with three skill levels, and online rooms where two players share a code.',
    problem:
      'I wanted a multiplayer game where the server owns the physics, so nobody can fudge a trajectory, and an AI opponent that plays by exactly the same rules as a human.',
    solution:
      'A single Rust/WASM SpacetimeDB module holds all match state in tables and runs turns, ballistics, terrain destruction, damage and the robot as reducers and scheduled timers. The Next.js 15 client subscribes to those tables over a websocket, renders the battlefield on a canvas and predicts locally; in Practice mode the same canvas engine runs the physics itself.',
    stack: ['Next.js 15', 'React 19', 'Tailwind CSS 4', 'Motion', 'SpacetimeDB', 'Rust', 'WebAssembly', 'Radix UI'],
    features: [
      'Three modes: offline hot-seat Practice, Solo vs Robot (easy, normal, hard) and two-player rooms joined by code',
      'Destructible procedural terrain, wind drift and three weapons: standard (99), cluster (3) and mini-nuke (1)',
      'A robot that is a real Player row and aims by searching candidate shots through the same simulator, with seeded, skill-scaled error',
      'A 30-second turn clock that auto-fires the current aim, and a 60-second reconnect grace window',
      'A battle log and scoreboard narrating every shot, hit and turn handoff',
      'Cargo tests for ballistics and robot rules, node:test unit tests, and tsx integration suites against a local SpacetimeDB',
    ],
    architecture:
      'app/page.jsx is the whole game UI; lib/engine.js is the canvas GameEngine that runs local physics in Practice and applies server state online, and lib/multiplayer/spacetime.js turns table subscriptions into UI events. The module is split into stdb-module/src/lib.rs (tables, reducers, scheduled timers), sim.rs (ballistics, terrain, blast damage) and robot.rs (plan_shot), with generated TypeScript bindings committed in module_bindings/.',
    challenges: [
      'Keeping gravity 0.2 and the 1200 by 800 field identical in lib/engine.js and sim.rs so client prediction matches the server',
      'Scheduled reducers (process_impact, process_turn_timeout, process_robot_turn, process_forfeit) guarded by scheduler_only so clients cannot call them',
      'A seed-deterministic robot: aim search plus skill-scaled error, and a weapon policy that never nukes itself and saves the nuke for a finish',
      'Three SpacetimeDB versions (the Rust crate, the npm SDK and the CLI) must stay on the same release, currently 2.6.1',
    ],
    decisions: [
      'SpacetimeDB over the earlier PartyKit plus Supabase backend, so one WASM module is both the realtime server and the database',
      'sim.rs and robot.rs import nothing from spacetimedb, so they compile natively and are tested in tests-core without a server',
      'The robot lives on the server as a Player row rather than in the UI, so turn order, ammo and damage apply to it identically',
    ],
    numbers: [
      { value: '100', label: 'HP per tank' },
      { value: '30 s', label: 'turn clock' },
      { value: '3', label: 'robot skill levels' },
    ],
    github: 'https://github.com/Akashmhatredev/pocket-artillery',
    live: 'https://pocket-artillery-sooty.vercel.app',
    year: 2026,
    shotsHint:
      'The battlefield mid-shot with cratered terrain, the angle and power sliders, the wind indicator and the battle log, ideally in a Solo match with the AI badge visible.',
  },

  {
    id: 'python-platform',
    name: 'Python Learning Platform',
    category: 'Interactive Python course',
    tagline: 'A 134-lesson Python course that runs real CPython 3.14 in the browser via Pyodide.',
    status: 'live',
    overview:
      'An interactive Python course where the code really runs: 134 lessons across 27 levels, from first programs to asyncio, CPython internals and interview drills, each with a live playground, visualizers, quizzes, test-graded exercises and interview questions. It needs no account or backend; progress stays in the browser.',
    problem:
      'I wanted a Python course where nothing is simulated: output, tracebacks, variables and test verdicts should all come from a real interpreter, in the browser, with no server to run code.',
    solution:
      'Pyodide (CPython 3.14 compiled to WebAssembly) loads once in a Web Worker and every playground, exercise check and code tracer on the page shares it. A Python harness writes the project to an in-memory filesystem, runs main.py, streams output and reports globals, and the same engine runs under Node in CI to prove that every lesson runs and every exercise behaves.',
    stack: ['Vue 3', 'Vite 8', 'Pinia', 'Vue Router', 'Pyodide', 'CodeMirror 6', 'Vitest', 'Playwright'],
    features: [
      '134 lessons in 27 levels and 9 guided projects, each following Learn, Experiment, Visualize, Understand, Practice, Interview, Review',
      'Live input() support and a Stop button, with runaway code interrupted after 10 s (20 s for tests)',
      '10 visualizers, including a real-execution code tracer built on sys.settrace, hash tables, MRO lookup, GC and the asyncio loop',
      'Interview mode with practice and timed mock sessions, a review screen and a weak-area revision queue',
      'Progress, streaks, bookmarks and export/import stored under plp:* in localStorage',
      'Light and dark themes, with WCAG 2.1 AA checked by axe in Playwright',
    ],
    architecture:
      'Lessons are pure-data modules in src/content/lessons/<level>/<lesson>.js with src/content/curriculum.js as the source of truth, and plugins/content-index.js builds virtual modules for the index, search and question bank. The Python runtime lives in src/services/python (worker.js, client.js, harness.py, engine.js), and plugins/pyodide-assets.js serves Pyodide from node_modules with no CDN. tests/unit/python-runner.js drives the identical engine from a Node worker thread for content validation.',
    challenges: [
      'Cross-origin isolation (COOP and COEP headers in vite.config.js and vercel.json) to get SharedArrayBuffer for live input() and interrupts',
      'Fidelity fixes: time.sleep() made to block like CPython, and asyncio.run() using WebAssembly stack switching (JSPI) where available',
      'Infinite recursion through C code exhausts the WASM stack, so the runtime is replaced and the learner is told why',
      'Content validation that compiles every Python block, runs every playground and checks that starters fail and solutions pass',
    ],
    decisions: [
      'Serve Pyodide from the app itself rather than a CDN, so it works offline once loaded and the version is pinned (314.0.7)',
      'One shared runtime per page with a queued client, instead of one interpreter per playground, to keep memory and load time sane',
      'Tests are written in Python with pytest-style helpers (output, run_program, raises, approx) so exercise checks read like real tests',
    ],
    numbers: [
      { value: '134', label: 'lessons in 27 levels' },
      { value: '884', label: 'interview questions' },
      { value: '259', label: 'graded exercises' },
    ],
    github: 'https://github.com/Akashmhatredev/PythonLearningPlatform',
    live: 'https://python-learning-platform-nine.vercel.app',
    year: 2026,
    shotsHint:
      'A lesson playground with the editor, console output and the Variables panel, and the code tracer visualizer stepping through frames.',
  },

  {
    id: 'vue-zero',
    name: 'Vue/Zero',
    category: 'Interactive Vue.js course',
    tagline: 'A Vue.js course built with Vue 3, with a sandbox that compiles real SFCs in the browser.',
    status: 'live',
    overview:
      'Vue/Zero is an interactive Vue.js course built with Vue 3 itself: 134 lessons across 20 levels, from web fundamentals to SSR and system-design interviews, each with a live sandbox, animated visualizers, quizzes, test-graded exercises and interview practice. There is no account or backend; progress lives in localStorage.',
    problem:
      "I wanted learners to write real Single-File Components and see them run, with their reactive state inspected live, without a server compiling anything or learner code touching the app's own page.",
    solution:
      'SFCs are compiled in a Web Worker with @vue/compiler-sfc, their imports rewritten into a small module registry with loop guards, and the result runs in a sandboxed iframe with an opaque origin that talks back over postMessage. The same core.js runs under Vitest, so the suite proves every exercise solution passes and every starter fails.',
    stack: ['Vue 3', 'Vite 8', 'Pinia', 'Vue Router', 'CodeMirror 6', 'GSAP', 'Vitest', 'Playwright'],
    features: [
      '134 lessons (125 lessons and 9 projects) in 20 levels, with completion tied to running the example, passing the quiz and passing tests',
      'A sandbox supporting script setup, Options API, scoped CSS, CSS modules, lazy import() routes and a live reactive-state inspector',
      '15 visualizers driven by real Vue, Vue Router and Pinia instances or a labelled teaching engine (miniReactivity.js, vdomDiff.js)',
      'Interview mode with practice and timed mock sessions; answers are auto-graded, test-graded or self-assessed, always labelled',
      'A search index and question bank that load lazily on first use',
      'Skip link, native dialogs, aria-live feedback, reduced-motion support and a dark blackboard theme, checked by axe',
    ],
    architecture:
      'Content is one pure-data module per lesson under src/content/lessons with curriculum.js as the map, indexed by plugins/content-index.js. The sandbox lives in src/services/sandbox (compile.js, compiler.worker.js, core.js, runtime.js, srcdoc.js), and plugins/sandbox-libs.js serves the vue, pinia and vue-router browser builds. Four Pinia stores (progress, interview, preferences, ui) talk to a storage adapter so a backend could replace localStorage later.',
    challenges: [
      'Isolating learner code with an iframe sandbox that omits allow-same-origin, so it gets an opaque origin and no access to the app DOM or storage',
      "Rewriting each module's ES imports and exports through Babel's AST into a registry format that still supports lazy import()",
      'Loop guards injected into every loop that throw after 1.5 s instead of freezing the tab',
      "No CSP header by design: srcdoc iframes inherit the parent's CSP and the sandbox needs inline scripts and new Function",
    ],
    decisions: [
      'Compile in a Worker and run in an iframe rather than eval in the page, so a broken lesson can never take the app down',
      'Share core.js between the iframe and Vitest so content validation uses the exact runtime learners get',
      'Tie lesson completion to real activity and never count self-assessed answers as correct',
    ],
    numbers: [
      { value: '134', label: 'lessons in 20 levels' },
      { value: '905', label: 'interview questions' },
      { value: '15', label: 'visualizers' },
    ],
    github: 'https://github.com/Akashmhatredev/VueJSLearningPlatform',
    live: 'https://vue-js-learning-platform.vercel.app',
    year: 2026,
    shotsHint:
      'The playground with a counter component, live preview and the reactive-state inspector, plus the reactivity visualizer on its dependency-tracking step, in the dark blackboard theme.',
  },

  {
    id: 'portfolio-v2',
    name: 'Portfolio V2',
    category: 'Interactive 3D portfolio',
    tagline: 'A studio-dark portfolio with five Three.js scenes and a scroll-driven 3D character.',
    status: 'live',
    overview:
      'My live portfolio: a near-black single page with poster-scale type, flat hairline-ruled panels and five custom WebGL scenes (hero, about, data, projects, contact), plus a procedural 3D developer character that walks the whole page on a fixed canvas behind the copy. It is built for recruiters and collaborators to read my experience and projects.',
    problem:
      'I wanted a portfolio that felt like a design-studio site with real WebGL work, while staying fast, accessible and usable with reduced motion.',
    solution:
      'Vue 3 with Vite 5 and Tailwind 3, raw three.js 0.170 wrapped in one lifecycle composable (useThreeScene) so each scene is a factory with init, update, resize and dispose, and GSAP, ScrollTrigger and Lenis for scroll and reveals. The journey maps scroll to a station coordinate anchored to the real section elements, so camera, gait and prop pickups are a pure function of scroll.',
    stack: ['Vue 3', 'Vite 5', 'Tailwind CSS 3', 'Three.js', 'GSAP', 'Lenis', 'Vercel'],
    features: [
      'Five raw Three.js scenes: hold-to-blast particles, a neural network, a medallion lakehouse, a project galaxy and constellations',
      'A scroll-driven procedural character with 23 collectible props that attach to named sockets on the rig',
      'A draggable CSS-3D architecture explorer and case-study modals for featured projects',
      'Lenis smooth scroll on the GSAP ticker, a v-reveal directive, animated counters and magnetic buttons',
      'Reduced motion renders each scene as a single static frame and disables the journey entirely',
      'SEO: Open Graph and Twitter tags, JSON-LD Person, sitemap.xml and robots.txt',
    ],
    architecture:
      'All copy lives in src/data/content.js and src/App.vue sets the section order, with one component per section in src/sections. Scenes are in src/three (Blast, Neural, Lakehouse, Galaxy, Contact) and the journey in src/three/JourneyScene.js and src/three/journey, where stages.js is the score with one entry per station. vite.config.js splits three, gsap and lenis into their own chunks.',
    challenges: [
      'A fixed GPU budget for the journey: cached geometry and materials, instanced repeats and only four environments resident at once',
      'Anchoring the journey to real section elements instead of page-height fractions, so copy edits cannot drift the 3D beats',
      'Pausing off-screen and hidden-tab scenes with IntersectionObserver and visibilitychange, with full GPU disposal on unmount',
      'Reduced motion opts the journey out entirely, since a frozen character while scrolling would read as broken rather than reduced',
    ],
    decisions: [
      'Raw Three.js in one composable instead of TresJS, for direct control of DPR capping, off-screen pausing and disposal',
      'A procedurally authored rig rather than a GLB, so sockets match the anatomy and nothing can fail to load; a GLB path is opt-in',
      'Everything derived from one scroll coordinate (stageT) with chained damping, so the journey reverses exactly when scrolling back up',
    ],
    numbers: [
      { value: '5', label: 'custom WebGL scenes' },
      { value: '23', label: 'journey props' },
      { value: '103 to 437', label: 'draw calls measured across the page' },
    ],
    github: 'https://github.com/Akashmhatredev/Portfolio_V2',
    live: 'https://portfolio-v2-indol-kappa.vercel.app',
    year: 2026,
    shotsHint:
      'The hero with the hold-to-blast particle field mid-charge, and a mid-page section where the 3D character is visible beside the copy.',
  },

  {
    id: 'github-profile',
    name: 'GitHub Profile README',
    category: 'Generated profile artwork',
    tagline: 'A hand-drawn GitHub profile whose SVGs are generated by code in light and dark versions.',
    status: 'live',
    overview:
      'My github.com/Akashmhatredev profile page, where every graphic (header, section titles, tabs, toolbox, project cards, achievements, buttons) is a sketch-style SVG drawn by Node scripts rather than an image editor. Live cards for stats, languages and the contribution calendar are redrawn twice a day by GitHub Actions.',
    problem:
      "I wanted a profile README that looked hand-drawn and matched the viewer's GitHub theme, without maintaining two sets of artwork by hand.",
    solution:
      'scripts/profile.mjs is the only content file; scripts/build.mjs renders each part through roughjs for sketchy strokes and converts handwritten fonts to SVG paths with opentype.js, once per theme. README.md links each pair with <picture> and prefers-color-scheme, and a workflow fetches GitHub REST and GraphQL data to draw the live cards onto an output branch.',
    stack: ['Node.js', 'roughjs', 'opentype.js', 'SVG', 'GitHub Actions', 'GitHub GraphQL API'],
    features: [
      'Light (cream paper, graphite ink) and dark (charcoal paper, white pencil) versions of every asset from one render',
      'Handwritten type (Caveat, Architects Daughter) converted to paths so it renders identically with no webfonts',
      'Project cards, the toolbox and achievements all driven by data in profile.mjs',
      'Live stats, languages and contribution-calendar cards drawn from GitHub data, plus a Platane/snk contribution snake',
      'A workflow that runs every 12 hours, on push to main and on dispatch, and publishes dist/ to the output branch',
    ],
    architecture:
      'scripts/profile.mjs holds the sections, links, stack, projects and achievements. scripts/build.mjs has a static target that writes assets/{light,dark}/*.svg for committing and a stats target that writes dist/ in CI; scripts/art/*.mjs holds one renderer per part and scripts/lib/sketch.mjs is the roughjs sketch engine with the THEMES table. scripts/lib/github.mjs fetches REST and GraphQL data with an optional GITHUB_TOKEN.',
    challenges: [
      'Turning handwritten fonts into plain SVG paths with opentype.js so the images render the same everywhere with no web fonts to load',
      "Pairing every asset with a dark twin and wiring each through <picture> so the README follows the viewer's theme",
      'Ink-reveal clips done in SMIL, attached only through CSS, so they play where CSS animation in clip paths is skipped and reduced-motion viewers just see the text',
    ],
    decisions: [
      'Generate assets in code and commit them, rather than hand-edit SVGs, so a content change is a one-file edit and a rebuild',
      'Publish live cards to a separate output branch loaded from raw.githubusercontent.com, keeping main free of generated churn',
    ],
    numbers: [{ value: '12 h', label: 'live card refresh interval' }],
    github: 'https://github.com/Akashmhatredev/Akashmhatredev',
    live: 'https://github.com/Akashmhatredev',
    year: 2026,
    shotsHint:
      'The top of the profile page with the sketched header and tab row, in both light and dark GitHub themes, plus the live stats and contribution cards.',
  },

  {
    id: 'travel-blog',
    name: 'Travel Blog',
    category: 'Travel photography site',
    tagline: 'A city-by-city photo site with a fixed panel that crossfades as you hover each city.',
    status: 'in progress',
    overview:
      'A travel photography site organised city by city: the index shows a fixed photo panel on the left that crossfades as you hover or tab through cities on the right, and each city has a static page with facts and a gallery of framed prints. Content is placeholder for now, with picsum.photos images and several nav links still pointing to #.',
    problem:
      'I wanted a clean place to publish travel photos city by city, modelled on the Hanssen template, before the real photos were ready.',
    solution:
      'Next.js 16 App Router with React 19 in plain JavaScript and plain CSS. City pages are generated statically with generateStaticParams and dynamicParams = false, an ActiveCity context links the hover list to the photo panel, and an inline pre-paint script applies the saved or OS theme before first render.',
    stack: ['Next.js 16', 'React 19', 'JavaScript', 'CSS', 'next/font', 'next/image'],
    features: [
      'An index at /travel with a hover- and focus-driven crossfading photo panel',
      'Fully static city pages at /travel/[slug] with generated metadata',
      'Light and dark themes that follow the OS until the switch is flipped, stored in localStorage',
      'A mobile menu, reduced-motion styles and images that fade in once decoded',
      'All content in lib/cities.js (10 cities) and lib/site.js',
    ],
    architecture:
      'app/layout.js sets the Readex Pro font, the theme script and the header; app/travel/page.js and app/travel/[slug]/page.js are the two routes, and / redirects to /travel. components/travel holds the ActiveCity context, TravelHero and CityList, and app/globals.css holds every style, with tokens such as --radius and --notch at the top.',
    challenges: [
      'Avoiding a theme flash by running an inline script before paint that reads localStorage and prefers-color-scheme',
      'Crossfading next/image photos smoothly with FadeImage, which waits for decode instead of painting top to bottom',
      'Keeping placeholder photos working through remotePatterns in next.config.mjs until real images land in public/images',
    ],
    decisions: [
      'Plain JavaScript and plain CSS with no UI library, so the site stays small and the template look is easy to adjust',
      'Static generation for every city page, since the content is a data file and does not need a server',
    ],
    numbers: [{ value: '10', label: 'cities' }],
    github: 'https://github.com/Akashmhatredev/travel_blog',
    live: null,
    year: 2026,
    shotsHint:
      'The /travel index with the photo panel mid-crossfade while a city is hovered, and one city page gallery, in both light and dark.',
  },

  {
    id: 'portfolio-v3',
    name: 'Portfolio V3',
    category: 'Portfolio template',
    tagline: 'A one-page portfolio template on a green cutting mat with draggable stickers.',
    status: 'in progress',
    overview:
      'A one-page developer portfolio template with a green cutting-mat background, draggable hero stickers and sections for filterable Work, Open Source, About, Sponsor tiers and Contact. The content is still placeholder (Your Name, hello@example.com), so it is a template rather than a finished site.',
    problem:
      'I wanted a lighter, TypeScript-first portfolio layout that could be filled from a single content file, as a candidate replacement for Portfolio V2.',
    solution:
      'Next.js 16 App Router with React 19 and strict TypeScript, no Tailwind and no animation libraries: about 800 lines of plain CSS with tokens like --paper, --ink, --mat and --sun. lib/content.ts types and holds every project, repo, tier and link, and projects without a screenshot get a hue-tinted mock drawn in their place.',
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'CSS', 'next/font'],
    features: [
      'Hero stickers you can drag with pointer events, with separate wide and narrow layout positions',
      'A Work section with type filters (apps, libraries, templates, client) and an expandable active project',
      'Open Source repos, About, Sponsor tiers and a copy-email contact button',
      "Screenshots from public/images, or a generated mock tinted with the project's hue when none exists",
      'Fonts via next/font/google (Mona Sans, Geist, Geist Mono, Kalam) exposed as --nf-* variables',
    ],
    architecture:
      'app/page.tsx orders Header, Hero, Work, OpenSource, About, Sponsor, Contact and Footer, and app/layout.tsx loads the fonts and metadata. lib/content.ts exports the typed content (Project, Repo, Tier), and components/*.tsx are mostly server components, with Work, Sticker, CopyEmailButton and Header as client components. app/globals.css holds all styles.',
    challenges: [
      'Sticker dragging with pointer events that drops dragged positions when the layout crosses the wide/narrow breakpoint',
      'Drawing a believable website mock per project from a hue alone, so the grid looks complete before real screenshots exist',
    ],
    decisions: [
      'Plain CSS over Tailwind to keep the template dependency-free and easy to retheme from the tokens at the top of globals.css',
      'A single typed lib/content.ts so filling in the real portfolio is a data edit, not a component edit',
    ],
    numbers: [],
    github: 'https://github.com/Akashmhatredev/Portfolio_V3',
    live: null,
    year: 2026,
    shotsHint:
      'The hero with the cutting-mat grid and stickers, then the Work grid with a filter active, noting the placeholder name and mock screenshots.',
  },
]
