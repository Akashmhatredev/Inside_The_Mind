<script setup>
import { inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { gsap, chapter, exit, hide, splitLetters, lettersIn } from '@/lib/gsap'
import { contact, profile } from '@/data/profile'
import { usePointer } from '@/composables/usePointer'

const stage = inject('stage')
const pointer = usePointer()
const layer = ref(null)
const word = ref(null)
const center = ref(null)
const stickers = ref(null)
const copied = ref(false)
const time = ref('')
let timer

async function copy() {
  try {
    await navigator.clipboard.writeText(profile.email)
    copied.value = true
    setTimeout(() => (copied.value = false), 1800)
  } catch {
    window.location.href = 'mailto:' + profile.email
  }
}

function tickClock() {
  time.value = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata', hour12: false }).format(new Date())
}

onMounted(() => {
  const t = word.value.textContent
  word.value.textContent = ''
  word.value.appendChild(splitLetters(t))
  tickClock()
  timer = setInterval(tickClock, 30000)
  // ambient float, independent of scroll
  stickers.value.querySelectorAll('.st').forEach((el, i) => {
    gsap.to(el, { y: '+=14', rotation: `+=${i % 2 ? 4 : -4}`, duration: 2.4 + i * 0.3, yoyo: true, repeat: -1, ease: 'sine.inOut' })
  })
})
onBeforeUnmount(() => clearInterval(timer))

watch(
  () => [pointer.x, pointer.y],
  ([x, y]) => {
    if (!pointer.fine || !stickers.value) return
    stickers.value.querySelectorAll('.st').forEach((el, i) => {
      const d = 10 + (i % 3) * 10
      gsap.to(el, { x: -x * d, y: -y * d, duration: 0.8, ease: 'power2.out', overwrite: 'auto' })
    })
  },
)

function build() {
  const chars = word.value.querySelectorAll('.ch')
  const fades = center.value.querySelectorAll('.fade')
  const sts = stickers.value.querySelectorAll('.st')
  hide(fades, sts)
  const tl = chapter({ layer: layer.value, stage: stage.value, bg: getComputedStyle(document.documentElement).getPropertyValue('--night').trim() })
  lettersIn(tl, chars, 'in', { each: 0.03, duration: 0.55 })
  tl.fromTo(fades, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.1 }, 'in+=0.3')
  tl.fromTo(sts, { scale: 0, rotation: -30, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(2)' }, 'in+=0.2')
  tl.to({}, { duration: 1 })
  exit(tl, layer.value, { hold: 0.2 })
  return tl
}
defineExpose({ build })
</script>

<template>
  <section ref="layer" id="contact" class="layer contact" aria-label="Contact">
    <div ref="stickers" class="stickers" aria-hidden="true">
      <svg class="st s1" viewBox="0 0 80 60"><rect x="2" y="2" width="76" height="56" rx="8" fill="#15131f" stroke="#f6f1e7" stroke-width="3" /><text x="12" y="38" font-family="JetBrains Mono Variable, monospace" font-size="20" font-weight="700" fill="#d7f26b">$ _</text></svg>
      <svg class="st s2" viewBox="0 0 70 80"><ellipse cx="35" cy="16" rx="28" ry="11" fill="#7cc6ff" stroke="#15131f" stroke-width="3" /><path d="M7 16v46c0 6 12.5 11 28 11s28-5 28-11V16" fill="#7cc6ff" stroke="#15131f" stroke-width="3" /><path d="M7 40c0 6 12.5 11 28 11s28-5 28-11" fill="none" stroke="#15131f" stroke-width="3" /></svg>
      <svg class="st s3" viewBox="0 0 90 60"><path d="M24 52a16 16 0 0 1-2-32A22 22 0 0 1 64 18a15 15 0 0 1-2 34z" fill="#f6f1e7" stroke="#15131f" stroke-width="3" /></svg>
      <svg class="st s4" viewBox="0 0 70 70"><text x="8" y="52" font-family="JetBrains Mono Variable, monospace" font-size="46" font-weight="700" fill="#ffb454" stroke="#15131f" stroke-width="2">{}</text></svg>
      <svg class="st s5" viewBox="0 0 80 50"><rect x="2" y="2" width="76" height="46" rx="10" fill="#ff7a90" stroke="#15131f" stroke-width="3" /><text x="12" y="32" font-family="Bricolage Grotesque Variable, sans-serif" font-size="16" font-weight="800" fill="#15131f">200 OK</text></svg>
      <svg class="st s6" viewBox="0 0 60 60"><path d="M30 4l6 16 17 1-13 11 5 17-15-10-15 10 5-17L7 21l17-1z" fill="#d7f26b" stroke="#15131f" stroke-width="3" stroke-linejoin="round" /></svg>
    </div>
    <div ref="center" class="center">
      <p class="small mono fade">{{ contact.small }}</p>
      <h2 ref="word" class="kinetic">{{ contact.big }}</h2>
      <p class="line fade">{{ contact.line }}</p>
      <div class="email fade">
        <a class="addr mono" :href="'mailto:' + profile.email" data-cursor="mail">{{ profile.email }}</a>
        <button class="btn" type="button" :class="{ done: copied }" data-cursor="copy" @click="copy">
          <svg v-if="!copied" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a1 1 0 0 1 1-1h10" /></svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          {{ copied ? contact.copied : contact.copy }}
        </button>
      </div>
      <div class="row fade">
        <a class="btn" :href="profile.linkedin" target="_blank" rel="noopener" data-cursor="visit">LinkedIn</a>
        <a class="btn" :href="profile.github" target="_blank" rel="noopener" data-cursor="visit">GitHub</a>
        <a class="btn solid" :href="profile.resume" download data-cursor="download">Download resume</a>
      </div>
      <p class="loc mono fade">{{ profile.location }} · IST {{ time }}</p>
    </div>
  </section>
</template>

<style scoped>
.contact {
  overflow: hidden;
}
.stickers {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.st {
  position: absolute;
  width: clamp(54px, 6vw, 96px);
  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.35));
}
.s1 {
  left: 10%;
  top: 18%;
}
.s2 {
  left: 16%;
  bottom: 22%;
}
.s3 {
  right: 12%;
  top: 16%;
}
.s4 {
  right: 18%;
  bottom: 26%;
}
.s5 {
  left: 28%;
  top: 12%;
  width: clamp(60px, 7vw, 110px);
}
.s6 {
  right: 30%;
  bottom: 14%;
  width: clamp(36px, 4vw, 60px);
}
.center {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  text-align: center;
  padding: 0 var(--pad);
  gap: 0.6em;
}
.small {
  font-size: var(--small);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--fg-dim);
}
h2 {
  font-size: clamp(40px, 7.4vw, 120px);
  white-space: normal;
}
h2 :deep(.w),
h2 :deep(.ch) {
  display: inline-block;
}
.line {
  font-size: var(--lead);
  color: var(--fg-dim);
  max-width: 44ch;
  margin: 0 auto;
}
.email {
  margin-top: 0.6em;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 14px;
}
.addr {
  font-size: clamp(18px, 2.4vw, 36px);
  font-weight: 600;
  text-decoration: none;
  border-bottom: 2px solid var(--lime);
  padding-bottom: 2px;
}
.addr:hover {
  color: var(--lime);
}
.btn.done {
  background: var(--lime);
  color: var(--ink);
  border-color: var(--lime);
}
.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 0.4em;
}
.loc {
  margin-top: 1.2em;
  font-size: var(--small);
  color: var(--fg-faint);
}
@media (max-width: 720px) {
  h2 {
    font-size: clamp(36px, 12vw, 56px);
  }
  .line {
    font-size: 15px;
  }
  .addr {
    font-size: 16px;
  }
  .s5,
  .s6 {
    display: none;
  }
  .st {
    width: 44px;
  }
}
</style>
