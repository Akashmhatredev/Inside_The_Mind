<script setup>
import { inject, ref } from 'vue'
import { gsap, chapter } from '@/lib/gsap'

const stage = inject('stage')
const layer = ref(null)
const rings = ref(null)
const words = ref(null)
const thoughts = [
  ['// an idea', 14, 24],
  ['ref(idea)', 70, 20],
  ['SELECT *', 22, 66],
  ['await', 60, 72],
  ['git commit', 38, 30],
  ['deploy', 82, 50],
  ['{ }', 10, 46],
  ['async', 48, 82],
  ['200 OK', 86, 80],
  ['v-for', 30, 50],
]

function build() {
  const ws = words.value.children
  gsap.set(ws, { autoAlpha: 0, scale: 0.5 })
  const tl = chapter({ layer: layer.value, stage: stage.value, bg: getComputedStyle(document.documentElement).getPropertyValue('--deep').trim(), enter: 0.2 })
  tl.fromTo(rings.value, { scale: 0.18, rotation: -10, opacity: 0.6 }, { scale: 3.2, rotation: 8, opacity: 1, duration: 1.5, ease: 'power1.in' }, 'in-=0.2')
  tl.fromTo(ws, { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1.3, duration: 0.5, stagger: 0.06, ease: 'power2.out' }, 'in')
  tl.to(ws, { autoAlpha: 0, scale: 2.4, duration: 0.45, stagger: 0.06, ease: 'power2.in' }, 'in+=0.4')
  tl.to(layer.value, { autoAlpha: 0, duration: 0.3 }, 'in+=1.0')
  return tl
}
defineExpose({ build })
</script>

<template>
  <section ref="layer" class="layer tunnel" aria-hidden="true">
    <div ref="rings" class="rings">
      <i v-for="n in 9" :key="n" :style="{ '--n': n }"></i>
    </div>
    <div ref="words" class="words mono">
      <span v-for="[w, x, y] in thoughts" :key="w" :style="{ left: x + '%', top: y + '%' }">{{ w }}</span>
    </div>
  </section>
</template>

<style scoped>
.tunnel {
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
  border: 2px solid rgba(246, 241, 231, calc(0.08 + var(--n) * 0.03));
  background: rgba(46, 43, 88, calc(0.1 * var(--n) / 9));
}
.words {
  position: absolute;
  inset: 0;
}
.words span {
  position: absolute;
  font-size: clamp(14px, 1.4vw, 22px);
  color: var(--fg-dim);
  white-space: nowrap;
  opacity: 0;
}
</style>
