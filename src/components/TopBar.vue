<script setup>
import { profile, nav } from '@/data/profile'

defineProps({ soundOn: Boolean, hint: Boolean })
const emit = defineEmits(['toggle-sound', 'go'])
</script>

<template>
  <header class="top">
    <div class="left">
      <a class="brand" href="#" @click.prevent="emit('go', 'hero')">{{ profile.name }}</a>
      <span class="status"><i aria-hidden="true"></i>{{ profile.status }}</span>
    </div>
    <div class="right">
      <div class="sound-wrap">
        <button class="sound" type="button" :aria-pressed="soundOn" @click="emit('toggle-sound')">
          <span class="bars" :class="{ on: soundOn }" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          <span class="sound-label">Sound {{ soundOn ? 'on' : 'off' }}</span>
        </button>
        <transition name="hint">
          <span v-if="hint && !soundOn" class="sound-hint" aria-hidden="true">Click for sound</span>
        </transition>
      </div>
      <nav class="nav" aria-label="Chapters">
        <a v-for="n in nav" :key="n.id" :href="'#' + n.id" @click.prevent="emit('go', n.id)">{{ n.label }}</a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.top {
  position: absolute;
  inset: 0 0 auto 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: var(--pad);
  z-index: 60;
  pointer-events: none;
}
.top > * {
  pointer-events: auto;
}
.left,
.right {
  display: flex;
  align-items: center;
  gap: 18px;
}
.brand {
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 14px;
  text-decoration: none;
}
.status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  padding: 7px 12px 7px 10px;
  border-radius: 999px;
  border: 1px solid rgba(246, 241, 231, 0.28);
  color: var(--fg-dim);
  white-space: nowrap;
}
.status i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--lime);
  box-shadow: 0 0 0 3px rgba(215, 242, 107, 0.2);
}
.sound-wrap {
  position: relative;
}
.sound {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: 0;
  padding: 6px 4px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.bars {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  height: 12px;
}
.bars i {
  width: 2px;
  height: 4px;
  background: currentColor;
  border-radius: 1px;
  transform-origin: bottom;
}
.bars.on i {
  animation: bar 0.9s ease-in-out infinite;
}
.bars.on i:nth-child(2) {
  animation-delay: 0.15s;
}
.bars.on i:nth-child(3) {
  animation-delay: 0.3s;
}
.bars.on i:nth-child(4) {
  animation-delay: 0.45s;
}
@keyframes bar {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(3);
  }
}
.sound-hint {
  position: absolute;
  top: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--paper);
  color: var(--ink);
  font-size: 12px;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 8px;
  white-space: nowrap;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}
.sound-hint::before {
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  width: 10px;
  height: 10px;
  background: inherit;
  transform: translateX(-50%) rotate(45deg);
}
.hint-enter-active,
.hint-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s var(--ease-out);
}
.hint-enter-from,
.hint-leave-to {
  opacity: 0;
  transform: translate(-50%, -4px);
}
.nav {
  display: flex;
  gap: 18px;
}
.nav a {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  opacity: 0.85;
  transition: opacity 0.2s;
}
.nav a:hover {
  opacity: 1;
  text-decoration: underline;
  text-decoration-color: var(--lime);
}
@media (max-width: 720px) {
  .status {
    display: none;
  }
  .sound-label {
    display: none;
  }
  .nav {
    gap: 12px;
  }
  .left,
  .right {
    gap: 10px;
  }
}
</style>
