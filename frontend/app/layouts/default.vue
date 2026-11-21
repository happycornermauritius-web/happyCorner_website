<script setup lang="ts">
const { shop, products } = useShop()
const { syncWith } = useCart()

// Keep the saved order in line with the current menu (removed or sold-out dishes, new prices).
watch(products, (list) => list.length && syncWith(list))
</script>

<template>
  <div class="page">
    <p v-if="shop?.demo" class="demo-note">
      Preview with sample menu, prices and reviews. Set <code>NUXT_PUBLIC_WP_URL</code> to show your WooCommerce shop.
    </p>
    <SiteHeader />
    <main class="page__main">
      <PageState>
        <slot />
      </PageState>
    </main>
    <SiteFooter />
    <OrderBar />
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page__main {
  flex: 1;
}

.demo-note {
  margin: 0;
  padding: 0.5rem 1.25rem;
  background: var(--ink);
  color: var(--paper);
  font-size: 0.9rem;
  text-align: center;
}

.demo-note code {
  color: var(--honey);
}
</style>
