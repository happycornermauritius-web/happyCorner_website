<script setup lang="ts">
import type { Product } from '~/data/types'

defineProps<{ products: Product[] }>()
</script>

<template>
  <div class="grid">
    <ProductCard v-for="p in products" :key="p.id" :product="p" />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 15.5rem), 1fr));
  gap: clamp(1rem, 2.5vw, 1.75rem);
}

@media (max-width: 520px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }
}
</style>
