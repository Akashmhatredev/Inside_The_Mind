<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { shots } from '@/data/shots'

const props = defineProps({ project: { type: Object, required: true } })
const emit = defineEmits(['close'])
const closeBtn = ref(null)
const sheet = ref(null)
const images = computed(() => (shots[props.project.id] || []).map((s) => '/' + s))
const statusLabel = { live: 'Live', source: 'Source available', 'in progress': 'In progress' }

function onKey(e) {
  if (e.key === 'Escape') emit('close')
}
let prevFocus
onMounted(() => {
  prevFocus = document.activeElement
  document.addEventListener('keydown', onKey)
  document.body.style.overflow = 'hidden'
  requestAnimationFrame(() => closeBtn.value?.focus())
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
  prevFocus?.focus?.()
})
</script>

<template>
  <div class="cs" role="dialog" aria-modal="true" :aria-label="project.name + ' case study'">
    <div class="scrim" @click="emit('close')"></div>
    <article ref="sheet" class="sheet">
      <header class="head">
        <div>
          <p class="meta mono">{{ project.category }} · {{ project.year }} · {{ statusLabel[project.status] }}</p>
          <h2>{{ project.name }}</h2>
          <p class="tagline">{{ project.tagline }}</p>
        </div>
        <button ref="closeBtn" class="close" type="button" aria-label="Close case study" data-cursor="close" @click="emit('close')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </header>
      <p class="links">
        <a v-if="project.live" class="btn solid" :href="project.live" target="_blank" rel="noopener" data-cursor="visit">Open live site</a>
        <a class="btn" :href="project.github" target="_blank" rel="noopener" data-cursor="visit">View source</a>
      </p>
      <div v-if="images.length" class="shots" :class="{ single: images.length === 1 }">
        <img v-for="(s, i) in images" :key="s" :src="s" :alt="project.name + ' screenshot ' + (i + 1)" :loading="i ? 'lazy' : 'eager'" decoding="async" width="1440" height="900" />
      </div>
      <div class="grid">
        <section class="wide">
          <h3>Overview</h3>
          <p>{{ project.overview }}</p>
        </section>
        <section>
          <h3>Problem</h3>
          <p>{{ project.problem }}</p>
        </section>
        <section>
          <h3>Solution</h3>
          <p>{{ project.solution }}</p>
        </section>
        <section class="wide">
          <h3>Stack</h3>
          <ul class="chips">
            <li v-for="s in project.stack" :key="s" class="mono">{{ s }}</li>
          </ul>
        </section>
        <section>
          <h3>Key features</h3>
          <ul class="list">
            <li v-for="f in project.features" :key="f">{{ f }}</li>
          </ul>
        </section>
        <section>
          <h3>Architecture</h3>
          <p>{{ project.architecture }}</p>
        </section>
        <section>
          <h3>Challenges</h3>
          <ul class="list">
            <li v-for="c in project.challenges" :key="c">{{ c }}</li>
          </ul>
        </section>
        <section>
          <h3>Engineering decisions</h3>
          <ul class="list">
            <li v-for="d in project.decisions" :key="d">{{ d }}</li>
          </ul>
        </section>
        <section v-if="project.numbers?.length" class="wide">
          <dl class="numbers">
            <div v-for="n in project.numbers" :key="n.label">
              <dt>{{ n.value }}</dt>
              <dd>{{ n.label }}</dd>
            </div>
          </dl>
        </section>
      </div>
    </article>
  </div>
</template>

<style scoped>
.cs {
  position: fixed;
  inset: 0;
  z-index: 800;
  display: grid;
  align-items: end;
  justify-items: center;
}
.scrim {
  position: absolute;
  inset: 0;
  background: rgba(13, 12, 26, 0.6);
  backdrop-filter: blur(4px);
  animation: fade 0.3s;
}
.sheet {
  position: relative;
  width: min(1100px, 100%);
  max-height: calc(100vh - var(--frame) * 2);
  overflow: auto;
  overscroll-behavior: contain;
  background: var(--paper);
  color: var(--ink);
  border-radius: 24px 24px 0 0;
  padding: clamp(20px, 3vw, 40px) clamp(20px, 4vw, 56px) clamp(40px, 6vh, 80px);
  box-shadow: 0 -20px 60px rgba(0, 0, 0, 0.4);
  animation: rise 0.5s var(--ease-out);
  scrollbar-color: var(--ink) var(--paper);
}
.sheet::selection,
.sheet ::selection {
  background: var(--ink);
  color: var(--paper);
}
@keyframes rise {
  from {
    transform: translateY(40px);
    opacity: 0;
  }
}
@keyframes fade {
  from {
    opacity: 0;
  }
}
.head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}
.meta {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(21, 19, 31, 0.6);
}
.head h2 {
  font-size: clamp(32px, 4.6vw, 64px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 0.95;
  margin: 0.2em 0 0.25em;
}
.tagline {
  font-size: var(--lead);
  color: rgba(21, 19, 31, 0.75);
  max-width: 60ch;
}
.close {
  flex: 0 0 auto;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px solid rgba(21, 19, 31, 0.25);
  background: transparent;
  display: grid;
  place-items: center;
  transition:
    background-color 0.2s,
    color 0.2s;
}
.close:hover {
  background: var(--ink);
  color: var(--paper);
}
.close svg {
  width: 18px;
  height: 18px;
}
.links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 18px 0 26px;
}
.links .btn {
  border-color: rgba(21, 19, 31, 0.3);
  color: var(--ink);
}
.links .btn:hover {
  background: var(--ink);
  color: var(--paper);
  border-color: var(--ink);
}
.links .btn.solid {
  background: var(--ink);
  color: var(--paper);
  border-color: var(--ink);
}
.links .btn.solid:hover {
  background: var(--lime);
  color: var(--ink);
  border-color: var(--lime);
}
.shots {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 30px;
}
.shots.single {
  grid-template-columns: 1fr;
}
.shots img {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  object-position: top;
  border-radius: 12px;
  border: 2px solid var(--ink);
  background: #e8e2d6;
}
.shots img:first-child:nth-last-child(odd) {
  grid-column: 1 / -1;
  aspect-ratio: 16 / 9;
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 26px 40px;
}
.wide {
  grid-column: 1 / -1;
}
h3 {
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 700;
  color: rgba(21, 19, 31, 0.55);
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(21, 19, 31, 0.15);
}
section p {
  font-size: var(--body);
  line-height: 1.55;
  max-width: 70ch;
  text-wrap: pretty;
}
.list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}
.list li {
  position: relative;
  padding-left: 18px;
  font-size: var(--body);
  line-height: 1.45;
}
.list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: var(--sel);
}
.chips {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chips li {
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #e8e2d6;
}
.numbers {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 30px 50px;
}
.numbers dt {
  font-size: clamp(28px, 3vw, 44px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
}
.numbers dd {
  margin: 4px 0 0;
  font-size: var(--small);
  color: rgba(21, 19, 31, 0.6);
}
@media (max-width: 720px) {
  .sheet {
    border-radius: 18px 18px 0 0;
    padding: 18px 18px 48px;
  }
  .shots,
  .grid {
    grid-template-columns: 1fr;
  }
  .shots img:first-child:nth-last-child(odd) {
    aspect-ratio: 16 / 10;
  }
  .head h2 {
    font-size: 30px;
  }
  .tagline {
    font-size: 15px;
  }
}
</style>
