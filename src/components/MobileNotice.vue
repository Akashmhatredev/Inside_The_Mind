<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const show = ref(false)
function onScroll() {
  // scrolling on is the same answer as "continue here"
  if (window.scrollY > window.innerHeight * 0.6) dismiss()
}
onMounted(() => {
  let seen = false
  try {
    seen = sessionStorage.getItem('ak:notice') === '1'
  } catch {}
  show.value = !seen && window.matchMedia('(max-width: 720px)').matches
  if (show.value) window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
function dismiss() {
  show.value = false
  window.removeEventListener('scroll', onScroll)
  try {
    sessionStorage.setItem('ak:notice', '1')
  } catch {}
}
</script>

<template>
  <transition name="notice">
    <div v-if="show" class="notice" role="status">
      <p class="t">Bigger screens show more of the mind.</p>
      <p class="b">The full experience is built for desktop. Everything still works here, just more compact.</p>
      <button class="btn solid" type="button" @click="dismiss">Continue here</button>
    </div>
  </transition>
</template>

<style scoped>
.notice {
  position: fixed;
  left: 12px;
  right: 12px;
  bottom: 12px;
  z-index: 900;
  background: var(--paper);
  color: var(--ink);
  border-radius: 16px;
  padding: 16px 16px 14px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
}
.t {
  font-family: var(--font-serif);
  font-size: 22px;
  line-height: 1.1;
  margin-bottom: 6px;
}
.b {
  font-size: 13px;
  line-height: 1.45;
  color: rgba(21, 19, 31, 0.75);
  margin-bottom: 12px;
}
.btn.solid {
  background: var(--ink);
  color: var(--paper);
  border-color: var(--ink);
}
.notice-enter-active,
.notice-leave-active {
  transition:
    transform 0.4s var(--ease-out),
    opacity 0.3s;
}
.notice-enter-from,
.notice-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
