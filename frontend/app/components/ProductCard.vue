<script setup lang="ts">
import type { Product } from '~/data/types'

defineProps<{ product: Product }>()
</script>

<template>
  <article class="card" :class="{ 'card--out': !product.inStock }">
    <NuxtLink :to="`/product/${product.slug}`" class="card__photo" tabindex="-1" aria-hidden="true">
      <ProductImage :image="product.images[0]" :name="product.name" />
    </NuxtLink>
    <div class="card__body">
      <h3 class="card__name">
        <NuxtLink :to="`/product/${product.slug}`">{{ product.name }}</NuxtLink>
      </h3>
      <p class="card__price">{{ product.price != null ? formatRs(product.price) : 'Ask for price' }}</p>
      <p v-if="product.summary" class="card__summary">{{ product.summary }}</p>
      <p v-if="product.reviewCount" class="card__rating">
        <StarRating :value="product.rating" />
        <span>{{ product.reviewCount }}</span>
      </p>
      <div class="card__action">
        <QtyControl :product="product" />
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  background: var(--paper);
  border: 2px solid var(--ink);
  border-radius: 8px;
  overflow: hidden;
}

.card__photo {
  display: block;
  text-decoration: none;
  border-bottom: 2px solid var(--ink);
}

.card__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.3rem;
  padding: 1rem 1.1rem 1.1rem;
}

.card__name {
  font-family: var(--body);
  font-weight: 600;
  font-size: 1.2rem;
  line-height: 1.25;
}

.card__name a {
  text-decoration: none;
}

.card__name a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.card__price {
  font-weight: 600;
  color: var(--lacquer);
  font-variant-numeric: tabular-nums;
}

.card__summary {
  color: var(--ink-soft);
  font-size: 0.95rem;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card__rating {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: var(--ink-soft);
}

.card__action {
  margin-top: auto;
  padding-top: 0.75rem;
}

.card--out .card__photo {
  opacity: 0.55;
}
</style>
