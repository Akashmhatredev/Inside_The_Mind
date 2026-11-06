import { onBeforeUnmount, onMounted } from 'vue'

/** Drifting dust motes on a canvas that covers the stage. Cheap: ~90 particles, one pass. */
export function useDust(canvasRef, { count = 90 } = {}) {
  let raf = 0
  let ctx = null
  let parts = []
  let w = 0
  let h = 0
  let visible = true
  let ro = null

  function resize() {
    const c = canvasRef.value
    if (!c) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = c.clientWidth
    h = c.clientHeight
    c.width = Math.floor(w * dpr)
    c.height = Math.floor(h * dpr)
    ctx = c.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    if (!parts.length) seed()
  }

  function seed() {
    parts = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.6 + Math.random() * 1.6,
      a: 0.15 + Math.random() * 0.45,
      vx: (Math.random() - 0.5) * 0.12,
      vy: -0.05 - Math.random() * 0.14,
      tw: Math.random() * Math.PI * 2,
    }))
  }

  function frame(t) {
    raf = requestAnimationFrame(frame)
    if (!ctx || !visible) return
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#fff'
    for (const p of parts) {
      p.x += p.vx
      p.y += p.vy
      if (p.y < -4) {
        p.y = h + 4
        p.x = Math.random() * w
      }
      if (p.x < -4) p.x = w + 4
      else if (p.x > w + 4) p.x = -4
      const tw = 0.6 + 0.4 * Math.sin(t * 0.0012 + p.tw)
      ctx.globalAlpha = p.a * tw
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  function onVis() {
    visible = document.visibilityState === 'visible'
  }

  onMounted(() => {
    resize()
    ro = new ResizeObserver(resize)
    ro.observe(canvasRef.value)
    document.addEventListener('visibilitychange', onVis)
    raf = requestAnimationFrame(frame)
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
    ro?.disconnect()
    document.removeEventListener('visibilitychange', onVis)
  })
}
