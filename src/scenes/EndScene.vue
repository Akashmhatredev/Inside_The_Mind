<script setup>
import { inject, ref } from 'vue'
import { gsap, chapter, hide } from '@/lib/gsap'
import { ending, profile } from '@/data/profile'

const stage = inject('stage')
const layer = ref(null)
const rings = ref(null)
const lines = ref(null)
const exitLine = ref(null)
const foot = ref(null)

function build() {
  const ps = lines.value.children
  const cs = exitLine.value.querySelectorAll('.c, .caret')
  hide(ps, cs, foot.value)
  const tl = chapter({ layer: layer.value, stage: stage.value, bg: getComputedStyle(document.documentElement).getPropertyValue('--midnight').trim(), enter: 0.4 })
  tl.fromTo(rings.value, { scale: 3.4, opacity: 0 }, { scale: 0.5, opacity: 1, duration: 2.6, ease: 'power1.out' }, 'in-=0.2')
  Array.from(ps).forEach((p, i) => {
    const base = i * 0.65
    tl.fromTo(p, { autoAlpha: 0, y: 30, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.35 }, `in+=${base}`)
    if (i < ps.length - 1) tl.to(p, { autoAlpha: 0, y: -30, duration: 0.25 }, `in+=${base + 0.4}`)
  })
  tl.fromTo(cs, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, stagger: 0.06 }, `in+=${ps.length * 0.65 + 0.1}`)
  tl.fromTo(foot.value, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, '>')
  tl.to({}, { duration: 0.4 })
  return tl
}
defineExpose({ build })
</script>

<template>
  <section ref="layer" id="end" class="layer end" aria-label="Ending">
    <div ref="rings" class="rings" aria-hidden="true">
      <i v-for="n in 9" :key="n" :style="{ '--n': n }"></i>
    </div>
    <div ref="lines" class="lines">
      <p v-for="(l, i) in ending.lines" :key="l" :class="i < 2 ? 'serif' : 'plain'">{{ l }}</p>
    </div>
    <p ref="exitLine" class="exit mono" aria-label="exit 0">
      <span class="c">$</span><span class="c">&nbsp;</span><span v-for="(c, i) in ending.exit" :key="i" class="c">{{ c }}</span><i class="caret" aria-hidden="true"></i>
    </p>
    <p ref="foot" class="foot mono">© {{ new Date().getFullYear() }} {{ profile.fullName }} · Built with Vue 3 and GSAP · <a :href="profile.github" target="_blank" rel="noopener">GitHub</a></p>
  </section>
</template>

<style scoped>
.end {
  overflow: hidden;
}
.rings {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 70vmax;
  height: 70vmax;
  margin: -35vmax 0 0 -35vmax;
  will-change: transform;
}
.rings i {
  position: absolute;
  inset: calc(var(--n) * 5.2%);
  border-radius: 50%;
  border: 2px solid rgba(246, 241, 231, calc(0.06 + var(--n) * 0.025));
  background: rgba(46, 43, 88, calc(0.12 * var(--n) / 9));
}
.lines {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 0 var(--pad);
  text-align: center;
}
.lines p {
  grid-area: 1 / 1;
  max-width: 20ch;
  text-wrap: balance;
}
.lines .serif {
  font-size: clamp(36px, 5.6vw, 92px);
  line-height: 1.05;
}
.lines .plain {
  font-size: clamp(22px, 2.6vw, 40px);
  font-weight: 600;
}
.exit {
  position: absolute;
  left: 50%;
  bottom: 22%;
  transform: translateX(-50%);
  font-size: clamp(16px, 1.6vw, 24px);
  color: var(--lime);
  display: flex;
  white-space: pre;
}
.caret {
  display: inline-block;
  width: 0.6em;
  height: 1.1em;
  margin-left: 2px;
  background: var(--lime);
  animation: blink 1s steps(2, start) infinite;
}
@keyframes blink {
  to {
    visibility: hidden;
  }
}
.foot {
  position: absolute;
  left: 0;
  right: 0;
  bottom: clamp(56px, 9vh, 90px);
  text-align: center;
  font-size: 11px;
  color: var(--fg-faint);
  letter-spacing: 0.04em;
}
@media (prefers-reduced-motion: reduce) {
  .caret {
    animation: none;
  }
}
</style>
