<script setup lang="ts">
const { shop, status, error, refresh } = useShop()
const { syncWith } = useCart()

watch(
  () => shop.value?.products,
  (products) => products && syncWith(products),
)

const settings = computed(() => shop.value?.settings)
</script>

<template>
  <div>
    <p v-if="shop?.demo" class="demo-note">
      Preview with sample menu, prices and reviews. Set <code>NUXT_PUBLIC_WP_URL</code> to show your WooCommerce shop.
    </p>

    <SiteHeader :whatsapp="settings?.whatsapp ?? ''" />

    <main>
      <HeroSection :intro="settings?.intro ?? ''" :location="settings?.location ?? ''" :hours="settings?.hours ?? ''" />

      <div v-if="status === 'pending' || status === 'idle'" class="wrap state" aria-live="polite">Loading the menu…</div>

      <div v-else-if="error" class="wrap state" role="alert">
        <p><strong>The menu couldn’t load.</strong> The shop server didn’t respond. Check your connection, then try again.</p>
        <button type="button" class="btn" @click="refresh()">Try again</button>
      </div>

      <template v-else-if="shop">
        <MenuSection :categories="shop.categories" :products="shop.products" :delivery-note="shop.settings.deliveryNote" />
        <ReviewsSection :reviews="shop.reviews" :products="shop.products" :demo="shop.demo" />
      </template>
    </main>

    <SiteFooter v-if="settings" :settings="settings" />
    <OrderBar :whatsapp="settings?.whatsapp ?? ''" :demo="!!shop?.demo" />
  </div>
</template>

<style scoped>
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

.state {
  display: grid;
  gap: 1rem;
  justify-items: start;
  padding-block: 3rem 6rem;
  font-size: 1.1rem;
}
</style>
