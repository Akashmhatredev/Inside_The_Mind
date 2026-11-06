<script setup>
import { inject, onMounted, ref } from 'vue'
import { gsap, chapter, exit, hide, splitLetters, lettersIn } from '@/lib/gsap'
import { build as copy } from '@/data/profile'

const stage = inject('stage')
const layer = ref(null)
const word = ref(null)
const run = ref(null)
const bar = ref(null)

onMounted(() => {
  const t = word.value.textContent
  word.value.textContent = ''
  word.value.appendChild(splitLetters(t))
})

function build() {
  const chars = word.value.querySelectorAll('.ch')
  const steps = run.value.querySelectorAll('.step')
  hide(steps)
  gsap.set(run.value.querySelectorAll('.body'), { height: 0, autoAlpha: 0 })
  const tl = chapter({ layer: layer.value, stage: stage.value, bg: getComputedStyle(document.documentElement).getPropertyValue('--amber').trim() })
  lettersIn(tl, chars, 'in', { each: 0.04, duration: 0.5 })
  tl.fromTo(steps, { autoAlpha: 0, x: -20 }, { autoAlpha: 0.45, x: 0, duration: 0.25, stagger: 0.06 }, 'in+=0.2')
  tl.fromTo(bar.value, { scaleX: 0 }, { scaleX: 1, duration: steps.length * 0.5, ease: 'none' }, 'in+=0.6')
  steps.forEach((step, i) => {
    const base = 0.6 + i * 0.5
    const dot = step.querySelector('.dot')
    const check = step.querySelector('.check')
    const body = step.querySelector('.body')
    tl.to(step, { autoAlpha: 1, duration: 0.15 }, `in+=${base}`)
    tl.to(dot, { backgroundColor: '#d7f26b', borderColor: '#d7f26b', scale: 1.15, duration: 0.15 }, `in+=${base}`)
    tl.fromTo(body, { height: 0, autoAlpha: 0 }, { height: 'auto', autoAlpha: 1, duration: 0.2 }, `in+=${base}`)
    tl.fromTo(check, { strokeDashoffset: 30 }, { strokeDashoffset: 0, duration: 0.15 }, `in+=${base + 0.2}`)
    if (i < steps.length - 1) {
      tl.to(body, { height: 0, autoAlpha: 0, duration: 0.15 }, `in+=${base + 0.42}`)
      tl.to(dot, { scale: 1, duration: 0.15 }, `in+=${base + 0.42}`)
    }
  })
  exit(tl, layer.value, { hold: 0.5 })
  return tl
}
defineExpose({ build })
</script>

<template>
  <section ref="layer" id="build" class="layer build" aria-label="How I build">
    <div class="head">
      <h2 ref="word" class="kinetic">{{ copy.big }}</h2>
      <p class="mono sub">pipeline · {{ copy.steps.length }} stages · every project</p>
    </div>
    <div class="panel">
      <div class="panel-top mono">
        <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
        <span>akash/build-process · run #{{ copy.steps.length * 101 }}</span>
        <span class="ok">passing</span>
      </div>
      <i ref="bar" class="bar" aria-hidden="true"></i>
      <ol ref="run" class="run">
        <li v-for="(s, i) in copy.steps" :key="s.id" class="step">
          <i class="dot" aria-hidden="true">
            <svg class="check-svg" viewBox="0 0 24 24"><path class="check" d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#15131f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="30" stroke-dashoffset="30" /></svg>
          </i>
          <div class="text">
            <b><span class="mono num">{{ String(i + 1).padStart(2, '0') }}</span>{{ s.label }}</b>
            <div class="body"><p>{{ s.body }}</p></div>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.build {
  overflow: hidden;
}
.head {
  position: absolute;
  left: var(--pad);
  top: clamp(70px, 11vh, 120px);
  width: min(44%, 560px);
}
.head h2 {
  font-size: clamp(44px, 7vw, 120px);
  white-space: normal;
  line-height: 0.9;
}
.head :deep(.w),
.head :deep(.ch) {
  display: inline-block;
}
.sub {
  margin-top: 1em;
  font-size: var(--small);
  color: var(--fg-dim);
  letter-spacing: 0.08em;
}
.panel {
  position: absolute;
  right: var(--pad);
  top: 50%;
  transform: translateY(-50%);
  width: min(52%, 640px);
  background: rgba(13, 12, 26, 0.72);
  border: 1px solid rgba(246, 241, 231, 0.12);
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(8px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.35);
}
.panel-top {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  font-size: 12px;
  color: var(--fg-dim);
  border-bottom: 1px solid rgba(246, 241, 231, 0.1);
}
.dots {
  display: inline-flex;
  gap: 6px;
}
.dots i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(246, 241, 231, 0.25);
}
.ok {
  margin-left: auto;
  color: var(--lime);
}
.bar {
  display: block;
  height: 3px;
  background: var(--lime);
  transform-origin: left;
}
.run {
  list-style: none;
  margin: 0;
  padding: 10px 16px 14px;
  display: grid;
  gap: 2px;
}
.step {
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: 14px;
  align-items: start;
  padding: 8px 0;
}
.dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid rgba(246, 241, 231, 0.35);
  display: grid;
  place-items: center;
  margin-top: 2px;
}
.check-svg {
  width: 14px;
  height: 14px;
}
.text b {
  display: block;
  font-size: clamp(16px, 1.3vw, 20px);
  font-weight: 700;
}
.num {
  color: var(--fg-faint);
  font-size: 12px;
  margin-right: 12px;
  font-weight: 500;
}
.body {
  overflow: hidden;
  height: 0;
}
.body p {
  padding: 6px 0 4px;
  font-size: var(--body);
  line-height: 1.45;
  color: var(--fg-dim);
  max-width: 52ch;
}
@media (max-width: 960px) {
  .head {
    width: calc(100% - 2 * var(--pad));
    top: 64px;
  }
  .head h2 {
    font-size: clamp(36px, 9vw, 60px);
  }
  .sub {
    display: none;
  }
  .panel {
    left: var(--pad);
    right: var(--pad);
    width: auto;
    top: auto;
    bottom: 56px;
    transform: none;
  }
  .run {
    padding: 6px 12px 8px;
  }
  .step {
    padding: 5px 0;
    gap: 10px;
  }
  .text b {
    font-size: 14px;
  }
  .body p {
    font-size: 13px;
  }
}
</style>
