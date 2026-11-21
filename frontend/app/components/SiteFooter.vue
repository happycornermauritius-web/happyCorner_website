<script setup lang="ts">
const { settings, categories } = useShop()
const wa = computed(() => (settings.value.whatsapp ? whatsappLink(settings.value.whatsapp) : ''))
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="wrap footer__inner">
      <div class="footer__brand">
        <span class="seal" style="--size: 3.4rem" aria-hidden="true">快乐</span>
        <div>
          <p class="footer__name">Happy Corner</p>
          <p>Sino-Mauritian home kitchen<template v-if="settings.location">, {{ settings.location }}</template></p>
          <p v-if="settings.hours">{{ settings.hours }}</p>
        </div>
      </div>

      <nav class="footer__nav" aria-label="Footer">
        <NuxtLink to="/shop">Shop</NuxtLink>
        <NuxtLink v-for="c in categories" :key="c.slug" :to="`/category/${c.slug}`">{{ c.name }}</NuxtLink>
        <NuxtLink :to="{ path: '/', hash: '#reviews' }">Reviews</NuxtLink>
      </nav>

      <div class="footer__contact">
        <a v-if="wa" :href="wa" target="_blank" rel="noopener">WhatsApp</a>
        <a v-if="settings.facebook" :href="settings.facebook" target="_blank" rel="noopener">Facebook</a>
        <a v-if="settings.instagram" :href="settings.instagram" target="_blank" rel="noopener">Instagram</a>
        <p class="footer__copy">© {{ year }} Happy Corner</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: clamp(3rem, 7vw, 5rem);
  background: var(--lacquer);
  color: var(--paper);
  padding-block: 2.75rem calc(6rem + env(safe-area-inset-bottom));
}

.footer__inner {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr);
  gap: 2rem;
}

.footer__brand {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.footer .seal {
  background: var(--paper);
  color: var(--lacquer);
  box-shadow: inset 0 0 0 calc(var(--size) * 0.05) var(--paper), inset 0 0 0 calc(var(--size) * 0.085) var(--lacquer);
}

.footer__name {
  font-family: var(--display);
  font-size: 1.6rem;
  line-height: 1.1;
  margin-bottom: 0.2rem;
}

.footer__nav,
.footer__contact {
  display: grid;
  align-content: start;
  gap: 0.4rem;
  justify-items: start;
}

.footer a {
  font-weight: 600;
  text-underline-offset: 4px;
}

.footer__copy {
  margin-top: 0.5rem;
  opacity: 0.8;
  font-size: 0.9rem;
}

@media (max-width: 720px) {
  .footer__inner {
    grid-template-columns: 1fr 1fr;
  }
  .footer__brand {
    grid-column: 1 / -1;
  }
}
</style>
