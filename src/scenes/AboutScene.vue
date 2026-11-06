<script setup>
import { inject, onMounted, ref } from 'vue'
import { gsap, chapter, exit, hide, splitLetters, lettersIn, lettersOut } from '@/lib/gsap'
import { about, experience, profile } from '@/data/profile'

const stage = inject('stage')
const layer = ref(null)
const word = ref(null)
const art = ref(null)
const lines = ref(null)
const care = ref(null)

onMounted(() => {
  const t = word.value.textContent
  word.value.textContent = ''
  word.value.appendChild(splitLetters(t))
})

function build() {
  const chars = word.value.querySelectorAll('.ch')
  hide(lines.value.children, care.value.children)
  gsap.set(art.value.querySelectorAll('.bldg'), { scaleY: 0, transformOrigin: 'bottom' })
  const tl = chapter({ layer: layer.value, stage: stage.value, bg: getComputedStyle(document.documentElement).getPropertyValue('--terracotta').trim() })
  lettersIn(tl, chars, 'in', { each: 0.04, duration: 0.6 })
  tl.fromTo(art.value.querySelectorAll('.hill'), { y: 160 }, { y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }, 'in')
  tl.fromTo(art.value.querySelector('.sun'), { y: 180, scale: 0.6 }, { y: 0, scale: 1, duration: 0.8, ease: 'power2.out' }, 'in+=0.1')
  tl.fromTo(art.value.querySelectorAll('.bldg'), { scaleY: 0 }, { scaleY: 1, duration: 0.4, stagger: 0.04, ease: 'power2.out', transformOrigin: 'bottom' }, 'in+=0.4')
  tl.fromTo(art.value.querySelector('.bike'), { x: -400 }, { x: 0, duration: 1.1, ease: 'power1.inOut' }, 'in+=0.5')
  tl.fromTo(lines.value.children, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.2 }, 'in+=0.6')
  tl.addLabel('leave', 'in+=2.2')
  lettersOut(tl, chars, 'leave', { each: 0.02 })
  tl.to(lines.value, { autoAlpha: 0, y: -40, duration: 0.3 }, 'leave')
  tl.to(art.value, { y: 120, autoAlpha: 0.35, duration: 0.5 }, 'leave')
  tl.fromTo(care.value.children, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.12 }, 'leave+=0.75')
  tl.to({}, { duration: 0.8 }, 'leave+=1.3')
  exit(tl, layer.value, { hold: 0 })
  return tl
}
defineExpose({ build })
</script>

<template>
  <section ref="layer" id="about" class="layer about" aria-label="About me">
    <svg ref="art" class="art" viewBox="0 0 1600 500" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <circle class="sun" cx="1180" cy="250" r="90" fill="var(--sun)" opacity="0.9" />
      <path class="hill" d="M0 330 C200 250 380 260 560 320 C760 390 900 300 1100 300 C1300 300 1450 380 1600 330 L1600 500 L0 500 Z" fill="rgba(13,12,26,.22)" />
      <path class="hill" d="M0 390 C220 330 420 340 640 380 C860 420 1040 350 1240 360 C1400 370 1520 420 1600 400 L1600 500 L0 500 Z" fill="rgba(13,12,26,.35)" />
      <g fill="rgba(13,12,26,.55)">
        <rect class="bldg" x="300" y="360" width="46" height="110" />
        <rect class="bldg" x="356" y="330" width="32" height="140" />
        <rect class="bldg" x="398" y="380" width="60" height="90" />
        <rect class="bldg" x="1020" y="350" width="40" height="120" />
        <rect class="bldg" x="1070" y="320" width="26" height="150" />
        <rect class="bldg" x="1106" y="372" width="54" height="98" />
      </g>
      <path class="hill" d="M0 460 L1600 460 L1600 500 L0 500 Z" fill="rgba(13,12,26,.6)" />
      <g class="bike" fill="none" stroke="var(--paper)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="620" cy="440" r="22" />
        <circle cx="720" cy="440" r="22" />
        <path d="M620 440 L660 400 L704 400 L720 440 M660 400 L648 382 L676 382 M704 400 L696 380" />
        <path d="M676 382 L700 370 L716 376" />
      </g>
    </svg>
    <h2 ref="word" class="kinetic">{{ about.big }}</h2>
    <div ref="lines" class="lines">
      <p v-for="l in about.lines" :key="l">{{ l }}</p>
    </div>
    <div ref="care" class="care">
      <p class="serif big">{{ about.serif }}</p>
      <p class="detail">{{ about.detail }}</p>
      <dl class="creds">
        <div><dt class="mono">Now</dt><dd>{{ experience.role }}, {{ experience.company }}</dd></div>
        <div><dt class="mono">Education</dt><dd>{{ experience.education[0].degree }}, {{ experience.education[0].school }}</dd></div>
        <div><dt class="mono">Experience</dt><dd>{{ profile.years }} years across SaaS, dashboards and data platforms</dd></div>
      </dl>
      <p class="links">
        <a class="btn" :href="profile.linkedin" target="_blank" rel="noopener" data-cursor="visit">LinkedIn</a>
        <a class="btn" :href="profile.github" target="_blank" rel="noopener" data-cursor="visit">GitHub</a>
        <a class="btn solid" :href="profile.resume" download data-cursor="download">Resume</a>
      </p>
    </div>
  </section>
</template>

<style scoped>
.about {
  overflow: hidden;
}
.art {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 42%;
  pointer-events: none;
}
h2 {
  position: absolute;
  left: 0;
  right: 0;
  top: clamp(80px, 13vh, 150px);
  text-align: center;
  font-size: clamp(56px, 12vw, 200px);
  pointer-events: none;
}
h2 :deep(.w),
h2 :deep(.ch) {
  display: inline-block;
}
.lines {
  position: absolute;
  left: 50%;
  top: 46%;
  transform: translateX(-50%);
  width: min(66ch, calc(100% - 2 * var(--pad)));
  text-align: center;
  display: grid;
  gap: 0.5em;
}
.lines p {
  font-size: var(--lead);
  line-height: 1.4;
  color: var(--fg);
  text-wrap: pretty;
}
.lines p:nth-child(n + 2) {
  color: var(--fg-dim);
  font-size: var(--body);
}
.care {
  position: absolute;
  left: var(--pad);
  right: var(--pad);
  top: clamp(90px, 14vh, 150px);
  max-width: 820px;
}
.care .big {
  font-size: clamp(34px, 4.6vw, 72px);
  line-height: 1.05;
  max-width: 18ch;
}
.detail {
  margin-top: 1em;
  font-size: var(--lead);
  line-height: 1.45;
  color: var(--fg-dim);
  max-width: 52ch;
}
.creds {
  margin: 2em 0 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  padding-top: 1.2em;
  border-top: 1px solid rgba(246, 241, 231, 0.25);
}
.creds dt {
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--fg-faint);
  margin-bottom: 6px;
}
.creds dd {
  margin: 0;
  font-weight: 700;
  font-size: var(--body);
  line-height: 1.35;
}
.links {
  margin-top: 1.6em;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
@media (max-width: 720px) {
  h2 {
    top: 84px;
    font-size: clamp(44px, 15vw, 72px);
  }
  .lines {
    top: 34%;
  }
  .lines p {
    font-size: 15px;
  }
  .lines p:nth-child(n + 2) {
    font-size: 14px;
  }
  .art {
    height: 30%;
  }
  .care {
    top: 76px;
  }
  .care .big {
    font-size: 30px;
  }
  .detail {
    font-size: 14px;
  }
  .creds {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-top: 1.2em;
  }
  .creds dd {
    font-size: 14px;
  }
}
</style>
