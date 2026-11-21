<script setup lang="ts">
const props = defineProps<{ value: number; label?: string }>()
const filled = computed(() => Math.round(props.value))
</script>

<template>
  <span class="stars" role="img" :aria-label="label ?? `${value.toFixed(1)} out of 5 stars`">
    <span v-for="i in 5" :key="i" :class="{ on: i <= filled }" aria-hidden="true">★</span>
  </span>
</template>

<style scoped>
.stars {
  display: inline-flex;
  gap: 0.05em;
  color: rgba(43, 24, 16, 0.25);
  letter-spacing: 0;
  line-height: 1;
}
.on {
  color: var(--honey);
  text-shadow: 0 0 0.5px var(--ink);
}
</style>
