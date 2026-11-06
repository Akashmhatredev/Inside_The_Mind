<script setup>
import { inject, onMounted, ref } from 'vue'
import { gsap, chapter, exit, hide, splitLetters, lettersIn } from '@/lib/gsap'
import { mind } from '@/data/profile'

const stage = inject('stage')
const layer = ref(null)
const word = ref(null)
const lines = ref(null)
const pipe = ref(null)
const packet = ref(null)
const snippet = ref(null)

onMounted(() => {
  const t = word.value.textContent
  word.value.textContent = ''
  word.value.appendChild(splitLetters(t))
})

function build() {
  const chars = word.value.querySelectorAll('.ch')
  const items = pipe.value.querySelectorAll('.node, .wire')
  const tokens = snippet.value.querySelectorAll('span')
  hide(lines.value.children, items, tokens, packet.value)
  const tl = chapter({ layer: layer.value, stage: stage.value, bg: getComputedStyle(document.documentElement).getPropertyValue('--teal').trim() })
  lettersIn(tl, chars, 'in', { each: 0.018, duration: 0.5 })
  tl.fromTo(lines.value.children, { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.3, stagger: 0.18 }, 'in+=0.3')
  tl.fromTo(
    items,
    { autoAlpha: 0, scale: 0.6, scaleX: (i, el) => (el.classList.contains('wire') ? 0 : 0.6) },
    { autoAlpha: 1, scale: 1, scaleX: 1, duration: 0.22, stagger: 0.09, ease: 'back.out(1.4)' },
    'in+=0.35',
  )
  const nodes = pipe.value.querySelectorAll('.node')
  const first = nodes[0]
  const last = nodes[nodes.length - 1]
  tl.fromTo(
    packet.value,
    { x: () => first.offsetLeft + first.offsetWidth / 2, autoAlpha: 0 },
    { x: () => last.offsetLeft + last.offsetWidth / 2, autoAlpha: 1, duration: 1.2, ease: 'power1.inOut' },
    'in+=1.1',
  )
  tl.fromTo(tokens, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, stagger: 0.03 }, 'in+=0.9')
  tl.to(packet.value, { autoAlpha: 0, duration: 0.2 }, '>')
  exit(tl, layer.value, { hold: 0.3 })
  return tl
}
defineExpose({ build })
</script>

<template>
  <section ref="layer" id="mind" class="layer mind" aria-label="My engineering mind">
    <div class="head">
      <p class="small mono">{{ mind.small }}</p>
      <h2 ref="word" class="kinetic">{{ mind.big }}</h2>
    </div>
    <div ref="lines" class="lines serif">
      <p v-for="l in mind.lines" :key="l">{{ l }}</p>
    </div>
    <div ref="pipe" class="pipe" role="list" aria-label="Idea to deployment pipeline">
      <template v-for="(n, i) in mind.pipeline" :key="n.id">
        <div class="node" role="listitem">
          <i class="glyph" aria-hidden="true">
            <svg v-if="n.glyph === 'spark'" viewBox="0 0 24 24"><path d="M12 2c1 6 4 9 10 10-6 1-9 4-10 10-1-6-4-9-10-10 6-1 9-4 10-10z" /></svg>
            <svg v-else-if="n.glyph === 'frame'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="5" width="14" height="14" /><circle cx="5" cy="5" r="1.6" fill="currentColor" stroke="none" /><circle cx="19" cy="5" r="1.6" fill="currentColor" stroke="none" /><circle cx="5" cy="19" r="1.6" fill="currentColor" stroke="none" /><circle cx="19" cy="19" r="1.6" fill="currentColor" stroke="none" /></svg>
            <svg v-else-if="n.glyph === 'vue'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M3 4h4.5L12 11l4.5-7H21l-9 16z" /></svg>
            <svg v-else-if="n.glyph === 'flask'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2.2h12.4a1.5 1.5 0 0 0 1.3-2.2L14 9V3" /><path d="M7 15h10" /></svg>
            <svg v-else-if="n.glyph === 'db'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5.5" rx="8" ry="3" /><path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13" /><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M7 18a4 4 0 0 1-.6-7.95A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z" /></svg>
          </i>
          <b>{{ n.label }}</b>
          <span class="mono">{{ n.tech }}</span>
        </div>
        <i v-if="i < mind.pipeline.length - 1" class="wire" aria-hidden="true"></i>
      </template>
      <i ref="packet" class="packet" aria-hidden="true"></i>
    </div>
    <pre ref="snippet" class="snippet mono" aria-hidden="true"><template v-for="(t, i) in mind.snippet" :key="i"><br v-if="t.t === 'nl'" /><span v-else :class="t.t">{{ t.v }}</span></template></pre>
  </section>
