<script setup>
import { inject, onMounted, ref } from 'vue'
import { gsap, ScrollTrigger, splitLetters } from '@/lib/gsap'
import { hero } from '@/data/profile'
import DevCharacter from '@/components/DevCharacter.vue'

const stage = inject('stage')
const layer = ref(null)
const inner = ref(null)
const char = ref(null)
const nameEl = ref(null)
const copy = ref(null)
const glyphs = ref(null)
const overlay = ref(null)
const size = ref('')
const spreadL = ref(null)
const spreadR = ref(null)

function measure() {
  const r = nameEl.value?.getBoundingClientRect()
  if (r) size.value = `${Math.round(r.width)} × ${Math.round(r.height)}`
}

function setOrigin() {
  const h = char.value?.head?.getBoundingClientRect()
  const l = inner.value?.getBoundingClientRect()
  if (!h || !l) return
  const x = h.left + h.width / 2 - l.left
  const y = h.top + h.height * 0.35 - l.top
  gsap.set(inner.value, { transformOrigin: `${x}px ${y}px` })
}

onMounted(() => {
  nameEl.value.querySelectorAll('.line').forEach((line) => {
    const t = line.textContent
    line.textContent = ''
    line.appendChild(splitLetters(t))
  })
  measure()
  window.addEventListener('resize', measure)
  // intro: letters rise, overlay snaps on
  const chars = nameEl.value.querySelectorAll('.ch')
  const intro = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out' } })
  intro
    .fromTo(chars, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.03 })
    .fromTo(overlay.value, { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.4 }, '-=0.3')
    .fromTo([spreadL.value, spreadR.value], { x: 0, opacity: 0 }, { x: (i) => (i ? 40 : -40), opacity: 1, duration: 0.8 }, '-=0.5')
    .fromTo(copy.value.children, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, '-=0.6')
    .fromTo(char.value.root, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, 0.2)
})

function build() {
  setOrigin()
  ScrollTrigger.addEventListener('refreshInit', setOrigin)
  const tl = gsap.timeline()
  tl.set(layer.value, { autoAlpha: 1 }, 0)
  tl.addLabel('in', 0)
  // 0 → 0.5: hold. 0.5 → 1.6: the head opens, ideas fly out, the camera dives in.
  tl.to({}, { duration: 0.5 })
  tl.addLabel('open')
  tl.to(char.value.lidScroll, { rotation: -118, svgOrigin: '258 150', duration: 0.45, ease: 'power2.inOut' }, 'open')
  gsap.set(glyphs.value.children, { y: 60, scale: 0.2, autoAlpha: 0 })
  tl.fromTo(
    glyphs.value.children,
    { y: 60, scale: 0.2, autoAlpha: 0 },
    { y: (i) => -120 - (i % 3) * 70, x: (i) => (i - 2.5) * 70, scale: 1, autoAlpha: 1, rotation: (i) => (i - 2.5) * 12, duration: 0.5, stagger: 0.04, ease: 'back.out(1.4)' },
    'open+=0.08',
  )
  tl.to([nameEl.value, overlay.value, copy.value, spreadL.value, spreadR.value], { autoAlpha: 0, y: -60, duration: 0.3, ease: 'power2.in' }, 'open+=0.15')
  tl.to(inner.value, { scale: 9, duration: 0.75, ease: 'power2.in' }, 'open+=0.3')
  tl.to(glyphs.value.children, { autoAlpha: 0, duration: 0.2 }, 'open+=0.7')
  tl.to(layer.value, { autoAlpha: 0, duration: 0.22 }, 'open+=0.85')
  return tl
}

defineExpose({ build })
</script>

<template>
  <section ref="layer" id="hero" class="layer hero" aria-label="Introduction">
    <div ref="inner" class="inner">
      <div class="sky" aria-hidden="true"></div>
      <div class="titles">
        <p class="kicker mono">{{ hero.kicker }}</p>
        <div class="name-wrap">
          <h1 ref="nameEl" class="name kinetic">
            <span class="line">{{ hero.name[0] }}</span>
            <span class="line">{{ hero.name[1] }}</span>
          </h1>
          <div ref="overlay" class="inspect" aria-hidden="true">
            <i class="hl"></i>
            <b class="tag"><em>h1</em>.name <span>{{ size }}</span></b>
          </div>
        </div>
        <p class="spread" aria-label="Full Stack Developer">
          <span ref="spreadL">{{ hero.spread[0] }}</span>
          <span ref="spreadR">{{ hero.spread[1] }}</span>
        </p>
      </div>
      <div class="figure">
        <DevCharacter ref="char" />
        <div ref="glyphs" class="glyphs mono" aria-hidden="true">
          <span>{ }</span>
          <span>&lt;/&gt;</span>
          <span>SELECT *</span>
          <span>async</span>
          <span>v-model</span>
          <span>200 OK</span>
        </div>
      </div>
      <div ref="copy" class="copy">
        <p class="line1">{{ hero.line }}</p>
        <p class="tags mono"><template v-for="(t, i) in hero.tags" :key="t"><span>{{ t }}</span><i v-if="i < hero.tags.length - 1">|</i></template></p>
      </div>
      <p class="scroll mono" aria-hidden="true"><i></i>{{ hero.scroll }}</p>
    </div>
  </section>
