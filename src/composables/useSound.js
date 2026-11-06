import { ref } from 'vue'

/**
 * Synthesised ambience, so no audio file ships: two detuned oscillators through a slow
 * low-pass sweep, plus a soft tick on chapter changes. Off until the visitor opts in.
 */
export function useSound() {
  const on = ref(false)
  let ac = null
  let master = null
  let nodes = []

  function build() {
    ac = new (window.AudioContext || window.webkitAudioContext)()
    master = ac.createGain()
    master.gain.value = 0
    master.connect(ac.destination)

    const filter = ac.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 420
    filter.Q.value = 0.8
    filter.connect(master)

    const lfo = ac.createOscillator()
    lfo.frequency.value = 0.07
    const lfoGain = ac.createGain()
    lfoGain.gain.value = 180
    lfo.connect(lfoGain).connect(filter.frequency)
    lfo.start()

    const voices = [
      [110, 'sawtooth', 0.06],
      [110.6, 'sawtooth', 0.05],
      [165, 'triangle', 0.05],
      [220.4, 'sine', 0.035],
    ]
    for (const [f, type, g] of voices) {
      const o = ac.createOscillator()
      o.type = type
      o.frequency.value = f
      const og = ac.createGain()
      og.gain.value = g
      o.connect(og).connect(filter)
      o.start()
      nodes.push(o)
    }
  }

  async function toggle() {
    if (!ac) build()
    if (ac.state === 'suspended') await ac.resume()
    on.value = !on.value
    const t = ac.currentTime
    master.gain.cancelScheduledValues(t)
    master.gain.setTargetAtTime(on.value ? 0.9 : 0, t, on.value ? 1.2 : 0.4)
  }

  function tick() {
    if (!ac || !on.value) return
    const t = ac.currentTime
    const o = ac.createOscillator()
    o.type = 'sine'
    o.frequency.setValueAtTime(880, t)
    o.frequency.exponentialRampToValueAtTime(440, t + 0.12)
    const g = ac.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18)
    o.connect(g).connect(ac.destination)
    o.start(t)
    o.stop(t + 0.2)
  }

  return { on, toggle, tick }
}