</template>

<style scoped>
.mind {
  overflow: hidden;
}
.head {
  position: absolute;
  top: clamp(70px, 11vh, 120px);
  left: var(--pad);
  right: 34%;
}
.small {
  font-size: var(--small);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--fg-dim);
  margin-bottom: 0.5em;
}
.head h2 {
  font-size: clamp(34px, 6.4vw, 108px);
  white-space: normal;
}
.head :deep(.w),
.head :deep(.ch) {
  display: inline-block;
}
.lines {
  position: absolute;
  right: var(--pad);
  top: clamp(70px, 11vh, 120px);
  text-align: right;
  font-size: clamp(18px, 1.7vw, 28px);
  line-height: 1.25;
  color: var(--fg-dim);
  max-width: 24ch;
}
.lines p + p {
  margin-top: 0.15em;
}
.pipe {
  position: absolute;
  left: var(--pad);
  right: var(--pad);
  top: 50%;
  transform: translateY(-40%);
  display: flex;
  align-items: center;
}
.node {
  flex: 0 0 auto;
  display: grid;
  justify-items: center;
  gap: 6px;
  text-align: center;
  width: clamp(96px, 11vw, 150px);
}
.node .glyph {
  width: clamp(48px, 4.6vw, 68px);
  height: clamp(48px, 4.6vw, 68px);
  border-radius: 50%;
  background: var(--paper);
  color: var(--ink);
  display: grid;
  place-items: center;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
}
.node .glyph svg {
  width: 52%;
  height: 52%;
  fill: currentColor;
}
.node b {
  font-size: clamp(14px, 1.2vw, 18px);
  font-weight: 700;
  margin-top: 4px;
}
.node span {
  font-size: 11px;
  color: var(--fg-dim);
  letter-spacing: 0.02em;
}
.wire {
  flex: 1 1 0;
  height: 2px;
  margin: 0 4px;
  background: repeating-linear-gradient(90deg, rgba(246, 241, 231, 0.6) 0 8px, transparent 8px 14px);
  transform-origin: left center;
  position: relative;
  top: calc(-1 * (clamp(14px, 1.2vw, 18px) + 10px + 11px) / 2);
}
.packet {
  position: absolute;
  left: 0;
  top: calc(clamp(48px, 4.6vw, 68px) / 2 - 7px);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--lime);
  box-shadow: 0 0 0 6px rgba(215, 242, 107, 0.25);
  margin-left: -7px;
  opacity: 0;
}
.snippet {
  position: absolute;
  right: var(--pad);
  bottom: clamp(64px, 10vh, 110px);
  margin: 0;
  padding: 18px 22px;
  background: rgba(13, 12, 26, 0.6);
  border: 1px solid rgba(246, 241, 231, 0.12);
  border-radius: 12px;
  font-size: clamp(12px, 0.95vw, 15px);
  line-height: 1.55;
  color: var(--fg);
  backdrop-filter: blur(6px);
}
.snippet .kw {
  color: var(--rose);
}
.snippet .fn {
  color: var(--sky);
}
.snippet .id {
  color: var(--fg);
}
.snippet .op {
  color: var(--fg-dim);
}
.snippet .cm {
  color: var(--lime);
  opacity: 0.8;
}
@media (max-width: 960px) {
  .lines {
    display: none;
  }
  .head {
    right: var(--pad);
  }
  .pipe {
    top: 44%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px 8px;
    transform: none;
  }
  .wire,
  .packet {
    display: none;
  }
  .node {
    width: auto;
  }
  .snippet {
    left: var(--pad);
    bottom: 60px;
    font-size: 12px;
  }
}
@media (max-width: 720px) {
  .head {
    top: 72px;
  }
  .head h2 {
    font-size: clamp(30px, 10vw, 44px);
  }
  .pipe {
    top: 40%;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px 4px;
  }
  .node .glyph {
    width: 44px;
    height: 44px;
  }
  .node b {
    font-size: 13px;
  }
  .node span {
    font-size: 10px;
  }
  .snippet {
    bottom: 56px;
    padding: 12px 14px;
    font-size: 11px;
  }
}
</style>
