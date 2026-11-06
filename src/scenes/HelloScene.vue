<script setup>
import { inject, onMounted, ref } from 'vue'
import { gsap, chapter, hide, splitLetters, lettersIn, lettersOut } from '@/lib/gsap'
import { hello } from '@/data/profile'

const stage = inject('stage')
const layer = ref(null)
const word = ref(null)
const squig = ref(null)
const lines = ref(null)
const sparks = ref(null)

onMounted(() => {
  const t = word.value.textContent
  word.value.textContent = ''
  word.value.appendChild(splitLetters(t))
})

function build() {
  const chars = word.value.querySelectorAll('.ch')
  hide(lines.value.children, sparks.value.children)
  const tl = chapter({ layer: layer.value, stage: stage.value, bg: getComputedStyle(document.documentElement).getPropertyValue('--plum').trim(), enter: 0.3 })
  lettersIn(tl, chars, 'in', { each: 0.04, duration: 0.6 })
  const len = squig.value.getTotalLength()
  tl.fromTo(squig.value, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' }, 'in+=0.45')
  tl.fromTo(sparks.value.children, { scale: 0, rotation: -40, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(2)' }, 'in+=0.5')
  tl.fromTo(lines.value.children, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.22 }, 'in+=0.7')
  tl.to(word.value, { xPercent: -6, duration: 1.4 }, 'in+=0.6')
  tl.addLabel('leave', 'in+=1.9')
  lettersOut(tl, chars, 'leave', { each: 0.02 })
  tl.to([lines.value, squig.value, sparks.value], { autoAlpha: 0, y: -40, duration: 0.3 }, 'leave')
  tl.to(layer.value, { autoAlpha: 0, duration: 0.25 }, 'leave+=0.55')
  return tl
}
defineExpose({ build })
</script>

<template>
  <section ref="layer" id="hello" class="layer hello" aria-label="Hello">
    <div class="big">
      <h2 ref="word" class="kinetic">{{ hello.big }}</h2>
      <svg class="squig" viewBox="0 0 420 24" aria-hidden="true">
        <path ref="squig" d="M4 14 C 30 -4, 56 32, 82 14 S 134 -4, 160 14 S 212 32, 238 14 S 290 -4, 316 14 S 368 32, 394 14 L 416 14" fill="none" stroke="var(--lime)" stroke-width="5" stroke-linecap="round" />
      </svg>
      <div ref="sparks" class="sparks" aria-hidden="true">
        <svg viewBox="0 0 40 40"><path d="M20 2 C22 14 26 18 38 20 C26 22 22 26 20 38 C18 26 14 22 2 20 C14 18 18 14 20 2 Z" fill="var(--paper)" /></svg>
        <svg viewBox="0 0 40 40"><path d="M20 2 C22 14 26 18 38 20 C26 22 22 26 20 38 C18 26 14 22 2 20 C14 18 18 14 20 2 Z" fill="var(--paper)" /></svg>
        <svg viewBox="0 0 40 40"><path d="M20 2 C22 14 26 18 38 20 C26 22 22 26 20 38 C18 26 14 22 2 20 C14 18 18 14 20 2 Z" fill="var(--lime)" /></svg>
      </div>
    </div>
    <div ref="lines" class="lines">
      <p v-for="l in hello.lines" :key="l">{{ l }}</p>
    </div>
  </section>
</template>

<style scoped>
.hello {
  overflow: hidden;
}
.big {
  position: absolute;
  left: 0;
  right: 0;
  top: 32%;
  transform: translateY(-50%);
  text-align: center;
  pointer-events: none;
}
.big h2 {
  font-size: clamp(56px, 12vw, 200px);
  padding: 0 var(--pad);
}
.big :deep(.w),
.big :deep(.ch) {
  display: inline-block;
}
.squig {
  display: block;
  width: clamp(200px, 26vw, 440px);
  margin: 0.4em auto 0;
  overflow: visible;
}
.sparks svg {
  position: absolute;
  width: clamp(18px, 2.2vw, 36px);
}
.sparks svg:nth-child(1) {
  left: 12%;
  top: -20%;
}
.sparks svg:nth-child(2) {
  right: 10%;
  top: 10%;
}
.sparks svg:nth-child(3) {
  left: 18%;
  bottom: -40%;
}
.lines {
  position: absolute;
  left: 50%;
  bottom: clamp(70px, 14vh, 140px);
  transform: translateX(-50%);
  width: min(62ch, calc(100% - 2 * var(--pad)));
  text-align: center;
  display: grid;
  gap: 0.5em;
}
.lines p {
  font-size: var(--lead);
  line-height: 1.4;
  font-weight: 500;
  color: var(--fg);
  text-wrap: pretty;
}
.lines p:nth-child(n + 2) {
  color: var(--fg-dim);
}
@media (max-width: 720px) {
  .big {
    top: 28%;
  }
  .big h2 {
    font-size: clamp(44px, 15vw, 80px);
    white-space: normal;
  }
  .lines {
    bottom: 96px;
  }
  .lines p {
    font-size: 15px;
  }
}
</style>
