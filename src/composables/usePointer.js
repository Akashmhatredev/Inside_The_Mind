import { onBeforeUnmount, onMounted, reactive } from 'vue'

/** Normalised pointer position (-1..1 from stage centre) shared by cursor-reactive scenes. */
const pointer = reactive({ x: 0, y: 0, px: 0, py: 0, fine: true, active: false })

let bound = 0

export function usePointer() {
  function onMove(e) {
    pointer.px = e.clientX
    pointer.py = e.clientY
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    pointer.active = true
  }
  function onLeave() {
    pointer.active = false
  }

  onMounted(() => {
    if (bound++ === 0) {
      pointer.fine = window.matchMedia('(pointer: fine)').matches
      window.addEventListener('pointermove', onMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onLeave)
    }
  })
  onBeforeUnmount(() => {
    if (--bound === 0) {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  })
  return pointer
}
