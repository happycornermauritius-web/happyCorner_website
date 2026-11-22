<script setup lang="ts">
const { settings, categories, products, productsIn } = useShop()

useHead({ title: 'Shop – Happy Corner' })

const sections = computed(() => {
  const list = categories.value.map((c) => ({ ...c, items: productsIn(c.slug) })).filter((s) => s.items.length)
  const placed = new Set(list.flatMap((s) => s.items.map((p) => p.id)))
  const rest = products.value.filter((p) => !placed.has(p.id))
  if (rest.length) list.push({ id: 0, slug: '', name: 'More', description: '', items: rest })
  return list
})
</script>

<template>
  <div class="wrap shop">
    <header class="shop__head">
      <h1>Shop</h1>
      <p class="shop__lead">
        Add dishes to your order, then send it on WhatsApp.
        <template v-if="settings.deliveryNote"> {{ settings.deliveryNote }}</template>
      </p>
    </header>
    <CategoryTabs />

    <p v-if="!products.length" class="empty">The menu is being updated. Message us on WhatsApp to ask what’s cooking.</p>

    <section v-for="s in sections" :key="s.slug || 'more'" class="section" :aria-labelledby="`sec-${s.slug || 'more'}`">
      <div class="section__head">
        <h2 :id="`sec-${s.slug || 'more'}`">{{ s.name }}</h2>
        <NuxtLink v-if="s.slug" :to="`/category/${s.slug}`" class="more">Open this section</NuxtLink>
      </div>
      <ProductGrid :products="s.items" />
    </section>
  </div>
</template>

<style scoped>
.shop {
  padding-block: clamp(2rem, 5vw, 3.5rem);
}

.shop__head {
  display: grid;
  gap: 1rem;
  margin-bottom: 1rem;
}

h1 {
  font-size: clamp(2.8rem, 7vw, 4.4rem);
  color: var(--lacquer);
}

.shop__lead {
  max-width: 56ch;
  font-size: 1.15rem;
}

.section {
  padding-top: clamp(1.75rem, 4vw, 2.75rem);
}

.section__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem 2rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 3px solid var(--ink);
}

.section h2 {
  font-size: clamp(1.7rem, 3.6vw, 2.3rem);
}

.more {
  font-weight: 600;
  text-underline-offset: 4px;
}

.empty {
  padding-block: 2rem;
  font-size: 1.1rem;
}
</style>
