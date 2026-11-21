<script setup lang="ts">
import type { Product } from '~/data/types'

const props = defineProps<{ product: Product }>()
const { qtyOf, setQty } = useCart()
const qty = computed(() => qtyOf(props.product.id))
const initial = computed(() => props.product.name.charAt(0))
</script>

<template>
  <li class="item" :class="{ 'item--out': !product.inStock }">
    <div class="item__photo">
      <img v-if="product.image" :src="product.image.src" :alt="product.image.alt" loading="lazy" width="96" height="96" />
      <span v-else class="item__placeholder" aria-hidden="true">{{ initial }}</span>
    </div>

    <div class="item__body">
      <div class="item__line">
        <h3 class="item__name">{{ product.name }}</h3>
        <span class="item__leader" aria-hidden="true"></span>
        <span class="item__price">{{ product.price != null ? formatRs(product.price) : 'Ask for price' }}</span>
      </div>
      <p v-if="product.description" class="item__desc">{{ product.description }}</p>
      <p v-if="product.reviewCount" class="item__rating">
        <StarRating :value="product.rating" />
        <span>{{ product.reviewCount }} {{ product.reviewCount === 1 ? 'review' : 'reviews' }}</span>
      </p>
    </div>

    <div class="item__action">
      <p v-if="!product.inStock" class="item__out">Sold out</p>
      <button v-else-if="qty === 0" type="button" class="btn item__add" @click="setQty(product, 1)">
        Add<span class="visually-hidden"> {{ product.name }}</span>
      </button>
      <div v-else class="stepper" role="group" :aria-label="`Quantity of ${product.name}`">
        <button type="button" @click="setQty(product, qty - 1)" :aria-label="`One less ${product.name}`">−</button>
        <output aria-live="polite">{{ qty }}</output>
        <button type="button" @click="setQty(product, qty + 1)" :aria-label="`One more ${product.name}`">+</button>
      </div>
    </div>
  </li>
</template>

<style scoped>
.item {
  display: grid;
  grid-template-columns: 5.5rem minmax(0, 1fr) 8.5rem;
  gap: 1.25rem;
  align-items: center;
  padding-block: 1.25rem;
  border-bottom: 1px dashed var(--line);
}

.item:last-child {
  border-bottom: 0;
}

.item__photo {
  width: 5.5rem;
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
  background: var(--kraft);
  box-shadow: inset 0 0 0 2px var(--ink);
}

.item__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item__placeholder {
  display: grid;
  place-items: center;
  height: 100%;
  font-family: var(--display);
  font-size: 2.2rem;
  color: var(--lacquer);
}

.item__line {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
}

.item__name {
  font-family: var(--body);
  font-weight: 600;
  font-size: 1.2rem;
  line-height: 1.3;
}

.item__leader {
  flex: 1;
  min-width: 1.5rem;
  border-bottom: 3px dotted rgba(43, 24, 16, 0.4);
  transform: translateY(-0.3em);
}

.item__price {
  font-weight: 600;
  font-size: 1.15rem;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.item__desc {
  margin-top: 0.25rem;
  max-width: 52ch;
  color: var(--ink-soft);
}

.item__rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.4rem;
  font-size: 0.9rem;
  color: var(--ink-soft);
}

.item__action {
  justify-self: end;
}

.item__add {
  min-width: 6.5rem;
}

.item__out {
  font-weight: 600;
  color: var(--ink-soft);
}

.item--out .item__photo,
.item--out .item__body {
  opacity: 0.55;
}

.stepper {
  display: inline-flex;
  align-items: center;
  border: 2px solid var(--ink);
  border-radius: 999px;
  background: var(--ink);
  color: var(--paper);
}

.stepper button {
  width: 2.6rem;
  height: 2.6rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: inherit;
  font: 600 1.3rem/1 var(--body);
  cursor: pointer;
}

.stepper button:hover {
  background: rgba(248, 238, 219, 0.15);
}

.stepper output {
  min-width: 1.6rem;
  text-align: center;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 640px) {
  .item {
    grid-template-columns: 4.25rem minmax(0, 1fr);
    gap: 0.4rem 1rem;
    align-items: start;
  }
  .item__photo {
    width: 4.25rem;
    grid-row: span 2;
  }
  .item__action {
    grid-column: 2;
    justify-self: start;
    margin-top: 0.5rem;
  }
  .item__name {
    font-size: 1.1rem;
  }
}
</style>
