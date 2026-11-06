<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { gsap } from '@/lib/gsap'
import { usePointer } from '@/composables/usePointer'

/**
 * Original developer character: round glasses, headphones around the neck,
 * a laptop, and a head whose top hinges open to let the ideas out.
 * Exposes the groups the hero timeline animates.
 */
const root = ref(null)
const lidHover = ref(null)
const lidScroll = ref(null)
const glyphsHover = ref(null)
const head = ref(null)
const pupilL = ref(null)
const pupilR = ref(null)
const hand = ref(null)
const pointer = usePointer()

const HINGE = '258 150' // svg units; back-left of the skull

let pxL, pyL, pxR, pyR
let hoverTl

function onEnter() {
  if (!pointer.fine) return
  hoverTl?.kill()
  hoverTl = gsap.timeline()
  hoverTl
    .to(lidHover.value, { rotation: -38, svgOrigin: HINGE, duration: 0.55, ease: 'back.out(1.6)' }, 0)
    .to(glyphsHover.value, { y: -34, opacity: 1, duration: 0.5, ease: 'power3.out' }, 0.05)
    .to(hand.value, { rotation: -14, svgOrigin: '118 330', duration: 0.3, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 0)
}
function onLeave() {
  if (!pointer.fine) return
  hoverTl?.kill()
  hoverTl = gsap.timeline()
  hoverTl
    .to(lidHover.value, { rotation: 0, svgOrigin: HINGE, duration: 0.5, ease: 'power3.inOut' }, 0)
    .to(glyphsHover.value, { y: 0, opacity: 0, duration: 0.35, ease: 'power2.in' }, 0)
    .to(hand.value, { rotation: 0, svgOrigin: '118 330', duration: 0.3 }, 0)
}

onMounted(() => {
  pxL = gsap.quickTo(pupilL.value, 'x', { duration: 0.25, ease: 'power2' })
  pyL = gsap.quickTo(pupilL.value, 'y', { duration: 0.25, ease: 'power2' })
  pxR = gsap.quickTo(pupilR.value, 'x', { duration: 0.25, ease: 'power2' })
  pyR = gsap.quickTo(pupilR.value, 'y', { duration: 0.25, ease: 'power2' })
  gsap.set(glyphsHover.value, { opacity: 0 })
  // idle: a slow breath on the whole figure
  gsap.to(root.value, { y: -5, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut' })
})

watch(
  () => [pointer.x, pointer.y, pointer.active],
  ([x, y, active]) => {
    const dx = active ? x * 7 : 0
    const dy = active ? y * 5 : 0
    pxL(dx)
    pyL(dy)
    pxR(dx)
    pyR(dy)
  },
)

onBeforeUnmount(() => {
  hoverTl?.kill()
  gsap.killTweensOf([root.value, lidHover.value, glyphsHover.value, hand.value])
})

defineExpose({ root, lidScroll, head, glyphsHover })
</script>

<template>
  <svg
    ref="root"
    class="char"
    viewBox="0 0 640 560"
    role="img"
    aria-label="Illustration of Akash, a developer with round glasses and headphones, waving from behind a laptop. The top of his head opens to let code float out."
    @pointerenter="onEnter"
    @pointerleave="onLeave"
  >
    <defs>
      <linearGradient id="screen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#6fb9ff" />
        <stop offset="1" stop-color="#3b6bd6" />
      </linearGradient>
    </defs>

    <!-- body -->
    <path d="M60 560 C60 430 150 372 320 372 C490 372 580 430 580 560 Z" fill="#17152a" />
    <path d="M250 372 L390 372 L370 420 L270 420 Z" fill="#101020" />
    <!-- neck -->
    <rect x="284" y="318" width="72" height="62" rx="18" fill="#c98f66" />
    <!-- headphones around the neck -->
    <path d="M238 352 C238 420 402 420 402 352" fill="none" stroke="#f6f1e7" stroke-width="12" stroke-linecap="round" />
    <rect x="222" y="344" width="30" height="42" rx="10" fill="#f6f1e7" />
    <rect x="388" y="344" width="30" height="42" rx="10" fill="#f6f1e7" />
    <rect x="230" y="352" width="14" height="26" rx="6" fill="#d7f26b" />
    <rect x="396" y="352" width="14" height="26" rx="6" fill="#d7f26b" />

    <!-- laptop -->
    <g>
      <path d="M352 420 L600 420 L622 548 L330 548 Z" fill="#2b2a3b" />
      <path d="M368 436 L588 436 L604 532 L352 532 Z" fill="url(#screen)" />
      <g font-family="JetBrains Mono Variable, JetBrains Mono, monospace" font-size="13" fill="#eaf4ff" opacity="0.9">
        <text x="384" y="462">&lt;script setup&gt;</text>
        <text x="392" y="482">const idea = ref()</text>
        <text x="392" y="502">await ship(idea)</text>
        <text x="384" y="522">&lt;/script&gt;</text>
      </g>
      <rect x="330" y="548" width="300" height="12" rx="4" fill="#3a3950" />
    </g>

    <!-- waving hand -->
    <g ref="hand">
      <path d="M118 332 C104 300 104 254 118 232 C130 214 150 226 146 250 L144 266 C150 232 176 236 172 262 L170 276 C180 246 206 254 200 284 L198 296 C210 276 232 288 224 310 L212 350 C200 392 150 402 124 370 Z" fill="#c98f66" />
      <path d="M126 350 C150 362 180 358 204 340" fill="none" stroke="#a9704d" stroke-width="6" stroke-linecap="round" />
    </g>

    <!-- head group (face, static part) -->
    <g ref="head">
      <rect x="236" y="150" width="168" height="194" rx="56" fill="#c98f66" />
      <!-- ears -->
      <circle cx="236" cy="250" r="16" fill="#c98f66" />
      <circle cx="404" cy="250" r="16" fill="#c98f66" />
      <!-- open head interior, visible when the lid lifts -->
      <ellipse cx="320" cy="166" rx="84" ry="18" fill="#2e2b58" />
      <ellipse cx="320" cy="166" rx="64" ry="11" fill="#17152a" />
      <!-- eyes -->
      <ellipse cx="288" cy="248" rx="22" ry="24" fill="#f6f1e7" />
      <ellipse cx="352" cy="248" rx="22" ry="24" fill="#f6f1e7" />
      <circle ref="pupilL" cx="290" cy="252" r="9" fill="#15131f" />
      <circle ref="pupilR" cx="354" cy="252" r="9" fill="#15131f" />
      <!-- glasses -->
      <g fill="none" stroke="#15131f" stroke-width="6">
        <circle cx="288" cy="248" r="32" />
        <circle cx="352" cy="248" r="32" />
        <path d="M320 248 h0 M256 240 L236 236 M384 240 L404 236" stroke-linecap="round" />
        <path d="M318 246 C319 240 321 240 322 246" />
      </g>
      <!-- brows -->
      <path d="M262 206 C274 196 298 196 310 204" fill="none" stroke="#15131f" stroke-width="7" stroke-linecap="round" />
      <path d="M330 204 C342 196 366 196 378 206" fill="none" stroke="#15131f" stroke-width="7" stroke-linecap="round" />
      <!-- nose + smile -->
      <path d="M320 268 C314 284 318 292 326 292" fill="none" stroke="#a9704d" stroke-width="5" stroke-linecap="round" />
      <path d="M292 310 C306 328 334 328 348 310" fill="none" stroke="#15131f" stroke-width="7" stroke-linecap="round" />
    </g>

    <!-- lid: hair + skull cap, hinged at the back-left -->
    <g ref="lidScroll">
      <g ref="lidHover">
        <!-- ideas that peek out on hover -->
        <g ref="glyphsHover" font-family="JetBrains Mono Variable, JetBrains Mono, monospace" font-weight="700">
          <text x="262" y="150" font-size="26" fill="#d7f26b">{ }</text>
          <text x="330" y="134" font-size="22" fill="#7cc6ff">&lt;/&gt;</text>
          <circle cx="372" cy="150" r="8" fill="#ffb454" />
          <path d="M300 112 L312 100 L324 112 Z" fill="#ff7a90" />
        </g>
        <path d="M236 168 C236 110 268 92 320 92 C372 92 404 110 404 168 Z" fill="#17152a" />
        <path d="M252 150 C262 118 296 108 320 110 C352 112 380 126 390 150" fill="none" stroke="#2e2b58" stroke-width="7" stroke-linecap="round" />
        <path d="M240 156 C246 146 258 140 270 142 M372 142 C384 140 396 146 402 156" fill="none" stroke="#2e2b58" stroke-width="7" stroke-linecap="round" />
      </g>
    </g>
  </svg>
</template>

<style scoped>
.char {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}
</style>
