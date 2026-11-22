<script setup lang="ts">
import type { Product } from '~/data/types'

withDefaults(defineProps<{ product: Product; large?: boolean }>(), { large: false })
const { needsAhead, label } = useOrderAhead()
</script>

<template>
  <article class="card" :class="{ 'card--out': !product.inStock, 'card--large': large }">
    <NuxtLink :to="`/product/${product.slug}`" class="card__photo" tabindex="-1" aria-hidden="true">
      <ProductImage :image="product.images[0]" :name="product.name" :eager="large" />
      <span v-if="!product.inStock" class="card__flag">Sold out</span>
    </NuxtLink>
    <div class="card__body">
      <div class="card__top">
        <h3 class="card__name">
          <NuxtLink :to="`/product/${product.slug}`">{{ product.name }}</NuxtLink>
        </h3>
        <p class="card__price">{{ product.price != null ? formatRs(product.price) : 'Ask' }}</p>
      </div>
      <p v-if="needsAhead(product)" class="card__ahead">Order {{ label }} ahead</p>
      <p v-if="product.summary" class="card__summary">{{ product.summary }}</p>
      <p v-if="product.reviewCount" class="card__rating">
        <StarRating :value="product.rating" />
        <span>{{ product.reviewCount }} {{ product.reviewCount === 1 ? 'review' : 'reviews' }}</span>
      </p>
      <div v-if="product.inStock" class="card__action">
        <QtyControl :product="product" />
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  min-width: 0;
}

.card__photo {
  position: relative;
  display: block;
  border: 2px solid var(--ink);
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
}

.card__photo :deep(.pimg) {
  transition: transform 0.35s ease;
}

.card__photo:hover :deep(.pimg) {
  transform: scale(1.04);
}

.card__flag {
  position: absolute;
  left: 0.75rem;
  top: 0.75rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  background: var(--paper);
  border: 2px solid var(--ink);
  font-size: 0.85rem;
  font-weight: 600;
}

.card__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.35rem;
}

.card__top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
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
  flex: none;
  font-weight: 600;
  color: var(--lacquer);
  font-variant-numeric: tabular-nums;
}

.card__ahead {
  justify-self: start;
  align-self: flex-start;
  padding: 0.1rem 0.6rem;
  border-radius: 999px;
  background: var(--lacquer);
  color: var(--paper);
  font-size: 0.8rem;
  font-weight: 600;
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
  padding-top: 0.6rem;
}

.card--out .card__photo :deep(.pimg) {
  filter: grayscale(0.6);
  opacity: 0.75;
}

/* Large card: the lead dish on the home page */
.card--large .card__action {
  margin-top: 0.4rem;
}

.card--large .card__action :deep(.add),
.card--large .card__action :deep(.stepper) {
  width: auto;
  min-width: 12rem;
}

.card--large .card__name {
  font-family: var(--display);
  font-weight: 400;
  font-size: clamp(1.8rem, 3.4vw, 2.6rem);
  line-height: 1.05;
}

.card--large .card__price {
  font-size: 1.35rem;
}

.card--large .card__summary {
  font-size: 1.1rem;
  -webkit-line-clamp: 3;
}

@media (max-width: 520px) {
  .card__top {
    flex-direction: column;
    gap: 0.1rem;
  }
  .card__name {
    font-size: 1.05rem;
  }
  .card__summary {
    font-size: 0.9rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .card__photo:hover :deep(.pimg) {
    transform: none;
  }
}
</style>
