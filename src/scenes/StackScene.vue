<script setup>
import { computed, inject, onMounted, ref } from 'vue'
import { gsap, chapter, exit, hide, splitLetters, lettersIn } from '@/lib/gsap'
import { stack } from '@/data/profile'
import { usePointer } from '@/composables/usePointer'

const stage = inject('stage')
const pointer = usePointer()
const layer = ref(null)
const word = ref(null)
const kbd = ref(null)
const current = ref(null)
const hint = computed(() => (pointer.fine ? 'Hover a key to see how I use it.' : 'Tap a key to see how I use it.'))

function select(key) {
  current.value = key
}
function clear() {
  if (pointer.fine) current.value = null
}

onMounted(() => {
  const t = word.value.textContent
  word.value.textContent = ''
  word.value.appendChild(splitLetters(t))
})

function build() {
  const chars = word.value.querySelectorAll('.ch')
  const keys = kbd.value.querySelectorAll('.key')
  hide(kbd.value, keys)
  const tl = chapter({ layer: layer.value, stage: stage.value, bg: getComputedStyle(document.documentElement).getPropertyValue('--cobalt').trim() })
  lettersIn(tl, chars, 'in', { each: 0.03, duration: 0.5 })
  tl.fromTo(kbd.value, { y: 80, rotateX: 18, autoAlpha: 0 }, { y: 0, rotateX: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out' }, 'in+=0.15')
  tl.fromTo(keys, { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.25, stagger: { each: 0.012, from: 'start' } }, 'in+=0.3')
  tl.to({}, { duration: 1.5 })
  exit(tl, layer.value, { hold: 0.2 })
  return tl
}
defineExpose({ build })
</script>

<template>
  <section ref="layer" id="stack" class="layer stack" aria-label="My tech stack">
    <div class="head">
      <h2 ref="word" class="kinetic">My stack.</h2>
    </div>
    <div ref="kbd" class="kbd" @pointerleave="clear">
      <div class="oled mono" aria-live="polite">
        <b>{{ current ? current.k : 'READY' }}</b>
        <span>{{ current ? current.use : hint }}</span>
      </div>
      <div v-for="g in stack" :key="g.group" class="row">
        <span class="grp mono">{{ g.group }}</span>
        <div class="keys">
          <button
            v-for="key in g.keys"
            :key="key.k"
            class="key"
            :class="{ wide: key.w === 2, lit: current?.k === key.k }"
            type="button"
            data-cursor="press"
            :aria-pressed="current?.k === key.k"
            @pointerenter="pointer.fine && select(key)"
            @focus="select(key)"
            @click="select(key)"
          >
            <span>{{ key.k }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stack {
  overflow: hidden;
  perspective: 1200px;
}
.head {
  position: absolute;
  top: clamp(64px, 9vh, 100px);
  left: var(--pad);
  right: var(--pad);
  text-align: center;
}
.head h2 {
  font-size: clamp(44px, 8vw, 128px);
}
.head :deep(.w),
.head :deep(.ch) {
  display: inline-block;
}
.kbd {
  position: absolute;
  left: 50%;
  top: 52%;
  transform: translate(-50%, -46%);
  width: min(1080px, calc(100% - 2 * var(--pad)));
  padding: 18px 20px 22px;
  border-radius: 22px;
  background: #1a1a2e;
  box-shadow:
    0 30px 70px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  display: grid;
  gap: 10px;
  transform-style: preserve-3d;
}
.oled {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 16px;
  min-height: 52px;
  padding: 10px 16px;
  margin-bottom: 8px;
  border-radius: 10px;
  background: #0a0a14;
  color: var(--lime);
  box-shadow: inset 0 0 0 1px rgba(215, 242, 107, 0.15);
  font-size: 13px;
}
.oled b {
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}
.oled span {
  color: rgba(215, 242, 107, 0.85);
  line-height: 1.4;
}
.row {
  display: grid;
  grid-template-columns: 110px 1fr;
  align-items: center;
  gap: 12px;
}
.grp {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--fg-faint);
}
.keys {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.key {
  --cap: #f6f1e7;
  --side: #b9b2a4;
  position: relative;
  flex: 1 1 0;
  min-width: 84px;
  height: 46px;
  padding: 0 10px;
  border: 0;
  border-radius: 9px;
  background: var(--cap);
  color: var(--ink);
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.01em;
  box-shadow:
    0 5px 0 var(--side),
    0 10px 18px rgba(0, 0, 0, 0.35);
  transform: translateY(0);
  transition:
    transform 0.08s ease-out,
    box-shadow 0.08s ease-out,
    background-color 0.15s;
  text-align: left;
  display: flex;
  align-items: flex-end;
  padding-bottom: 6px;
}
.key.wide {
  flex-grow: 2;
}
.key:hover,
.key:focus-visible,
.key.lit {
  --cap: var(--lime);
  --side: #93a842;
  transform: translateY(3px);
  box-shadow:
    0 2px 0 var(--side),
    0 4px 10px rgba(0, 0, 0, 0.3);
}
.key:active {
  transform: translateY(5px);
  box-shadow: 0 0 0 var(--side);
}
@media (max-width: 960px) {
  .row {
    grid-template-columns: 1fr;
    gap: 6px;
  }
  .key {
    min-width: 72px;
    height: 40px;
    font-size: 12px;
  }
}
@media (max-width: 720px) {
  .head {
    top: 64px;
  }
  .head h2 {
    font-size: clamp(36px, 12vw, 56px);
  }
  .kbd {
    top: 50%;
    transform: translate(-50%, -48%);
    padding: 12px 12px 14px;
    gap: 6px;
    border-radius: 16px;
  }
  .oled {
    min-height: 60px;
    font-size: 11.5px;
    grid-template-columns: 1fr;
    gap: 4px;
    padding: 8px 12px;
  }
  .keys {
    gap: 5px;
  }
  .key {
    min-width: 0;
    flex-basis: calc(25% - 5px);
    height: 30px;
    font-size: 10.5px;
    padding: 0 6px 4px;
    border-radius: 7px;
    box-shadow:
      0 3px 0 var(--side),
      0 6px 10px rgba(0, 0, 0, 0.3);
  }
  .key.wide {
    flex-basis: calc(33% - 5px);
  }
  .grp {
    font-size: 9px;
  }
}
</style>
