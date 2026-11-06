<script setup>
import { nextTick, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useDust } from '@/composables/useDust'
import { useSound } from '@/composables/useSound'
import { usePointer } from '@/composables/usePointer'
import { chapters } from '@/data/profile'
import TopBar from '@/components/TopBar.vue'
import Ruler from '@/components/Ruler.vue'
import CursorTag from '@/components/CursorTag.vue'
import MobileNotice from '@/components/MobileNotice.vue'
import CaseStudy from '@/components/CaseStudy.vue'
import HeroScene from '@/scenes/HeroScene.vue'
import TunnelScene from '@/scenes/TunnelScene.vue'
import HelloScene from '@/scenes/HelloScene.vue'
import MindScene from '@/scenes/MindScene.vue'
import StackScene from '@/scenes/StackScene.vue'
import YearsScene from '@/scenes/YearsScene.vue'
import WorkScene from '@/scenes/WorkScene.vue'
import BuildScene from '@/scenes/BuildScene.vue'
import AboutScene from '@/scenes/AboutScene.vue'
import ContactScene from '@/scenes/ContactScene.vue'
import EndScene from '@/scenes/EndScene.vue'

const stageEl = ref(null)
const spaceEl = ref(null)
const dustEl = ref(null)
provide('stage', stageEl)

const rm = ref(false)
const progress = ref(0)
const units = ref(30)
const rulerChapters = ref([])
const openProject = ref(null)
const soundHint = ref(true)

const sound = useSound()
const pointer = usePointer()
useDust(dustEl)

const scenes = {
  hero: ref(null),
  tunnel: ref(null),
  hello: ref(null),
  mind: ref(null),
  stack: ref(null),
  years: ref(null),
  work: ref(null),
  build: ref(null),
  about: ref(null),
  contact: ref(null),
  end: ref(null),
}
const order = Object.keys(scenes)

let master
let trigger
let current = ''

function scrollLength() {
  return spaceEl.value.offsetHeight - window.innerHeight
}

function go(id) {
  if (rm.value || !master) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    return
  }
  // land just after the chapter's entrance, once the previous layer has faded
  const t = id === 'hero' ? 0 : Math.min((master.labels[id] ?? 0) + 0.5, master.duration())
  const y = (t / master.duration()) * scrollLength()
  gsap.to(window, { scrollTo: { y: y + 2, autoKill: true }, duration: 1.4, ease: 'power3.inOut' })
}

function onUpdate(self) {
  progress.value = self.progress
  const t = self.progress * master.duration()
  let c = ''
  for (const ch of rulerChapters.value) if (t >= ch.at * master.duration()) c = ch.id
  if (c !== current) {
    current = c
    sound.tick()
  }
  if (soundHint.value && self.progress > 0.04) soundHint.value = false
}

onMounted(async () => {
  rm.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.documentElement.classList.toggle('rm', rm.value)
  document.documentElement.classList.toggle('fine', pointer.fine || window.matchMedia('(pointer: fine)').matches)
  if (rm.value) return
  try {
    await document.fonts?.ready
  } catch {}

  master = gsap.timeline({ paused: true })
  order.forEach((id, i) => {
    const tl = scenes[id].value.build()
    // overlap each chapter's entrance with the previous exit
    const pos = i === 0 ? 0 : '-=0.15'
    master.addLabel(id, pos)
    master.add(tl, id)
  })
  units.value = master.duration()
  await nextTick()

  const d = master.duration()
  const labelAt = (id) => (master.labels[id] ?? 0) / d
  rulerChapters.value = chapters.map((c, i) => ({
    ...c,
    at: labelAt(c.id),
    end: i < chapters.length - 1 ? labelAt(chapters[i + 1].id) : labelAt('end'),
  }))

  trigger = ScrollTrigger.create({
    trigger: spaceEl.value,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.6,
    animation: master,
    invalidateOnRefresh: true,
    onUpdate,
  })
  // deep links such as /#work
  const hash = location.hash.slice(1)
  if (hash && master.labels[hash] != null) requestAnimationFrame(() => go(hash))
})

