<script setup>
defineProps({
  chapters: { type: Array, default: () => [] },
  progress: { type: Number, default: 0 },
})
const emit = defineEmits(['go'])
</script>

<template>
  <nav class="ruler" aria-label="Progress">
    <div class="ticks" aria-hidden="true"></div>
    <button
      v-for="c in chapters"
      :key="c.id"
      class="mark"
      type="button"
      :class="{ active: progress >= c.at && progress < c.end }"
      :style="{ left: c.at * 100 + '%' }"
      @click="emit('go', c.id)"
    >
      {{ c.label }}
    </button>
    <i class="head" :style="{ left: progress * 100 + '%' }" aria-hidden="true"></i>
  </nav>
</template>

<style scoped>
.ruler {
  position: absolute;
  left: var(--pad);
  right: var(--pad);
  bottom: calc(var(--pad) * 0.7);
  height: 30px;
  z-index: 55;
}
.ticks {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 7px;
  background: repeating-linear-gradient(90deg, rgba(246, 241, 231, 0.45) 0 1.5px, transparent 1.5px 1%);
}
.mark {
  position: absolute;
  bottom: 11px;
  transform: translateX(-2px);
  background: none;
  border: 0;
  padding: 2px 0;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--fg-faint);
  transition: color 0.3s;
}
.mark:hover,
.mark.active {
  color: var(--fg);
}
.head {
  position: absolute;
  bottom: 0;
  width: 2px;
  height: 18px;
  background: var(--lime);
  box-shadow: 0 0 10px rgba(215, 242, 107, 0.6);
  transition: left 0.08s linear;
}
@media (max-width: 720px) {
  .mark {
    display: none;
  }
}
</style>
