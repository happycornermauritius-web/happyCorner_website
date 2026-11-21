<script setup lang="ts">
// Links between the whole menu and each category page.
defineProps<{ current?: string }>()
const { categories, products, productsIn } = useShop()
</script>

<template>
  <nav class="tabs" aria-label="Menu sections">
    <NuxtLink to="/shop" class="tab" :aria-current="!current ? 'page' : undefined">
      Everything <span class="tab__count">{{ products.length }}</span>
    </NuxtLink>
    <NuxtLink
      v-for="c in categories"
      :key="c.slug"
      :to="`/category/${c.slug}`"
      class="tab"
      :aria-current="current === c.slug ? 'page' : undefined"
    >
      {{ c.name }} <span class="tab__count">{{ productsIn(c.slug).length }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0.45rem 1.1rem;
  border: 2px solid var(--ink);
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
  background: transparent;
}

.tab:hover {
  background: rgba(43, 24, 16, 0.08);
}

.tab[aria-current='page'] {
  background: var(--ink);
  color: var(--paper);
}

.tab__count {
  font-size: 0.85rem;
  font-weight: 500;
  opacity: 0.75;
  font-variant-numeric: tabular-nums;
}
</style>
