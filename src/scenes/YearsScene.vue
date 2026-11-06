<script setup>
import { inject, onMounted, ref } from 'vue'
import { gsap, chapter, exit, hide, splitLetters, lettersIn, lettersOut } from '@/lib/gsap'
import { experience } from '@/data/profile'

const stage = inject('stage')
const layer = ref(null)
const giant = ref(null)
const word = ref(null)
const tag = ref(null)
const log = ref(null)
const commits = ref(null)
const graph = ref(null)

onMounted(() => {
  const t = word.value.textContent
  word.value.textContent = ''
  word.value.appendChild(splitLetters(t))
})

function build() {
  const chars = word.value.querySelectorAll('.ch')
  hide(tag.value, log.value.querySelector('.role'), commits.value.querySelectorAll('.commit'), commits.value.querySelectorAll('li'), log.value.querySelector('.edu'))
  const tl = chapter({ layer: layer.value, stage: stage.value, bg: getComputedStyle(document.documentElement).getPropertyValue('--indigo').trim() })
  lettersIn(tl, chars, 'in', { each: 0.05, duration: 0.6 })
  tl.fromTo(tag.value, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 'in+=0.4')
  tl.addLabel('leave', '>+=0.4')
  lettersOut(tl, chars, 'leave', { each: 0.03 })
  tl.to(tag.value, { autoAlpha: 0, y: -30, duration: 0.25 }, 'leave')
  tl.set(giant.value, { autoAlpha: 0 }, 'leave+=0.9')
  tl.addLabel('log', 'leave+=0.7')
  tl.fromTo(log.value.querySelector('.role'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 'log')
  tl.fromTo(graph.value.querySelector('.rail'), { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: 'power2.out' }, 'log')
  const cards = commits.value.querySelectorAll('.commit')
  const nodes = graph.value.querySelectorAll('.node')
  const span = 1.0
  cards.forEach((card, i) => {
    const base = 0.2 + i * span
    tl.fromTo(card, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }, `log+=${base}`)
    tl.fromTo(card.querySelectorAll('li'), { autoAlpha: 0, x: 16 }, { autoAlpha: 1, x: 0, duration: 0.2, stagger: 0.07 }, `log+=${base + 0.1}`)
    tl.to(nodes[i], { scale: 1.6, fill: '#d7f26b', duration: 0.2, transformOrigin: 'center' }, `log+=${base}`)
    if (i < cards.length - 1) {
      tl.to(card, { autoAlpha: 0, y: -40, duration: 0.22, ease: 'power2.in' }, `log+=${base + 0.72}`)
      tl.to(nodes[i], { scale: 1, fill: '#f6f1e7', duration: 0.2 }, `log+=${base + 0.72}`)
    }
  })
  tl.fromTo(log.value.querySelector('.edu'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.3 }, `log+=${0.5 + (cards.length - 1) * span}`)
  exit(tl, layer.value, { hold: 0.5 })
  return tl
}
defineExpose({ build })
</script>

<template>
  <section ref="layer" id="years" class="layer years" aria-label="Experience">
    <div ref="giant" class="giant">
      <h2 ref="word" class="kinetic">{{ experience.big }}</h2>
      <p ref="tag" class="tag">{{ experience.tag }}</p>
    </div>
    <div ref="log" class="log">
      <header class="role">
        <b>{{ experience.role }}</b>
        <span>{{ experience.company }}</span>
        <span class="mono">{{ experience.period }}</span>
        <span class="focus">{{ experience.focus.join(' · ') }}</span>
      </header>
      <svg ref="graph" class="graph" viewBox="0 0 24 400" preserveAspectRatio="none" aria-hidden="true">
        <line class="rail" x1="12" y1="0" x2="12" y2="400" stroke="rgba(246,241,231,.35)" stroke-width="2" />
        <circle v-for="(e, i) in experience.engagements" :key="e.id" class="node" cx="12" :cy="40 + i * 106" r="6" fill="#f6f1e7" />
      </svg>
      <div ref="commits" class="commits">
        <article v-for="e in experience.engagements" :key="e.id" class="commit">
          <p class="hash mono">commit <span>{{ e.hash }}</span> · {{ e.team }}</p>
          <h3>{{ e.name }}</h3>
          <ul>
            <li v-for="p in e.points" :key="p">{{ p }}</li>
          </ul>
          <p class="chips"><span v-for="s in e.stack" :key="s" class="mono">{{ s }}</span></p>
        </article>
      </div>
      <footer class="edu">
        <span v-for="ed in experience.education" :key="ed.degree"><b>{{ ed.degree }}</b> · {{ ed.school }} · {{ ed.years }} · {{ ed.grade }}</span>
      </footer>
    </div>
  </section>
