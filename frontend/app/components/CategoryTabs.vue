<script setup lang="ts">
// Links between the whole menu and each category page.
const props = defineProps<{ current?: string }>()
const { categories, products, productsIn } = useShop()

// On phones the tabs scroll sideways: bring the current one into view.
const nav = ref<HTMLElement | null>(null)
onMounted(() => {
  const el = nav.value
  const tab = el?.querySelector<HTMLElement>('[aria-current="page"]')
  if (el && tab && props.current) el.scrollLeft = tab.offsetLeft - (el.clientWidth - tab.offsetWidth) / 2
})
</script>

<template>
  <nav ref="nav" class="tabs" aria-label="Menu sections">
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
/* Stays under the header while scrolling the menu */
.tabs {
  position: sticky;
  top: 4.25rem;
  z-index: 10;
  display: flex;
  gap: 0.6rem;
  padding-block: 0.75rem;
  overflow-x: auto;
  scrollbar-width: none;
  background: var(--kraft);
  box-shadow: 0 0 0 100vmax var(--kraft);
  clip-path: inset(0 -100vmax);
}

.tabs::-webkit-scrollbar {
  display: none;
}

.tab {
  flex: none;
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
