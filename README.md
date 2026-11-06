# Inside the Mind of Akash Mhatre

An immersive, scroll-driven developer portfolio for Akash Mhatre (Senior Full Stack
Developer, Vue.js Developer, Pune). The page is one pinned stage: scrolling drives a
single GSAP timeline through eleven chapters, each with its own ground colour, kinetic
type and interaction, in the storytelling style of nesilnoble.com but with original
art, copy and a developer-themed world.

**Stack:** Vue 3 (`<script setup>`, JavaScript), Vite 8, GSAP 3 + ScrollTrigger +
ScrollToPlugin, plain CSS with custom properties, self-hosted fonts via `@fontsource`
(Bricolage Grotesque, Instrument Serif, JetBrains Mono). No router, no three.js.

## Run it

Requires Node 20.19 or newer (`.nvmrc` pins 24; the shell default here is Node 16).

```bash
export PATH=$HOME/.nvm/versions/node/v24.18.0/bin:$PATH   # or: nvm use
npm install
npm run dev       # http://localhost:5180
npm run build     # production build in dist/
npm run preview   # serve dist/ on http://localhost:5181
```

Deploys to Vercel as a static Vite site (`vercel.json` sets security headers and
immutable caching for `/shots` and `/assets`).

## The journey

| Chapter | What happens |
| --- | --- |
| Hero | "Inside the mind of / Akash Mhatre" with a DevTools-style inspector box, an original developer character (eyes follow the cursor, hover lifts the lid of his head), and a scroll that opens the head and dives into it. |
| Tunnel | Concentric rings and drifting code thoughts. |
| Hello | "Hi, I'm Akash." in kinetic type with a lime squiggle and the three intro lines. |
| Mind | "From pixels to production.": Idea → Design → Frontend → Backend → Database → Deployment with a travelling packet and a typed code snippet. |
| Stack | A mechanical keyboard; hover or tap a keycap and the OLED readout says how Akash uses that technology. |
| Years | "4+ years." then a git log of the four Incentius engagements, one commit at a time, with the resume bullets. |
| Work | "Selected work" horizontal gallery of the nine ~/App projects; click a cover for the case study (overview, problem, solution, stack, features, architecture, challenges, decisions, numbers, links). |
| Build | "How I build." as a CI pipeline run: Understand → Architect → Develop → Integrate → Test → Deploy → Optimize. |
| Pune | "Based in Pune." with hills, a sun and a bike, then the "I care about the details" statement and credentials. |
| Contact | Email with copy button, LinkedIn, GitHub, resume download, floating dev stickers that follow the cursor. |
| End | "Every idea starts somewhere." → "Let's build something extraordinary." → "Thanks for exploring my world." → `$ exit 0`. |

Chrome: a chapter ruler along the bottom (click a label to jump), a top bar with a
synthesised ambient sound toggle (Web Audio, no audio file) and WORK / ABOUT / CONTACT
links, a custom cursor on fine pointers, drifting dust on a canvas and a light grain.
`prefers-reduced-motion` unpins the stage and stacks every chapter as a static section.

## Where things live

- `src/data/profile.js`: all copy (hero, intro, stack keycaps with "how I use it" lines, experience from the resume, build steps, about, contact, ending, chapter and nav lists).
- `src/data/projects.js`: the nine case studies, derived from each project's README and code. No invented numbers.
- `src/data/shots.js`: generated from `public/shots/manifest.json`; maps project ids to screenshots.
- `src/App.vue`: builds the master timeline from each scene's `build()`, owns the ScrollTrigger, ruler, nav jumps and reduced-motion mode.
- `src/scenes/*Scene.vue`: one component per chapter. Each exposes `build()` returning a GSAP timeline; `src/lib/gsap.js` has the `chapter`, `exit`, `hide`, `lettersIn` and `lettersOut` helpers.
- `src/components/`: `DevCharacter.vue` (SVG character), `CaseStudy.vue` (project sheet), `TopBar.vue`, `Ruler.vue`, `CursorTag.vue`, `MobileNotice.vue`.
- `src/composables/`: `useDust`, `useSound`, `usePointer`.
- `src/styles/tokens.css`: chapter grounds, type scale, fonts.
- `public/shots/`: project screenshots (WebP). `public/Akash-Mhatre-Resume.pdf`: the resume without the phone number.

## Gotchas

- Timeline units are 100 vh of scroll each; `.scroll-space` height is `duration × 100vh + 100vh`.
- Anything revealed by a staggered `fromTo` must start hidden with `hide()`; GSAP only pre-renders the first stagger target.
- GSAP position strings cannot chain offsets (`label+=1+=0.5` is invalid); compute the number first.
- Nav jumps land 0.5 units after a chapter label so the previous layer has faded.
- Dev server port 5180 is shared with `Portfolio_Mildsugar`; run one at a time or pass `--port`.
