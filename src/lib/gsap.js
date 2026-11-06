import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
gsap.defaults({ ease: 'none' })

export { gsap, ScrollTrigger }

/** Split a string into letter spans for kinetic type. Words stay together in .w spans. */
export function splitLetters(text) {
  const frag = document.createDocumentFragment()
  text.split(' ').forEach((word, wi, arr) => {
    const w = document.createElement('span')
    w.className = 'w'
    for (const c of word) {
      const s = document.createElement('span')
      s.className = 'ch'
      s.textContent = c
      w.appendChild(s)
    }
    frag.appendChild(w)
    if (wi < arr.length - 1) {
      const sp = document.createElement('span')
      sp.className = 'sp'
      sp.textContent = ' '
      frag.appendChild(sp)
    }
  })
  return frag
}

/**
 * Chapter timeline: fades the layer in and tweens the stage ground colour,
 * then returns a timeline with an `in` label where content tweens attach.
 */
export function chapter({ layer, stage, bg, enter = 0.45, first = false }) {
  const tl = gsap.timeline()
  if (first) tl.set(layer, { autoAlpha: 1 }, 0)
  else tl.fromTo(layer, { autoAlpha: 0 }, { autoAlpha: 1, duration: enter }, 0)
  if (bg && stage) tl.to(stage, { backgroundColor: bg, duration: enter }, 0)
  tl.addLabel('in', enter)
  return tl
}

export function exit(tl, layer, { hold = 0.6, duration = 0.4 } = {}) {
  tl.to(layer, { autoAlpha: 0, duration }, `>+=${hold}`)
  return tl
}

/** Deterministic jitter in [-amp, amp] for kinetic letters. */
export function jitter(i, amp = 1) {
  const s = Math.sin((i + 1) * 12.9898) * 43758.5453
  const r = s - Math.floor(s)
  return (r * 2 - 1) * amp
}

/**
 * Hide targets before their timeline runs. A staggered fromTo only pre-renders its
 * first target, so anything revealed by a stagger must start hidden explicitly.
 */
export function hide(...targets) {
  gsap.set(targets.flat().filter(Boolean), { autoAlpha: 0 })
}

/** Letters of a kinetic word rise in with a wobble. */
export function lettersIn(tl, chars, at = 'in', { each = 0.035, duration = 0.7 } = {}) {
  const from = { yPercent: 120, rotation: (i) => jitter(i, 28), '--wdth': 75, autoAlpha: 0 }
  gsap.set(chars, from)
  tl.fromTo(chars, from, { yPercent: 0, rotation: (i) => jitter(i, 6), '--wdth': 100, autoAlpha: 1, duration, stagger: each, ease: 'back.out(1.3)' }, at)
  return tl
}

export function lettersOut(tl, chars, at = '>', { each = 0.02, duration = 0.45 } = {}) {
  tl.to(chars, { yPercent: -150, rotation: (i) => jitter(i + 11, 40), autoAlpha: 0, stagger: each, duration, ease: 'power2.in' }, at)
  return tl
}
