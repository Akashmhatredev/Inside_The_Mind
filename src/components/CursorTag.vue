<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from '@/lib/gsap'

const el = ref(null)
const label = ref('')
const hidden = ref(true)
let toX, toY

function onMove(e) {
  toX(e.clientX)
  toY(e.clientY)
  hidden.value = false
  const t = e.target.closest?.('[data-cursor]')
  label.value = t ? t.dataset.cursor : ''
}
function onLeave() {
  hidden.value = true
}

onMounted(() => {
  toX = gsap.quickTo(el.value, 'x', { duration: 0.12, ease: 'power3' })
  toY = gsap.quickTo(el.value, 'y', { duration: 0.12, ease: 'power3' })
  window.addEventListener('pointermove', onMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', onLeave)
})
onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onMove)
  document.documentElement.removeEventListener('pointerleave', onLeave)
})
</script>

<template>
  <div ref="el" class="cursor" :class="{ hidden, tagged: !!label }" aria-hidden="true">
    <svg viewBox="0 0 22 24" width="22" height="24">
      <path d="M2 2 L20 11.5 L12 13.5 L8.5 21 Z" fill="var(--lime)" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round" />
    </svg>
    <b v-if="label">{{ label }}</b>
  </div>
</template>

<style scoped>
.cursor {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  pointer-events: none;
  will-change: transform;
  transition: opacity 0.2s;
}
.cursor.hidden {
  opacity: 0;
}
.cursor svg {
  display: block;
}
.cursor b {
  position: absolute;
  left: 18px;
  top: 20px;
  background: var(--lime);
  color: var(--ink);
  font-size: 12px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 0 8px 8px 8px;
  white-space: nowrap;
  letter-spacing: 0.02em;
}
</style>