onBeforeUnmount(() => {
  trigger?.kill()
  master?.kill()
})
</script>

<template>
  <div class="frame">
    <div ref="stageEl" class="stage">
      <canvas ref="dustEl" class="dust" aria-hidden="true"></canvas>
      <HeroScene :ref="scenes.hero" />
      <TunnelScene :ref="scenes.tunnel" />
      <HelloScene :ref="scenes.hello" />
      <MindScene :ref="scenes.mind" />
      <StackScene :ref="scenes.stack" />
      <YearsScene :ref="scenes.years" />
      <WorkScene :ref="scenes.work" @open="openProject = $event" />
      <BuildScene :ref="scenes.build" />
      <AboutScene :ref="scenes.about" />
      <ContactScene :ref="scenes.contact" />
      <EndScene :ref="scenes.end" />
      <TopBar :sound-on="sound.on.value" :hint="soundHint" @toggle-sound="sound.toggle" @go="go" />
      <Ruler v-if="!rm" :chapters="rulerChapters" :progress="progress" @go="go" />
      <div class="grain" aria-hidden="true"></div>
    </div>
    <CursorTag v-if="pointer.fine && !rm" />
  </div>
  <div ref="spaceEl" class="scroll-space" :style="{ height: units * 100 + 100 + 'vh' }" aria-hidden="true"></div>
  <transition name="cs">
    <CaseStudy v-if="openProject" :project="openProject" @close="openProject = null" />
  </transition>
  <MobileNotice />
</template>

<style>
.frame {
  position: fixed;
  inset: 0;
  padding: var(--frame);
  z-index: 1;
}
.stage {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 14px;
  overflow: hidden;
  background: var(--dusk);
  isolation: isolate;
}
html.fine .frame {
  cursor: none;
}
html.fine .frame a,
html.fine .frame button {
  cursor: none;
}
.dust {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  mix-blend-mode: screen;
}
.layer {
  position: absolute;
  inset: 0;
  visibility: hidden;
  opacity: 0;
  z-index: 3;
}
.layer.hero {
  visibility: visible;
  opacity: 1;
}
.grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 50;
  opacity: 0.16;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1.4 -0.5'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}
.scroll-space {
  position: relative;
  z-index: 0;
}
.cs-enter-active,
.cs-leave-active {
  transition: opacity 0.25s;
}
.cs-enter-from,
.cs-leave-to {
  opacity: 0;
}

/* Reduced motion: the stage unpins and every chapter stacks as a static section. */
html.rm .frame {
  position: relative;
  padding: 0;
}
html.rm .stage {
  height: auto;
  border-radius: 0;
  overflow: visible;
}
html.rm .layer {
  position: relative;
  inset: auto;
  visibility: visible;
  opacity: 1;
  min-height: 100vh;
  padding: 80px var(--pad);
}
html.rm .layer > * {
  position: relative !important;
  inset: auto !important;
  transform: none !important;
  width: auto;
  margin: 0 auto 24px;
}
html.rm .tunnel,
html.rm .dust,
html.rm .grain,
html.rm .scroll-space {
  display: none;
}
html.rm .layer.hero {
  background: var(--dusk);
}
html.rm .layer.hello {
  background: var(--plum);
}
html.rm .layer.mind {
  background: var(--teal);
}
html.rm .layer.stack {
  background: var(--cobalt);
}
html.rm .layer.years {
  background: var(--indigo);
}
html.rm .layer.work {
  background: var(--pine);
}
html.rm .layer.build {
  background: var(--amber);
}
html.rm .layer.about {
  background: var(--terracotta);
}
html.rm .layer.contact {
  background: var(--night);
}
html.rm .layer.end {
  background: var(--midnight);
}
html.rm .top {
  position: sticky;
  top: 0;
  background: var(--dusk);
}
</style>
