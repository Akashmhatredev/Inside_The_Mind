<script setup>
import { inject, onMounted, ref } from 'vue'
import { gsap, chapter, exit, hide, splitLetters, lettersIn } from '@/lib/gsap'
import { work, profile } from '@/data/profile'
import { projects } from '@/data/projects'
import { shots } from '@/data/shots'

const stage = inject('stage')
const emit = defineEmits(['open'])
const layer = ref(null)
const word = ref(null)
const track = ref(null)
const intro = ref(null)

const statusLabel = { live: 'Live', source: 'Source', 'in progress': 'In progress' }

function cover(p) {
  return shots[p.id]?.[0] ? '/' + shots[p.id][0] : null
}

onMounted(() => {
  const t = word.value.textContent
  word.value.textContent = ''
  word.value.appendChild(splitLetters(t))
})

function build() {
  const chars = word.value.querySelectorAll('.ch')
  const introBits = intro.value.querySelectorAll('p, a')
  const projs = track.value.querySelectorAll('.proj')
  hide(introBits, projs)
  const tl = chapter({ layer: layer.value, stage: stage.value, bg: getComputedStyle(document.documentElement).getPropertyValue('--pine').trim() })
  lettersIn(tl, chars, 'in', { each: 0.04, duration: 0.5 })
  tl.fromTo(introBits, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.1 }, 'in+=0.2')
  tl.fromTo(projs, { autoAlpha: 0, x: 160 }, { autoAlpha: 1, x: 0, duration: 0.4, stagger: 0.08, ease: 'power3.out' }, 'in+=0.2')
  tl.to(track.value, { x: () => -(track.value.scrollWidth - layer.value.clientWidth), duration: 4.2, ease: 'none' }, 'in+=0.6')
  exit(tl, layer.value, { hold: 0.3 })
  return tl
}
defineExpose({ build })
</script>

<template>
  <section ref="layer" id="work" class="layer work" aria-label="Selected work">
    <div ref="track" class="track">
      <div ref="intro" class="intro">
        <h2 ref="word" class="kinetic">{{ work.small }} {{ work.big }}</h2>
        <p>{{ work.intro }}</p>
        <a class="btn" :href="profile.github" target="_blank" rel="noopener" data-cursor="visit">{{ work.more }}</a>
      </div>
      <article v-for="p in projects" :key="p.id" class="proj">
        <div class="label">
          <b>{{ p.name }}</b>
          <em>{{ p.category }}</em>
        </div>
        <button class="cover" type="button" data-cursor="open" :aria-label="'Open case study: ' + p.name" @click="emit('open', p)">
          <img v-if="cover(p)" :src="cover(p)" :alt="p.name + ' screenshot'" loading="lazy" decoding="async" width="1440" height="900" />
          <span v-else class="fallback mono">{{ p.name }}</span>
          <i class="status" :class="p.status.replace(' ', '-')">{{ statusLabel[p.status] }}</i>
        </button>
        <p class="tagline">{{ p.tagline }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.work {
  overflow: hidden;
}
.track {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: clamp(36px, 5vw, 96px);
  padding: 0 var(--pad) 0 calc(var(--pad) + 1vw);
  will-change: transform;
}
.intro {
  flex: 0 0 auto;
  width: clamp(260px, 28vw, 420px);
}
.intro h2 {
  font-size: clamp(40px, 5.4vw, 84px);
  white-space: normal;
  line-height: 0.9;
}
.intro :deep(.w),
.intro :deep(.ch) {
  display: inline-block;
}
.intro p {
  margin: 1.2em 0 1.4em;
  font-size: var(--body);
  line-height: 1.5;
  color: var(--fg-dim);
  max-width: 34ch;
}
.proj {
  flex: 0 0 auto;
  width: clamp(290px, 40vw, 640px);
}
.label {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: var(--body);
  margin-bottom: 10px;
}
.label b {
  font-weight: 700;
}
.label em {
  font-style: normal;
  color: var(--fg-dim);
  text-align: right;
}
.cover {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  max-height: 52vh;
  padding: 0;
  border: 2.5px solid var(--ink);
  border-radius: var(--radius);
  background: #0f0e1d;
  overflow: hidden;
  transition: transform 0.5s var(--ease-out);
}
.cover::after {
  content: '';
  position: absolute;
  inset: -2px;
  border: 3px solid var(--lime);
  border-radius: var(--radius);
  opacity: 0;
  transition: opacity 0.2s;
}
.cover:hover,
.cover:focus-visible {
  transform: translateY(-6px) rotate(-0.6deg);
}
.cover:hover::after,
.cover:focus-visible::after {
  opacity: 1;
}
.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}
.fallback {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 18px;
  color: var(--fg-dim);
}
.status {
  position: absolute;
  left: 12px;
  top: 12px;
  font-style: normal;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 5px 9px;
  border-radius: 999px;
  background: var(--paper);
  color: var(--ink);
}
.status.live {
  background: var(--lime);
}
.status.in-progress {
  background: var(--sun);
}
.tagline {
  margin-top: 10px;
  font-size: var(--small);
  color: var(--fg-dim);
  line-height: 1.4;
}
@media (max-width: 720px) {
  .track {
    gap: 22px;
    top: 52%;
  }
  .intro {
    width: 72vw;
  }
  .intro h2 {
    font-size: clamp(40px, 13vw, 60px);
  }
  .intro p {
    font-size: 14px;
  }
  .proj {
    width: 76vw;
  }
  .cover {
    max-height: 46vh;
  }
  .label {
    font-size: 14px;
  }
}
</style>