</template>

<style scoped>
.hero {
  overflow: hidden;
}
.inner {
  position: absolute;
  inset: 0;
  will-change: transform;
}
.sky {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(60% 50% at 50% 100%, rgba(200, 90, 60, 0.55), transparent 70%),
    radial-gradient(40% 30% at 80% 10%, rgba(124, 198, 255, 0.12), transparent 70%);
  pointer-events: none;
}
.titles {
  position: absolute;
  top: clamp(56px, 9vh, 96px);
  left: 0;
  right: 0;
  text-align: center;
  pointer-events: none;
}
.kicker {
  font-size: var(--small);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--fg-dim);
  margin-bottom: 0.6em;
}
.name-wrap {
  position: relative;
  display: inline-block;
}
.name {
  font-size: var(--giant);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 0.86;
  display: flex;
  gap: 0.22em;
  justify-content: center;
  white-space: nowrap;
}
.name .line {
  display: inline-block;
}
.name :deep(.w) {
  display: inline-block;
}
.name :deep(.ch) {
  display: inline-block;
}
.inspect {
  position: absolute;
  inset: -0.08em -0.1em;
  pointer-events: none;
}
.inspect .hl {
  position: absolute;
  inset: 0;
  border: 1.5px solid var(--sel);
  background: rgba(61, 139, 255, 0.14);
  border-radius: 2px;
}
.inspect .tag {
  position: absolute;
  left: -2px;
  top: calc(100% + 6px);
  background: #fff;
  color: #1b1b1b;
  font-family: var(--font-mono);
  font-weight: 500;
  font-size: 12px;
  padding: 5px 8px;
  border-radius: 4px;
  white-space: nowrap;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
}
.inspect .tag em {
  font-style: normal;
  color: #881280;
}
.inspect .tag span {
  color: #6e6e6e;
  margin-left: 8px;
}
.spread {
  display: flex;
  justify-content: center;
  gap: clamp(40px, 10vw, 180px);
  margin-top: 1.1em;
  font-family: var(--font-serif);
  font-size: clamp(22px, 2.6vw, 40px);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--fg-dim);
}
.figure {
  position: absolute;
  left: 50%;
  bottom: -2px;
  width: clamp(320px, 58vh, 700px);
  transform: translateX(-50%);
}
.glyphs {
  position: absolute;
  left: 50%;
  top: 18%;
  pointer-events: none;
}
.glyphs span {
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(-50%, -50%);
  font-weight: 700;
  font-size: clamp(16px, 1.6vw, 24px);
  padding: 6px 10px;
  border-radius: 8px;
  background: var(--paper);
  color: var(--ink);
  white-space: nowrap;
  opacity: 0;
}
.glyphs span:nth-child(2) {
  background: var(--lime);
}
.glyphs span:nth-child(3) {
  background: var(--sky);
}
.glyphs span:nth-child(4) {
  background: var(--sun);
}
.glyphs span:nth-child(5) {
  background: #42b883;
  color: #fff;
}
.glyphs span:nth-child(6) {
  background: var(--rose);
}
.copy {
  position: absolute;
  right: var(--pad);
  bottom: clamp(56px, 9vh, 90px);
  max-width: 34ch;
  text-align: right;
}
.line1 {
  font-size: var(--lead);
  line-height: 1.35;
  font-weight: 500;
}
.tags {
  margin-top: 10px;
  font-size: var(--small);
  color: var(--fg-dim);
  letter-spacing: 0.04em;
}
.tags i {
  font-style: normal;
  margin: 0 0.6em;
  opacity: 0.5;
}
.scroll {
  position: absolute;
  left: var(--pad);
  bottom: clamp(56px, 9vh, 90px);
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--fg-dim);
  display: flex;
  align-items: center;
  gap: 10px;
}
.scroll i {
  width: 28px;
  height: 1px;
  background: currentColor;
  transform-origin: left;
  animation: scrollhint 1.8s ease-in-out infinite;
}
@keyframes scrollhint {
  0%,
  100% {
    transform: scaleX(0.4);
    opacity: 0.4;
  }
  50% {
    transform: scaleX(1);
    opacity: 1;
  }
}
@media (max-width: 720px) {
  .titles {
    top: 72px;
  }
  .name {
    flex-direction: column;
    gap: 0;
    font-size: clamp(58px, 17vw, 90px);
  }
  .spread {
    gap: 24px;
    font-size: 18px;
    margin-top: 2.4em;
  }
  .figure {
    width: min(78vw, 46vh);
  }
  .copy {
    left: var(--pad);
    right: var(--pad);
    bottom: 64px;
    max-width: none;
    text-align: center;
  }
  .line1 {
    font-size: 15px;
  }
  .scroll {
    display: none;
  }
}
</style>
