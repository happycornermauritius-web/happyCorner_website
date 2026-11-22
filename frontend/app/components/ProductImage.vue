<script setup lang="ts">
import type { ProductImage } from '~/data/types'

// Square (1:1) product photo. Until there's a photo: an illustration of the dish,
// or a paper label with its name.
const props = defineProps<{ image?: ProductImage; name: string; eager?: boolean }>()
const kind = computed(() => dishKind(props.name))
</script>

<template>
  <div class="pimg">
    <img v-if="image" :src="image.src" :alt="image.alt" :loading="eager ? 'eager' : 'lazy'" width="800" height="800" />
    <DishArt v-else-if="kind" :kind="kind" />
    <div v-else class="pimg__label" aria-hidden="true">
      <span>{{ name }}</span>
    </div>
  </div>
</template>

<style scoped>
.pimg {
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--kraft);
}

.pimg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pimg__label {
  display: grid;
  place-items: center;
  height: 100%;
  padding: 12%;
  background:
    repeating-linear-gradient(-45deg, transparent 0 14px, rgba(43, 24, 16, 0.05) 14px 15px),
    var(--kraft);
  text-align: center;
}

.pimg__label span {
  font-family: var(--display);
  font-size: clamp(1.4rem, 3.2vw, 2.3rem);
  line-height: 1.02;
  color: var(--lacquer);
  text-wrap: balance;
}
</style>
