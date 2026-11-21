<script setup lang="ts">
import type { Product } from '~/data/types'

const props = withDefaults(defineProps<{ product: Product; size?: 'md' | 'lg' }>(), { size: 'md' })
const { qtyOf, setQty } = useCart()
const qty = computed(() => qtyOf(props.product.id))
</script>

<template>
  <p v-if="!product.inStock" class="soldout">Sold out</p>
  <button v-else-if="qty === 0" type="button" class="btn add" :class="`add--${size}`" @click="setQty(product, 1)">
    <template v-if="size === 'lg'">Add to order<span class="visually-hidden">: {{ product.name }}</span></template>
    <template v-else>Add<span class="visually-hidden"> {{ product.name }} to order</span></template>
  </button>
  <div v-else class="stepper" :class="`stepper--${size}`" role="group" :aria-label="`Quantity of ${product.name}`">
    <button type="button" :aria-label="`One less ${product.name}`" @click="setQty(product, qty - 1)">−</button>
    <output aria-live="polite">{{ qty }}</output>
    <button type="button" :aria-label="`One more ${product.name}`" @click="setQty(product, qty + 1)">+</button>
  </div>
</template>

<style scoped>
.soldout {
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  font-weight: 600;
  color: var(--ink-soft);
}

.add--md {
  width: 100%;
}

.stepper--md {
  width: 100%;
  justify-content: space-between;
}

.add--lg {
  min-height: 3.25rem;
  padding-inline: 1.75rem;
  font-size: 1.05rem;
  background: var(--ink);
  color: var(--paper);
}

.add--lg:hover {
  background: #4a2c1f;
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

.stepper--lg button {
  width: 3.1rem;
  height: 3.1rem;
}

.stepper button:hover {
  background: rgba(248, 238, 219, 0.15);
}

.stepper output {
  min-width: 1.8rem;
  text-align: center;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
</style>
