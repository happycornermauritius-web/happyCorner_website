<script setup lang="ts">
const route = useRoute()
const { categories, productsIn, settings } = useShop()

const slug = computed(() => String(route.params.slug))
const category = computed(() => categories.value.find((c) => c.slug === slug.value))
const items = computed(() => productsIn(slug.value))

useHead({ title: () => (category.value ? `${category.value.name} – Happy Corner` : 'Happy Corner') })
</script>

<template>
  <div class="wrap cat">
    <template v-if="category">
      <nav class="crumbs" aria-label="Breadcrumb">
        <NuxtLink to="/shop">Shop</NuxtLink>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{{ category.name }}</span>
      </nav>

      <header class="cat__head">
        <h1>{{ category.name }}</h1>
        <p v-if="category.description" class="cat__lead">{{ category.description }}</p>
        <p v-if="settings.deliveryNote" class="cat__note">{{ settings.deliveryNote }}</p>
      </header>
      <CategoryTabs :current="category.slug" class="cat__tabs" />

      <ProductGrid v-if="items.length" :products="items" />
      <p v-else class="empty">Nothing in this section right now. <NuxtLink to="/shop">See the whole menu</NuxtLink>.</p>
    </template>

    <div v-else class="missing">
      <h1>This section isn’t on the menu</h1>
      <p>It may have been renamed or removed.</p>
      <NuxtLink to="/shop" class="btn btn--red">See the whole menu</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.cat {
  padding-block: clamp(1.5rem, 4vw, 2.5rem) clamp(2rem, 5vw, 3.5rem);
}

.crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  color: var(--ink-soft);
  font-size: 0.95rem;
}

.crumbs a {
  font-weight: 600;
  color: var(--ink);
  text-underline-offset: 3px;
}

.cat__head {
  display: grid;
  gap: 0.9rem;
  margin: 1rem 0 0.25rem;
}

.cat__tabs {
  margin-bottom: 1.25rem;
}

h1 {
  font-size: clamp(2.5rem, 6.5vw, 4.2rem);
  color: var(--lacquer);
  max-width: 18ch;
}

.cat__lead {
  max-width: 56ch;
  font-size: 1.2rem;
}

.cat__note {
  font-weight: 600;
}

.empty {
  font-size: 1.1rem;
}

.missing {
  display: grid;
  gap: 1rem;
  justify-items: start;
  padding-block: 3rem 5rem;
}
</style>