</template>

<style scoped>
.years {
  overflow: hidden;
}
.giant {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  text-align: center;
  pointer-events: none;
}
.giant h2 {
  font-size: clamp(64px, 14vw, 230px);
}
.giant :deep(.w),
.giant :deep(.ch) {
  display: inline-block;
}
.tag {
  margin-top: 0.6em;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(20px, 2.4vw, 36px);
  color: var(--fg-dim);
}
.log {
  position: absolute;
  left: var(--pad);
  right: var(--pad);
  top: clamp(70px, 11vh, 120px);
  bottom: clamp(64px, 10vh, 100px);
  display: grid;
  grid-template-columns: 24px 1fr;
  grid-template-rows: auto 1fr auto;
  column-gap: 28px;
  row-gap: 20px;
  max-width: 1100px;
  margin: 0 auto;
}
.role {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px 18px;
  font-size: var(--body);
  color: var(--fg-dim);
}
.role b {
  font-size: clamp(20px, 1.8vw, 28px);
  color: var(--fg);
  font-weight: 800;
}
.role .focus {
  flex-basis: 100%;
  font-size: var(--small);
  color: var(--fg-faint);
}
.graph {
  width: 24px;
  height: 100%;
  overflow: visible;
}
.graph .rail {
  transform-origin: top;
}
.commits {
  position: relative;
  min-height: 0;
}
.commit {
  position: absolute;
  inset: 0;
  max-width: 72ch;
}
.hash {
  font-size: var(--small);
  color: var(--fg-dim);
}
.hash span {
  color: var(--sun);
}
.commit h3 {
  font-size: clamp(26px, 3.2vw, 48px);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0.15em 0 0.4em;
}
.commit ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.6em;
}
.commit li {
  position: relative;
  padding-left: 22px;
  font-size: var(--body);
  line-height: 1.45;
  color: var(--fg);
  text-wrap: pretty;
}
.commit li::before {
  content: '+';
  position: absolute;
  left: 0;
  top: 0;
  color: var(--lime);
  font-family: var(--font-mono);
  font-weight: 700;
}
.chips {
  margin-top: 1em;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.chips span {
  font-size: 11px;
  padding: 4px 9px;
  border-radius: 999px;
  border: 1px solid rgba(246, 241, 231, 0.3);
  color: var(--fg-dim);
}
.edu {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 24px;
  font-size: var(--small);
  color: var(--fg-dim);
}
.edu b {
  color: var(--fg);
}
@media (max-width: 720px) {
  .giant h2 {
    font-size: clamp(56px, 20vw, 90px);
  }
  .log {
    top: 70px;
    bottom: 56px;
    grid-template-columns: 14px 1fr;
    column-gap: 14px;
    row-gap: 12px;
  }
  .graph {
    width: 14px;
  }
  .role {
    padding-bottom: 8px;
    font-size: 13px;
  }
  .role b {
    font-size: 18px;
  }
  .role .focus {
    display: none;
  }
  .commit h3 {
    font-size: 22px;
  }
  .commit li {
    font-size: 13.5px;
    line-height: 1.4;
  }
  .commit li:nth-child(n + 3) {
    display: none;
  }
  .edu {
    font-size: 11px;
  }
}
</style>
